/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { dateStringFromDate, dateTimeStringFromDate, getFilterArrayOfListForKey } from 'utils';
import { useDebounce } from 'use-debounce';
import uuid from 'uuid/v4';
import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import moment from 'moment';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getBlockSummaryListAction, filterBlockSummaryAction, setDefaultValueAction } from './action';

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

const BlockSummary = ({ getBlockSummaryListAction, filterBlockSummaryAction, setDefaultValueAction, ui: { isLoading }, data: { defaultValue = {}, list = [], filteredList = [] }, history }) => {
  const fromDateDefault = moment().add(-30, 'days');
  const toDateDefault = moment();

  const searchData = searchDataDefault.sort((a) => (a.value === defaultValue.searchType ? -1 : 1));
  const [sortValue, setSortValue] = useState(defaultValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState({
    startDate: moment(defaultValue?.datePicker?.startDateValueOf) || fromDateDefault,
    endDate: moment(defaultValue?.datePicker?.endDateValueOf) || toDateDefault,
  });
  const [activeTab, setActiveTab] = useState(defaultValue.premiseType !== 'BLOCK' ? '1' : '0');
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const routeName = WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY.name;

  useEffect(() => {
    document.title = 'NEA | Block Summary';
    getBlockSummaryListAction(
      {
        inspectionDateFrom: dateTimeStringFromDate(datePickerValue?.startDate || fromDateDefault),
        inspectionDateTo: dateTimeStringFromDate(datePickerValue?.endDate || toDateDefault),
        propertyType: activeTab === '1' ? 'LANDED' : 'BLOCK',
      },
      { filterValue, sortValue, searchText: debounceSearchText, searchType },
    );
  }, [getBlockSummaryListAction, activeTab, datePickerValue]);

  useEffect(() => {
    const param = { filterValue, sortValue, searchText: debounceSearchText, searchType };
    filterBlockSummaryAction(param);
  }, [sortValue, filterValue, debounceSearchText, filterBlockSummaryAction, searchType]);

  const onRowClick = (rowInfo) => {
    const block = rowInfo?.original;
    if (!block) return;

    const mapBlock = {
      ...block,
      inspectionDateFrom: dateTimeStringFromDate(datePickerValue?.startDate || fromDateDefault),
      inspectionDateTo: dateTimeStringFromDate(datePickerValue?.endDate || toDateDefault),
    };
    const path = activeTab === '0' ? WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_BLOCK_CHART.url : WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_LANDED_DETAIL.url;
    setDefaultValueAction({
      searchText,
      searchType,
      datePicker: {
        startDateValueOf: datePickerValue.startDate.valueOf(),
        endDateValueOf: datePickerValue.endDate.valueOf(),
      },
      filterValue,
      premiseType: activeTab === '0' ? 'BLOCK' : 'LANDED',
      sortValue,
    });
    history.push(path, { block: mapBlock, parent: routeName, fromLatest: false });
  };

  const getTrProps = (_state, rowInfo) => ({
    onClick: debounce(() => onRowClick(rowInfo), 500),
    style: {
      cursor: 'pointer',
    },
  });

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOffice',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOffice'),
      default: defaultValue?.filterValue?.regionOffice || [],
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
      default: defaultValue?.filterValue?.division || [],
    },
    {
      type: FilterType.SEARCH,
      id: 'premisesType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(list, 'premisesType'),
      default: defaultValue?.filterValue?.premisesType || [],
    },
  ];

  const tableTitle = `Inspection Date: ${dateStringFromDate(datePickerValue?.startDate || fromDateDefault)} to ${dateStringFromDate(datePickerValue?.endDate || toDateDefault)}`;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={routeName} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY]} />
          <div className="main-title">
            <h1>Block Summary</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <nav className="tab__main marginBottom20">
            <div className="tabsContainer">
              <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={tabNavMenu} />
            </div>
          </nav>
          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} title={tableTitle} showListPosition="end" key={uuid()} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { blockSummary } }, ownProps) => ({
  ...ownProps,
  ...blockSummary,
});

const mapDispatchToProps = {
  getBlockSummaryListAction,
  filterBlockSummaryAction,
  setDefaultValueAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BlockSummary));
