import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { difference } from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import Filter, { FilterType } from 'components/common/filter';
import SearchBox from 'components/common/searchBox';
import { withRouter } from 'react-router-dom';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import Checkbox from 'components/common/checkbox';
import FloatingNumber from 'components/common/floating-number';
import CustomModal from 'components/common/modal';
import { commonPoolListingAction, commonPoolFilter, claimTaskAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Task ID',
    value: 'taskId',
  },
  {
    label: 'Address',
    value: 'street',
  },
  {
    label: 'Postal Code',
    value: 'postalCode',
  },
];

const ClaimTask = ({ commonPoolListingAction, claimTaskAction, commonPoolFilterAction, ui: { isLoading }, data: { filteredTaskList, taskList }, history }) => {
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [selectedTask, setSelectedTasks] = useState([]);
  const [isSelectingAllTask, setIsSelectingAllTask] = useState([0]);
  const filterRef = useRef(null);

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.CLAIM_TASK.name}`;
    commonPoolListingAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [commonPoolListingAction]);

  useEffect(() => {
    commonPoolFilterAction({ sortValue, searchText, searchType, filterValue });
  }, [searchText, searchType, filterValue, commonPoolFilterAction, sortValue]);

  const checkSelectAll = (selectedTaskInput, tasks) => {
    if (selectedTaskInput.length === 0) {
      return 0;
    }
    const selectedArray = Array.from(selectedTaskInput).sort();
    const array = Array.from(tasks.map((item) => item.taskId)).sort();
    return difference(array, selectedArray).length === 0 ? 1 : 0;
  };

  let doubleCheckSelectingAll = checkSelectAll(selectedTask, filteredTaskList);
  doubleCheckSelectingAll = doubleCheckSelectingAll === isSelectingAllTask ? isSelectingAllTask : doubleCheckSelectingAll;

  const onCheckTaskId = (taskId) => {
    const tasks = new Set(selectedTask);
    if (tasks.has(taskId)) {
      tasks.delete(taskId);
    } else {
      tasks.add(taskId);
    }
    setSelectedTasks(Array.from(tasks));
    setIsSelectingAllTask(checkSelectAll(tasks, filteredTaskList));
  };

  const onCheckAllTask = () => {
    const setTasks = new Set(selectedTask);
    if (isSelectingAllTask === 1) {
      filteredTaskList.forEach((e) => {
        setTasks.delete(e.taskId);
      });
      setSelectedTasks(Array.from(setTasks));
      setIsSelectingAllTask(0);
    } else {
      filteredTaskList.forEach((e) => {
        setTasks.add(e.taskId);
      });
      setSelectedTasks(Array.from(setTasks));
      setIsSelectingAllTask(1);
    }
  };

  const onClaimTasks = () => {
    claimTaskAction(selectedTask, () => {
      setSelectedTasks([]);
      commonPoolListingAction();
      setIsShowConfirmModal(true);
    });
  };

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={selectedTask.includes(cellInfo.row.taskId)} onChange={() => onCheckTaskId(cellInfo.row.taskId)} />,
      Header: () => <Checkbox checked={doubleCheckSelectingAll === 1} onChange={() => onCheckAllTask()} />,
    },
    {
      Header: 'Division',
      accessor: 'constituency',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Task ID',
      accessor: 'taskId',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Address',
      accessor: 'street',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Trap Code',
      accessor: 'trapCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Eweek',
      accessor: 'week',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Sample Bottles',
      accessor: 'contractorBottleCount',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Specimen',
      accessor: 'contractorSpecimenCount',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
  ];

  const filterData =
    (() => [
      {
        type: FilterType.SEARCH,
        id: 'constituency',
        title: 'Division',
      },
      {
        type: FilterType.SEARCH,
        id: 'week',
        title: 'Eweek',
      },
    ],
    []);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.CLAIM_TASK.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.CLAIM_TASK.name}</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={taskList} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>

          <div className="tabsContainer">
            {selectedTask.length > 0 && (
              <div className="d-flex mt-3 mb-3">
                <div className="receive__numbers">
                  <FloatingNumber title="Tasks Selected:" number={selectedTask.length} />
                </div>
                <div className="d-flex align-items-center ml-auto">
                  <button type="button" className="btn btn-pri" onClick={onClaimTasks}>
                    Claim Tasks
                  </button>
                </div>
              </div>
            )}
            <DataTable data={filteredTaskList} columns={columns} title="" />
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

const mapStateToProps = ({ claimTaskReducers: { ehiTechnicalOfficer } }, ownProps) => ({
  ...ownProps,
  ...ehiTechnicalOfficer,
});

const mapDispatchToProps = {
  commonPoolListingAction,
  commonPoolFilterAction: commonPoolFilter,
  claimTaskAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
