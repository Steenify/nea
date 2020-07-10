import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import Checkbox from 'components/common/checkbox';

import { WEB_ROUTES, tableColumnWidth, GRAVITRAP_TASK_TYPE, FUNCTION_NAMES } from 'constants/index';

import { viewLDPendingSupportService, supportLDService, collateSupportLDService } from 'services/site-paper-gravitrap-audit';
import FloatingNumber from 'components/common/floating-number';
import { actionTryCatchCreator, getFilterArrayOfListForKey, filterFunc, sortFunc, monthIntToString } from 'utils';
import CustomModal from 'components/common/modal';
import { toast } from 'react-toastify';

const searchData = [
  {
    label: 'Task ID',
    value: 'displayTaskId',
  },
  {
    label: 'Address',
    value: 'address',
  },
];

const Table = (props) => {
  const {
    history: { push },
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'trapCode',
    label: 'Trap Code',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('displayTaskId');
  const [filterValue, setFilterValue] = useState(null);
  const [taskIds, setTaskIds] = useState([]);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [showRejectRemark, toggleShowRejectRemark] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText: debounceSearchText, searchType, filterValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, debounceSearchText, searchType],
  );

  const getListingAction = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.sitePaperList || [];
      const mappedList = list.map((item) => {
        const { blockNo, postalCode, roadName, audittask } = item;
        const monthInt = Number(item?.month || '0') || 0;
        const mappedMonth = monthIntToString(monthInt - 1, true);
        const taskId = audittask?.id;
        const address = [blockNo ? `Blk ${blockNo}` : '', roadName || '', postalCode ? `S${postalCode}` : ''].filter((item) => item).join(', ');
        return { ...item, address, mappedMonth, taskId };
      });
      setTableData(mappedList);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(viewLDPendingSupportService(), onPending, onSuccess, onError);
  }, []);

  const rejectLDAction = (param) => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      setTaskIds([]);
      toggleShowRejectRemark(false);
      setRejectionRemark('');
      getListingAction();
    };
    const onError = (error) => {
      setIsLoading(false);
    };
    actionTryCatchCreator(supportLDService(param), onPending, onSuccess, onError);
  };

  const getTemplateAction = (params) => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (template) => {
      setIsLoading(false);
      push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.SUPPORT_LD.url, { ...params, template });
    };
    const onError = (error) => {
      setIsLoading(false);
    };
    actionTryCatchCreator(collateSupportLDService(params), onPending, onSuccess, onError);
  };

  const onSupport = () => {
    const selectedTask = tableData.filter(({ displayTaskId }) => taskIds.includes(displayTaskId));
    const selectedMonths = selectedTask.map(({ month }) => month);
    const selectedYears = selectedTask.map(({ year }) => year);
    const monthSet = new Set(selectedMonths);
    const yearSet = new Set(selectedYears);
    const currentMonth = selectedMonths[0];
    const currentYear = selectedYears[0];

    const mappedMonth = selectedTask[0]?.mappedMonth || '';
    const totalLDForMonth = tableData.filter(({ month, year }) => month === currentMonth && year === currentYear).length;

    if (monthSet.size !== 1 || yearSet.size !== 1) {
      toast.error('All LD must be in the same month.');
      return;
    }

    if (totalLDForMonth !== selectedMonths.length) {
      toast.error('Unable to support LD as there are pending tasks in the month not submitted.');
      return;
    }

    const taskInfoList = selectedTask.map(({ displayTaskId, auditRepotType }) => ({ taskId: displayTaskId, taskType: auditRepotType }));

    const params = { year: currentYear, month: currentMonth, taskInfoList, mappedMonth };
    getTemplateAction(params);
  };

  useEffect(() => {
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const getTdProps = (_state, rowInfo, column) => {
    if (rowInfo && rowInfo.row && typeof column?.Header === 'string') {
      return {
        onClick: () => {
          const auditRepotType = rowInfo?.row?._original?.auditRepotType || '';
          if (auditRepotType.toUpperCase() === GRAVITRAP_TASK_TYPE.EHI) {
            const caseId = rowInfo?.row?._original?.displayTaskId || '';
            push(WEB_ROUTES.EHI_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
              caseId,
              isConcur: false,
              isSupport: true,
              taskType: auditRepotType,
            });
            return;
          }
          push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
            caseInfo: rowInfo?.row?._original,
            fromFunction: FUNCTION_NAMES.getPendingSupportWorkspaceListing,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const isSelectAll = taskIds.length > 0 && filteredTableData.filter(({ displayTaskId }) => !taskIds.includes(displayTaskId)).length === 0;
  const onSelectAll = () => {
    if (isSelectAll) {
      setTaskIds(taskIds.filter((item) => filteredTableData.findIndex(({ displayTaskId }) => displayTaskId === item) < 0));
    } else {
      const set = new Set([...taskIds, ...filteredTableData.map((item) => item.displayTaskId)]);
      setTaskIds(Array.from(set));
    }
  };

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => {
        const taskId = cellInfo?.row?._original?.displayTaskId;
        return (
          <Checkbox
            checked={taskIds.includes(taskId)}
            onChange={() => {
              setTaskIds(taskIds.includes(taskId) ? taskIds.filter((item) => item !== taskId) : [...taskIds, taskId]);
            }}
          />
        );
      },
      Header: () => <Checkbox checked={isSelectAll} onChange={onSelectAll} />,
    },
    {
      Header: 'Task ID',
      accessor: 'displayTaskId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Type',
      accessor: 'auditRepotType',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Division',
      accessor: 'divCode',
      minWidth: tableColumnWidth.lg,
    },

    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Trap Code',
      accessor: 'trapCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Month',
      accessor: 'mappedMonth',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Lapses',
      accessor: 'lapseDescription',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = [
    {
      type: FilterType.SEARCH,
      id: 'auditRepotType',
      title: 'Type',
      values: getFilterArrayOfListForKey(tableData, 'auditRepotType'),
    },
    {
      type: FilterType.SEARCH,
      id: 'divCode',
      title: 'Division',
      values: getFilterArrayOfListForKey(tableData, 'divCode'),
    },
    {
      type: FilterType.SEARCH,
      id: 'mappedMonth',
      title: 'Month',
      values: getFilterArrayOfListForKey(tableData, 'mappedMonth'),
    },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          {/* <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} /> */}
          <Filter ref={filterRef} className="navbar-nav ml-auto filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        {taskIds.length > 0 && (
          <div className="d-flex mt-3 mb-3">
            <div className="receive__numbers">
              <FloatingNumber title="Tasks Selected:" number={taskIds.length} />
            </div>
            <div className="d-flex align-items-center ml-auto mr-3">
              <button onClick={() => toggleShowRejectRemark(true)} type="button" className="btn btn-sec mr-3">
                Reject
              </button>
            </div>
            <div className="d-flex align-items-center">
              <button onClick={onSupport} type="button" className="btn btn-pri">
                Support
              </button>
            </div>
          </div>
        )}
        <DataTable data={filteredTableData} columns={columns} getTdProps={getTdProps} />
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
          const taskInfoList = tableData
            .filter(({ displayTaskId }) => taskIds.includes(displayTaskId))
            .map(({ displayTaskId, auditRepotType }) => ({ taskId: displayTaskId, taskType: auditRepotType }));
          rejectLDAction({ taskInfoList, rejectionRemarks: rejectionRemark, action: 'REJECTSUPPORT' });
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
    </>
  );
};

export default withRouter(Table);
