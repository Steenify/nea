import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import { getAllTownCouncilFineRegimeListingService } from 'services/inspection-management/town-council-fine-regime';
import { actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'tcCodeDesc',
  filterValue: null,
  sortValue: {
    id: 'tcCodeDesc',
    label: 'Town Council',
    desc: false,
  },
};

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
    sortType: 'number',
  },
  {
    Header: 'Month',
    accessor: 'month',
    minWidth: tableColumnWidth.md,
    sortType: 'month',
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
  const { history, functionNameList } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const getListing = useCallback((params) => {
    actionTryCatchCreator(
      getAllTownCouncilFineRegimeListingService(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.tcRegimeDetailSummaryListingVoList || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, []);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME.name}`;
    getListing({ isSupport: true });
  }, [getListing]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'year',
        title: 'Year',
      },
      {
        type: FilterType.SELECT,
        id: 'month',
        title: 'Month',
      },
    ],
    [],
  );

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
              <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
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

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryTownCouncilFineRegime));
