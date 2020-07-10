import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect, { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import CustomModal from 'components/common/modal';

import { dateTimeStringFromDate, actionTryCatchCreator } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getQueryInspectionFormStatuses } from 'services/vector-inspection';

const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
    sortType: 'date',
  },
  filterValue: null,
  datePickerValue: {
    selectedValue: 'breedingDetectionDate',
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  searchText: '',
  searchType: 'address',
};

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
    value: 'lastUpdate',
  },
];

const QueryInspectionFormStatus = (props) => {
  const { history } = props;

  const [apiState, setAPIState] = useState({ taskList: [], isLoading: false });
  const [modalState, setModalState] = useState({ open: false, data: [] });

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const getListAction = useCallback(() => {
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const selectValue = datePickerValue?.selectedValue || defaultFilterValue.datePickerValue.selectedValue;
    const data = {};
    data[`${selectValue}From`] = dateTimeStringFromDate(startDate);
    data[`${selectValue}To`] = dateTimeStringFromDate(endDate);

    actionTryCatchCreator(
      getQueryInspectionFormStatuses(data),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        const temp = data.inspections || [];
        const list = [...temp];
        // for (let i = 0; i < 200; i += 1) {
        //   list.push(...temp);
        // }
        list.map((item) => {
          const form3IdList = (item.form3Id || '').split(',').filter((id) => id);
          return { ...item, form3IdList };
        });
        setAPIState({ isLoading: false, taskList: list });
        if (filterRef && filterRef.current) filterRef.current.onClear();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [datePickerValue]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_NON_RODENT_INSPECTION.name}`;
    getListAction();
  }, [getListAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'regionOfficeCode',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'inspectionFormStatus',
        title: 'Inspection Form Status',
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
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
        Header: 'Inspection Officer',
        accessor: 'officerName',
        minWidth: tableColumnWidth.xl,
      },
      {
        Header: 'Inspection Date',
        accessor: 'inspectionDate',
        minWidth: tableColumnWidth.lg,
        sortType: 'date',
      },
      {
        Header: 'Inspection Time',
        accessor: 'inspectionTime',
        minWidth: tableColumnWidth.lg,
        sortType: 'time',
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
        sortType: 'date',
      },
      {
        Header: 'Last Updated Time',
        accessor: 'lastUpdateTime',
        minWidth: tableColumnWidth.lg,
        sortType: 'time',
      },
      {
        Header: 'Form 3 ID',
        accessor: 'form3Id',
        Cell: (cellInfo) => {
          const idList = cellInfo?.original?.form3IdList || [];
          return (
            <div style={{ maxHeight: 300, overflowY: 'scroll', display: 'block', width: '100%', padding: '15px 20px' }}>
              <ul style={{ listStyle: 'disc' }}>
                {idList.length > 0 &&
                  idList.slice(0, 50).map((form3Id) => (
                    <li key={`form3Id_${form3Id}`}>
                      <span className="text-blue cursor-pointer" onClick={() => history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id })}>
                        {form3Id}
                      </span>
                    </li>
                  ))}
                {idList.length > 50 && (
                  <li key="form3Id_view_more">
                    <span className="text-blue cursor-pointer" onClick={() => setModalState({ open: true, data: idList })}>
                      View more...
                    </span>
                  </li>
                )}
              </ul>
            </div>
          );
        },
        minWidth: tableColumnWidth.lg,
      },
    ],
    [history],
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_NON_RODENT_INSPECTION.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_NON_RODENT_INSPECTION]} />
          <div className="main-title">
            <h1>Query Non-Rodent Inspections</h1>
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
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.taskList || []} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <FilteringDataTable data={apiState.taskList || []} columns={columns} filterData={{ searchType, searchText, filterValue, sortValue }} />
            </div>
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open}
            type="action-modal"
            headerTitle="Form 3 IDs"
            cancelTitle="Close"
            onCancel={() => setModalState({ open: false })}
            content={
              <div style={{ maxHeight: 300, overflowY: 'scroll', display: 'block', width: '100%', padding: '15px 20px' }}>
                <ul style={{ listStyle: 'disc', columns: 4 }}>
                  {modalState.data?.length > 0 &&
                    modalState.data?.map((form3Id) => (
                      <li key={`form3Id_${form3Id}`}>
                        <span className="text-blue cursor-pointer" onClick={() => history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id })}>
                          {form3Id}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryInspectionFormStatus));
