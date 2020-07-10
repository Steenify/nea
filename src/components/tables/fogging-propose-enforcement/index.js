import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';

import { getFoggingWorkspaceListingService } from 'services/fogging-audit';
import { actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

const searchData = [
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Auditor Name',
    value: 'auditorName',
  },
];

const dateSelectData = [
  {
    label: 'Fogging Date',
    value: 'foggingDate',
    useExactField: true,
  },
  {
    label: 'Audit Date',
    value: 'audit',
  },
];

const FoggingProposeEnforcementTable = (props) => {
  const {
    history: { push },
    functionNameList,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [enforcements, setEnforcements] = useState([]);

  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('inspectionId');
  const [filterValue, setFilterValue] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const filterRef = useRef(null);

  const getListing = () => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      setEnforcements(data?.enforcements || []);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(getFoggingWorkspaceListingService(), onPending, onSuccess, onError);
  };

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText, searchType, filterValue, datePickerValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, searchText, searchType, datePickerValue],
  );

  useEffect(() => {
    getListing();
  }, []);

  useEffect(() => {
    filterListingAction(enforcements);
  }, [enforcements, filterListingAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOffice',
        title: 'RO',
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'nonCompliant',
        title: ' Non-compliant',
      },
    ],
    [],
  );

  const enforcementColumns = [
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'regionOffice',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
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
      Header: 'Auditor Name',
      accessor: 'auditorName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Non-compliant',
      accessor: 'nonCompliant',
      minWidth: tableColumnWidth.md,
    },
    // {
    //   Header: 'Enforcement',
    //   accessor: 'enforcement',
    //   className: 'rt-overflow-visible header-right justify-content-center',
    //   minWidth: tableColumnWidth.md,
    //   Cell: cellInfo => {
    //     const auditTaskId = cellInfo?.row?._original?.auditTaskId;
    //     if (auditTaskId) {
    //       return (
    //         <MeatBallDropdown
    //           actions={[
    //             {
    //               title: 'Yes',
    //               onClick: () => {},
    //             },
    //             {
    //               title: 'No',
    //               onClick: () => {},
    //             },
    //           ]}
    //         />
    //       );
    //     }
    //     return <div />;
    //   },
    // },
  ];

  const enforcementGetTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      let action = 'view';
      if (functionNameList.includes(FUNCTION_NAMES.submitFoggingEnforcement) || functionNameList.includes(FUNCTION_NAMES.saveFoggingEnforcement)) {
        action = 'propose';
      }
      if (functionNameList.includes(FUNCTION_NAMES.approveOrRejectFoggingExpiredTask)) {
        action = 'confirm';
      }
      return {
        onClick: () => {
          push(WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_ENFORCEMENT_DETAIL.url, { ...rowInfo.row._original, action });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  // const enforcementsData = enforcements.sort((a, b) => sortFunc(a, b, filterData.sortValue)).filter((item) => filterFunc(item, filterData));

  // const enforcementTitle = functionNameList.includes(FUNCTION_NAMES.approveOrRejectFoggingExpiredTask) ? 'Recommendation for Enforcement' : 'Propose Enforcement';
  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={enforcements} />
          <Sort className="navbar-nav sortWrapper" data={enforcementColumns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable
          data={filteredTableData}
          columns={enforcementColumns}
          // title={enforcementTitle}
          // showListHidden={true}
          // pageSize={pageSize}
          // showListPosition="end"
          getTrProps={enforcementGetTrProps}
        />
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FoggingProposeEnforcementTable));
