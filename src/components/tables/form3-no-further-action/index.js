import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import CommonRejectModal from 'components/modals/common-reject-modal';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getApprovalListingService } from 'services/common';
import { approveNoFurtherActionService } from 'services/inspection-management/form3';
import { actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Sample ID',
    value: 'sampleId',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breeding',
  },
];

const Form3NoFurtherActionPendingApprovalTable = ({ history: { push } }) => {
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
  const [searchType, setSearchType] = useState('address');
  const [filterValue, setFilterValue] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const filterRef = useRef(null);

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText, searchType, filterValue, datePickerValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, searchText, searchType, datePickerValue],
  );

  const hideModal = () => {
    setModalState({ isOpen: false, data: null, type: null });
  };

  const getNoFurtherActionListing = useCallback(() => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const list = data?.pendingApprovals || [];
      const findItem = list.find((item) => item.approvalFunction === 'Form3NoFurtherAction')?.form3NoFurtherActionVOs || [];
      setTableData(findItem);
      filterListingAction(findItem);
    };
    const onError = () => {};
    actionTryCatchCreator(getApprovalListingService(), onPending, onSuccess, onError);
  }, [filterListingAction]);

  const approveNoFurtherAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      const { isApprovedByMnger } = params;
      toast.success(isApprovedByMnger ? 'Approved' : 'Rejected');
      hideModal();
      setIsLoading(false);
      getNoFurtherActionListing();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(approveNoFurtherActionService(params), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getNoFurtherActionListing();
  }, [getNoFurtherActionListing]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
    ],
    [],
  );

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
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            push(`${WEB_ROUTES.DETAILS.url}/inspection`, { id: cellInfo?.row?.inspectionId });
          }}>
          {cellInfo.row.inspectionId}
        </span>
      ),
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            push(`${WEB_ROUTES.DETAILS.url}/sample`, { id: cellInfo?.row?.sampleId });
          }}>
          {cellInfo.row.sampleId}
        </span>
      ),
    },
    // {
    //   Header: 'Vector / Non-Vector',
    //   accessor: 'isVector',
    //   minWidth: tableColumnWidth.md,
    // },
    {
      Header: 'Reason',
      accessor: 'reason',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.sm,
      hiddenInSort: true,
      Cell: (cellInfo) => {
        const sampleId = cellInfo?.row?._original?.sampleId;
        if (sampleId) {
          return (
            <MeatBallDropdown
              actions={[
                {
                  title: 'Approve',
                  onClick: () => {
                    approveNoFurtherAction({ sampleId, isApprovedByMnger: true });
                  },
                },
                {
                  title: 'Reject',
                  onClick: () => {
                    setModalState({
                      isOpen: true,
                      data: { sampleId, isApprovedByMnger: false },
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
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={tableData} />
          <Sort className="navbar-nav sortWrapper" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={filteredTableData} columns={columns} />
      </div>
      <CommonRejectModal
        isOpen={modalState.isOpen}
        onConfirm={() => approveNoFurtherAction({ ...modalState.data, sampleRejectionVO: { remarks, rejectFileIds } })}
        onCancel={hideModal}
        onTextChange={setRejectionReason}
        setFileIds={setFileIds}
        submissionType="SAMPLENOACTION"
      />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(Form3NoFurtherActionPendingApprovalTable);
