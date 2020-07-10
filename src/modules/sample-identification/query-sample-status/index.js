import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import NewBreadCrumb from 'components/ui/breadcrumb';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import { connect } from 'react-redux';
import DateRangePickerSelect, { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { getQueriesStatus } from 'services/sample-identification';
import { dateTimeStringFromDate, actionTryCatchCreator } from 'utils';

const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
    sortType: 'date',
  },
  filterValue: null,
  datePickerValue: {
    selectedValue: 'breedingDate',
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  searchText: '',
  searchType: 'sampleId',
};

const searchData = [
  {
    label: 'Sample ID',
    value: 'sampleId',
  },
  {
    label: 'Officer Name',
    value: 'officerName',
  },
  {
    label: 'Analyst Name',
    value: 'analystName',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDate',
  },
  {
    label: 'Date Received by EHI',
    value: 'receivedDate',
  },
];

const columns = [
  {
    Header: 'Breeding Detection Date',
    accessor: 'breedingDetectionDate',
    minWidth: tableColumnWidth.lg,
    sortType: 'date',
  },
  {
    Header: 'Breeding Detection Time',
    accessor: 'breedingDetectionTime',
    minWidth: tableColumnWidth.lg,
    sortType: 'time',
  },
  {
    Header: 'Date Received by EHI',
    accessor: 'receivedDate',
    minWidth: tableColumnWidth.lg,
    sortType: 'date',
  },
  {
    Header: 'Time Received by EHI',
    accessor: 'receivedTime',
    minWidth: tableColumnWidth.lg,
    sortType: 'time',
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
    accessor: 'sampleId',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Analyst Name',
    accessor: 'analystName',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Sample Status',
    accessor: 'sampleStatus',
    minWidth: tableColumnWidth.lg,
  },
];

const QuerySampleStatus = (props) => {
  const {
    getMastercodeAction,
    history,
    // masterCodes,
  } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const getListing = useCallback(() => {
    const { startDate, endDate, selectedValue } = datePickerValue || {};
    const params = {
      startDate: dateTimeStringFromDate(startDate || defaultFilterValue.datePickerValue.startDate),
      endDate: dateTimeStringFromDate(endDate || defaultFilterValue.datePickerValue.endDate),
      dateType: selectedValue || 'breedingDate',
    };
    actionTryCatchCreator(
      getQueriesStatus(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.sampleIdList || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [datePickerValue]);

  useEffect(() => {
    getMastercodeAction([MASTER_CODE.SAMPLE_STATUS_CODE]);
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name}`;
    getListing();
  }, [getListing, getMastercodeAction]);

  const getTrProps = (_state, rowInfo) => {
    const props = {
      onClick: () => history.push(`${WEB_ROUTES.DETAILS.url}/sample`, { id: rowInfo.row.sampleId }),
      className: 'cursor-pointer',
    };

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

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'sampleStatus',
        title: 'Sample Status',
        // values: (masterCodes[MASTER_CODE.SAMPLE_STATUS_CODE] || []).map((item) => item.label),
      },
    ],
    [],
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom15"
                onChange={setDatePickerValue}
                selectData={dateSelectData}
                data={datePickerValue}
                resetValue={defaultFilterValue.datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <FilteringDataTable data={apiState.list || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, filterValue, sortValue }} />
            </div>
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuerySampleStatus));
