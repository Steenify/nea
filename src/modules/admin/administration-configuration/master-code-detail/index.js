import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Formik, Form } from 'formik';
import moment from 'moment';
import uuid from 'uuid/v4';

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
import {
  dateStringFromDate,
  dbDateTimeStringFrom,
  // dateAndTimeFromDB,
  exportExcel,
  configMissingFieldMessage,
} from 'utils';

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
    label: 'Code',
    value: 'code',
  },
  {
    label: 'Description',
    value: 'codeDesc',
  },
];

const MasterCodeMaintenanceDetail = (props) => {
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
    location: { state },
    history,
    ui: { isLoading },
    data: { filteredList, editingList },
  } = props;

  const [sortValue, setSortValue] = useState(initialState.ui.filterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(initialState.ui.filterValue.searchType);
  const [searchText, setSearchTextValue] = useState(initialState.ui.filterValue.searchText);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  const id = state?.action;

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL.name}`;
    if (id !== 'edit' && id !== 'create') {
      history.replace(WEB_ROUTES.ADMINISTRATION.MASTER_CODE.url);
      return;
    }
    resetReducerAction();
    const list = state?.detail.mastCdDetList || [];
    // .map((item) => {
    //   const [effDate, effTime] = dateAndTimeFromDB(item.effDate);
    //   const [expDate, expTime] = dateAndTimeFromDB(item.expDate);
    //   return { ...item, effDate, effTime, expDate, expTime };
    // });
    getListingAction(list);
  }, [getListingAction, resetReducerAction, id, history, state]);

  useEffect(() => {
    updateFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
    });
  }, [debounceSearchText, searchType, sortValue, updateFilterAction]);

  const onSubmit = async (values, actions) => {
    const data = values.data.map((item) => ({
      codeId: item.codeId,
      mastCd: item.mastCd,
      code: item.code,
      codeDesc: item.codeDesc,
      effDate: dbDateTimeStringFrom(item.effDate, item.effTime),
      expDate: dbDateTimeStringFrom(item.expDate, item.expTime),
      action: item.action,
    }));
    // const { data } = values;
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
        if (!value.code) {
          errorCount += 1;
          error.code = '(Required)';
        }
        if (!value.codeDesc) {
          errorCount += 1;
          error.codeDesc = '(Required)';
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

  const defaultAddValue = () => ({
    codeId: uuid(),
    mastCd: state?.detail?.mastCode || '',
    code: '',
    codeDesc: '',
    sourceCode: state?.detail?.mastCodeSource,
    effDate: dateStringFromDate(moment()),
    expDate: dateStringFromDate(moment()),
    // effDate: dateStringDBFromDate(moment()),
    // effTime: '00:00:00',
    // expDate: dateStringDBFromDate(moment()),
    // expTime: '23:59:59',
    action: 'add',
  });

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.MASTER_CODE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.MASTER_CODE, WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL]} />
          <div className="go-back d-flex align-items-center">
            <span onClick={() => history.goBack()}>{WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL.name}</span>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div className="row mb-3">
              <div className="col-md-4 col-lg-2 font-weight-bold">Master Code</div>
              <div className="col col-lg-5">{state?.detail.mastCode}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 col-lg-2 font-weight-bold">Description</div>
              <div className="col col-lg-5">{state?.detail.mastCodeDesc}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 col-lg-2 font-weight-bold">Source From</div>
              <div className="col col-lg-5">{state?.detail.mastCodeSource}</div>
            </div>
            <hr />
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Code',
                  accessor: 'code',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { code, action, codeId } = cellInfo.row._original;
                    const name = 'code';
                    if (action === 'add') {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, codeId, name })} />;
                    }
                    return <span>{code || ''}</span>;
                  },
                },
                {
                  Header: 'Description',
                  accessor: 'codeDesc',
                  minWidth: tableColumnWidth.xl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { codeDesc, action, codeId } = cellInfo.row._original;
                    const name = 'codeDesc';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, codeId, name })} />;
                    }
                    return <span>{codeDesc || ''}</span>;
                  },
                },
                {
                  Header: 'Effective Date',
                  accessor: 'effDate',
                  minWidth: tableColumnWidth.xxxl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const {
                      effDate,
                      // effTime,
                      action,
                      codeId,
                    } = cellInfo.row._original;
                    const dateName = 'effDate';
                    // const timeName = 'effTime';
                    if (action) {
                      return (
                        <>
                          <ValidationField inputComponent="singleDatePickerV2" name={`data[${index}].${dateName}`} hideError onChange={(value) => setValueAction({ value, codeId, name: dateName })} />
                          {/* <ValidationField
                            name={`data[${index}].${timeName}`}
                            placeholder="Time"
                            inputClassName="d-inline wf-150 "
                            inputComponent="timePicker"
                            use12Hours={false}
                            hideError
                            onChange={(value) => setValueAction({ value, codeId, name: timeName })}
                          /> */}
                        </>
                      );
                    }
                    return <span>{`${effDate}`}</span>;
                    // return <span>{`${effDate} ${effTime}`}</span>;
                  },
                },
                {
                  Header: 'Expired Date',
                  accessor: 'expDate',
                  minWidth: tableColumnWidth.xxxl,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const {
                      expDate,
                      //  expTime,
                      action,
                      codeId,
                    } = cellInfo.row._original;
                    const dateName = 'expDate';
                    // const timeName = 'expTime';
                    if (action) {
                      return (
                        <>
                          <ValidationField inputComponent="singleDatePickerV2" name={`data[${index}].${dateName}`} hideError onChange={(value) => setValueAction({ value, codeId, name: dateName })} />
                          {/* <ValidationField
                            name={`data[${index}].${timeName}`}
                            placeholder="Time"
                            inputClassName="d-inline wf-150 "
                            inputComponent="timePicker"
                            use12Hours={false}
                            hideError
                            onChange={(value) => setValueAction({ value, codeId, name: timeName })}
                          /> */}
                        </>
                      );
                    }
                    // return <span>{`${expDate} ${expTime}`}</span>;
                    return <span>{`${expDate}`}</span>;
                  },
                },
                {
                  Header: 'Source Code',
                  accessor: 'sourceCode',
                  minWidth: tableColumnWidth.md,
                },
                {
                  Header: 'Action',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { codeId, action, mastCd } = cellInfo?.row?._original;
                    if (action === 'add') {
                      return (
                        <>
                          <span className="cursor-pointer" onClick={() => removeAddAction(codeId)}>
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
                            onClick: () => editAction(codeId),
                          },
                          {
                            title: 'Delete',
                            onClick: () => setModalState({ open: true, type: 'delete', data: { codeId, mastCd } }),
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
                              <AddButton title="Add" onClick={() => addAction(defaultAddValue())} className="d-inline m-1" />
                              <button
                                type="button"
                                className="btn btn-sec m-1"
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { masterCodeMaintenanceDetail } }, ownProps) => ({
  ...ownProps,
  ...masterCodeMaintenanceDetail,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MasterCodeMaintenanceDetail));
