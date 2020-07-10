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
// import ValidationField from 'components/common/formik/validationField';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { exportExcel } from 'utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';

import { filterListingAction, getListingAction, deleteAction, cancelEditAction, removeAddAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Broadcast Title',
    value: 'broadcastTitle',
  },
];

const BroadcastOnlineMessage = (props) => {
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

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name}`;
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    filterListingAction({
      sortValue,
      searchType,
      searchText,
    });
  }, [searchText, searchType, sortValue, filterListingAction]);

  const isEditing = editingList.filter((item) => item.action).length > 0;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name}</h1>
          </div>
          <Formik enableReinitialize initialValues={{ data: filteredList }}>
            {({ dirty }) => {
              const columns = [
                {
                  Header: 'Broadcast Title',
                  accessor: 'broadcastTitle',
                  minWidth: tableColumnWidth.md,
                },
                {
                  Header: 'Start Date Time',
                  accessor: 'startDate',
                  minWidth: tableColumnWidth.md,
                },
                {
                  Header: 'End Date Time',
                  accessor: 'endDate',
                  minWidth: tableColumnWidth.md,
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
                            onClick: () =>
                              history.push(`${WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL.url}/edit`, {
                                detail: cellInfo?.row?._original,
                              }),
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
                              <AddButton title="Add" onClick={() => history.push(`${WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL.url}/create`)} className="d-inline m-1" />
                              <button
                                type="button"
                                className="btn btn-sec m-1"
                                onClick={() => exportExcel(filteredList, WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name, columns.slice(0, columns.length - 1))}>
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

const mapStateToProps = ({ adminReducers: { broadcastOnlineMessage } }, ownProps) => ({
  ...ownProps,
  ...broadcastOnlineMessage,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  deleteAction,
  cancelEditAction,
  removeAddAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BroadcastOnlineMessage));
