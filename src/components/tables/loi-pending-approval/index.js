import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import CommonRejectModal from 'components/modals/common-reject-modal';
import FilePreviewModal from 'components/common/file-review-modal';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getApprovalListingService } from 'services/common';

import { loiApproveSubmittedListingService, loiPreviewService } from 'services/inspection-management/letter-of-intent';
import { actionTryCatchCreator, byteArrayToBase64, filterFunc, sortFunc, getFilterArrayOfListForKey } from 'utils';

const searchData = [
  {
    label: 'Address',
    value: 'premiseFullAddress',
  },
  {
    label: 'Form 3 ID',
    value: 'form3Id',
  },
  {
    label: 'Officer Name',
    value: 'loiSubmittedBy',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breeding',
  },
  {
    label: 'LOI Submitted Date',
    value: 'loiSubmitted',
  },
];

const LOIPendingApprovalTable = ({ history: { push } }) => {
  const [remarks, setRejectionReason] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, data: null, type: null });
  const [rejectFileIds, setFileIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'breedingDate',
    label: 'Breeding Detection Date',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('premiseFullAddress');
  const [filterValue, setFilterValue] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const hideModal = () => {
    setModalState({ isOpen: false, data: null, type: null });
  };

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText: debounceSearchText, searchType, filterValue, datePickerValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, debounceSearchText, searchType, datePickerValue],
  );

  const getLOIPendingListing = useCallback(() => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const approvalFunctionList = data.pendingApprovals || [];
      const approvalFunction = approvalFunctionList.find((item) => item.approvalFunction === 'LoiApproval');

      setTableData(approvalFunction?.loiApproveVoList || []);
      filterListingAction(approvalFunction?.loiApproveVoList || []);
    };
    const onError = () => {};
    actionTryCatchCreator(getApprovalListingService(), onPending, onSuccess, onError);
  }, [filterListingAction]);

  const approvePendingLOI = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      const { isApprovedByMnger } = params;
      toast.success(isApprovedByMnger ? 'Approved' : 'Rejected');
      hideModal();
      setIsLoading(false);
      getLOIPendingListing();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(loiApproveSubmittedListingService(params), onPending, onSuccess, onError);
  };

  const previewLOI = (loiReferenceNo) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      const base64 = byteArrayToBase64(data?.loiVO?.loiFile || []);
      setModalState({ isOpen: true, data: base64, type: 'preview' });
    };
    const onError = (error) => {
      setIsLoading(false);
      console.log('TCL: previewLOI -> error', error);
    };
    actionTryCatchCreator(loiPreviewService({ loiReferenceNo }), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getLOIPendingListing();
  }, [getLOIPendingListing]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(tableData, 'regionOfficeCode'),
    },
  ];

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'premiseFullAddress',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id: cellInfo.row.form3Id })}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
    {
      Header: 'Officer Name',
      accessor: 'loiSubmittedBy',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'LOI Submitted Date',
      accessor: 'loiSubmittedDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LOI Submitted Time',
      accessor: 'loiSubmittedTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LOI Submitted',
      accessor: 'loiSubmitted',
      hiddenInSort: true,
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => previewLOI(cellInfo?.row?._original?.loiReferenceNo)}>
          View LOI
        </span>
      ),
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.sm,
      hiddenInSort: true,
      Cell: (cellInfo) => {
        const loiReferenceNo = cellInfo?.row?._original?.loiReferenceNo;
        if (loiReferenceNo) {
          return (
            <MeatBallDropdown
              actions={[
                {
                  title: 'Approve',
                  onClick: () => {
                    approvePendingLOI({ loiReferenceNo, isApprovedByMnger: true });
                  },
                },
                {
                  title: 'Reject',
                  onClick: () => {
                    setModalState({
                      isOpen: true,
                      data: { loiReferenceNo, isApprovedByMnger: false },
                      type: 'reject',
                    });
                  },
                },
              ]}
            />
          );
        }
        return <div />;
      },
    },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={filteredTableData} columns={columns} />
      </div>
      <CommonRejectModal
        isOpen={modalState.isOpen && modalState.type === 'reject'}
        onConfirm={() => approvePendingLOI({ ...modalState.data, rejectionVO: { remarks, rejectFileIds } })}
        onCancel={hideModal}
        onTextChange={setRejectionReason}
        setFileIds={setFileIds}
      />
      {modalState.type === 'preview' && <FilePreviewModal isOpen={modalState.isOpen} file={modalState.data} onCancel={hideModal} />}
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(LOIPendingApprovalTable);
