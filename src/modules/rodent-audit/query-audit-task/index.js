import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import InPageLoading from 'components/common/inPageLoading';

import { getAuditTaskService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';

const defaultFilterValue = {
  searchText: '',
  searchType: 'taskID',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'taskID',
    label: 'Task ID',
    desc: false,
  },
};

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
    minWidth: tableColumnWidth.lg,
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
    sortType: 'date',
  },
  {
    Header: 'Audit Date',
    accessor: 'auditDate',
    minWidth: tableColumnWidth.lg,
    sortType: 'date',
  },
  {
    Header: 'RO',
    accessor: 'ro',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'GRC',
    accessor: 'grc',
    minWidth: tableColumnWidth.lg,
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
    minWidth: tableColumnWidth.lg,
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
    minWidth: tableColumnWidth.lg,
  },
];

const QueryAuditTask = (props) => {
  const { history } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const title = WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK.name;

  const getListing = useCallback(() => {
    actionTryCatchCreator(
      getAuditTaskService(),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.dailyReportList || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, []);

  useEffect(() => {
    document.title = `NEA | ${title}`;
    getListing();
  }, [getListing, title]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'taskTypeToBeDisplayed',
        title: 'Task Type',
      },
      {
        type: FilterType.SELECT,
        id: 'grc',
        title: 'GRC',
      },
      {
        type: FilterType.SELECT,
        id: 'ro',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'causeStatus',
        title: 'Show Cause/LD Status',
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'auditStatus',
        title: 'Audit Status',
      },
      {
        type: FilterType.SELECT,
        id: 'actionTaken',
        title: 'Action Taken by Contractor',
      },
    ],
    [],
  );

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
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK]} />
          <div className="main-title">
            <h1>{title}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.list || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, filterValue, sortValue, datePickerValue }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryAuditTask));
