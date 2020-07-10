import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Checkbox from 'components/common/checkbox';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getFilterArrayOfListForKey } from 'utils';

import { upcomingListFilterAction, upcomingDefaultFilterValue, submitAdhocFoggingAuditAction } from './action';

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Building Name',
    value: 'buildingName',
  },
];

const dateSelectData = [
  {
    label: 'Fogging Date',
    value: 'foggingDate',
    useExactField: true,
  },
];

const UpcomingFoggingTab = (props) => {
  const {
    upcomingListFilterAction,
    submitAdhocFoggingAuditAction,
    history,
    ui: { isLoading },
    data: { filteredUpcomingList, upcomingList },
  } = props;

  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('address');
  const [debounceSearchText] = useDebounce(searchText, 1000);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  const [upcomingSortValue, setUpcomingSortValue] = useState(upcomingDefaultFilterValue.sortValue);

  const [scheduleIds, setscheduleIds] = useState([]);
  const [previousRandomId, setPreviousRandomId] = useState();

  useEffect(() => {
    upcomingListFilterAction({
      sortValue: upcomingSortValue,
      searchText: debounceSearchText,
      searchType,
      filterValue,
      datePickerValue,
    });
  }, [upcomingSortValue, upcomingListFilterAction, debounceSearchText, searchType, datePickerValue, filterValue]);

  const submitAudit = () => {
    submitAdhocFoggingAuditAction({ scheduleIds }, () => {
      setscheduleIds([]);
      toast.success('Ad-hoc audit task(s) created.');
      history.goBack();
    });
  };

  const randomSelection = () => {
    const temp = [...scheduleIds].filter((item) => item !== previousRandomId);
    const notSelectedList = filteredUpcomingList.filter((item) => !scheduleIds.includes(item.scheduleId) && item.selectable);
    if (notSelectedList.length === 0) {
      toast.info('All selectable records are selected');
    } else {
      const randomIndex = parseInt((Math.random() * notSelectedList.length) % notSelectedList.length);
      setPreviousRandomId(notSelectedList[randomIndex].scheduleId);
      temp.push(notSelectedList[randomIndex].scheduleId);
      setscheduleIds([...temp]);
    }
  };

  const onCheckSample = (scheduleId) => {
    const index = scheduleIds.findIndex((id) => id === scheduleId);
    if (index > -1) {
      scheduleIds.splice(index, 1);
      if (scheduleId === previousRandomId) {
        setPreviousRandomId(undefined);
      }
    } else {
      scheduleIds.push(scheduleId);
    }
    setscheduleIds([...scheduleIds]);
  };

  // const onCheckAllSample = () => {
  //   if (isSelectAll) {
  //     filteredUpcomingList.forEach((cluster) => {
  //       const index = scheduleIds.findIndex((id) => id === cluster.scheduleId);
  //       if (index > -1) scheduleIds.splice(index, 1);
  //     });
  //     setscheduleIds([...scheduleIds]);
  //   } else {
  //     filteredUpcomingList.forEach((cluster) => {
  //       const index = scheduleIds.findIndex((id) => id === cluster.scheduleId);
  //       if (index < 0) scheduleIds.push(cluster.scheduleId);
  //     });
  //     setscheduleIds([...scheduleIds]);
  //   }
  // };

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.FOGGING_AUDIT.AD_HOC_UPCOMING_FOGGING_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const upcomingColumns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => {
        const { selectable, scheduleId } = cellInfo.row._original;
        if (selectable) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={scheduleIds.includes(scheduleId)} onChange={() => onCheckSample(scheduleId)} />
            </div>
          );
        }
        return <></>;
      },
      // Header: () => (
      //   <div style={{ textAlign: 'center' }}>
      //     <div className="custom-control custom-checkbox">
      //       <input
      //         type="checkbox"
      //         className="custom-control-input"
      //         id="custom_search_check_all"
      //         checked={isSelectAll}
      //         onChange={() => onCheckAllSample()}
      //       />
      //       <label className="custom-control-label" htmlFor="custom_search_check_all" />
      //     </div>
      //   </div>
      // ),
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
      Header: 'Building Name',
      accessor: 'buildingName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Premises Type',
      accessor: 'premisesType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Source Reduction',
      accessor: 'sourceReduction',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Notification',
      accessor: 'notification',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Submitted For Audit',
      accessor: 'submittedForAudit',
      minWidth: tableColumnWidth.md,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOffice',
      title: 'RO',
      values: getFilterArrayOfListForKey(upcomingList, 'regionOffice'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(upcomingList, 'division'),
    },
    {
      type: FilterType.SEARCH,
      id: 'premisesType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(upcomingList, 'premisesType'),
    },
    {
      type: FilterType.SELECT,
      id: 'sourceReduction',
      title: 'Source Reduction',
      values: getFilterArrayOfListForKey(upcomingList, 'sourceReduction'),
    },
    {
      type: FilterType.SELECT,
      id: 'notification',
      title: 'Notification',
      values: getFilterArrayOfListForKey(upcomingList, 'notification'),
    },
    {
      type: FilterType.SELECT,
      id: 'submittedForAudit',
      title: 'Submitted For Audit',
      values: getFilterArrayOfListForKey(upcomingList, 'submittedForAudit'),
    },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData.filter((item) => item.show !== false)} />
          <Sort className="navbar-nav sortWrapper" data={upcomingColumns} value={upcomingSortValue} desc={upcomingSortValue.desc} onChange={setUpcomingSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <div>
          <DataTable data={filteredUpcomingList} columns={upcomingColumns} getTrProps={getTrProps} />
        </div>
        <div className="text-center mt-3 mb-3">
          <div className="">
            <h1 className="font-weight-bold">Tasks Selected for Ad Hoc Fogging Audit: {scheduleIds.length}</h1>
          </div>
          <div className="">
            <button type="button" className="btn btn-sec m-2" onClick={randomSelection}>
              Random Selection
            </button>
            <button type="button" className="btn btn-pri m-2" disabled={scheduleIds.length === 0} onClick={submitAudit}>
              Submit for Audit
            </button>
          </div>
        </div>
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { adHocFoggingAuditDetail } }, ownProps) => ({
  ...ownProps,
  ...adHocFoggingAuditDetail,
});

const mapDispatchToProps = {
  upcomingListFilterAction,
  submitAdhocFoggingAuditAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UpcomingFoggingTab));
