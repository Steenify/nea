import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import { getFilterArrayOfListForKey } from 'utils';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { defaultFilterValue, filterListAction, getListAction } from './action';

const searchData = [
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Address',
    value: 'address',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDetection',
  },
];

const EditSOF = (props) => {
  const {
    getListAction,
    filterListAction,
    ui: { isLoading },
    data: { filteredList, list },
    history: { push },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOfficeCode'),
    },
  ];

  useEffect(() => {
    document.title = 'NEA | Edit SOF';
    getListAction();
  }, [getListAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
    });
  }, [sortValue, searchType, debounceSearchText, filterValue, datePickerValue, filterListAction]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(`${WEB_ROUTES.DETAILS.url}/sof`, { showAction: true, isEditing: true, id: rowInfo.row.inspectionId });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => <span className="text-blue cursor-pointer">{cellInfo.row.inspectionId}</span>,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.EDIT_SOF.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.EDIT_SOF]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.EDIT_SOF.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom10" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom10" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
            <InPageLoading isLoading={isLoading} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { editSof } }, ownProps) => ({
  ...ownProps,
  ...editSof,
});

const mapDispatchToProps = {
  filterListAction,
  getListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditSOF));
