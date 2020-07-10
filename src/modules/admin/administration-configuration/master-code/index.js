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
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { exportExcel } from 'utils';

import {
  filterListingAction,
  getListingAction,
  deleteAction,
  editAction,
  cancelEditAction,
  addAction,
  removeAddAction,
  setValueAction,
  updateFilterAction,
  createAction,
  resetReducerAction,
  updateAction,
} from './action';
import { initialState } from './reducer';

const searchData = [
  {
    label: 'Master Code',
    value: 'mastCode',
  },
  {
    label: 'Description',
    value: 'mastCodeDesc',
  },
];

const MasterCodeMaintenance = (props) => {
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
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.MASTER_CODE.name}`;
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
      Header: 'Master Code',
      accessor: 'mastCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Description',
      accessor: 'mastCodeDesc',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Source System',
      accessor: 'mastCodeSource',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => {
        return (
          <button
            type="button"
            className="btn btn-sec"
            onClick={() =>
              history.push(WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL.url, {
                detail: cellInfo?.row?._original,
                action: 'edit',
              })
            }>
            Edit
          </button>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.MASTER_CODE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.MASTER_CODE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.MASTER_CODE.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns.slice(0, columns.length - 1)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sec m-1" onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.MASTER_CODE.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { masterCodeMaintenance } }, ownProps) => ({
  ...ownProps,
  ...masterCodeMaintenance,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  deleteAction,
  editAction,
  cancelEditAction,
  addAction,
  removeAddAction,
  setValueAction,
  updateFilterAction,
  createAction,
  resetReducerAction,
  updateAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MasterCodeMaintenance));
