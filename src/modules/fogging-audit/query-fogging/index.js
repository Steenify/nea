import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getFoggingActivityListingService } from 'services/fogging-audit';
import { actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'inspectionId',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
    sortType: 'date',
  },
};

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
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Fogging Date',
    accessor: 'foggingDate',
    minWidth: tableColumnWidth.md,
    sortType: 'date',
  },
  {
    Header: 'Fogging Period',
    accessor: 'foggingPeriod',
    sortType: 'timePeriod',
    minWidth: tableColumnWidth.xl,
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
    sortType: 'date',
  },
  {
    Header: 'Audit Time',
    accessor: 'auditTime',
    minWidth: tableColumnWidth.md,
    sortType: 'time',
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

const QueryFogging = (props) => {
  const { history } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

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

  const getListing = useCallback(() => {
    actionTryCatchCreator(
      getFoggingActivityListingService(),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.activities || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, []);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name}`;
    getListing();
  }, [getListing]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOffice',
        title: 'RO',
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'auditTaskStatus',
        title: 'Audit Task Status',
      },
      {
        type: FilterType.SELECT,
        id: 'nonCompliant',
        title: 'Non-compliant',
      },
      {
        type: FilterType.SELECT,
        id: 'enforcementStatus',
        title: 'Enforcement Status',
      },
    ],
    [],
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING.name}</h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryFogging));
