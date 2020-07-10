import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import Filter, { FilterType } from 'components/common/filter';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import InPageLoading from 'components/common/inPageLoading';
import { debounce } from 'lodash';
import { actionTryCatchCreator } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getLatestInspectionListingService } from 'services/vector-inspection';

const defaultFilterValue = {
  searchText: '',
  searchType: 'roadName',
  filterValue: {
    division: [],
    regionOffice: [],
    premisesType: [],
  },
  sortValue: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
};

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
  const { history } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });

  const searchData = searchDataDefault.sort((a) => (a.value === defaultFilterValue.searchType ? -1 : 1));
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [activeTab, setActiveTab] = useState(defaultFilterValue.premiseType !== 'BLOCK' ? '1' : '0');
  const filterRef = useRef(null);

  const routeName = WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.name;

  const getListAction = useCallback(() => {
    const params = {
      propertyType: activeTab === '1' ? 'LANDED' : 'BLOCK',
    };
    const onPending = () => setAPIState((prev) => ({ ...prev, isLoading: true }));
    const onSuccess = (data) => {
      setAPIState({ isLoading: false, list: data.inspections || [] });
      if (filterRef && filterRef.current) filterRef.current.onClear();
    };
    const onError = () => setAPIState((prev) => ({ ...prev, isLoading: false }));
    actionTryCatchCreator(getLatestInspectionListingService(params), onPending, onSuccess, onError);
  }, [activeTab]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.name}`;
    getListAction();
  }, [getListAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOffice',
        title: 'RO',
        // default: filterValue?.regionOffice || [],
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
        // default: filterValue?.division || [],
      },
      {
        type: FilterType.SEARCH,
        id: 'premisesType',
        title: 'Premises Type',
        // default: filterValue?.premisesType || [],
      },
    ],
    [],
  );

  const onRowClick = (rowInfo) => {
    const block = rowInfo?.original;
    // const index = rowInfo?.index || 0;
    if (!block) return;

    const path = activeTab === '0' ? WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BLOCK_CHART.url : WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_LANDED_DETAIL.url;
    // setDefaultValueAction({
    //   searchText,
    //   searchType,
    //   filterValue,
    //   premiseType: activeTab === '0' ? 'BLOCK' : 'LANDED',
    //   sortValue,
    // });
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
            <h1>{routeName}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list || []} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <nav className="tab__main marginBottom20">
            <div className="tabsContainer">
              <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={tabNavMenu} />
            </div>
          </nav>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.list || []} getTrProps={getTrProps} columns={columns} filterData={{ searchType, searchText, filterValue, sortValue }} />
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reduders, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LatestInspection));
