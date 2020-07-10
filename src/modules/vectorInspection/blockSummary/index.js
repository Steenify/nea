import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { dateStringFromDate, dateTimeStringFromDate, actionTryCatchCreator } from 'utils';
import moment from 'moment';

import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import NewBreadCrumb from 'components/ui/breadcrumb';
import FilteringDataTable from 'components/common/filtering-data-table';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import DateRangePickerSelect, { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getBlockSummaryList } from 'services/vector-inspection';

const searchDataDefault = [
  {
    label: 'Road Name',
    value: 'roadName',
  },
  {
    label: 'Postal Code',
    value: 'postalCode',
  },
];

const dateSelectData = [
  {
    label: 'Inspection Date',
    value: 'inspectionDateFrom',
  },
];

const columns = [
  {
    Header: 'Road Name',
    accessor: 'roadName',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Block',
    accessor: 'blockHouseNo',
    minWidth: tableColumnWidth.sm,
    sortType: 'number',
  },
  {
    Header: 'Postal Code',
    accessor: 'postalCode',
    minWidth: tableColumnWidth.md,
    sortType: 'number',
  },
  {
    Header: 'Premises Type',
    accessor: 'premisesType',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'RO',
    accessor: 'regionOffice',
    minWidth: tableColumnWidth.sm,
  },

  {
    Header: 'Division',
    accessor: 'division',
    minWidth: tableColumnWidth.md,
  },
];

const tabNavMenu = ['HDB/Condo', 'Landed'];

export const defaultFilterValue = {
  sortValue: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
  filterValue: null,
  searchText: '',
  searchType: 'roadName',
  datePickerValue: {
    selectedValue: 'inspectionDateFrom',
    startDate: moment().startOf('day').add(-30, 'days'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  premiseType: 'BLOCK',
};

const BlockSummary = (props) => {
  const { history } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [activeTab, setActiveTab] = useState(defaultFilterValue.premiseType !== 'BLOCK' ? '1' : '0');
  const filterRef = useRef(null);

  const searchData = searchDataDefault.sort((a) => (a.value === defaultFilterValue.searchType ? -1 : 1));

  const getListAction = useCallback(() => {
    const params = {
      inspectionDateFrom: dateTimeStringFromDate(datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate),
      inspectionDateTo: dateTimeStringFromDate(datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate),
      propertyType: activeTab === '1' ? 'LANDED' : 'BLOCK',
    };

    actionTryCatchCreator(
      getBlockSummaryList(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.inspections || [] });
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [activeTab, datePickerValue]);

  useEffect(() => {
    document.title = 'NEA | Block Summary';
    getListAction();
  }, [getListAction]);

  const onRowClick = (rowInfo) => {
    const block = rowInfo?.original;
    if (!block) return;

    const mapBlock = {
      ...block,
      inspectionDateFrom: dateTimeStringFromDate(datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate),
      inspectionDateTo: dateTimeStringFromDate(datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate),
    };
    const path = activeTab === '0' ? WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_BLOCK_CHART.url : WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_LANDED_DETAIL.url;
    // setDefaultValueAction({
    //   searchText,
    //   searchType,
    //   datePicker: {
    //     startDateValueOf: datePickerValue.startDate.valueOf(),
    //     endDateValueOf: datePickerValue.endDate.valueOf(),
    //   },
    //   filterValue,
    //   premiseType: activeTab === '0' ? 'BLOCK' : 'LANDED',
    //   sortValue,
    // });
    history.push(path, { block: mapBlock, parent: WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY.name, fromLatest: false });
  };

  const getTrProps = (_state, rowInfo) => ({
    onClick: debounce(() => onRowClick(rowInfo), 500),
    style: {
      cursor: 'pointer',
    },
  });

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOffice',
        title: 'RO',
        // default: filterValue?.regionOffice || [],
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
        // default: filterValue?.division || [],
      },
      {
        type: FilterType.SEARCH,
        id: 'premisesType',
        title: 'Premises Type',
        // default: filterValue?.premisesType || [],
      },
    ],
    [],
  );

  const tableTitle = `Inspection Date: ${dateStringFromDate(datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate)} to ${dateStringFromDate(
    datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate,
  )}`;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom15"
                onChange={setDatePickerValue}
                selectData={dateSelectData}
                data={datePickerValue}
                resetValue={defaultFilterValue.datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <nav className="tab__main marginBottom20">
            <div className="tabsContainer">
              <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={tabNavMenu} />
            </div>
          </nav>
          <div className="tabsContainer">
            <FilteringDataTable
              data={apiState.list || []}
              columns={columns}
              getTrProps={getTrProps}
              title={tableTitle}
              showListPosition="end"
              filterData={{ searchType, searchText, filterValue, sortValue }}
            />
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BlockSummary));
