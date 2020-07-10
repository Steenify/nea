import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';

import { getFilterArrayOfListForKey, dateTimeFormatString } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { filterQueryRodentInspectionAction, getRodentInspectionListAction, defaultFilterValue } from './action';

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
    minWidth: tableColumnWidth.md,
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
  },
  {
    Header: 'Inspection Time',
    accessor: 'inspectionTime',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Inspection Officer',
    accessor: 'inspectedBy',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Division',
    accessor: 'division',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Inspection Type',
    accessor: 'inspectionType',
    minWidth: tableColumnWidth.md,
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

const QueryRodentInspection = (props) => {
  const {
    getRodentInspectionListAction,
    filterQueryRodentInspectionAction,

    // history,
    ui: { isLoading },
    data: { filteredList, list },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const getListing = useCallback(() => {
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    getRodentInspectionListAction({
      startDate: startDate.format(dateTimeFormatString),
      endDate: endDate.format(dateTimeFormatString),
    }).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [datePickerValue, getRodentInspectionListAction]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION.name}`;
    getListing();
  }, [getListing]);

  useEffect(() => {
    filterQueryRodentInspectionAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, filterQueryRodentInspectionAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOfficeCode'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
    },
    {
      type: FilterType.SELECT,
      id: 'inspectionType',
      title: 'Inspection Type',
      values: getFilterArrayOfListForKey(list, 'inspectionType'),
    },
    {
      type: FilterType.SEARCH,
      id: 'premiseType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(list, 'premiseType'),
    },
    {
      type: FilterType.SELECT,
      id: 'tcInspectionType',
      title: 'TC Inspection Type',
      values: getFilterArrayOfListForKey(list, 'tcInspectionType'),
    },
    {
      type: FilterType.SELECT,
      id: 'signsOfInfestation',
      title: 'Signs of Infestation',
      values: getFilterArrayOfListForKey(list, 'signsOfInfestation'),
    },
    {
      type: FilterType.SELECT,
      id: 'breedingHabitats',
      title: 'Breeding Habitats',
      values: getFilterArrayOfListForKey(list, 'breedingHabitats'),
    },
    {
      type: FilterType.SELECT,
      id: 'preventiveMeasures',
      title: 'Preventive Measures',
      values: getFilterArrayOfListForKey(list, 'preventiveMeasures'),
    },
    {
      type: FilterType.SELECT,
      id: 'inspectorRole',
      title: 'RCU / Non-RCU',
      values: getFilterArrayOfListForKey(list, 'inspectorRole'),
    },
  ];

  // const getTrProps = (_state, rowInfo) => {
  //   if (rowInfo && rowInfo.row) {
  //     const { rccId } = rowInfo.row;
  //     return {
  //       onClick: () => {
  //         // history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION_DETAIL.url, { rccId });
  //       },
  //       className: 'cursor-pointer',
  //     };
  //   }
  //   return {};
  // };

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
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList || []} columns={columns} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { queryRodentInspection } }, ownProps) => ({
  ...ownProps,
  ...queryRodentInspection,
});

const mapDispatchToProps = {
  filterQueryRodentInspectionAction,
  getRodentInspectionListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryRodentInspection));
