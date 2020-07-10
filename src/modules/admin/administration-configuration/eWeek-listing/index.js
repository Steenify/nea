import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import AddButton from 'components/common/add-button';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { exportExcel } from 'utils';

import { filterListingAction, getListingAction, updateFilterAction, resetReducerAction } from './action';
import { initialState } from './reducer';

const searchData = [
  {
    label: 'Year',
    value: 'year',
  },
  {
    label: 'EWeek No',
    value: 'week',
  },
];

const EWeekMaintenance = (props) => {
  const {
    getListingAction,
    updateFilterAction,
    resetReducerAction,
    history,
    ui: { isLoading },
    data: { filteredList },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.EWEEK.name}`;
    resetReducerAction();
    getListingAction();
  }, [getListingAction, resetReducerAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText,
    });
  }, [searchText, searchType, sortValue, updateFilterAction]);

  const columns = [
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'EWeek No',
      accessor: 'week',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Start Date',
      accessor: 'startDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.sm,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.EWEEK.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.EWEEK]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.EWEEK.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <AddButton title="Generate eWeek" onClick={() => history.push(WEB_ROUTES.ADMINISTRATION.EWEEK_GENERATE.url)} className="d-inline m-1" />
                    <button type="button" className="btn btn-sec m-1" onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.EWEEK.name, columns)}>
                      Download
                    </button>
                  </div>
                }
              />
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { eWeekListingMaintenance } }, ownProps) => ({
  ...ownProps,
  ...eWeekListingMaintenance,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  updateFilterAction,
  resetReducerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EWeekMaintenance));
