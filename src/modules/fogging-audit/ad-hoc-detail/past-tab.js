import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import DataTable from 'components/common/data-table';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getFilterArrayOfListForKey } from 'utils';

import { adHocFoggingAuditSearchAction, pastDefaultFilterValue, pastListFilterAction, submitAdhocFoggingAuditAction } from './action';

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

const AdHocDetail = (props) => {
  const {
    adHocFoggingAuditSearchAction,
    pastListFilterAction,
    history,
    location: { state },
    data: { filteredPastList, pastList },
  } = props;

  const companyUen = state?.companyUen || '';

  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('address');
  const [debounceSearchText] = useDebounce(searchText, 1000);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  const [pastSortValue, setPastSortValue] = useState(pastDefaultFilterValue.sortValue);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.name}`;
    if (companyUen) {
      adHocFoggingAuditSearchAction({ companyUen });
    } else {
      history.goBack();
    }
  }, [companyUen, adHocFoggingAuditSearchAction, history]);

  useEffect(() => {
    pastListFilterAction({
      sortValue: pastSortValue,
      searchText: debounceSearchText,
      searchType,
      filterValue,
      datePickerValue,
    });
  }, [pastSortValue, pastListFilterAction, debounceSearchText, searchType, datePickerValue, filterValue]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      const { url } = WEB_ROUTES.FOGGING_AUDIT.AD_HOC_PAST_FOGGING_DETAIL;
      return {
        onClick: () => {
          history.push(url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const pastColumns = [
    {
      Header: 'Fogging Date',
      accessor: 'foggingDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Fogging Period',
      accessor: 'foggingPeriod',
      isTimePeriod: true,
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xl,
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
      minWidth: tableColumnWidth.lg,
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
      Header: 'Audited',
      accessor: 'audited',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Non-compliant',
      accessor: 'nonCompliant',
      minWidth: tableColumnWidth.md,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOffice',
      title: 'RO',
      values: getFilterArrayOfListForKey(pastList, 'regionOffice'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(pastList, 'division'),
    },
    {
      type: FilterType.SEARCH,
      id: 'premisesType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(pastList, 'premisesType'),
    },
    {
      type: FilterType.SELECT,
      id: 'sourceReduction',
      title: 'Source Reduction',
      values: getFilterArrayOfListForKey(pastList, 'sourceReduction'),
    },
    {
      type: FilterType.SELECT,
      id: 'notification',
      title: 'Notification',
      values: getFilterArrayOfListForKey(pastList, 'notification'),
    },
    {
      type: FilterType.SELECT,
      id: 'audited',
      title: 'Audited',
      values: getFilterArrayOfListForKey(pastList, 'audited'),
    },
    {
      type: FilterType.SELECT,
      id: 'nonCompliant',
      title: ' Non-compliant',
      values: getFilterArrayOfListForKey(pastList, 'nonCompliant'),
    },
  ];

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper" data={pastColumns} value={pastSortValue} desc={pastSortValue.desc} onChange={setPastSortValue} />
        </div>
      </div>
      <div className="paddingBottom50 tabsContainer">
        <div>
          <DataTable data={filteredPastList} columns={pastColumns} getTrProps={getTrProps} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { adHocFoggingAuditDetail } }, ownProps) => ({
  ...ownProps,
  ...adHocFoggingAuditDetail,
});

const mapDispatchToProps = {
  adHocFoggingAuditSearchAction,
  pastListFilterAction,
  submitAdhocFoggingAuditAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdHocDetail));
