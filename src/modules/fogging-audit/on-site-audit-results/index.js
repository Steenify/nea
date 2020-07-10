import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import Footer from 'components/ui/footer';

import { getFilterArrayOfListForKey } from 'utils';
import { defaultFilterValue, getListAction, filterListAction } from './action';

const OnSiteAuditResults = (props) => {
  const {
    ui: { isLoading },
    data: { filteredList, list },

    getListAction,
    filterListAction,
    history,
  } = props;

  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [debounceSearchText] = useDebounce(searchText, 500);
  const filterRef = useRef(null);

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
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOffice',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.lg,
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
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Non-compliant',
      accessor: 'nonCompliant',
      minWidth: tableColumnWidth.lg,
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
      id: 'nonCompliant',
      title: 'Non-compliant',
      values: getFilterArrayOfListForKey(list, 'nonCompliant'),
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS.name}`;
    getListAction();
  }, [getListAction]);

  useEffect(() => {
    filterListAction({
      searchText: debounceSearchText,
      searchType,
      datePickerValue,
      sortValue,
      filterValue,
    });
  }, [filterListAction, debounceSearchText, searchType, datePickerValue, sortValue, filterValue]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS.name}</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto" onChange={setDatePickerValue} selectData={dateSelectData} timePicker={false} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { onSiteAuditResults } }, ownProps) => ({
  ...ownProps,
  ...onSiteAuditResults,
});

const mapDispatchToProps = { getListAction, filterListAction };

export default connect(mapStateToProps, mapDispatchToProps)(OnSiteAuditResults);
