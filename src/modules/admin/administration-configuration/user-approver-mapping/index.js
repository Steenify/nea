import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Formik, Form } from 'formik';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import AddButton from 'components/common/add-button';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import Select from 'components/common/select';

import { exportExcel, configMissingFieldMessage } from 'utils';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';

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
  getUserRoleAction,
} from './action';
import { initialState } from './reducer';

const searchData = [
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Approver',
    value: 'approver',
  },
];

const UserApproverMapping = (props) => {
  const {
    getListingAction,
    deleteAction,
    editAction,
    cancelEditAction,
    addAction,
    removeAddAction,
    setValueAction,
    updateFilterAction,
    createAction,
    updateAction,
    resetReducerAction,
    getUserRoleAction,
    // history,
    ui: { isLoading },
    data: { filteredList, editingList, userRoles },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING.name}`;
    resetReducerAction();
    getListingAction();
    getUserRoleAction();
  }, [getListingAction, resetReducerAction, getUserRoleAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
    });
  }, [debounceSearchText, searchType, sortValue, updateFilterAction]);

  const onSubmit = async (values, actions) => {
    const updatedItems = values.data.filter((item) => item.action === 'edit').map((item) => ({ userSoeId: item.userSoeId, approverSoeId: item.approverSoeId, id: item.id }));
    const addedItems = values.data.filter((item) => item.action === 'add').map((item) => ({ userSoeId: item.userSoeId, approverSoeId: item.approverSoeId, id: item.id }));

    await Promise.all(
      addedItems.map(async (item) => {
        try {
          await createAction(item);
        } catch (error) {
          console.log(`error: ${error}`);
        }
      }),
    );
    await Promise.all(
      updatedItems.map(async (item) => {
        try {
          await updateAction(item);
        } catch (error) {
          console.log(`error: ${error}`);
        }
      }),
    );
    // addedItems.forEach((item) => createAction(item));
    // updatedItems.forEach((item) => updateAction(item));
    getListingAction();

    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};
    const dataErrors = [];
    let errorCount = 0;

    values.data
      .filter((item) => item.action === 'edit' || item.action === 'add')
      .forEach((value) => {
        const error = {};
        if (!value.approver) {
          errorCount += 1;
          error.approver = '(Required)';
        }
        if (!value.user) {
          errorCount += 1;
          error.user = '(Required)';
        }
        dataErrors.push(error);
      });

    if (errorCount) {
      errors.data = dataErrors;
      errors.errorCount = errorCount;
      errors.errorHint = configMissingFieldMessage(errorCount);
    }

    return errors;
  };

  const isEditing = editingList.filter((item) => item.action).length > 0;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'User',
                  accessor: 'user',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { user, action, id, userSoeId, approver } = cellInfo.row._original;
                    if (action) {
                      const approverOfApprover = editingList.filter((item) => item.user === approver && item.approver !== approver).map((item) => item.approver);
                      const userOfApprover = editingList.filter((item) => item.approver === approver && item.user !== user).map((item) => item.user);
                      const checkRole = (role) => role && role !== approver && !approverOfApprover.includes(role) && !userOfApprover.includes(role);
                      return (
                        <Select
                          isAppendToBody
                          placeholder="Find User..."
                          className="m-2 w-100"
                          small
                          value={checkRole(user) ? { value: userSoeId, label: user } : null}
                          options={userRoles.filter((item) => checkRole(item.label))}
                          // isAsync
                          // loadOptions={_.debounce(onSearchUser, 500)}
                          // defaultOptions={false}
                          // cacheOptions
                          onChange={(item) => {
                            setValueAction({ value: item.fullName, id, name: 'user' });
                            setValueAction({ value: item.soeId, id, name: 'userSoeId' });
                          }}
                        />
                      );
                    }
                    return user || '';
                  },
                },
                {
                  Header: 'Approver',
                  accessor: 'approver',
                  minWidth: tableColumnWidth.md,
                  Cell: (cellInfo) => {
                    const { approver, action, id, approverSoeId, user } = cellInfo.row._original;
                    if (action) {
                      const approverOfUser = editingList.filter((item) => item.user === user && item.approver !== approver).map((item) => item.approver);
                      const userOfUser = editingList.filter((item) => item.approver === user && item.user !== user).map((item) => item.user);
                      const checkRole = (role) => role && role !== user && !approverOfUser.includes(role) && !userOfUser.includes(role);
                      return (
                        <Select
                          isAppendToBody
                          placeholder="Find Approver..."
                          className="m-2 w-100"
                          small
                          value={checkRole(approver) ? { value: approverSoeId, label: approver } : null}
                          options={userRoles.filter((item) => checkRole(item.label))}
                          // isAsync
                          // loadOptions={_.debounce(onSearchUser, 500)}
                          // defaultOptions={false}
                          // cacheOptions
                          onChange={(item) => {
                            setValueAction({ value: item.fullName, id, name: 'approver' });
                            setValueAction({ value: item.soeId, id, name: 'approverSoeId' });
                          }}
                        />
                      );
                    }
                    return approver || '';
                  },
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { id, action, userSoeId } = cellInfo?.row?._original;
                    if (action === 'add') {
                      return (
                        <span className="cursor-pointer" onClick={() => removeAddAction(id)}>
                          <CloseIcon width={36} height={36} />
                        </span>
                      );
                    }
                    if (action === 'edit') return <></>;
                    return (
                      <MeatBallDropdown
                        actions={[
                          {
                            title: 'Edit',
                            onClick: () => editAction(id),
                          },
                          {
                            title: 'Delete',
                            onClick: () => setModalState({ open: true, type: 'delete', data: { id, userSoeId } }),
                          },
                        ]}
                      />
                    );
                  },
                },
              ];
              return (
                <>
                  <div className="navbar navbar-expand filterMainWrapper">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
                      <Sort className="navbar-nav sortWrapper ml-auto" data={columns.slice(0, columns.length - 1)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
                    </div>
                  </div>
                  <div className="paddingBottom50 tabsContainer">
                    <div>
                      <Form>
                        <PromptOnLeave dirty={dirty} />
                        <DataTable
                          data={filteredList}
                          columns={columns}
                          rightHeaderContent={
                            <div className="d-flex align-items-center">
                              <AddButton title="Add" onClick={addAction} className="d-inline m-1" />
                              <button
                                type="button"
                                className="btn btn-sec m-1"
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING.name, columns.slice(0, columns.length - 1))}>
                                Download
                              </button>
                            </div>
                          }
                        />
                        <SubmitErrorMessage />
                        {isEditing && (
                          <div className="text-center mb-4">
                            <button type="button" className="btn btn-sec m-2" onClick={cancelEditAction}>
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-pri m-2">
                              Save
                            </button>
                          </div>
                        )}
                      </Form>
                    </div>
                  </div>
                </>
              );
            }}
          </Formik>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'delete'}
            type="system-modal"
            headerTitle="Do you want to Delete this Record?"
            cancelTitle="No"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Yes"
            onConfirm={() => {
              deleteAction(modalState.data);
              setModalState({ open: false });
            }}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { userApproverMapping } }, ownProps) => ({
  ...ownProps,
  ...userApproverMapping,
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
  getUserRoleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserApproverMapping));
