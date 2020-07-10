import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import CommonRejectModal from 'components/modals/common-reject-modal';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { form3NoEnforcementListingService, approveNoEnforcementService } from 'services/inspection-management/form3';
import { actionTryCatchCreator, filterFunc, sortFunc, getFilterArrayOfListForKey } from 'utils';

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Form 3 ID',
    value: 'form3Id',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breeding',
  },
];

const Form3NoEnforcementPendingApprovalTable = ({ history: { push } }) => {
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
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText: debounceSearchText, searchType, filterValue, datePickerValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, debounceSearchText, searchType, datePickerValue],
  );

  const hideModal = () => {
    setModalState({ isOpen: false, data: null, type: null });
  };

  const getNoEnforcementListing = useCallback(() => {
    const onPending = () => {};
    const onSuccess = (data) => {
      setTableData(data.queryForm3VOs || []);
      filterListingAction(data.queryForm3VOs || []);
    };
    const onError = () => {};
    actionTryCatchCreator(form3NoEnforcementListingService(), onPending, onSuccess, onError);
  }, [filterListingAction]);

  const approveNoEnforcement = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      const { isApprovedByMnger } = params;
      toast.success(isApprovedByMnger ? 'Approved' : 'Rejected');
      hideModal();
      setIsLoading(false);
      getNoEnforcementListing();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(approveNoEnforcementService(params), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getNoEnforcementListing();
  }, [getNoEnforcementListing]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [sortValue, filterValue, debounceSearchText, searchType, datePickerValue, filterListingAction, tableData]);

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
      accessor: 'address',
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
      Header: 'Reason',
      accessor: 'reasonNotEnforce',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      hiddenInSort: true,
      minWidth: tableColumnWidth.sm,
      Cell: (cellInfo) => {
        const form3Id = cellInfo?.row?._original?.form3Id;
        if (form3Id) {
          return (
            <MeatBallDropdown
              actions={[
                {
                  title: 'Approve',
                  onClick: () => {
                    approveNoEnforcement({ form3Id, isApprovedByMnger: true });
                  },
                },
                {
                  title: 'Reject',
                  onClick: () => {
                    setModalState({
                      isOpen: true,
                      data: { form3Id, isApprovedByMnger: false },
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
        isOpen={modalState.isOpen}
        onConfirm={() => approveNoEnforcement({ ...modalState.data, sampleRejectionVO: { remarks, rejectFileIds } })}
        onCancel={hideModal}
        onTextChange={setRejectionReason}
        setFileIds={setFileIds}
        submissionType="FORM3NOENFORCE"
      />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(Form3NoEnforcementPendingApprovalTable);
