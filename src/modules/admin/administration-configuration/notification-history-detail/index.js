import React, { useEffect, useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { filterFunc, sortFunc } from 'utils';

import { getInAppNotificationListDetailsAction } from './action';

const EmailHistoryDetail = (props) => {
  const { getInAppNotificationListDetailsAction, data, ui } = props;

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL.name}`;
    getInAppNotificationListDetailsAction();
  }, [getInAppNotificationListDetailsAction]);

  const list = (data?.history?.inAppNotiList || []).map((item) => ({ ...item, readFlag: item.readFlag ? 'Yes' : 'No' }));

  const columns = [
    {
      Header: 'SOE ID',
      accessor: 'soeId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Submitted Date',
      accessor: 'submittedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Read?',
      accessor: 'readFlag',
      minWidth: tableColumnWidth.md,
      // Cell: (cellInfo) => (cellInfo?.original?.readFlag ? 'Yes' : 'No'),
    },
    {
      Header: 'Content',
      accessor: 'content',
      minWidth: tableColumnWidth.xxl,
    },
  ];

  const searchData = [
    {
      value: 'soeId',
      label: 'SOE ID',
    },
    {
      label: 'Content',
      value: 'content',
    },
  ];

  const dateSelectData = [
    {
      label: 'Submitted Date',
      value: 'submittedDate',
      useExactField: true,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'readFlag',
        title: 'Read?',
        values: ['Yes', 'No'],
      },
    ],
    [],
  );

  const [sortValue, setSortValue] = useState({ id: 'submittedDate', label: 'Submitted Date', desc: false });
  const [searchType, setSearchTypeValue] = useState('soeId');
  const [searchText, setSearchTextValue] = useState('');
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filteredList = list.filter((item) => filterFunc(item, { sortValue, searchText, searchType, filterValue, datePickerValue })).sort((a, b) => sortFunc(a, b, sortValue));

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.DASHBOARD, WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredList} columns={columns} />
            </div>
          </div>
          <InPageLoading isLoading={ui?.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { notificationHistory } }, ownProps) => ({
  ...ownProps,
  ...notificationHistory,
});

const mapDispatchToProps = {
  getInAppNotificationListDetailsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailHistoryDetail);
