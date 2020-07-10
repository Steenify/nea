import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getFilterArrayOfListForKey } from 'utils';

import { filterQueryFoggingAction, getFoggingListAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Auditor Name',
    value: 'auditorName',
  },
];

const dateSelectData = [
  {
    label: 'Fogging Date',
    value: 'foggingDate',
    useExactField: true,
  },
  {
    label: 'Audit Date',
    value: 'auditDate',
    useExactField: true,
  },
];

const QueryFogging = (props) => {
  const {
    history,
    filterQueryFoggingAction,
    getFoggingListAction,

    ui: { isLoading },
    data: { list, filteredList },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const getTrProps = (_, rowInfo) => {
    if (rowInfo) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING_AUDIT_TASK_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }

    return {};
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name}`;
    getFoggingListAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getFoggingListAction]);

  useEffect(() => {
    filterQueryFoggingAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, datePickerValue, filterQueryFoggingAction]);

  const columns = [
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'regionOffice',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Fogging Date',
      accessor: 'foggingDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Fogging Period',
      accessor: 'foggingPeriod',
      isTimePeriod: true,
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Audit Task Status',
      accessor: 'auditTaskStatus',
      minWidth: tableColumnWidth.md,
    },

    {
      Header: 'Audit Date',
      accessor: 'auditDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Audit Time',
      accessor: 'auditTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Auditor Name',
      accessor: 'auditorName',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Non-compliant',
      accessor: 'nonCompliant',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Enforcement Status',
      accessor: 'enforcementStatus',
      minWidth: tableColumnWidth.md,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOffice',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOffice'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
    },
    {
      type: FilterType.SELECT,
      id: 'auditTaskStatus',
      title: 'Audit Task Status',
      values: getFilterArrayOfListForKey(list, 'auditTaskStatus'),
    },
    {
      type: FilterType.SELECT,
      id: 'nonCompliant',
      title: 'Non-compliant',
      values: getFilterArrayOfListForKey(list, 'nonCompliant'),
    },
    {
      type: FilterType.SELECT,
      id: 'enforcementStatus',
      title: 'Enforcement Status',
      values: getFilterArrayOfListForKey(list, 'enforcementStatus'),
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name}</h1>
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

const mapStateToProps = ({ foggingAuditReducers: { queryFogging } }, ownProps) => ({
  ...ownProps,
  ...queryFogging,
});

const mapDispatchToProps = {
  getFoggingListAction,
  filterQueryFoggingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryFogging));
