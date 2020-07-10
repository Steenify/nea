import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import { connect } from 'react-redux';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import TabNav from 'components/ui/tabnav';
import Checkbox from 'components/common/checkbox';
import CustomModal from 'components/common/modal';

import { form3CommonPoolAction, sampleMyWorkspaceFilter, form3ClaimAction } from './action';

const tabNavMenu = ['Rejected Tasks Pending Approval', 'LOI Pending Approval', 'Pending Approval for No Enforcement'];

const ClaimTask = (props) => {
  const {
    history,
    ui: { isLoading },
    data: { filteredTaskList },

    history: { push },
    form3CommonPoolAction,
    form3ClaimAction,
  } = props;
  const [selectedTask, setSelectedTasks] = useState([]);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const [activeTabNav, toggleTabNav] = useState('0');

  const onCheckTaskId = (form3Id) => {
    const tasks = new Set(selectedTask);
    if (tasks.has(form3Id)) {
      tasks.delete(form3Id);
    } else {
      tasks.add(form3Id);
    }
    setSelectedTasks(Array.from(tasks));
  };

  const onCheckAllTask = () => {
    const result = filteredTaskList.length === selectedTask.length ? [] : filteredTaskList.map((item) => item?.form3Id || '');
    setSelectedTasks(result);
  };

  const onClaimTasks = () => {
    form3ClaimAction(selectedTask).then((_data) => {
      setIsShowConfirmModal(true);
      // toast.success('Claim task successfully');
    });
  };

  const columns = [
    {
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={selectedTask.includes(cellInfo?.row?.form3Id || '')} onChange={() => onCheckTaskId(cellInfo.row?.form3Id || '')} />,
      Header: () => <Checkbox checked={filteredTaskList.length === selectedTask.length && filteredTaskList.length !== 0} onChange={() => onCheckAllTask()} />,
    },
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id: cellInfo.row.form3Id })}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
    {
      Header: 'Officer Name',
      accessor: 'inspector',
      minWidth: tableColumnWidth.md,
    },
  ];

  useEffect(() => {
    document.title = 'NEA | Claim Tasks';
    form3CommonPoolAction().then(() => {});
  }, [form3CommonPoolAction]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Claim Tasks" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.CLAIM_TASK]} />
          <div className="main-title">
            <h1>Claim Tasks</h1>
          </div>
          <nav className="tab__main">
            <div className="tabsContainer">
              <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
            </div>
          </nav>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredTaskList} columns={columns.filter((item) => (activeTabNav === '1' ? true : item.Header !== 'Officer Name'))} />
              {filteredTaskList.length > 0 && (
                <div className="workspace__claim_button_container text-center">
                  <button type="button" className="btn btn-pri" onClick={onClaimTasks} hidden={selectedTask.length === 0}>
                    Claim Tasks
                  </button>
                </div>
              )}
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={isShowConfirmModal}
            headerTitle="Tasks Claimed. Go to My Workspace?"
            onCancel={() => {
              setIsShowConfirmModal(false);
            }}
            type="system-modal"
            cancelTitle="No"
            confirmTitle="Yes"
            onConfirm={() => history.push(WEB_ROUTES.MY_WORKSPACE.url)}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ claimTaskReducers: { ieuOfficer } }, ownProps) => ({
  ...ownProps,
  ...ieuOfficer,
});

const mapDispatchToProps = {
  form3CommonPoolAction,
  sampleMyWorkspaceFilterAction: sampleMyWorkspaceFilter,
  form3ClaimAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
