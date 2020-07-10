import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { getFilterArrayOfListForKey } from 'utils';

import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import { filterListAction, getListAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Town Council',
    value: 'tcCodeDesc',
  },
];

const columns = [
  {
    Header: 'Year',
    accessor: 'year',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Month',
    accessor: 'month',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Town Council',
    accessor: 'tcCodeDesc',
    minWidth: tableColumnWidth.xl,
  },
  {
    Header: 'Immediate Fine',
    accessor: 'immediateFine',
    minWidth: tableColumnWidth.md,
    sortType: 'number',
  },
  {
    Header: 'Threshold List',
    accessor: 'thresholdList',
    minWidth: tableColumnWidth.md,
    sortType: 'number',
  },
  {
    Header: 'No Enforcement',
    accessor: 'noEnforcement',
    minWidth: tableColumnWidth.md,
    sortType: 'number',
  },
  {
    Header: 'Total',
    accessor: 'total',
    minWidth: tableColumnWidth.md,
    sortType: 'number',
  },
];

const QueryTownCouncilFineRegime = (props) => {
  const {
    getListAction,
    filterListAction,

    history,
    ui: { isLoading },
    data: { filteredList, list },
    functionNameList,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME.name}`;
    getListAction({ isSupport: true }).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getListAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, filterListAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'year',
      title: 'Year',
      values: getFilterArrayOfListForKey(list, 'year'),
    },
    {
      type: FilterType.SELECT,
      id: 'month',
      title: 'Month',
      values: getFilterArrayOfListForKey(list, 'month'),
    },
    // {
    //   type: FilterType.SELECT,
    //   id: 'tcCodeDesc',
    //   title: 'Town Council',
    //   values: getFilterArrayOfListForKey(list, 'tcCodeDesc'),
    // },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      if (functionNameList.includes(FUNCTION_NAMES.getTcRegimeDetail) || functionNameList.includes(FUNCTION_NAMES.getTcRegimeSummary)) {
        return {
          onClick: () => {
            history.push(`${WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL.url}`, rowInfo.row._original);
          },
          className: 'cursor-pointer',
        };
      }
    }
    return {};
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
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

const mapStateToProps = ({ global, vectorInspectionReducers: { queryTownCouncilFineRegime } }, ownProps) => ({
  ...ownProps,
  ...queryTownCouncilFineRegime,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  filterListAction,
  getListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryTownCouncilFineRegime));
