import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { Form3Mode } from 'modules/details/form3/helper';

import { form3VoidListingService } from 'services/inspection-management/form3';
import { actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'address',
    label: 'Address',
    desc: false,
  },
  datePickerValue: null,
  searchText: '',
  searchType: 'address',
};

const searchData = [
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Team Lead',
    value: 'teamLead',
  },
  {
    label: 'Form 3 ID',
    value: 'formId',
  },
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breedingDate',
    useExactField: true,
  },
  {
    label: 'Creation Date',
    value: 'createdDate',
    useExactField: true,
  },
];

const VoidForm3 = (props) => {
  const { history } = props;

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      minWidth: tableColumnWidth.lg,
      sortType: 'date',
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Form 3 ID',
      accessor: 'formId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <ul>
          {cellInfo.original?.inspectionId?.split(',')?.map((id, i) => (
            <li key={i}>{id}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: 'Creation Date',
      accessor: 'createdDate',
      minWidth: tableColumnWidth.md,
      sortType: 'date',
    },
    {
      Header: 'Team Lead',
      accessor: 'teamLead',
      minWidth: tableColumnWidth.md,
    },
  ];

  const [apiState, setAPIState] = useState({ taskList: [], isLoading: false });
  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const getListAction = useCallback(() => {
    const onPending = () => setAPIState((prev) => ({ ...prev, isLoading: true }));
    const onSuccess = (data) => {
      setAPIState({ taskList: data.voidListingList || [], isLoading: false });
    };
    const onError = () => setAPIState((prev) => ({ ...prev, isLoading: false }));
    actionTryCatchCreator(form3VoidListingService(), onPending, onSuccess, onError);
  }, []);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_VOID_LISTING.name}`;
    getListAction();
  }, [getListAction]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, {
            action: Form3Mode.void,
            form3Id: rowInfo.row.formId,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_VOID_LISTING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_VOID_LISTING]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_VOID_LISTING.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <FilteringDataTable data={apiState.taskList || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, sortValue, datePickerValue }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VoidForm3));
