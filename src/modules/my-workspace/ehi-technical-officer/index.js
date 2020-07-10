import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TabNav from 'components/ui/tabnav';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Filter, { FilterType } from 'components/common/filter';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import { useDebounce } from 'use-debounce';
import { getFilterArrayOfListForKey } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import Checkbox from 'components/common/checkbox';
import FloatingNumber from 'components/common/floating-number';
import CustomModal from 'components/common/modal';
import { toast } from 'react-toastify';
import { listAction, filterAction, defaultFilterValue, rejectAction, supportAction } from './action';

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

const MyWorkspace = ({
  ui: { isLoading },
  data: { list, filteredList },
  history,

  listAction,
  filterAction,
  rejectAction,
  supportAction,
  isAnalyst = false,
  isUnitLeader = false,
  isSectionLeader = false,
}) => {
  const analystSort = { id: 'week', label: 'Eweek', desc: false, sortType: 'number' };
  const [sortValue, setSortValue] = useState(isAnalyst ? analystSort : defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);
  const [activeTab, setTab] = useState('0');
  const [taskIds, setTaskIds] = useState([]);

  const [showRejectRemark, toggleShowRejectRemark] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');

  const isSelectAll = taskIds.length > 0 && taskIds.length === filteredList.length;

  useEffect(() => {
    document.title = 'NEA | My Workspace';
    listAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [listAction]);

  useEffect(() => {
    const temp = activeTab === '1';
    const filterNext = isUnitLeader ? (item) => (item.rejectFlag || false) === temp : null;
    filterAction({ searchText: debounceSearchText, searchType, sortValue, filterValue, filterNext });
  }, [debounceSearchText, searchType, filterValue, filterAction, sortValue, activeTab, isUnitLeader]);

  const onSupport = () => {
    const selectedTask = list.filter(({ taskId }) => taskIds.includes(taskId));
    const selectedMonths = selectedTask.map(({ month }) => month);
    const selectedYears = selectedTask.map(({ year }) => year);
    const monthSet = new Set(selectedMonths);
    const yearSet = new Set(selectedYears);
    const currentMonth = selectedMonths[0];
    const currentYear = selectedYears[0];

    const totalLDForMonth = list.filter(({ month, year }) => month === currentMonth && year === currentYear).length;

    if (monthSet.size !== 1 || yearSet.size !== 1) {
      toast.error('All LD must be in the same month.');
      return;
    }

    if (totalLDForMonth !== selectedMonths.length) {
      toast.error('Unable to support LD as there are pending tasks in the month not submitted.');
      return;
    }
    supportAction(taskIds, () => {
      setTaskIds([]);
      toast.success('Task Supported');
    });
  };

  const getTdProps = (_state, rowInfo, column) => {
    if (rowInfo && rowInfo.row && typeof column?.Header === 'string') {
      return {
        onClick: (e) => {
          e.preventDefault();
          const caseId = rowInfo?.row?._original?.taskId || '';
          const taskType = rowInfo?.row?._original?.taskType || '';
          history.push(WEB_ROUTES.EHI_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
            caseId,
            isConcur: isUnitLeader,
            isSupport: isSectionLeader,
            taskType,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      maxWidth: isSectionLeader ? undefined : 0,
      show: isSectionLeader,
      Cell: (cellInfo) => {
        const taskId = cellInfo?.row?.taskId;
        return (
          <Checkbox
            checked={taskIds.includes(taskId)}
            onChange={() => {
              setTaskIds(taskIds.includes(taskId) ? taskIds.filter((item) => item !== taskId) : [...taskIds, taskId]);
            }}
          />
        );
      },
      Header: () => <Checkbox checked={isSelectAll} onChange={() => setTaskIds(isSelectAll ? [] : filteredList.map((item) => item.taskId))} />,
    },
    {
      Header: 'Division',
      accessor: 'constituency',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Task ID',
      accessor: 'taskId',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Type',
      accessor: 'taskType',
      minWidth: tableColumnWidth.md,
      show: isUnitLeader || isSectionLeader,
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
      maxWidth: isAnalyst ? undefined : 0,
      show: isAnalyst,
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Month',
      accessor: 'mappedMonth',
      maxWidth: isSectionLeader || isUnitLeader ? undefined : 0,
      show: isSectionLeader || isUnitLeader,
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Year',
      accessor: 'year',
      maxWidth: isSectionLeader ? undefined : 0,
      show: isSectionLeader,
      minWidth: tableColumnWidth.sm,
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
    {
      Header: 'Status',
      accessor: 'status',
      maxWidth: isAnalyst ? undefined : 0,
      show: isAnalyst,
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Lapses Observed',
      accessor: 'lapseObserved',
      maxWidth: isSectionLeader || (isUnitLeader && activeTab === '1') ? undefined : 0,
      show: isSectionLeader || (isUnitLeader && activeTab === '1'),
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = [
    {
      type: FilterType.SEARCH,
      id: 'constituency',
      title: 'Division',
      values: getFilterArrayOfListForKey(
        // list,
        list.filter((item) => (item?.rejectFlag || false) === (activeTab === '1')),
        'constituency',
      ),
    },
    {
      type: FilterType.SEARCH,
      id: 'week',
      title: 'Eweek',
      values: getFilterArrayOfListForKey(list, 'week'),
      show: isAnalyst,
    },
    {
      type: FilterType.SEARCH,
      id: 'mappedMonth',
      title: 'Month',
      values: getFilterArrayOfListForKey(list, 'mappedMonth'),
      show: isSectionLeader,
    },
    {
      type: FilterType.SEARCH,
      id: 'status',
      title: 'Status',
      values: getFilterArrayOfListForKey(list, 'status'),
      show: isAnalyst,
    },
  ];

  return (
    <>
      {isUnitLeader && (
        <nav className="tab__main">
          <div className="tabsContainer">
            <TabNav onToggleTab={setTab} activeTab={activeTab} menu={['Lapse Assessment', 'Rejected LD']} />
          </div>
        </nav>
      )}
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData.filter((item) => item.show !== false)} />
          <Sort
            className="navbar-nav sortWrapper xs-paddingBottom20"
            data={columns.filter((item) => item.show !== false).map((item) => (item.Header === 'Month' ? { ...item, accessor: 'month' } : item))}
            value={sortValue}
            desc={sortValue.desc}
            onChange={setSortValue}
          />
        </div>
      </div>

      <div className="paddingBottom50 tabsContainer">
        <div>
          {taskIds.length > 0 && (
            <div className="d-flex mt-3 mb-3">
              <div className="receive__numbers">
                <FloatingNumber title="Tasks Selected:" number={taskIds.length} />
              </div>
              <div className="d-flex align-items-center ml-auto mr-3">
                <button type="button" className="btn btn-sec" onClick={() => toggleShowRejectRemark(true)}>
                  Reject
                </button>
              </div>
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-pri" onClick={onSupport}>
                  Support
                </button>
              </div>
            </div>
          )}
          <DataTable data={filteredList} columns={columns} getTdProps={getTdProps} />
        </div>
        <CustomModal
          headerTitle="Remarks for Rejection"
          confirmTitle="Reject"
          cancelTitle="Cancel"
          isOpen={showRejectRemark}
          onConfirm={() => {
            if (!rejectionRemark) {
              toast.error('Please enter Remarks for Rejection');
              return;
            }
            rejectAction({ taskIds, rejectionRemark }, () => {
              setTaskIds([]);
              toggleShowRejectRemark(false);
              setRejectionRemark('');
              toast.success('Task rejected');
            });
          }}
          onCancel={() => {
            toggleShowRejectRemark(false);
            setRejectionRemark('');
          }}
          type="action-modal"
          content={
            <form className="form-group">
              <div className="row paddingBottom20">
                <div className="col-lg-12">
                  <textarea className="form-control" rows={3} onChange={(e) => setRejectionRemark(e.target.value)} />
                </div>
              </div>
            </form>
          }
        />
        <InPageLoading isLoading={isLoading} />
      </div>
    </>
  );
};

// export default MyWorkspace;

const mapStateToProps = ({ myWorkspaceReducers: { ehiTechnicalOfficer } }, ownProps) => ({
  ...ownProps,
  ...ehiTechnicalOfficer,
});

const mapDispatchToProps = { listAction, filterAction, rejectAction, supportAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyWorkspace));
