import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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
// import AddButton from 'components/common/add-button';
// import MeatBallDropdown from 'components/common/meatball-dropdown';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
// import Select from 'components/common/select';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import { exportExcel, actionTryCatchCreator, configMissingFieldMessage, formikValidate } from 'utils';

import { roleListingService } from 'services/authentication-authorisation/role-function-mapping';

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
    label: 'Lapse Code',
    value: 'lapseCode',
  },
  {
    label: 'Lapse Description',
    value: 'lapseDescription',
  },
];

const lapseTypeLOV = [
  {
    label: 'ADHOC',
    value: 'ADHOC',
  },
  {
    label: 'EHI',
    value: 'EHI',
  },
  {
    label: 'PAPER',
    value: 'PAPER',
  },
  {
    label: 'RODENT',
    value: 'RODENT',
  },
  {
    label: 'SITE',
    value: 'SITE',
  },
];

const LapseConfiguration = (props) => {
  const {
    getListingAction,
    deleteAction,
    editAction,
    cancelEditAction,
    // addAction,
    removeAddAction,
    setValueAction,
    updateFilterAction,
    createAction,
    updateAction,
    resetReducerAction,
    ui: { isLoading },
    data: { filteredList, editingList },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });
  const [roleLOV, setRoleLOV] = useState([]);

  const onSearchRole = () => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const lov = (data?.roleVoList).map((role) => ({
        label: role.roleName,
        value: role.roleName,
      }));
      setRoleLOV(lov);
    };
    const onError = (error) => {
      console.log('TCL: getUserRolesLovService -> error', error);
    };
    actionTryCatchCreator(roleListingService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION.name}`;
    resetReducerAction();
    onSearchRole();
  }, [resetReducerAction]);

  useEffect(() => {
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText,
    });
  }, [searchText, searchType, sortValue, updateFilterAction]);

  const onSubmit = async (values, actions) => {
    const data = values.data.map((item) => ({
      ...item,
    }));
    const updatedItems = data.filter((item) => item.action === 'edit');
    const addedItems = data.filter((item) => item.action === 'add');
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
        // if (!value.lapseCode) {
        //   errorCount += 1;
        //   error.lapseCode = '(Required)';
        // }
        // if (!value.lapseDescription) {
        //   errorCount += 1;
        //   error.lapseDescription = '(Required)';
        // }
        const ldRateError = formikValidate(value.ldRate, ['positive']);
        if (ldRateError) {
          errorCount += 1;
          error.ldRate = ldRateError;
        }

        if (!value.lapseType) {
          errorCount += 1;
          error.lapseType = '(Required)';
        }
        if (!value.roles || value.roles.length === 0) {
          errorCount += 1;
          error.roles = '(Required)';
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
        <NavBar active={WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Lapse Code',
                  accessor: 'lapseCode',
                  minWidth: tableColumnWidth.lg,
                  // Cell: (cellInfo) => {
                  //   const { index } = cellInfo;
                  //   const { lapseCode, action, id } = cellInfo.row._original;
                  //   const name = 'lapseCode';
                  //   if (action) {
                  //     return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                  //   }
                  //   return <span>{lapseCode || ''}</span>;
                  // },
                },
                {
                  Header: 'Lapse Description',
                  accessor: 'lapseDescription',
                  minWidth: tableColumnWidth.xl,
                  // Cell: (cellInfo) => {
                  //   const { index } = cellInfo;
                  //   const { lapseDescription, action, id } = cellInfo.row._original;
                  //   const name = 'lapseDescription';
                  //   if (action) {
                  //     return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                  //   }
                  //   return <span>{lapseDescription || ''}</span>;
                  // },
                },
                {
                  Header: 'ldRate',
                  accessor: 'ldRate',
                  sortType: 'number',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { ldRate, action, id } = cellInfo.row._original;
                    const name = 'ldRate';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return <span>{ldRate || ''}</span>;
                  },
                },
                {
                  Header: 'Lapse Type',
                  accessor: 'lapseType',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { lapseType, action, id } = cellInfo.row._original;
                    const name = 'lapseType';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={lapseTypeLOV}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, id, name })}
                        />
                      );
                    }
                    return <span>{lapseType || ''}</span>;
                  },
                },
                {
                  Header: 'Roles',
                  accessor: 'roles',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { roles, action, id } = cellInfo.row._original;
                    const name = 'roles';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-multi-select"
                          options={roleLOV}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, id, name })}
                        />
                      );
                    }
                    return (roles || []).join(', ');
                    // const code = masterCodes[MASTER_CODE.TC_CODE].find((item) => item.value === roles);
                    // if (code) return <span>{code.label}</span>;
                  },
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { id, action } = cellInfo?.row?._original;
                    if (action === 'add') {
                      return (
                        <>
                          <span className="cursor-pointer" onClick={() => removeAddAction(id)}>
                            <CloseIcon width={36} height={36} />
                          </span>
                        </>
                      );
                    }
                    if (action === 'edit') return <></>;
                    return (
                      <>
                        <button type="button" className="btn btn-sec" onClick={() => editAction(id)}>
                          Edit
                        </button>
                      </>
                      // <MeatBallDropdown
                      //   actions={[
                      //     {
                      //       title: 'Edit',
                      //       onClick: () => editAction(id),
                      //     },
                      //     {
                      //       title: 'Delete',
                      //       onClick: () => setModalState({ open: true, type: 'delete', data: { id } }),
                      //     },
                      //   ]}
                      // />
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
                              {/* <AddButton title="Add" onClick={addAction} className="d-inline m-1" /> */}
                              <button
                                type="button"
                                className="btn btn-sec m-1"
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { lapseConfiguration } }, ownProps) => ({
  ...ownProps,
  ...lapseConfiguration,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LapseConfiguration));
