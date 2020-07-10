import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import SingleDatePickerV2 from 'components/common/single-date-picker';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getFoggingWorkspaceListingService, pickNewFoggingAuditDateService } from 'services/fogging-audit';
import { actionTryCatchCreator, dateStringFromDate, randomDate, getFilterArrayOfListForKey, filterFunc, sortFunc } from 'utils';

const searchData = [
  {
    label: 'Company Name',
    value: 'companyName',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Assigned to',
    value: 'assignedTo',
  },
];

const dateSelectData = [
  {
    label: 'Fogging Date',
    value: 'fogging',
    useExactField: true,
  },
];

const FoggingExpiredTaskTable = (props) => {
  const {
    history: { push },
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [pendingExplanations, setPendingExplanations] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('companyName');
  const [filterValue, setFilterValue] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [modalState, setModalState] = useState({ open: false, type: '', newAuditDate: '', auditTaskId: '' });

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText: debounceSearchText, searchType, filterValue, datePickerValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, debounceSearchText, searchType, datePickerValue],
  );

  const getListing = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      setPendingExplanations(data.pendingExplanations || []);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(getFoggingWorkspaceListingService(), onPending, onSuccess, onError);
  }, []);

  const pickNewFoggingAuditDateAction = () => {
    if (!modalState.newAuditDate) {
      toast.error('New Date is required');
      return;
    }
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = () => {
      setIsLoading(false);
      setModalState({ open: false });
      toast.success('New audit date selected.');
      getListing();
    };
    const onError = () => {
      setIsLoading(false);
    };
    const { auditTaskId, newAuditDate } = modalState;
    actionTryCatchCreator(pickNewFoggingAuditDateService({ auditTaskId, newAuditDate: dateStringFromDate(newAuditDate) }), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getListing();
  }, [getListing]);

  useEffect(() => {
    filterListingAction(pendingExplanations);
  }, [filterListingAction, pendingExplanations]);

  const pendingExplanationColumns = [
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.lg,
      sortType: 'string',
    },
    {
      Header: 'Fogging Date',
      accessor: 'foggingDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Fogging Period',
      accessor: 'foggingPeriod',
      isTimePeriod: true,
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Premises Type',
      accessor: 'premisesType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Purpose of Fogging',
      accessor: 'foggingPurpose',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Assigned to',
      accessor: 'assignedTo',
      minWidth: tableColumnWidth.lg,
    },
    // {
    //   Header: 'Audit Task Status',
    //   accessor: 'auditTaskStatus',
    //   minWidth: tableColumnWidth.lg,
    // },
    {
      Header: '',
      accessor: 'action',
      className: 'rt-overflow-visible header-right justify-content-center',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => {
        const auditTaskId = cellInfo?.row?._original?.auditTaskId;
        const canPickNewAuditDate = cellInfo?.row?._original?.canPickNewAuditDate;

        if (auditTaskId && canPickNewAuditDate) {
          return (
            <button
              type="button"
              className="btn btn-sec"
              onClick={(e) => {
                e.stopPropagation();
                setModalState({ open: true, type: 'pickNewDate', auditTaskId });
              }}>
              Pick a New Audit Date
            </button>
          );
        }
        return <div />;
      },
    },
  ];

  const pendingExplanationGetTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const filterData = [
    {
      type: FilterType.SEARCH,
      id: 'premisesType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(pendingExplanations, 'premisesType'),
    },
    {
      type: FilterType.SELECT,
      id: 'foggingPurpose',
      title: 'Purpose of Fogging',
      values: getFilterArrayOfListForKey(pendingExplanations, 'foggingPurpose'),
    },
    // {
    //   type: FilterType.SEARCH,
    //   id: 'auditTaskStatus',
    //   title: 'Audit Task Status',
    //   values: getFilterArrayOfListForKey(pendingExplanations, 'auditTaskStatus'),
    // },
  ];

  // const expiredTaskTitle = functionNameList.includes(FUNCTION_NAMES.approveOrRejectFoggingExpiredTask) ? 'Expired Tasks – Explanation Pending Approval' : 'Expired Tasks – Pending Explanation';
  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper" data={pendingExplanationColumns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={filteredTableData} columns={pendingExplanationColumns} getTrProps={pendingExplanationGetTrProps} />
      </div>
      <InPageLoading isLoading={isLoading} />
      <CustomModal
        isOpen={modalState.open && modalState.type === 'pickNewDate'}
        type="action-modal"
        headerTitle="Pick a New Audit Date"
        confirmTitle="Submit"
        onConfirm={pickNewFoggingAuditDateAction}
        cancelTitle="Cancel"
        onCancel={() => setModalState({ open: false })}
        content={
          <div>
            <SingleDatePickerV2 date={modalState.newAuditDate} onChangeDate={(newAuditDate) => setModalState({ ...modalState, newAuditDate })} minDate={moment().add(3, 'days')} />
            <button type="button" className="btn btn-sec mt-4" onClick={() => setModalState({ ...modalState, newAuditDate: randomDate(moment().add(2, 'days')) })}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FoggingExpiredTaskTable));
