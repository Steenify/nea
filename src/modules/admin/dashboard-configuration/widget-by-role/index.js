import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { filterListingAction, getListingAction, deleteAction, resetReducerAction, updateFilterAction, getAssignedListingAction } from './action';
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

const WidgetByRole = (props) => {
  const {
    getListingAction,
    updateFilterAction,
    resetReducerAction,
    getAssignedListingAction,
    deleteAction,
    history,
    ui: { isLoading },
    data: { filteredList, assignedList },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE.name}`;
    resetReducerAction();
    getListingAction();
    getAssignedListingAction();
  }, [getListingAction, resetReducerAction, getAssignedListingAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText,
    });
  }, [searchText, searchType, sortValue, updateFilterAction]);

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
        const actions = [
          {
            title: 'Edit',
            onClick: () =>
              history.push(`${WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE_DETAIL.url}`, {
                detail: cellInfo?.original,
              }),
          },
        ];
        if (assignedList.map((item) => item.roleName).includes(cellInfo?.original.roleName)) {
          actions.push({
            title: 'Remove Widgets',
            onClick: () =>
              deleteAction(cellInfo?.original, () => {
                toast.success(`Widgets removed for ${cellInfo?.original.roleName}`);
              }),
          });
        }
        return <MeatBallDropdown actions={actions} />;
      },
    },
  ];

  const mappedList = filteredList.map((item) => {
    const existedRole = assignedList.find((role) => role.roleName === item.roleName);
    if (existedRole) {
      return { ...existedRole, ...item };
    }
    return item;
  });

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.DASHBOARD_CONFIGURATION, WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns.slice(0, columns.length - 1)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={mappedList} columns={columns} />
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { widgetByRole } }, ownProps) => ({
  ...ownProps,
  ...widgetByRole,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  deleteAction,
  updateFilterAction,
  resetReducerAction,
  getAssignedListingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WidgetByRole));
