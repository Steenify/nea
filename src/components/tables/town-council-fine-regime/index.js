import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import MeatBallDropdown from 'components/common/meatball-dropdown';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getApprovalListingService } from 'services/common';

import { actionTryCatchCreator, getMonthFromString, filterFunc, sortFunc } from 'utils';

import { rejectAction, supportAction, approveAction } from 'modules/vectorInspection/town-council-fine-regime-detail/action';

const TCFineRegimeTable = ({ history: { push }, detailAction, ui: { isLoading }, rejectAction, supportAction, approveAction }) => {
  const [isLocalLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'year',
    label: 'Year',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState(detailAction === 'support' ? 'confirmedBy' : 'supportedBy');
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText, searchType, filterValue };
      const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, searchText, searchType],
  );

  const getList = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      const approvalFunctionList = data.pendingApprovals || [];
      const approvalFunction = approvalFunctionList.find((item) => item.approvalFunction === 'TCFineRegime');
      if (detailAction === 'support') {
        setTableData(approvalFunction?.tcRegimeDetailSupportVoList || []);
        filterListingAction(approvalFunction?.tcRegimeDetailSupportVoList || []);
      }
      if (detailAction === 'approve') {
        setTableData(approvalFunction?.tcRegimeDetailApproveVoList || []);
        filterListingAction(approvalFunction?.tcRegimeDetailApproveVoList || []);
      }
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(getApprovalListingService(), onPending, onSuccess, onError);
  }, [detailAction, filterListingAction]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(`${WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL.url}/`, {
            ...rowInfo.row._original,
            detailAction,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'year',
        title: 'Year',
      },
      {
        type: FilterType.SELECT,
        id: 'month',
        title: 'Month',
      },
      {
        type: FilterType.SELECT,
        id: 'tcCodeDesc',
        title: 'Town Council',
      },
    ],
    [],
  );

  const searchData = [
    {
      label: detailAction === 'support' ? 'Confirmed By' : 'Supported By',
      value: detailAction === 'support' ? 'confirmedBy' : 'supportedBy',
    },
  ];

  const columns = [
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Town Council',
      accessor: 'tcCodeDesc',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Immediate Fine',
      accessor: 'immediateFine',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Threshold List',
      accessor: 'thresholdList',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'No Enforcement',
      accessor: 'noEnforcement',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Total',
      accessor: 'total',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: detailAction === 'support' ? 'Confirmed By' : 'Supported By',
      accessor: detailAction === 'support' ? 'confirmedBy' : 'supportedBy',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Action',
      accessor: 'action',
      className: 'rt-overflow-visible',
      hiddenInSort: true,
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => {
        const { year, month, tcCode } = cellInfo.row._original;
        const params = { year, tcCode, month: String(getMonthFromString(month)) };
        return (
          <MeatBallDropdown
            actions={[
              {
                title: detailAction === 'support' ? 'Support' : 'Approve',
                onClick: () => {
                  if (detailAction === 'support') {
                    supportAction(params, () => {
                      toast.success('TC Fine Regime supported');
                      getList();
                    });

                    return;
                  }

                  approveAction(params, () => {
                    toast.success('TC Fine Regime approved');
                    getList();
                  });
                },
              },
              {
                title: 'Reject',
                onClick: () =>
                  rejectAction(params, () => {
                    toast.success('TC Fine Regime rejected');
                    getList();
                  }),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <Filter ref={filterRef} className="ml-auto navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={tableData} />
          <Sort className="navbar-nav sortWrapper" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable
          data={filteredTableData}
          columns={columns}
          // columns={wrongColumns}
          // title='Pending action for Town Council Fine Regime Enforcement'
          // showListHidden={showListHidden}
          // pageSize={pageSize}
          getTrProps={getTrProps}
          // showListPosition="end"
        />
      </div>
      <InPageLoading isLoading={isLocalLoading || isLoading} />
    </>
  );
};
const mapStateToProps = ({ vectorInspectionReducers: { townCouncilFineRegimeDetail } }, ownProps) => ({
  ...ownProps,
  ...townCouncilFineRegimeDetail,
});

const mapDispatchToProps = {
  rejectAction,
  supportAction,
  approveAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TCFineRegimeTable));
