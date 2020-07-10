import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';

import { rejectedLdListingService } from 'services/site-paper-gravitrap-audit';

import { actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

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

const dateSelectData = [
  {
    label: 'Audit',
    value: 'audit',
  },
];

const Table = (props) => {
  const {
    history: { push },
    // showExtraFilter,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'auditDate',
    label: 'Audit Date',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('displayTaskId');
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

  const getListingAction = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.sitePaperList || [];
      const mappedList = list.map((item) => {
        const { blockNo, postalCode, roadName, audittask, auditdate } = item;
        const mappedWeek = item?.eweek?.week || '';
        const taskId = audittask?.id;
        const auditDate = auditdate;
        const address = [blockNo ? `Blk ${blockNo}` : '', roadName || '', postalCode ? `S${postalCode}` : ''].filter((item) => item).join(', ');
        return { ...item, mappedWeek, address, taskId, auditDate };
      });
      setTableData(mappedList);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(rejectedLdListingService(), onPending, onSuccess, onError);
  }, []);

  useEffect(() => {
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
            caseInfo: rowInfo?.row?._original,
            fromFunction: FUNCTION_NAMES.getLocSitePaperAuditRejected,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
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
      Header: 'Eweek',
      accessor: 'mappedWeek',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Audit Date',
      accessor: 'auditDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Audit Time',
      accessor: 'auditTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Auditor',
      accessor: 'auditor',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Team Lead',
      accessor: 'teamLead',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Lapses',
      accessor: 'lapseDescription',
      minWidth: tableColumnWidth.lg,
    },
  ];
  const filterData = useMemo(
    () => [
      {
        type: FilterType.SEARCH,
        id: 'auditRepotType',
        title: 'Type',
      },
      {
        type: FilterType.SEARCH,
        id: 'divCode',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'mappedWeek',
        title: 'Eweek',
      },
      {
        type: FilterType.SEARCH,
        id: 'auditor',
        title: 'Auditor',
      },
    ],
    [],
  );

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
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

export default withRouter(Table);
