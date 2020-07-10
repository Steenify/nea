import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';
import { exportExcel } from 'utils';

import { filterListingAction, getListingAction, deleteAction, cancelEditAction, removeAddAction, setValueAction, updateFilterAction, resetReducerAction } from './action';
import { initialState } from './reducer';

const searchData = [
  {
    label: 'Role Name',
    value: 'roleName',
  },
  {
    label: 'Role Description',
    value: 'roleDescription',
  },
];

const RoleFunctionMapping = (props) => {
  const {
    getListingAction,
    updateFilterAction,
    resetReducerAction,
    history,
    ui: { isLoading },
    data: { filteredList },
    functionNameList,
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = 'NEA | Function Role Mapping';
    resetReducerAction();
    getListingAction();
  }, [getListingAction, resetReducerAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
    });
  }, [debounceSearchText, searchType, sortValue, updateFilterAction]);

  const columns = [
    {
      Header: 'Role Name',
      accessor: 'roleName',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Role Description',
      accessor: 'roleDescription',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => {
        if (functionNameList.includes(FUNCTION_NAMES.getRolesAssigned)) {
          return (
            <button
              type="button"
              className="btn btn-sec"
              onClick={() =>
                history.push(WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING_DETAIL.url, {
                  detail: cellInfo?.row?._original,
                })
              }>
              Edit
            </button>
          );
        }
        return <></>;
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Function Role Mapping" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.AUTHENTICATION_AUTHORISATION, WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING]} />
          <div className="main-title">
            <h1>Function Role Mapping</h1>
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
                    <button
                      type="button"
                      className="btn btn-sec m-1"
                      onClick={() => exportExcel(filteredList, WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ global, adminReducers: { roleFunctionMapping } }, ownProps) => ({
  ...ownProps,
  ...roleFunctionMapping,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  deleteAction,
  cancelEditAction,
  removeAddAction,
  setValueAction,
  updateFilterAction,
  resetReducerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoleFunctionMapping));
