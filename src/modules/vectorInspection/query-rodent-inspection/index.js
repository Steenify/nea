import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect, { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';

import { dateTimeFormatString, actionTryCatchCreator } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getRodentInspectionListingService } from 'services/inspection-management/rodent';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'rccId',
  datePickerValue: {
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  filterValue: null,
  sortValue: {
    id: 'inspectionDate',
    label: 'Inspection Date',
    desc: false,
    sortType: 'date',
  },
};

const searchData = [
  {
    label: 'RCC ID',
    value: 'rccId',
  },
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Address of Premises',
    value: 'addressOfPremise',
  },
  {
    label: 'Inspection Officer',
    value: 'inspectedBy',
  },
];

const dateSelectData = [
  {
    label: 'Inspection Date',
    value: 'inspection',
  },
];

const columns = [
  {
    Header: 'RCC ID',
    accessor: 'rccId',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Inspection ID',
    accessor: 'inspectionId',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'RO',
    accessor: 'regionOfficeCode',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Address of Premises',
    accessor: 'addressOfPremise',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Inspection Date',
    accessor: 'inspectionDate',
    minWidth: tableColumnWidth.md,
    sortType: 'date',
  },
  {
    Header: 'Inspection Time',
    accessor: 'inspectionTime',
    minWidth: tableColumnWidth.md,
    sortType: 'time',
  },
  {
    Header: 'Inspection Officer',
    accessor: 'inspectedBy',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Division',
    accessor: 'division',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Inspection Type',
    accessor: 'inspectionType',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Premises Type',
    accessor: 'premiseType',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Land Owner',
    accessor: 'landOwner',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'TC Inspection Type',
    accessor: 'tcInspectionType',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Burrows',
    accessor: 'burrowCount',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Signs of Infestation',
    accessor: 'signsOfInfestation',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Breeding Habitats',
    accessor: 'breedingHabitats',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Preventive Measures',
    accessor: 'preventiveMeasures',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'RCU / Non-RCU',
    accessor: 'inspectorRole',
    minWidth: tableColumnWidth.md,
  },
];

const QueryRodentInspection = () => {
  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const getListing = useCallback(() => {
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const params = {
      startDate: startDate.format(dateTimeFormatString),
      endDate: endDate.format(dateTimeFormatString),
    };
    actionTryCatchCreator(
      getRodentInspectionListingService(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.queryRodentList || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [datePickerValue]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION.name}`;
    getListing();
  }, [getListing]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'inspectionType',
        title: 'Inspection Type',
      },
      {
        type: FilterType.SEARCH,
        id: 'premiseType',
        title: 'Premises Type',
      },
      {
        type: FilterType.SELECT,
        id: 'tcInspectionType',
        title: 'TC Inspection Type',
      },
      {
        type: FilterType.SELECT,
        id: 'signsOfInfestation',
        title: 'Signs of Infestation',
      },
      {
        type: FilterType.SELECT,
        id: 'breedingHabitats',
        title: 'Breeding Habitats',
      },
      {
        type: FilterType.SELECT,
        id: 'preventiveMeasures',
        title: 'Preventive Measures',
      },
      {
        type: FilterType.SELECT,
        id: 'inspectorRole',
        title: 'RCU / Non-RCU',
      },
    ],
    [],
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom15"
                onChange={setDatePickerValue}
                selectData={dateSelectData}
                data={datePickerValue}
                resetValue={defaultFilterValue.datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.list || []} columns={columns} filterData={{ searchType, searchText, filterValue, sortValue }} />
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryRodentInspection));
