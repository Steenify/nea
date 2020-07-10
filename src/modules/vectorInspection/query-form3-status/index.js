import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { getFilterArrayOfListForKey, dateTimeStringFromDate } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { queryForm3StatusFilterAction, getQueryForm3StatusAction, defaultFilterValue } from './action';

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
  const {
    getQueryForm3StatusAction,
    queryForm3StatusFilterAction,

    ui: { isLoading },
    data: { filteredList, list },
    history,
  } = props;

  const columns = [
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
      // Cell: (cellInfo) => (
      //   <span
      //     className="text-blue cursor-pointer"
      //     onClick={() =>
      //       history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, {
      //         form3Id: cellInfo.row.form3Id,
      //         test: 'dasda',

      //       })
      //     }>
      //     {cellInfo.row.form3Id}
      //   </span>
      // ),
    },
    {
      Header: 'Created Date',
      accessor: 'createdDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Created Time',
      accessor: 'createdTime',
      minWidth: tableColumnWidth.lg,
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
    },
    {
      Header: 'Last Updated Time',
      accessor: 'lastUpdatedTime',
      minWidth: tableColumnWidth.lg,
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

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = 'NEA | Query Form 3 Status';
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    getQueryForm3StatusAction({
      startDate: dateTimeStringFromDate(startDate),
      endDate: dateTimeStringFromDate(endDate),
      dateType: datePickerValue?.selectedValue || 'createdDate',
    }).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getQueryForm3StatusAction, datePickerValue]);

  useEffect(() => {
    queryForm3StatusFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, queryForm3StatusFilterAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOfficeCode'),
    },
    {
      type: FilterType.SEARCH,
      id: 'form3Status',
      title: 'Status',
      values: getFilterArrayOfListForKey(list, 'form3Status'),
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, {
            form3Id: rowInfo.row.form3Id,
            action: rowInfo.row.form3Status?.toLowerCase() === 'form 3 voided' ? 'void' : undefined,
          });
          // history.push(`/vector-inspection/query-rodent-inspection/detail?rccId=${rowInfo.row.rccId}`);
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
        <NavBar active="Query Form 3 Status" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS]} />
          <div className="main-title">
            <h1>Query Form 3 Status</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList || []} columns={columns} getTrProps={getTrProps} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { queryForm3Status } }, ownProps) => ({
  ...ownProps,
  ...queryForm3Status,
});

const mapDispatchToProps = {
  queryForm3StatusFilterAction,
  getQueryForm3StatusAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryForm3Status));
