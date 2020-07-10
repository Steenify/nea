import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import NewBreadCrumb from 'components/ui/breadcrumb';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { exportExcel } from 'utils';

import { manpowerListInfoAction, filterListAction, defaultFilterValue } from './action';

const dateSelectData = [
  {
    label: 'Licence Expiry Date',
    value: 'licenseExpiryDate',
    useExactField: true,
  },
  {
    label: 'Verified Expiry Date',
    value: 'verifiedExpiryDate',
    useExactField: true,
  },
];

const searchData = [
  {
    label: 'Name of Technician/Worker Name',
    value: 'technicianName',
  },
  {
    label: 'Personal ID',
    value: 'technicianId',
  },
  {
    label: 'Verified Licence Number',
    value: 'licenseNo',
  },
];

const ManpowerListInfo = (props) => {
  const {
    history,
    location: { state },
    manpowerListDetail: {
      ui: { isLoading = false },
      data: { filteredList = [], list },
    },
    manpowerListInfoAction,
    filterListAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST_DETAIL.name}`;

    if (state?.manpowerId) {
      manpowerListInfoAction({ manpowerId: state?.manpowerId });
    } else {
      history.goBack();
    }
  }, [manpowerListInfoAction, history, state]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText,
      datePickerValue,
      filterValue,
    });
  }, [searchText, searchType, sortValue, datePickerValue, filterValue, filterListAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'licenseType',
        title: 'Type of Licence',
      },
      {
        type: FilterType.SELECT,
        id: 'licenseStatus',
        title: 'Licence Status',
      },
      {
        type: FilterType.SELECT,
        id: 'teamAllocationRO',
        title: 'Team Allocation by RO',
      },
    ],
    [],
  );

  const columns = [
    {
      Header: 'Name of Technician/Worker',
      accessor: 'technicianName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Personal ID',
      accessor: 'technicianId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Type of Licence',
      accessor: 'licenseType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Team Allocation by RO',
      accessor: 'teamAllocationRO',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Licence Expiry Date',
      accessor: 'licenseExpiryDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Verified Expiry Date',
      accessor: 'verifiedExpiryDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Verified Licence Number',
      accessor: 'licenseNo',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Licence Status',
      accessor: 'licenseStatus',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Remarks',
      accessor: 'remarks',
      minWidth: tableColumnWidth.lg,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST, WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST_DETAIL]} />

          <div className="go-back d-flex align-items-center">
            {/* <span onClick={() => history.goBack()}>{detail ? `${detail?.surveyDate} - ${detail?.ro} - ${detail?.division} ${detail?.grc}` : 'Go Back'}</span> */}
            <span onClick={() => history.goBack()}>{`${state?.companyName}`}</span>

            <button type="button" className="btn btn-sec ml-2 ml-auto" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST_DETAIL.name, columns)}>
              Download
            </button>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
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

const mapStateToProps = ({ rodentAuditReducers: { manpowerListDetail } }, ownProps) => ({ ...ownProps, manpowerListDetail });

const mapDispatchToProps = {
  manpowerListInfoAction,
  filterListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ManpowerListInfo));
