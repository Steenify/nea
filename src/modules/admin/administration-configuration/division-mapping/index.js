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

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import { dbDateTimeStringFrom, exportExcel, configMissingFieldMessage } from 'utils';

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
    label: 'Division Code',
    value: 'divCode',
  },
  {
    label: 'Division Description',
    value: 'divDescription',
  },
  {
    label: 'TL Name',
    value: 'tlName',
  },
];

const DivisionMaintenance = (props) => {
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
    getMastercodeAction,
    getUserRoleAction,
    ui: { isLoading },
    data: { filteredList, editingList, userRoles },

    masterCodes,
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING.name}`;
    getMastercodeAction([MASTER_CODE.RO_CODE, MASTER_CODE.GRC_CODE, MASTER_CODE.TC_CODE, MASTER_CODE.CDC_CODE]);
    resetReducerAction();
    getUserRoleAction();
  }, [resetReducerAction, getMastercodeAction, getUserRoleAction]);

  useEffect(() => {
    if (masterCodes[MASTER_CODE.RO_CODE]) {
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
    const data = values.data.map((item) => ({
      ...item,
      effDate: dbDateTimeStringFrom(item.effDate, item.effTime),
      expDate: dbDateTimeStringFrom(item.expDate, item.expTime),
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
        if (!value.divCode) {
          errorCount += 1;
          error.divCode = '(Required)';
        }
        if (!value.divDescription) {
          errorCount += 1;
          error.divDescription = '(Required)';
        }
        if (!value.divRo) {
          errorCount += 1;
          error.divRo = '(Required)';
        }
        if (!value.divDistrict) {
          errorCount += 1;
          error.divDistrict = '(Required)';
        }
        if (!value.divTc) {
          errorCount += 1;
          error.divTc = '(Required)';
        }
        if (!value.divGrc) {
          errorCount += 1;
          error.divGrc = '(Required)';
        }
        if (!value.tlName) {
          errorCount += 1;
          error.tlName = '(Required)';
        }
        if (!value.effDate) {
          errorCount += 1;
          error.effDate = '(Required)';
        }
        // if (!value.effTime) {
        //   errorCount += 1;
        //   error.effTime = '(Required)';
        // }
        if (!value.expDate) {
          errorCount += 1;
          error.expDate = '(Required)';
        }
        // if (!value.expTime) {
        //   errorCount += 1;
        //   error.expTime = '(Required)';
        // }
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

  const downloadExcel = (columns) => {
    const temp = filteredList.map((item) => {
      const divDescription = item.divDescription?.toLowerCase().toTitleCase();
      const divRo = (masterCodes[MASTER_CODE.RO_CODE]?.find((code) => code.value === item.divRo)?.label || item.divRo)?.toLowerCase().toTitleCase();
      const divDistrict = (masterCodes[MASTER_CODE.CDC_CODE]?.find((code) => code.value === item?.divDistrict)?.label || item.divDistrict)?.toLowerCase().toTitleCase();
      const divTc = (masterCodes[MASTER_CODE.TC_CODE]?.find((code) => code.value === item.divTc)?.label || item.divTc)?.toLowerCase().toTitleCase();
      const divGrc = (masterCodes[MASTER_CODE.GRC_CODE]?.find((code) => code.value === item.divGrc)?.label || item.divGrc)?.toLowerCase().toTitleCase();
      return { ...item, divDescription, divRo, divDistrict, divTc, divGrc };
    });
    exportExcel(temp, WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING.name, columns.slice(0, columns.length - 1));
  };

  const districtOptions = (masterCodes[MASTER_CODE.CDC_CODE] || []).map((item) => ({ ...item, label: item.label?.toLowerCase().toTitleCase() }));
  const tcOptions = (masterCodes[MASTER_CODE.TC_CODE] || []).map((item) => ({ ...item, label: item.label?.toLowerCase().toTitleCase() }));
  const grcOptions = (masterCodes[MASTER_CODE.GRC_CODE] || []).map((item) => ({ ...item, label: item.label?.toLowerCase().toTitleCase() }));

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Division Code',
                  accessor: 'divCode',
                  sortType: 'number',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divCode, action, divId } = cellInfo.row._original;
                    const name = 'divCode';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, divId, name })} />;
                    }
                    return <span>{divCode || ''}</span>;
                  },
                },
                {
                  Header: 'Division Description',
                  accessor: 'divDescription',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divDescription, action, divId } = cellInfo.row._original;
                    const name = 'divDescription';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, divId, name })} />;
                    }
                    return <span>{divDescription.toLowerCase().toTitleCase() || ''}</span>;
                  },
                },
                {
                  Header: 'RO',
                  accessor: 'divRo',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divRo, action, divId } = cellInfo.row._original;
                    const name = 'divRo';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={masterCodes[MASTER_CODE.RO_CODE]}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, divId, name })}
                        />
                      );
                    }
                    const code = masterCodes[MASTER_CODE.RO_CODE].find((item) => item.value === divRo);
                    if (code) return <span>{code.label}</span>;
                    return <span>{divRo || ''}</span>;
                  },
                },
                {
                  Header: 'District',
                  accessor: 'divDistrict',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divDistrict, action, divId } = cellInfo.row._original;
                    const name = 'divDistrict';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={districtOptions}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, divId, name })}
                        />
                      );
                    }
                    const code = districtOptions.find((item) => item.value === divDistrict);
                    const text = (code ? code.label : divDistrict) || '';
                    return <span>{text.toLowerCase().toTitleCase()}</span>;
                  },
                },
                {
                  Header: 'TC',
                  accessor: 'divTc',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divTc, action, divId } = cellInfo.row._original;
                    const name = 'divTc';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={tcOptions}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, divId, name })}
                        />
                      );
                    }
                    const code = tcOptions.find((item) => item.value === divTc);
                    const text = (code ? code.label : divTc) || '';
                    return <span>{text.toLowerCase().toTitleCase()}</span>;
                  },
                },
                {
                  Header: 'GRC',
                  accessor: 'divGrc',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { divGrc, action, divId } = cellInfo.row._original;
                    const name = 'divGrc';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          options={grcOptions}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value, divId, name })}
                        />
                      );
                    }
                    const code = grcOptions.find((item) => item.value === divGrc);
                    const text = (code ? code.label : divGrc) || '';
                    return <span>{text.toLowerCase().toTitleCase()}</span>;
                  },
                },
                {
                  Header: 'TL Name',
                  accessor: 'tlName',
                  minWidth: tableColumnWidth.xxl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { tlName, action, divId } = cellInfo.row._original;
                    if (action) {
                      return (
                        <ValidationField
                          placeholder="Find User..."
                          appendToBody
                          name={`data[${index}].tlName`}
                          inputComponent="react-select"
                          options={userRoles}
                          isClearable
                          selectClassName="w-100"
                          hideError
                          onChange={(item) => {
                            setValueAction({ value: userRoles.find((role) => role.value === item)?.label, divId, name: 'tlName' });
                            setValueAction({ value: item, divId, name: 'tl' });
                          }}
                        />
                      );
                    }
                    return <span>{tlName || ''}</span>;
                  },
                },
                {
                  Header: 'Effective Date',
                  accessor: 'effDate',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const {
                      effDate,
                      // effTime,
                      action,
                      divId,
                    } = cellInfo.row._original;
                    const dateName = 'effDate';
                    // const timeName = 'effTime';
                    if (action) {
                      return (
                        <>
                          <ValidationField inputComponent="singleDatePickerV2" name={`data[${index}].${dateName}`} hideError onChange={(value) => setValueAction({ value, divId, name: dateName })} />
                          {/* <ValidationField
                            name={`data[${index}].${timeName}`}
                            placeholder="Time"
                            inputClassName="d-inline wf-150 "
                            inputComponent="timePicker"
                            use12Hours={false}
                            hideError
                            onChange={value => setValueAction({ value, divId, name: timeName })}
                          /> */}
                        </>
                      );
                    }
                    return <span>{`${effDate}`}</span>;
                    // return `${effDate} ${effTime}`;
                  },
                },
                {
                  Header: 'Expired Date',
                  accessor: 'expDate',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const {
                      expDate,
                      // expTime,
                      action,
                      divId,
                    } = cellInfo.row._original;
                    const dateName = 'expDate';
                    // const timeName = 'expTime';
                    if (action) {
                      return (
                        <>
                          <ValidationField inputComponent="singleDatePickerV2" name={`data[${index}].${dateName}`} hideError onChange={(value) => setValueAction({ value, divId, name: dateName })} />
                          {/* <ValidationField
                            name={`data[${index}].${timeName}`}
                            placeholder="Time"
                            inputClassName="d-inline wf-150 "
                            inputComponent="timePicker"
                            use12Hours={false}
                            hideError
                            onChange={value => setValueAction({ value, divId, name: timeName })}
                          /> */}
                        </>
                      );
                    }
                    return <span>{`${expDate}`}</span>;
                    // return `${expDate} ${expTime}`;
                  },
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { divId, action } = cellInfo?.row?._original;
                    if (action === 'add') {
                      return (
                        <>
                          <span className="cursor-pointer" onClick={() => removeAddAction(divId)}>
                            <CloseIcon width={36} height={36} />
                          </span>
                        </>
                      );
                    }
                    if (action === 'edit') return <></>;
                    return (
                      <MeatBallDropdown
                        actions={[
                          {
                            title: 'Edit',
                            onClick: () => editAction(divId),
                          },
                          {
                            title: 'Delete',
                            onClick: () => setModalState({ open: true, type: 'delete', data: { divId } }),
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

const mapStateToProps = ({ global, adminReducers: { divisionMaintenance } }, ownProps) => ({
  ...ownProps,
  ...divisionMaintenance,
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
  getUserRoleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DivisionMaintenance));
