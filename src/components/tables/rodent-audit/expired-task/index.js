import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';

import { pickNewAuditDateService } from 'services/rodent-audit';
import { actionTryCatchCreator, dateStringFromDate, randomDate, filterFunc, sortFunc } from 'utils';

const RodentExpiredTaskTable = (props) => {
  const {
    history: { push },
    functionNameList,
    getListingAction,
    data,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ open: false, type: '', newAuditDate: '', id: '' });

  const pickNewAuditDateAction = () => {
    if (!modalState.newAuditDate) {
      toast.error('New Date is required');
      return;
    }
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      setModalState({ open: false });
      toast.success('New date submitted for audit task.');
      // getListing();
      getListingAction();
    };
    const onError = (error) => {
      setIsLoading(false);
      console.log('TCL: pickNewAuditDateService -> error', error);
    };
    const { id, newAuditDate } = modalState;
    actionTryCatchCreator(pickNewAuditDateService({ id, newAuditDate: dateStringFromDate(newAuditDate) }), onPending, onSuccess, onError);
  };

  useEffect(() => {
    // getListing();
  }, []);

  const teamLeadColumns = [
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
      Header: 'Proposed Audit Date',
      accessor: 'proposedAuditDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Location',
      accessor: 'location',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
  ];

  const teamLeadGetTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.RODENT_AUDIT.EXPIRED_SHOWCAUSE_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const managerColumns = [
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
      Header: 'Proposed Audit Date',
      accessor: 'proposedAuditDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Location',
      accessor: 'location',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Audit Date',
      accessor: 'action',
      className: 'rt-overflow-visible header-right',
      // className: 'rt-overflow-visible header-right justify-content-center',
      minWidth: tableColumnWidth.xl,
      hiddenInSort: true,
      Cell: (cellInfo) => {
        const id = cellInfo?.row?._original?.id;
        const pickNewAuditDate = cellInfo?.row?._original?.pickNewAuditDate;

        if (id && pickNewAuditDate) {
          return (
            <button
              type="button"
              className="btn btn-sec"
              onClick={(e) => {
                e.stopPropagation();
                setModalState({ open: true, type: 'pickNewDate', id });
              }}>
              Pick a New Audit Date
            </button>
          );
        }
        return <>{cellInfo?.row?._original?.auditDate}</>;
      },
    },
  ];

  const managerGetTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.RODENT_AUDIT.EXPIRED_SHOWCAUSE_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const searchData = [
    {
      value: 'taskId',
      label: 'Task ID',
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

  const dateSelectData = [
    {
      label: 'Proposed Audit Date',
      value: 'proposedAuditDate',
      useExactField: true,
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
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
    ],
    [],
  );

  const [sortValue, setSortValue] = useState({ id: 'taskId', label: 'Task ID', desc: false });
  const [searchType, setSearchTypeValue] = useState('taskId');
  const [searchText, setSearchTextValue] = useState('');
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filteredData = data.filter((item) => filterFunc(item, { sortValue, searchText, searchType, filterValue, datePickerValue })).sort((a, b) => sortFunc(a, b, sortValue));

  const hasApproveRejectRights = functionNameList.includes(FUNCTION_NAMES.pickNewAuditDate);
  const columns = hasApproveRejectRights ? managerColumns : teamLeadColumns;
  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={data} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={filteredData} columns={columns} getTrProps={hasApproveRejectRights ? managerGetTrProps : teamLeadGetTrProps} />
      </div>
      <InPageLoading isLoading={isLoading} />
      <CustomModal
        isOpen={modalState.open && modalState.type === 'pickNewDate'}
        type="action-modal"
        headerTitle="Pick a New Audit Date"
        confirmTitle="Submit"
        onConfirm={pickNewAuditDateAction}
        cancelTitle="Cancel"
        onCancel={() => setModalState({ open: false })}
        content={
          <div>
            <SingleDatePickerV2 date={modalState.newAuditDate} onChangeDate={(newAuditDate) => setModalState({ ...modalState, newAuditDate })} minDate={moment()} />
            <button type="button" className="btn btn-sec mt-4" onClick={() => setModalState({ ...modalState, newAuditDate: randomDate() })}>
              Select a Random Audit Date
            </button>
          </div>
        }
      />
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RodentExpiredTaskTable));
