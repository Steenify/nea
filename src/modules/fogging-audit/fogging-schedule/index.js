import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';

import { getFilterArrayOfListForKey } from 'utils';
import { tableColumnWidth, WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';

import { defaultFilterValue, getListAction, filterListAction, uploadFoggingScheduleAction } from './action';

const searchData = [
  {
    label: 'UEN',
    value: 'companyUen',
  },
  {
    label: 'Company Name',
    value: 'companyName',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Product',
    value: 'product',
  },
  {
    label: 'Purpose of Fogging',
    value: 'foggingPurpose',
  },
];

const columns = [
  {
    Header: 'UEN',
    accessor: 'companyUen',
    headerClassName: 'header-right',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Company Name',
    accessor: 'companyName',
    minWidth: tableColumnWidth.xl,
    sortType: 'string',
  },
  {
    Header: 'Fogging Date',
    accessor: 'foggingDate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Fogging Period',
    accessor: 'foggingPeriod',
    isTimePeriod: true,
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'RO',
    accessor: 'regionOffice',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Division',
    accessor: 'division',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.xxl,
  },
  {
    Header: 'Premises Type',
    accessor: 'premisesType',
    minWidth: tableColumnWidth.xl,
  },
  {
    Header: 'Product',
    accessor: 'product',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Purpose of Fogging',
    accessor: 'foggingPurpose',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Source Reduction',
    accessor: 'sourceReduction',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Notification',
    accessor: 'notification',
    minWidth: tableColumnWidth.md,
  },
];

const FoggingSchedule = (props) => {
  const {
    // history,

    ui: { isLoading },
    data: { list, filteredList },
    getListAction,
    filterListAction,
    uploadFoggingScheduleAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [modalState, setModalState] = useState({ open: false });
  const [uploadFileIds, setUploadFileIds] = useState([]);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const getList = useCallback(() => {
    getListAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getListAction]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.FOGGING_SCHEDULE.name}`;
    getList();
  }, [getList]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
    });
  }, [sortValue, searchType, debounceSearchText, filterValue, datePickerValue, filterListAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOffice',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'regionOffice'),
    },
    {
      type: FilterType.SELECT,
      id: 'foggingPurpose',
      title: 'Purpose of Fogging',
      values: getFilterArrayOfListForKey(list, 'foggingPurpose'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
    },
    {
      type: FilterType.SEARCH,
      id: 'premisesType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(list, 'premisesType'),
    },
    {
      type: FilterType.SEARCH,
      id: 'product',
      title: 'Product',
      values: getFilterArrayOfListForKey(list, 'product'),
    },
    {
      type: FilterType.SELECT,
      id: 'sourceReduction',
      title: 'Source Reduction',
      values: getFilterArrayOfListForKey(list, 'sourceReduction'),
    },
    {
      type: FilterType.SELECT,
      id: 'notification',
      title: 'Notification',
      values: getFilterArrayOfListForKey(list, 'notification'),
    },
  ];

  // const getTrProps = (_state, rowInfo) => {
  //   if (rowInfo) {
  //     return {
  //       onClick: () => {
  //         history.push(WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.url, { companyUen: rowInfo.row._original.companyUen });
  //       },
  //       className: 'cursor-pointer',
  //     };
  //   }
  //   return {};
  // };

  const uploadFoggingSchedule = () => {
    uploadFoggingScheduleAction({ fileIds: uploadFileIds }, () => {
      setUploadFileIds([]);
      toast.success('Upload successful.');
      setModalState({ open: false });
      getList();
    });
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.FOGGING_SCHEDULE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.FOGGING_SCHEDULE]} />
          <div className="main-title">
            <h1>Fogging Schedule</h1>
            {/* {functionNameList.includes(FUNCTION_NAMES.uploadFoggingSchedule) && (
              <button type="button" className="btn btn-pri ml-auto" onClick={() => setModalState({ open: true })}>
                Upload Contractor Fogging Schedule
              </button>
            )} */}
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect
                className="navbar-nav filterWrapper ml-auto xs-paddingBottom15"
                onChange={setDatePickerValue}
                timePicker={false}
                selectData={[
                  {
                    label: 'Fogging Date',
                    value: 'foggingDate',
                    useExactField: true,
                  },
                ]}
                data={datePickerValue}
              />
              <Filter ref={filterRef} className="navbar-nav filterWrapper" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>

          <div className="tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                // getTrProps={getTrProps}
              />
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />

          <CustomModal
            headerTitle="Upload Contractor Fogging Schedule"
            confirmTitle="Submit"
            cancelTitle="Cancel"
            isOpen={modalState.open}
            onConfirm={uploadFoggingSchedule}
            onCancel={() => {
              setUploadFileIds([]);
              setModalState({ open: false });
            }}
            type="action-modal"
            content={
              <form className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <DropBox submissionType={SUBMISSION_TYPE.FOGAUDITSCHEDULE} size="sm" fileIdList={uploadFileIds} onChange={(fileList) => setUploadFileIds(fileList.map((file) => file.fileId))} />
                  </div>
                </div>
              </form>
            }
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, foggingAuditReducers: { foggingSchedule } }, ownProps) => ({
  ...ownProps,
  ...foggingSchedule,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getListAction,
  filterListAction,
  uploadFoggingScheduleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoggingSchedule);
