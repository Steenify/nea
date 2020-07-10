import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import { dateTimeStringFromDate, getFilterArrayOfListForKey } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { formQueryStatusSearch, formQueryStatusFilter, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Inspection Officer',
    value: 'officerName',
  },
  {
    label: 'Analyst',
    value: 'labAnalystName',
  },
  {
    label: 'Form 3 ID',
    value: 'form3Id',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDetectionDate',
  },
  {
    label: 'Inspection Date',
    value: 'inspection',
  },
  {
    label: 'Last Updated Date',
    value: 'lastUpdated',
  },
];

const QueryInspectionFormStatus = (props) => {
  const {
    formQueryStatusSearchAction,
    formQueryStatusFilterAction,
    ui: { isLoading },
    data: { filteredTaskList, taskList },
    history,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS.name}`;
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const selectValue = datePickerValue?.selectedValue || defaultFilterValue.datePickerValue.selectedValue;
    const data = {};
    data[`${selectValue}From`] = dateTimeStringFromDate(startDate);
    data[`${selectValue}To`] = dateTimeStringFromDate(endDate);
    formQueryStatusSearchAction(data).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [formQueryStatusSearchAction, datePickerValue]);

  useEffect(() => {
    formQueryStatusFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [sortValue, searchType, debounceSearchText, filterValue, formQueryStatusFilterAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(taskList, 'regionOfficeCode'),
    },
    {
      type: FilterType.SELECT,
      id: 'inspectionFormStatus',
      title: 'Inspection Form Status',
      values: getFilterArrayOfListForKey(taskList, 'inspectionFormStatus'),
    },
  ];

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/inspection`, { isAllExpanded: true, id: cellInfo.row.inspectionId })}>
          {cellInfo.row.inspectionId}
        </span>
      ),
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Analyst',
      accessor: 'labAnalystName',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Inspection Officer',
      accessor: 'officerName',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Inspection Date',
      accessor: 'inspectionDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Inspection Time',
      accessor: 'inspectionTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Inspection Form Status',
      accessor: 'inspectionFormStatus',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Last Updated Date',
      accessor: 'lastUpdateDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Last Updated Time',
      accessor: 'lastUpdateTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      Cell: (cellInfo) => {
        const idList = (cellInfo.row.form3Id || '').split(',').filter((item) => item);
        return (
          <ul style={{ listStyle: 'disc' }}>
            {idList.length > 0 &&
              idList.map((form3Id) => (
                <li key={`form3Id_${form3Id}`}>
                  <span className="text-blue cursor-pointer" onClick={() => history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id })}>
                    {form3Id}
                  </span>
                </li>
              ))}
          </ul>
        );
      },
      minWidth: tableColumnWidth.lg,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS.name}</h1>
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
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredTaskList} columns={columns} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ sampleIdentificationReducers: { queryInspectionFormStatus } }, ownProps) => ({
  ...ownProps,
  ...queryInspectionFormStatus,
});

const mapDispatchToProps = {
  formQueryStatusSearchAction: formQueryStatusSearch,
  formQueryStatusFilterAction: formQueryStatusFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryInspectionFormStatus));
