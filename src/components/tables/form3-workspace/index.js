import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { form3WorkspaceService } from 'services/inspection-management/form3';
import { actionTryCatchCreator, filterFunc, sortFunc, getFilterArrayOfListForKey } from 'utils';

import { Form3Mode } from 'modules/details/form3/helper';

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Form 3 ID',
    value: 'form3Id',
  },
  {
    label: 'Manager Name',
    value: 'managerName',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDate',
    useExactField: true,
  },
];

const Form3WorkspaceTable = (props) => {
  const {
    history: { push },
    // filterData = {
    //   sortValue: { id: 'breedingDate', label: 'Breeding Detection Date', desc: false },
    //   region: '',
    //   searchType: 'address',
    //   searchText: '',
    //   datePickerValue: null,
    //   filterValue: null,
    // },
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);

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

  const getListing = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      setListData(data.queryForm3VOs || []);
      filterListingAction(data?.queryForm3VOs || []);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(form3WorkspaceService(), onPending, onSuccess, onError);
  }, [filterListingAction]);

  useEffect(() => {
    getListing();
  }, [getListing]);

  useEffect(() => {
    filterListingAction(listData);
  }, [filterListingAction, listData]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'form3Status',
      title: 'Form 3 Status',
      values: getFilterArrayOfListForKey(listData, 'form3Status'),
    },
  ];

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
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
      Cell: (cellInfo) => {
        const action = cellInfo.row._original.form3Status === 'Form3 Created' ? Form3Mode.create : Form3Mode.enforce;
        return (
          <span className="text-blue cursor-pointer" onClick={() => push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { action, form3Id: cellInfo.row.form3Id })}>
            {cellInfo.row.form3Id}
          </span>
        );
      },
    },
    {
      Header: 'Form 3 Status',
      accessor: 'form3Status',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Manager Name',
      accessor: 'managerName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Reason for Rejection',
      accessor: 'rejectionReason',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      const action = rowInfo.row._original.form3Status === 'Form3 Created' ? Form3Mode.create : Form3Mode.enforce;
      return {
        onClick: () => {
          push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { action, form3Id: rowInfo.row._original.form3Id, isFromWorkspace: true });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

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
        <DataTable data={filteredTableData} columns={columns} getTrProps={getTrProps} />
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(Form3WorkspaceTable);
