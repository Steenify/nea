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
import AddButton from 'components/common/add-button';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import { exportExcel, configMissingFieldMessage } from 'utils';

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
    label: 'Configuration Name',
    value: 'configName',
  },
  {
    label: 'Configuration Description',
    value: 'configDescription',
  },
];

const SystemConfiguration = (props) => {
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
    // history,
    ui: { isLoading },
    data: { filteredList, editingList },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE.name}`;
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

  const onSubmit = async (values, actions) => {
    const updatedItems = values.data.filter((item) => item.action === 'edit');
    const addedItems = values.data.filter((item) => item.action === 'add');

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
        if (!value.configName) {
          errorCount += 1;
          error.configName = '(Required)';
        }
        if (!value.configDescription) {
          errorCount += 1;
          error.configDescription = '(Required)';
        }
        if (!value.configValue) {
          errorCount += 1;
          error.configValue = '(Required)';
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
        <NavBar active={WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Configuration Name',
                  accessor: 'configName',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { configName, action, id } = cellInfo.row._original;
                    const name = 'configName';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return configName || '';
                  },
                },
                {
                  Header: 'Configuration Description',
                  accessor: 'configDescription',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { configDescription, action, id } = cellInfo.row._original;
                    const name = 'configDescription';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return configDescription || '';
                  },
                },
                {
                  Header: 'Configuration Value',
                  accessor: 'configValue',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { configValue, action, id } = cellInfo.row._original;
                    const name = 'configValue';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return configValue || '';
                  },
                },
                {
                  Header: 'Updateable',
                  accessor: 'updateable',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { updateable, action, id } = cellInfo.row._original;
                    const name = 'updateable';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                          ]}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value: value ? true : false, id, name })}
                        />
                      );
                    }
                    return updateable ? 'Yes' : 'No';
                  },
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { id, action, updateable } = cellInfo?.row?._original;
                    if (action === 'add') {
                      return (
                        <>
                          <span className="cursor-pointer" onClick={() => removeAddAction(id)}>
                            <CloseIcon width={36} height={36} />
                          </span>
                        </>
                      );
                    }
                    if (action === 'edit' || !updateable) return <></>;
                    return (
                      <MeatBallDropdown
                        actions={[
                          {
                            title: 'Edit',
                            onClick: () => editAction(id),
                          },
                          {
                            title: 'Delete',
                            onClick: () => setModalState({ open: true, type: 'delete', data: { id } }),
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
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ global, adminReducers: { systemConfiguration } }, ownProps) => ({
  ...ownProps,
  ...systemConfiguration,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SystemConfiguration));
