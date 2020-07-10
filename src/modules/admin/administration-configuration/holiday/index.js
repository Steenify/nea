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
import ValidationField from 'components/common/formik/validationField';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import { dateFromString, dateStringDBFromDate, exportExcel, configMissingFieldMessage } from 'utils';

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
    label: 'Description',
    value: 'holidayDescription',
  },
];

const HolidayMaintenance = (props) => {
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

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.HOLIDAY.name}`;
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

  const onSubmit = async (values, actions) => {
    const data = values.data.map((item) => ({
      ...item,
      holidayDate: dateStringDBFromDate(dateFromString(item.holidayDate)),
    }));
    const updatedItems = data
      .filter((item) => item.action === 'edit')
      .map((item) => {
        if (item.fullDay) item.amPm = undefined;
        return item;
      });
    const addedItems = data
      .filter((item) => item.action === 'add')
      .map((item) => {
        if (item.fullDay) item.amPm = undefined;
        return item;
      });

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
        if (!value.holidayDate) {
          errorCount += 1;
          error.holidayDate = '(Required)';
        }
        if (!value.holidayDescription) {
          errorCount += 1;
          error.holidayDescription = '(Required)';
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
        <NavBar active={WEB_ROUTES.ADMINISTRATION.HOLIDAY.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.HOLIDAY]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.HOLIDAY.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Year',
                  accessor: 'holidayYear',
                  minWidth: tableColumnWidth.sm,
                  Cell: (cellInfo) => {
                    const { holidayYear } = cellInfo.row._original;
                    return <span>{holidayYear || ''}</span>;
                  },
                },
                {
                  Header: 'Date',
                  accessor: 'holidayDate',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { holidayDate, action, id } = cellInfo.row._original;
                    const name = 'holidayDate';
                    if (action) {
                      return (
                        <ValidationField
                          placeholder="Date"
                          inputComponent="singleDatePickerV2"
                          name={`data[${index}].${name}`}
                          hideError
                          onChange={(value) => {
                            setValueAction({ value, id, name });
                            setValueAction({ value: dateFromString(value).get('years'), id, name: 'holidayYear' });
                          }}
                        />
                      );
                    }
                    return <span>{holidayDate || ''}</span>;
                  },
                },
                {
                  Header: 'Description',
                  accessor: 'holidayDescription',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { holidayDescription, action, id } = cellInfo.row._original;
                    const name = 'holidayDescription';
                    if (action) {
                      return <ValidationField name={`data[${index}].${name}`} inputClassName="textfield" hideError onChange={(value) => setValueAction({ value, id, name })} />;
                    }
                    return <span>{holidayDescription || ''}</span>;
                  },
                },
                {
                  Header: 'Fixed Holiday',
                  accessor: 'fixedHoliday',
                  minWidth: tableColumnWidth.md,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { fixedHoliday, action, id } = cellInfo.row._original;
                    const name = 'fixedHoliday';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          isClearable={false}
                          options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                          ]}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => setValueAction({ value: !!value, id, name })}
                        />
                      );
                    }
                    return <span>{fixedHoliday ? 'Yes' : 'No'}</span>;
                  },
                },
                {
                  Header: 'Full Day',
                  accessor: 'fullDay',
                  minWidth: tableColumnWidth.md,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { fullDay, action, id } = cellInfo.row._original;
                    const name = 'fullDay';
                    if (action) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          isClearable={false}
                          options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                          ]}
                          selectClassName="w-100"
                          hideError
                          onChange={(value) => {
                            setValueAction({ value: !!value, id, name });
                            if (value) {
                              setValueAction({ value: undefined, id, name: 'amPm' });
                            }
                          }}
                        />
                      );
                    }
                    return <span>{fullDay ? 'Yes' : 'No'}</span>;
                  },
                },
                {
                  Header: 'AM/PM',
                  accessor: 'amPm',
                  minWidth: tableColumnWidth.md,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { amPm, action, id, fullDay } = cellInfo.row._original;
                    const name = 'amPm';
                    if (action && !fullDay) {
                      return (
                        <ValidationField
                          name={`data[${index}].${name}`}
                          inputComponent="react-select"
                          isClearable={false}
                          options={[
                            { label: 'AM', value: 'AM' },
                            { label: 'PM', value: 'PM' },
                          ]}
                          selectClassName="w-100"
                          hideError
                          disabled={fullDay}
                          onChange={(value) => setValueAction({ value, id, name })}
                        />
                      );
                    }
                    return <span>{amPm || ''}</span>;
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
                        <>
                          <span className="cursor-pointer" onClick={() => removeAddAction(id)}>
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
                              <button type="button" className="btn btn-sec m-1" onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.HOLIDAY.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { holidayMaintenance } }, ownProps) => ({
  ...ownProps,
  ...holidayMaintenance,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HolidayMaintenance));
