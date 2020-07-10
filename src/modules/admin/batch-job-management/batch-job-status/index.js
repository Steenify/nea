import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

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
import SingleDatePickerV2 from 'components/common/single-date-picker';
import Filter, { FilterType } from 'components/common/filter';
import { toast } from 'react-toastify';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { exportExcel } from 'utils';

import { filterListingAction, getListingAction, deleteAction, triggerAction, terminateAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Job Name',
    value: 'jobName',
  },
];

const BatchJobStatus = (props) => {
  const {
    getListingAction,
    filterListingAction,
    deleteAction,
    triggerAction,
    terminateAction,
    history,
    ui: { isLoading },
    data: { filteredList, list },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.name}`;
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

  const columns = [
    // {
    //   Header: 'Job ID',
    //   accessor: 'id',
    //   minWidth: tableColumnWidth.sm,
    // },
    {
      Header: 'Job Name',
      accessor: 'jobName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Active Status',
      accessor: 'activeStatus',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (cellInfo.original?.activeStatus ? 'Yes' : 'No'),
    },
    {
      Header: 'Last Run',
      accessor: 'lastRun',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.sm,
      Cell: (cellInfo) => {
        const { id, jobEndPt, jobName, status, triggerDateRequired } = cellInfo?.original;
        return (
          <MeatBallDropdown
            actions={[
              {
                title: 'Edit',
                onClick: () =>
                  history.push(`${WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL.url}/edit`, {
                    detail: cellInfo?.row?._original,
                  }),
              },
              {
                title: 'Trigger',
                onClick: () => {
                  if (triggerDateRequired) {
                    setModalState({ open: true, type: 'trigger', data: { url: jobEndPt, batchId: id } });
                  } else {
                    triggerAction({ url: jobEndPt, batchId: id }, () => {
                      toast.success('Batch Job Triggered Successfully');
                    });
                  }
                },
              },
              {
                title: 'Terminate',
                onClick: () => {
                  const data = { batchName: jobName, batchId: id };
                  if (status === 'RUNNING') {
                    setModalState({ open: true, type: 'terminate', data });
                  } else {
                    terminateAction(data, () => {
                      setModalState({ open: false });
                      toast.success('Batch Job Terminated Successfully');
                    });
                  }
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

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'status',
        title: 'Status',
      },
    ],
    [],
  );
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.BATCH_JOB_MANAGEMENT, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15 ml-auto" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper" data={columns.filter((col) => col.Header.toLowerCase() !== 'action')} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <AddButton title="Add" onClick={() => history.push(`${WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL.url}/create`)} className="d-inline m-1" />
                    <button
                      type="button"
                      className="btn btn-sec m-1"
                      onClick={() => exportExcel(filteredList, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.name, columns.slice(0, columns.length - 1))}>
                      Download
                    </button>
                  </div>
                }
              />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'delete'}
            type="system-modal"
            headerTitle="Delete will clear this Job's cron expression. Do you want to proceed?"
            cancelTitle="No"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Yes"
            onConfirm={() => {
              deleteAction(modalState.data);
              setModalState({ open: false });
            }}
          />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'terminate'}
            type="system-modal"
            headerTitle="Job running in-progress, do you need to terminate now?"
            cancelTitle="No"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Yes"
            onConfirm={() => {
              terminateAction(modalState.data, () => {
                setModalState({ open: false });
                toast.success('Batch Job Terminated Successfully');
              });
            }}
          />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'trigger'}
            size="sm"
            headerTitle="Trigger Date"
            confirmTitle="Trigger"
            cancelTitle="Cancel"
            onConfirm={() => {
              triggerAction(modalState.data, () => {
                setModalState({ open: false });
                toast.success('Batch Job Triggered Successfully');
              });
            }}
            onCancel={() => setModalState({ open: false })}
            type="action-modal"
            content={
              <SingleDatePickerV2
                date={moment(modalState?.data?.dateStr)}
                // className="w-100"
                onChangeDate={(date) => setModalState({ ...modalState, data: { ...modalState.data, dateStr: date.format('YYYY-MM-DD') } })}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { batchJobStatus } }, ownProps) => ({
  ...ownProps,
  ...batchJobStatus,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
  terminateAction,
  triggerAction,
  deleteAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BatchJobStatus));
