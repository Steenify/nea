import React, { useState, useRef, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Checkbox from 'components/common/checkbox';
import CustomModal from 'components/common/modal';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { supportLDService } from 'services/rodent-audit';

import { actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

const searchData = [
  {
    label: 'Task ID',
    value: 'taskId',
  },
  {
    label: 'Location',
    value: 'location',
  },
  {
    label: 'Postal Code',
    value: 'postalCode',
  },
];

const PendingLDSupportTable = (props) => {
  const {
    history: { push },
    data,
    getListingAction,
  } = props;

  const [sortValue, setSortValue] = useState({ id: 'taskId', label: 'Task ID', desc: false });
  const [searchType, setSearchTypeValue] = useState('taskId');
  const [searchText, setSearchTextValue] = useState('');
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState();

  const [taskIds, setTaskIds] = useState([]);

  const filteredData = data.filter((item) => filterFunc(item, { sortValue, searchText, searchType, filterValue })).sort((a, b) => sortFunc(a, b, sortValue));

  const isSelectAll = taskIds.length > 0 && taskIds.length === filteredData.length;

  const onCheckRow = (taskId) => {
    const index = taskIds.findIndex((id) => id === taskId);
    if (index > -1) {
      taskIds.splice(index, 1);
    } else {
      taskIds.push(taskId);
    }
    setTaskIds([...taskIds]);
  };

  const onCheckAllRow = () => {
    if (isSelectAll) {
      filteredData.forEach((task) => {
        const index = taskIds.findIndex((id) => id === task.id);
        if (index > -1) taskIds.splice(index, 1);
      });
      setTaskIds([...taskIds]);
    } else {
      filteredData.forEach((task) => {
        const index = taskIds.findIndex((id) => id === task.id);
        if (index < 0) taskIds.push(task.id);
      });
      setTaskIds([...taskIds]);
    }
  };

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.RODENT_AUDIT.SUPPORT_LD_AMOUNT.url, rowInfo.original);
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
      hiddenInSort: true,
      Cell: (cellInfo) => {
        const { id } = cellInfo.row._original;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={taskIds.includes(id)} onChange={() => onCheckRow(id)} />
          </div>
        );
      },
      Header: () => (
        <div style={{ textAlign: 'center' }}>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="custom_search_check_all" checked={isSelectAll} onChange={onCheckAllRow} />
            <label className="custom-control-label" htmlFor="custom_search_check_all" />
          </div>
        </div>
      ),
    },
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Task Type',
      accessor: 'taskTypeToBeDisplayed',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Task ID',
      accessor: 'taskId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Location',
      accessor: 'location',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Type of Lapse',
      accessor: 'typeOfLapse',
      minWidth: tableColumnWidth.xxl,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'taskTypeToBeDisplayed',
        title: 'Task Type',
      },
      {
        type: FilterType.SELECT,
        id: 'typeOfLapse',
        title: 'Type of Lapse',
      },
    ],
    [],
  );

  const supportLDAction = (support) => {
    actionTryCatchCreator(
      supportLDService({ taskIds, remarks: rejectionRemark, support }),
      () => setIsLoading(true),
      () => {
        setTaskIds([]);
        setModalState({ open: false });
        setRejectionRemark(undefined);
        getListingAction();
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  };

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={data} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={filteredData} columns={columns} getTrProps={getTrProps} />
      </div>
      {taskIds.length > 0 && (
        <div className="btnWrapper text-center">
          <button type="button" className="btn btn-pri m-2" onClick={() => setModalState({ open: true, type: 'support' })}>
            Support
          </button>
          <button type="button" className="btn btn-sec m-2" onClick={() => setModalState({ open: true, type: 'reject' })}>
            Reject
          </button>
        </div>
      )}
      <CustomModal
        isOpen={modalState.open && modalState.type === 'support'}
        type="system-modal"
        headerTitle="Confirm to support LD amount ?"
        cancelTitle="No"
        onCancel={() => setModalState({ open: false })}
        confirmTitle="Yes"
        onConfirm={() => {
          setModalState({ open: false });
          supportLDAction(true);
        }}
      />
      <CustomModal
        headerTitle="Remarks for Rejection"
        confirmTitle="Reject"
        cancelTitle="Cancel"
        isOpen={modalState.open && modalState.type === 'reject'}
        onConfirm={() => {
          if (!rejectionRemark) {
            toast.error('Please enter Remarks for Rejection');
            return;
          }
          supportLDAction(false);
        }}
        onCancel={() => {
          setModalState({ open: false });
          setRejectionRemark(undefined);
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

export default withRouter(PendingLDSupportTable);
