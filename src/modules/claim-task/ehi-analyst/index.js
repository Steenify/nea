import React, { useState, useEffect, useRef, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import { connect } from 'react-redux';
import DataTable from 'components/common/data-table';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { sampleTaskSearch, sampleTaskFilter, claimSampleAction, resetClaimTaskReducer, defaultFilterValue } from './action';

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDetection',
  },
  {
    label: 'Received at',
    value: 'received',
  },
];

const ClaimTask = (props) => {
  const {
    history,
    sampleTaskSearchAction,
    sampleTaskFilterAction,
    claimSampleAction,
    resetClaimTaskReducerAction,
    ui: { isLoading },
    data: { filteredTaskList, taskList },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [barcodeId, setBarcodeId] = useState('');
  const filterRef = useRef(null);

  const [activeTabNav, setActiveTabNav] = useState('0');
  const [region, setRegion] = useState(defaultFilterValue.region);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.CLAIM_TASK.name}`;
    sampleTaskSearchAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [sampleTaskSearchAction]);

  useEffect(() => {
    sampleTaskFilterAction({ sortValue, region, searchText, searchType, filterValue, datePickerValue });
  }, [sampleTaskFilterAction, sortValue, region, searchText, searchType, datePickerValue, filterValue]);

  const navigateToDetail = (barcodeId, edit) => {
    resetClaimTaskReducerAction();
    setSearchTextValue('');
    history.push(`${WEB_ROUTES.DETAILS.url}/sample`, { isEditing: edit, id: barcodeId });
  };

  const submitBarcode = (e) => {
    if (e) e.preventDefault();
    if (barcodeId && barcodeId.trim()) {
      const id = barcodeId.trim();
      claimSampleAction({ barcodeId: id }).then(() => {
        navigateToDetail(id, true);
      });
    }
  };

  const toggleTabNav = (tab) => {
    let selectedRegion = '';
    switch (tab) {
      case '1':
        selectedRegion = 'CRO';
        break;
      case '2':
        selectedRegion = 'ERO';
        break;
      case '3':
        selectedRegion = 'WRO';
        break;
      default:
        selectedRegion = '';
        break;
    }
    setActiveTabNav(tab);
    setRegion(selectedRegion);
  };

  const allCount = taskList.length;
  const centralCount = taskList.filter((item) => item.regionOfficeCode === 'CRO').length;
  const eastCount = taskList.filter((item) => item.regionOfficeCode === 'ERO').length;
  const westCount = taskList.filter((item) => item.regionOfficeCode === 'WRO').length;
  const tabNavMenu = [`All (${allCount})`, `CRO (${centralCount})`, `ERO (${eastCount})`, `WRO (${westCount})`];

  const getTrProps = (_state, rowInfo) => {
    const props = { onClick: () => navigateToDetail(rowInfo.row.barcodeId, false), className: 'cursor-pointer' };
    if (rowInfo) {
      if (rowInfo.row._original.isPrioritized) {
        props.className = 'bg-warning cursor-pointer';
      }
      if (rowInfo.row._original.isUrgentCase) {
        props.className = 'bg-danger cursor-pointer';
      }
    }
    return props;
  };

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Received Date',
      accessor: 'receivedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Received Time',
      accessor: 'receivedTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Officer Name',
      accessor: 'officerName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'barcodeId',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SEARCH,
        id: 'officerName',
        title: 'Officer Name',
      },
    ],
    [],
  );

  const searchData = [
    { label: 'Sample ID', value: 'barcodeId' },
    { label: 'Officer Name', value: 'officerName' },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.CLAIM_TASK.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.CLAIM_TASK]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.CLAIM_TASK.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox autoFocus placeholder="Please scan or enter Sample ID" value={barcodeId} onSubmit={submitBarcode} onChangeText={setBarcodeId} className="mb-0" />
            </div>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} timePicker />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={taskList} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <nav className="tab__main">
            <div className="tabsContainer">
              <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
            </div>
          </nav>

          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredTaskList} columns={columns} getTrProps={getTrProps} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ claimTaskReducers: { ehiAnalyst } }, ownProps) => ({
  ...ownProps,
  ...ehiAnalyst,
});

const mapDispatchToProps = {
  sampleTaskSearchAction: sampleTaskSearch,
  sampleTaskFilterAction: sampleTaskFilter,
  claimSampleAction,
  resetClaimTaskReducerAction: resetClaimTaskReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
