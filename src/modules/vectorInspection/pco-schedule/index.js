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

import { getFilterArrayOfListForKey } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { filterUploadedPCOScheduleAction, getUploadedPCOScheduleAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Town Council',
    value: 'townCouncil',
  },
];

const dateSelectData = [
  {
    label: 'Submitted Date',
    value: 'submittedDate',
  },
  {
    label: 'Validated Date',
    value: 'validatedDate',
  },
];

const columns = [
  {
    Header: 'Submitted Date',
    accessor: 'submittedDate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Validated Date',
    accessor: 'validatedDate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Town Council',
    accessor: 'townCouncil',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Month(s)',
    accessor: 'months',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Submitted By',
    accessor: 'submittedBy',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'File Status',
    accessor: 'status',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Action',
    accessor: 'action',
    minWidth: tableColumnWidth.md,
  },
];

const PCOSchedule = (props) => {
  const {
    getUploadedPCOScheduleAction,
    filterUploadedPCOScheduleAction,

    history: { push },
    ui: { isLoading },
    data: { filteredList, list },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = 'NEA | PCO Schedule';
    getUploadedPCOScheduleAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getUploadedPCOScheduleAction]);

  useEffect(() => {
    filterUploadedPCOScheduleAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      datePickerValue,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, datePickerValue, filterUploadedPCOScheduleAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'months',
      title: 'Months',
      values: getFilterArrayOfListForKey(list, 'months'),
    },
    {
      type: FilterType.SEARCH,
      id: 'status',
      title: 'File Status',
      values: getFilterArrayOfListForKey(list, 'status'),
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="PCO Schedule" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.PCO_SCHEDULE]} />
          <div className="main-title">
            <h1>PCO Schedule</h1>
            <button type="button" className="btn btn-pri ml-auto" onClick={() => push(WEB_ROUTES.INSPECTION_MANAGEMENT.UPLOAD_PCO_SCHEDULE.url)}>
              Upload
            </button>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList || []} columns={columns} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { pcoSchedule } }, ownProps) => ({
  ...ownProps,
  ...pcoSchedule,
});

const mapDispatchToProps = {
  filterUploadedPCOScheduleAction,
  getUploadedPCOScheduleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PCOSchedule));
