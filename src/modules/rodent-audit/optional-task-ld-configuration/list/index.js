import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NewBreadCrumb from 'components/ui/breadcrumb';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';

import { getFilterArrayOfListForKey } from 'utils';

import { WEB_ROUTES } from 'constants/index';

import { optionalInstanceCfgListingAction, defaultFilterValue, filterListAction } from '../action';

const dateSelectData = [
  {
    label: 'Effective Date',
    value: 'effectiveDate',
    useExactField: true,
  },
];

const searchData = [
  {
    label: 'Created By',
    value: 'createdBy',
  },
];

const OptionalTaskLDConfigurationList = (props) => {
  const {
    history,
    optionalTaskLDConfiguration: {
      ui: { isLoading = false },
      data: { list = [], filteredList = [] },
    },
    filterListAction,
    optionalInstanceCfgListingAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const [debounceSearchText] = useDebounce(searchText, 500);

  useEffect(() => {
    optionalInstanceCfgListingAction();
  }, [optionalInstanceCfgListingAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      datePickerValue,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, datePickerValue, filterListAction, filterValue]);

  const columns = [
    {
      Header: 'CRC Instance',
      accessor: 'crcInstance',
    },
    {
      Header: 'Bin Chute Instance',
      accessor: 'binchuteInstance',
    },
    {
      Header: 'Bin Centre Instance',
      accessor: 'bincentreInstance',
    },
    {
      Header: 'Effective Date',
      accessor: 'effectiveDate',
    },
    {
      Header: 'Created By',
      accessor: 'createdBy',
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'crcInstance',
      title: 'CRC Instance',
      values: getFilterArrayOfListForKey(list, 'crcInstance'),
    },
    {
      type: FilterType.SELECT,
      id: 'binchuteInstance',
      title: 'Bin Chute Instance',
      values: getFilterArrayOfListForKey(list, 'binchuteInstance'),
    },
    {
      type: FilterType.SELECT,
      id: 'bincentreInstance',
      title: 'Bin Centre Instance',
      values: getFilterArrayOfListForKey(list, 'bincentreInstance'),
    },
  ];

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => history.push(WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_NEW.url)}>
              New Configuration
            </button>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>

          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ rodentAuditReducers: { optionalTaskLDConfiguration } }, ownProps) => ({
  ...ownProps,
  optionalTaskLDConfiguration,
});

const mapDispatchToProps = {
  filterListAction,
  optionalInstanceCfgListingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionalTaskLDConfigurationList);
