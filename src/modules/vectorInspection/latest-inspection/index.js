/* eslint-disable react-hooks/exhaustive-deps */
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
import Filter, { FilterType } from 'components/common/filter';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import InPageLoading from 'components/common/inPageLoading';
import { debounce } from 'lodash';
import { getFilterArrayOfListForKey } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import uuid from 'uuid/v4';
import { getLatestInspectionListingAction, setDefaultValueAction, latestInspectionListingFilterAction } from './action';

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

const columns = [
  {
    Header: 'Road Name',
    accessor: 'roadName',
    minWidth: tableColumnWidth.xl,
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
    minWidth: tableColumnWidth.md,
  },
  // {
  //   Header: 'Officer Name',
  //   accessor: 'inspector',
  //   minWidth: tableColumnWidth.lg,
  // },
];

const tabNavMenu = ['HDB/Condo', 'Landed'];

const LatestInspection = (props) => {
  const {
    getLatestInspectionListingAction,
    setDefaultValueAction,
    latestInspectionListingFilterAction,

    history,
    ui: { isLoading },
    data: { list = [], defaultValue = {}, filteredList = [] },
  } = props;

  const searchData = searchDataDefault.sort((a) => (a.value === defaultValue.searchType ? -1 : 1));
  const [sortValue, setSortValue] = useState(defaultValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultValue.filterValue);
  const [activeTab, setActiveTab] = useState(defaultValue.premiseType !== 'BLOCK' ? '1' : '0');
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);
  const routeName = WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.name;

  useEffect(() => {
    document.title = 'NEA | Latest Inspection';
    getLatestInspectionListingAction(
      {
        propertyType: activeTab === '1' ? 'LANDED' : 'BLOCK',
      },
      { filterValue, sortValue, searchText: debounceSearchText, searchType },
    );
  }, [getLatestInspectionListingAction, activeTab]);

  useEffect(() => {
    const param = { filterValue, sortValue, searchText: debounceSearchText, searchType };
    latestInspectionListingFilterAction(param);
  }, [filterValue, latestInspectionListingFilterAction, sortValue, searchType, debounceSearchText]);

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

  const onRowClick = (rowInfo) => {
    const block = rowInfo?.original;
    // const index = rowInfo?.index || 0;
    if (!block) return;

    const path = activeTab === '0' ? WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BLOCK_CHART.url : WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_LANDED_DETAIL.url;
    setDefaultValueAction({
      searchText,
      searchType,
      filterValue,
      premiseType: activeTab === '0' ? 'BLOCK' : 'LANDED',
      sortValue,
    });
    history.push(path, { block, fromLatest: true, parent: routeName });
  };

  const getTrProps = (_state, rowInfo) => ({
    onClick: debounce(() => onRowClick(rowInfo), 500),
    style: {
      cursor: 'pointer',
    },
  });

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={routeName} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION]} />
          <div className="main-title">
            <h1>Latest Inspection</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <nav className="tab__main marginBottom20">
            <div className="tabsContainer">
              <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={tabNavMenu} />
            </div>
          </nav>
          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} key={uuid()} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { latestInspectionListing } }, ownProps) => ({
  ...ownProps,
  ...latestInspectionListing,
});

const mapDispatchToProps = {
  getLatestInspectionListingAction,
  setDefaultValueAction,
  latestInspectionListingFilterAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LatestInspection));
