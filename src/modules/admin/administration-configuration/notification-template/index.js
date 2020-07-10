import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Formik, Form } from 'formik';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import AddButton from 'components/common/add-button';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import Filter, { FilterType } from 'components/common/filter';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import { byteArrayToBlob, exportExcel, configMissingFieldMessage } from 'utils';

import { filterListingAction, getListingAction, deleteAction, editAction, cancelEditAction, addAction, removeAddAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Notification Name',
    value: 'notificationName',
  },
  {
    label: 'Notification Type',
    value: 'notificationType',
  },
];

const NotificationTemplate = (props) => {
  const {
    getListingAction,
    filterListingAction,
    deleteAction,
    cancelEditAction,
    removeAddAction,
    history,
    ui: { isLoading },
    data: { filteredList, editingList },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE.name}`;
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    filterListingAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
    });
  }, [searchText, searchType, sortValue, filterValue, filterListingAction]);

  const onSubmit = (values, actions) => {
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

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'notificationType',
        title: 'Notification Type',
      },
    ],
    [],
  );

  const isEditing = editingList.filter((item) => item.action).length > 0;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }} validate={validate} onSubmit={onSubmit}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Notification Type',
                  accessor: 'notificationType',
                  minWidth: tableColumnWidth.sm,
                },
                {
                  Header: 'Notification Name',
                  accessor: 'notificationName',
                  minWidth: tableColumnWidth.md,
                },
                {
                  Header: 'Effective Date',
                  accessor: 'effDate',
                  minWidth: tableColumnWidth.lg,
                },
                {
                  Header: 'Expired Date',
                  accessor: 'expDate',
                  minWidth: tableColumnWidth.lg,
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
                            // onClick: () => editAction(id),
                            onClick: () => {
                              const detail = cellInfo?.row?._original;
                              if (detail.file) {
                                detail.file = byteArrayToBlob(cellInfo?.row?._original?.file);
                              }

                              history.push(`${WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE_DETAIL.url}/edit`, {
                                detail,
                              });
                            },
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
                      <Filter className="navbar-nav filterWrapper xs-paddingBottom15 ml-auto" onChange={setFilterValue} data={filterData} original={editingList} />
                      <Sort className="navbar-nav sortWrapper" data={columns.filter((col) => col.Header.toLowerCase() !== 'action')} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
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
                              <AddButton title="Add" onClick={() => history.push(`${WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE_DETAIL.url}/create`)} className="d-inline m-1" />
                              <button
                                type="button"
                                className="btn btn-sec m-1"
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { notificationTemplate } }, ownProps) => ({
  ...ownProps,
  ...notificationTemplate,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  deleteAction,
  editAction,
  cancelEditAction,
  addAction,
  removeAddAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NotificationTemplate));
