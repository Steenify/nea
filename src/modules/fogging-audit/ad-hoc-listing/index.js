import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { listFilterAction, adHocFoggingAuditSearchAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'UEN',
    value: 'companyUen',
  },
  {
    label: 'Company Name',
    value: 'companyName',
  },
];

const AdHocFoggingAudit = (props) => {
  const {
    adHocFoggingAuditSearchAction,
    listFilterAction,
    history,
    ui: { isLoading },
    data: { filteredList },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.AD_HOC.name}`;
    adHocFoggingAuditSearchAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [adHocFoggingAuditSearchAction]);

  useEffect(() => {
    listFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
    });
  }, [debounceSearchText, searchType, datePickerValue, sortValue, filterValue, listFilterAction]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.url, rowInfo.original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
    {
      Header: 'UEN',
      accessor: 'companyUen',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.xxl,
      sortType: 'string',
    },
    {
      Header: 'Last Audit Date',
      accessor: 'lastAuditedDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Last Audit Time',
      accessor: 'lastAuditedTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Latest Fogging Completion Date',
      accessor: 'latestFoggingCompletionDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Latest Upcoming Fogging Date',
      accessor: 'latestUpcomingFoggingDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'No. of Audits in the Past 12 Months',
      accessor: 'numOfAuditInPast12Months',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'No. of Failed Audits in the Past 12 Months',
      accessor: 'numOfAuditFailedInPast12Months',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = [
    {
      type: FilterType.COMPARE,
      id: 'numOfAuditInPast12Months',
      title: 'No. of Audits in the Past 12 Months',
      values: [
        {
          title: 'Less than/equal to 5',
          comparision: '<= 5',
        },
        {
          title: 'More than 5',
          comparision: '> 5',
        },
      ],
    },
    {
      type: FilterType.COMPARE,
      id: 'numOfAuditFailedInPast12Months',
      title: 'No. of Failed Audits in the Past 12 Months',
      values: [
        {
          title: 'Less than/equal to 5',
          comparision: '<= 5',
        },
        {
          title: 'More than 5',
          comparision: '> 5',
        },
      ],
    },
  ];

  const dateSelectData = [
    {
      label: 'Last Audit Date',
      value: 'lastAudited',
    },
    {
      label: 'Latest Fogging Completion Date',
      value: 'latestFoggingCompletionDate',
      useExactField: true,
    },
    {
      label: 'Latest Upcoming Fogging Date',
      value: 'latestUpcomingFoggingDate',
      useExactField: true,
    },
  ];

  const selectRandom = () => {
    const randomIndex = parseInt((Math.random() * filteredList.length) % filteredList.length);
    history.push(WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.url, filteredList[randomIndex]);
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.AD_HOC.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.FOGGING_AUDIT.AD_HOC.name}</h1>
            <button type="button" className="btn btn-pri ml-auto" onClick={selectRandom} disabled={filteredList.length === 0}>
              Select Random Company to Audit
            </button>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { adHocFoggingAudit } }, ownProps) => ({
  ...ownProps,
  ...adHocFoggingAudit,
});

const mapDispatchToProps = {
  adHocFoggingAuditSearchAction,
  listFilterAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdHocFoggingAudit));
