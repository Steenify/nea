import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import CommonRejectModal from 'components/modals/common-reject-modal';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { tableColumnWidth, FUNCTION_NAMES, WEB_ROUTES } from 'constants/index';

import { getApprovalListingService } from 'services/common';

import { approveInspectionNoticeService, rejectInspectionNoticeService } from 'services/inspection-management/latest-block-summary';
import { actionTryCatchCreator, getFilterArrayOfListForKey, filterFunc, sortFunc } from 'utils';

const InspectionNoticeApprovalTable = (props) => {
  const { functionNameList, history } = props;
  const [remarks, setRejectionReason] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, data: null, type: null });
  const [rejectFileIds, setFileIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const hideModal = () => {
    setModalState({ isOpen: false, data: null, type: null });
  };

  const getInspectionNoticeListing = () => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const approvalFunctionList = data.pendingApprovals || [];
      const callLetterList = (approvalFunctionList.find((item) => item.approvalFunction === 'CL')?.noticeApprovalVOs || []).map((item) => ({ ...item, noticeTypeShort: 'CL' }));
      const s35List = (approvalFunctionList.find((item) => item.approvalFunction === 'S35')?.noticeApprovalVOs || []).map((item) => ({ ...item, noticeTypeShort: 'S35' }));
      const s35RList = (approvalFunctionList.find((item) => item.approvalFunction === 'S35R')?.noticeApprovalVOs || []).map((item) => ({ ...item, noticeTypeShort: 'S35R' }));
      const s36List = (approvalFunctionList.find((item) => item.approvalFunction === 'S36')?.noticeApprovalVOs || []).map((item) => ({ ...item, noticeTypeShort: 'S36' }));

      setTableData([...callLetterList, ...s35List, ...s35RList, ...s36List]);
    };
    const onError = (error) => {
      console.log('TCL: getInspectionNoticeListing -> error', error);
    };
    actionTryCatchCreator(getApprovalListingService(), onPending, onSuccess, onError);
  };

  const approveInspectionNotice = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      toast.success('Approved');
      hideModal();
      setIsLoading(false);
      getInspectionNoticeListing();
    };
    const onError = (error) => {
      console.log('TCL: approveInspectionNotice -> error', error);
      setIsLoading(false);
    };
    actionTryCatchCreator(approveInspectionNoticeService(params), onPending, onSuccess, onError);
  };

  const rejectInspectionNotice = (params) => {
    if (!params?.rejectionVO?.remarks) {
      toast.error('Please enter rejection reason');
      return;
    }
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      toast.success('Rejected');
      hideModal();
      setIsLoading(false);
      getInspectionNoticeListing();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(rejectInspectionNoticeService(params), onPending, onSuccess, onError);
  };

  const viewInspectionNotice = (params) => {
    history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.APPROVING_NOTICE_DETAIL.url, params);
  };

  useEffect(() => {
    getInspectionNoticeListing();
  }, []);

  const columns = [
    {
      Header: 'Notice Type',
      accessor: 'noticeType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Requested Date',
      accessor: 'requestedDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Requested Time',
      accessor: 'requestedTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Requestor',
      accessor: 'requestor',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Block/House No.',
      accessor: 'blockHouseNo',
      minWidth: tableColumnWidth.lg,
      sortType: 'number',
    },
    {
      Header: 'Street Name',
      accessor: 'streetName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'No. of Request(s)',
      accessor: 'numberOfRequest',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.sm,
      hiddenInSort: true,
      Cell: (cellInfo) => {
        const { noticeIds } = cellInfo?.original;
        const actions = [];
        if (functionNameList.includes(FUNCTION_NAMES.approveInspectionNotice)) {
          actions.push({ title: 'Approve', onClick: () => approveInspectionNotice({ noticeIds }) });
        }
        if (functionNameList.includes(FUNCTION_NAMES.rejectInspectionNotice)) {
          actions.push({ title: 'Reject', onClick: () => setModalState({ isOpen: true, data: { noticeIds }, type: 'reject' }) });
        }

        if (noticeIds) {
          return <MeatBallDropdown actions={actions} />;
        }
        return <div />;
      },
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (functionNameList.includes(FUNCTION_NAMES.getApprovingNoticeDetail)) {
      return { onClick: () => viewInspectionNotice({ ...rowInfo?.original, noticeType: rowInfo?.original?.noticeTypeShort }), className: 'cursor-pointer' };
    }
    return {};
  };

  const searchData = [
    {
      value: 'requestor',
      label: 'Requestor',
    },
    {
      label: 'Block/House No.',
      value: 'blockHouseNo',
    },
    {
      label: 'Street Name',
      value: 'streetName',
    },
    {
      label: 'Postal Code',
      value: 'postalCode',
    },
  ];

  const dateSelectData = [
    {
      label: 'Requested Date',
      value: 'requested',
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'noticeType',
      title: 'Notice Type',
      values: getFilterArrayOfListForKey(tableData, 'noticeType'),
    },
  ];

  const [sortValue, setSortValue] = useState({ id: 'requestedDate', label: 'Requested Date', desc: false });
  const [searchType, setSearchTypeValue] = useState('requestor');
  const [searchText, setSearchTextValue] = useState('');
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filteredData = tableData.filter((item) => filterFunc(item, { sortValue, searchText, searchType, filterValue, datePickerValue })).sort((a, b) => sortFunc(a, b, sortValue));

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={filteredData} columns={columns} getTrProps={getTrProps} />
      </div>
      <CommonRejectModal
        isOpen={modalState.isOpen && modalState.type === 'reject'}
        onConfirm={() => rejectInspectionNotice({ ...modalState.data, rejectionVO: { remarks, rejectFileIds } })}
        onCancel={hideModal}
        onTextChange={setRejectionReason}
        setFileIds={setFileIds}
      />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InspectionNoticeApprovalTable));
