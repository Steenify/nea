import React, { useEffect, useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import NewBreadCrumb from 'components/ui/breadcrumb';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { dateTimeStringFromDate, actionTryCatchCreator } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { form3QueryListingService } from 'services/inspection-management/form3';

export const defaultFilterValue = {
  sortValue: {
    id: 'address',
    label: 'Address',
    desc: true,
  },
  datePickerValue: {
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
  },
  searchText: '',
  searchType: 'form3Id',
};

const searchData = [
  {
    label: 'Form 3 ID',
    value: 'form3Id',
  },
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'EEMS2 Case ID',
    value: 'caseId',
  },
];

const dateSelectData = [
  {
    label: 'Created Date',
    value: 'createdDate',
  },
  {
    label: 'Last Updated Date',
    value: 'lastUpdatedDate',
  },
];

const QueryForm3Status = (props) => {
  const { history } = props;

  const columns = [
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Created Date',
      accessor: 'createdDate',
      minWidth: tableColumnWidth.lg,
      sortType: 'date',
    },
    {
      Header: 'Created Time',
      accessor: 'createdTime',
      minWidth: tableColumnWidth.lg,
      sortType: 'time',
    },
    {
      Header: 'Status',
      accessor: 'form3Status',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Last Updated Date',
      accessor: 'lastUpdatedDate',
      minWidth: tableColumnWidth.lg,
      sortType: 'date',
    },
    {
      Header: 'Last Updated Time',
      accessor: 'lastUpdatedTime',
      minWidth: tableColumnWidth.lg,
      sortType: 'time',
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <ul>
          {cellInfo.original?.inspectionId?.split(',')?.map((id, i) => (
            <li key={i}>{id}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'EEMS2 Case ID',
      accessor: 'caseId',
      minWidth: tableColumnWidth.md,
    },
  ];

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS.name}`;
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const params = {
      startDate: dateTimeStringFromDate(startDate),
      endDate: dateTimeStringFromDate(endDate),
      dateType: datePickerValue?.selectedValue || 'createdDate',
    };
    actionTryCatchCreator(
      form3QueryListingService(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.queryForm3VOs || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [datePickerValue]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
      {
        type: FilterType.SEARCH,
        id: 'form3Status',
        title: 'Status',
      },
    ],
    [],
  );

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, {
            form3Id: rowInfo.row.form3Id,
            action: rowInfo.row.form3Status?.toLowerCase() === 'form 3 voided' ? 'void' : undefined,
          });
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
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.list || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, filterValue, sortValue }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryForm3Status));
