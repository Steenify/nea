import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { sofListingService } from 'services/inspection-management/sof';
import { actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
    sortType: 'date',
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'inspectionId',
};

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
    history: { push },
  } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
    ],
    [],
  );

  const getListing = useCallback(() => {
    actionTryCatchCreator(
      sofListingService(),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        setAPIState({ isLoading: false, list: data.inspections || [] });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, []);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.EDIT_SOF.name}`;
    getListing();
  }, [getListing]);

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
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom10"
                onChange={setDatePickerValue}
                selectData={dateSelectData}
                data={datePickerValue}
                resetValue={defaultFilterValue.datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom10" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.list || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, filterValue, sortValue, datePickerValue }} />

            <InPageLoading isLoading={apiState.isLoading} />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditSOF));
