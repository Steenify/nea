import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getSampleIdentificationMyWorkspace } from 'services/sample-identification';

import { actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

const EHIWorkspaceTable = (props) => {
  const {
    history: { push },
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({ id: 'breedingDetectionDate', label: 'Breeding Detection Date', desc: false });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchTypeValue] = useState('barcodeId');
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText, searchType, datePickerValue, filterValue };
      const urgentList = list.filter((item) => item.isUrgentCase).sort((a, b) => sortFunc(a, b, sortValue));
      const lateList = list.filter((item) => !item.isUrgentCase && item.isPrioritized).sort((a, b) => sortFunc(a, b, sortValue));
      const normalList = list.filter((item) => !item.isUrgentCase && !item.isPrioritized).sort((a, b) => sortFunc(a, b, sortValue));
      const newList = [...urgentList, ...lateList, ...normalList].filter((item) => filterFunc(item, filterData));
      setFilteredTableData(newList);
    },
    [sortValue, filterValue, datePickerValue, searchText, searchType],
  );

  const getListingAction = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      setTableData(data.claimTaskVOs || []);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(getSampleIdentificationMyWorkspace(), onPending, onSuccess, onError);
  }, []);

  useEffect(() => {
    getListingAction();
  }, [getListingAction]);

  const navigateToDetail = (barcodeId) => {
    push(`${WEB_ROUTES.DETAILS.url}/sample`, { isEditing: true, id: barcodeId });
  };

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const getTrProps = (_state, rowInfo) => {
    const props = { onClick: () => navigateToDetail(rowInfo.row.barcodeId), className: 'cursor-pointer' };
    if (rowInfo) {
      if (rowInfo.row._original.isPrioritized) {
        props.className = 'bg-warning cursor-pointer';
      }
      if (rowInfo.row._original.isUrgentCase) {
        props.className = 'bg-danger cursor-pointer';
      }
    }
    return props;
  };

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Received Date',
      accessor: 'receivedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Received Time',
      accessor: 'receivedTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Officer Name',
      accessor: 'officerName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'barcodeId',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const dateSelectData = [
    {
      label: 'Breeding Detection Date',
      value: 'breedingDetection',
    },
    {
      label: 'Received Date',
      value: 'received',
    },
  ];

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

  const searchData = [
    { label: 'Sample ID', value: 'barcodeId' },
    { label: 'Officer Name', value: 'officerName' },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search Sample ID" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={tableData} />
          <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={filteredTableData} columns={columns} getTrProps={getTrProps} />
      </div>

      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(EHIWorkspaceTable);
