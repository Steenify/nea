import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import NewBreadCrumb from 'components/ui/breadcrumb';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import { connect } from 'react-redux';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { dateTimeStringFromDate, getFilterArrayOfListForKey } from 'utils';

import { sampleQueryStatusSearch, sampleQueryStatusFilter, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Sample ID',
    value: 'sampleId',
  },
  {
    label: 'Officer Name',
    value: 'officerName',
  },
  {
    label: 'Analyst Name',
    value: 'analystName',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDate',
  },
  {
    label: 'Date Received by EHI',
    value: 'receivedDate',
  },
];

const QuerySampleStatus = (props) => {
  const {
    sampleQueryStatusSearchAction,
    sampleQueryStatusFilterAction,
    history,
    ui: { isLoading },
    data: { filteredTaskList, taskList },

    getMastercodeAction,
    masterCodes,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    getMastercodeAction([MASTER_CODE.SAMPLE_STATUS_CODE]);
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name}`;
    const { startDate, endDate, selectedValue } = datePickerValue || {};
    sampleQueryStatusSearchAction({
      startDate: dateTimeStringFromDate(startDate || defaultFilterValue.datePickerValue.startDate),
      endDate: dateTimeStringFromDate(endDate || defaultFilterValue.datePickerValue.endDate),
      dateType: selectedValue || 'breedingDate',
    }).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [sampleQueryStatusSearchAction, filterRef, datePickerValue, getMastercodeAction]);

  useEffect(() => {
    sampleQueryStatusFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, sampleQueryStatusFilterAction]);

  const getTrProps = (_state, rowInfo) => {
    const props = {
      onClick: () => history.push(`${WEB_ROUTES.DETAILS.url}/sample`, { id: rowInfo.row.sampleId }),
      className: 'cursor-pointer',
    };

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
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Date Received by EHI',
      accessor: 'receivedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Time Received by EHI',
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
      accessor: 'sampleId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Analyst Name',
      accessor: 'analystName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample Status',
      accessor: 'sampleStatus',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(taskList, 'regionOfficeCode'),
    },
    {
      type: FilterType.SELECT,
      id: 'sampleStatus',
      title: 'Sample Status',
      values: (masterCodes[MASTER_CODE.SAMPLE_STATUS_CODE] || []).map((item) => item.label),
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom15"
                onChange={setDatePickerValue}
                selectData={dateSelectData}
                data={datePickerValue}
                resetValue={defaultFilterValue.datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
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

const mapStateToProps = ({ global, sampleIdentificationReducers: { querySampleStatus } }, ownProps) => ({
  ...ownProps,
  ...querySampleStatus,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  sampleQueryStatusSearchAction: sampleQueryStatusSearch,
  sampleQueryStatusFilterAction: sampleQueryStatusFilter,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuerySampleStatus));
