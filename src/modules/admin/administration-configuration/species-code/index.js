import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { isArray } from 'lodash';

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
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

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
} from './action';
import { initialState } from './reducer';

const searchData = [
  {
    label: 'Species Code',
    value: 'speciesCode',
  },
  {
    label: 'Species Name',
    value: 'speciesName',
  },
];

const SpeciesCodeMaintenance = (props) => {
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

    getMastercodeAction,
    masterCodes,
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.SPECIES_CODE.name}`;
    getMastercodeAction([MASTER_CODE.SPECIMEN_STAGE, MASTER_CODE.DISEASE_TYPE, MASTER_CODE.SPECIMEN_CODE]);
    resetReducerAction();
  }, [getListingAction, resetReducerAction, getMastercodeAction]);

  useEffect(() => {
    if (masterCodes[MASTER_CODE.SPECIMEN_CODE]) {
      getListingAction();
    }
  }, [masterCodes, getListingAction]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText,
    });
  }, [searchText, searchType, sortValue, updateFilterAction]);

  const onSubmit = async (values, actions) => {
    const data = values.data;
    const updatedItems = data.filter((item) => item.action === 'edit');
    const addedItems = data.filter((item) => item.action === 'add');

    // addedItems.forEach((item) => createAction({ ...item, stage: item.stage.join(',') }));
    // updatedItems.forEach((item) => updateAction(Array.isArray(item.stage) ? { ...item, stage: item.stage.join(',') } : item));
    await Promise.all(
      addedItems.map(async (item) => {
        try {
          await createAction({ ...item, stage: item.stage.join(',') });
        } catch (error) {
          console.log(`error: ${error}`);
        }
      }),
    );
    await Promise.all(
      updatedItems.map(async (item) => {
        try {
          await updateAction(Array.isArray(item.stage) ? { ...item, stage: item.stage.join(',') } : item);
        } catch (error) {
          console.log(`error: ${error}`);
        }
      }),
    );
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
        if (!value.speciesCode) {
          errorCount += 1;
          error.speciesCode = '(Required)';
        }
        if (!value.speciesName) {
          errorCount += 1;
          error.speciesName = '(Required)';
        }
        if (!value.diseases || value.diseases.length < 1) {
          errorCount += 1;
          error.diseases = '(Required)';
        }
        if (!value.specimenTypeCode) {
          errorCount += 1;
          error.specimenTypeCode = '(Required)';
        }
        dataErrors.push(error);
      });

    if (errorCount) {
      errors.data = dataErrors;
      errors.errorCount = errorCount;
      errors.errorHint = configMissingFieldMessage(errorCount);
    }

    // console.log(errors);
    return errors;
  };

  const isEditing = editingList.filter((item) => item.action).length > 0;

  const downloadExcel = (columns) => {
    const temp = filteredList.map((item) => {
      const specimenTypeCode = masterCodes[MASTER_CODE.SPECIMEN_CODE]?.find((code) => code.value === item.specimenTypeCode)?.label || item.specimenTypeCode;
      // const stage = masterCodes[MASTER_CODE.SPECIMEN_STAGE]?.find((code) => code.value === item?.stage)?.label || item.stage;
      const diseases = masterCodes[MASTER_CODE.DISEASE_TYPE]?.find((code) => code.value === item.diseases)?.label || item.diseases;
      return { ...item, diseases, specimenTypeCode };
    });
    exportExcel(temp, WEB_ROUTES.ADMINISTRATION.SPECIES_CODE.name, columns.slice(0, columns.length - 1));
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.SPECIES_CODE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.SPECIES_CODE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.SPECIES_CODE.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Species Code',
                  accessor: 'speciesCode',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { speciesCode, action, id } = cellInfo.row._original;
                    const name = 'speciesCode';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return <span>{speciesCode || ''}</span>;
                  },
                },
                {
                  Header: 'Species Name',
                  accessor: 'speciesName',
                  minWidth: tableColumnWidth.xxl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { speciesName, action, id } = cellInfo.row._original;
                    const name = 'speciesName';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return <span>{speciesName || ''}</span>;
                  },
                },
                {
                  Header: 'Vector of Disease',
                  accessor: 'diseases',
                  minWidth: tableColumnWidth.xxl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { diseases, action, id } = cellInfo.row._original;
                    const name = 'diseases';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-multi-select"
                          options={masterCodes[MASTER_CODE.DISEASE_TYPE]}
                          optionsCompareField="label"
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => {
                            let diseases = value;
                            diseases = masterCodes[MASTER_CODE.DISEASE_TYPE].filter((item) => value.includes(item.value)).map((item) => item.label);
                            setValueAction({ value: diseases, id, name });
                          }}
                        />
                      );
                    }
                    return <span>{(diseases || []).join(', ')}</span>;
                  },
                },
                {
                  Header: 'Specimen Type',
                  accessor: 'specimenTypeCode',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { specimenTypeCode, action, id } = cellInfo.row._original;
                    const name = 'specimenTypeCode';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={masterCodes[MASTER_CODE.SPECIMEN_CODE]}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, id, name })}
                        />
                      );
                    }
                    const code = masterCodes[MASTER_CODE.SPECIMEN_CODE].find((item) => item.value === specimenTypeCode);
                    if (code) return <span>{code.label}</span>;
                    return <span>{specimenTypeCode || ''}</span>;
                  },
                },
                {
                  Header: 'Specimen Stage',
                  accessor: 'stage',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { stage, action, id } = cellInfo.row._original;
                    const name = 'stage';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-multi-select"
                          options={masterCodes[MASTER_CODE.SPECIMEN_STAGE]}
                          optionsCompareField="value"
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, id, name })}
                        />
                      );
                    }
                    if (isArray(stage)) {
                      return <span>{stage.join(',') || ''}</span>;
                    }
                    return <span>{stage || ''}</span>;
                  },
                },
                {
                  Header: 'Is Vector?',
                  accessor: 'isVector',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { isVector } = cellInfo.row._original;
                    if (isVector === true) return 'Yes';
                    if (isVector === false) return 'No';
                    return '';
                  },
                },
                {
                  Header: 'Is Enforceable?',
                  accessor: 'enforceable',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { enforceable, action, id } = cellInfo.row._original;
                    const name = 'enforceable';
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
                    return enforceable ? 'Yes' : 'No';
                  },
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { id, action } = cellInfo?.row?._original;
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
                      <Sort
                        className="navbar-nav sortWrapper ml-auto"
                        data={columns.filter((col) => col.Header.toLowerCase() !== 'action')}
                        value={sortValue}
                        desc={sortValue.desc}
                        onChange={setSortValue}
                      />
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
                              <button type="button" className="btn btn-sec m-1" onClick={() => downloadExcel(columns)}>
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

const mapStateToProps = ({ global, adminReducers: { speciesCodeMaintenance } }, ownProps) => ({
  ...ownProps,
  ...speciesCodeMaintenance,
  masterCodes: global.data.masterCodes,
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
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SpeciesCodeMaintenance));
