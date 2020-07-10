import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import InPageLoading from 'components/common/inPageLoading';
import { getFilterArrayOfListForKey } from 'utils';

import { filterAuditTaskAction, getAuditTaskListAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Task ID',
    value: 'taskID',
  },
  {
    label: 'Location',
    value: 'address',
  },
];

const dateSelectData = [
  {
    label: 'Inspection Date',
    value: 'inspectionDate',
    useExactField: true,
  },
  {
    label: 'Audit Date',
    value: 'auditDate',
    useExactField: true,
  },
];

const columns = [
  {
    Header: 'Task Type',
    accessor: 'taskTypeToBeDisplayed',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Task ID',
    accessor: 'taskID',
    minWidth: tableColumnWidth.xl,
  },
  {
    Header: 'Inspection Date',
    accessor: 'inspectionDate',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Audit Date',
    accessor: 'auditDate',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'RO',
    accessor: 'ro',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'GRC',
    accessor: 'grc',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Division',
    accessor: 'division',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Location',
    accessor: 'address',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Action Taken by Contractor',
    accessor: 'actionTaken',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Audit Status',
    accessor: 'auditStatus',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Burrow Count Discrepancies',
    accessor: 'burrowCount',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: "Contractor's Reply Date ",
    accessor: 'replyDate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Show Cause/LD Status',
    accessor: 'causeStatus',
    minWidth: tableColumnWidth.md,
  },
];

const QueryAuditTask = (props) => {
  const {
    getAuditTaskListAction,
    filterAuditTaskAction,
    ui: { isLoading },
    data: { filteredList, list },
    history,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 500);

  const title = WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK.name;

  useEffect(() => {
    document.title = `NEA | ${title}`;
    getAuditTaskListAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getAuditTaskListAction, title]);

  useEffect(() => {
    filterAuditTaskAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, datePickerValue, filterAuditTaskAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'taskTypeToBeDisplayed',
      title: 'Task Type',
      values: getFilterArrayOfListForKey(list, 'taskTypeToBeDisplayed'),
    },
    {
      type: FilterType.SELECT,
      id: 'grc',
      title: 'GRC',
      values: getFilterArrayOfListForKey(list, 'grc'),
    },
    {
      type: FilterType.SELECT,
      id: 'ro',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'ro'),
    },
    {
      type: FilterType.SELECT,
      id: 'causeStatus',
      title: 'Show Cause/LD Status',
      values: getFilterArrayOfListForKey(list, 'causeStatus'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
    },
    {
      type: FilterType.SELECT,
      id: 'auditStatus',
      title: 'Audit Status',
      values: getFilterArrayOfListForKey(list, 'auditStatus'),
    },
    {
      type: FilterType.SELECT,
      id: 'actionTaken',
      title: 'Action Taken by Contractor',
      values: getFilterArrayOfListForKey(list, 'actionTaken'),
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={title} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{title}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ rodentAuditReducers: { queryAuditTask } }, ownProps) => ({
  ...ownProps,
  ...queryAuditTask,
});

const mapDispatchToProps = {
  getAuditTaskListAction,
  filterAuditTaskAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryAuditTask));
