import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import moment from 'moment-timezone';
import update from 'react-addons-update';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import { getFilterArrayOfListForKey } from 'utils';

import { defaultFilterValue, filterListAction, dailyReportListingAction, uploadDailyReportAction } from './action';

const dateSelectData = [
  {
    label: 'Date of Survey',
    value: 'surveyDate',
    useExactField: true,
  },
  {
    label: 'Date Submitted',
    value: 'submissionDate',
    useExactField: true,
  },
  {
    label: 'Date Validated',
    value: 'fileValidatedDate',
    useExactField: true,
  },
];

const searchData = [
  {
    label: 'RO',
    value: 'ro',
  },
  {
    label: 'GRC',
    value: 'grc',
  },
  {
    label: 'Division',
    value: 'division',
  },
  {
    label: 'Zone',
    value: 'zone',
  },
  {
    label: 'Uploaded By',
    value: 'uploadedBy',
  },
];

const format = (date) => moment(date).format('DD/MM/YYYY');

const DailyReport = (props) => {
  const {
    dailyReport: {
      ui: { isLoading = false },
      data: { filteredList = [], list },
    },
    filterListAction,
    dailyReportListingAction,
    uploadDailyReportAction,
    history,
  } = props;

  useEffect(() => {
    dailyReportListingAction();
  }, [dailyReportListingAction]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [listOfFile, setListOfFile] = useState([]);

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      datePickerValue,
      filterValue,
    });
  }, [sortValue, searchType, debounceSearchText, datePickerValue, filterValue, filterListAction]);

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'ro',
      title: 'RO',
      values: getFilterArrayOfListForKey(list, 'ro'),
    },
    {
      type: FilterType.SELECT,
      id: 'grc',
      title: 'GRC',
      values: getFilterArrayOfListForKey(list, 'grc'),
    },
    {
      type: FilterType.SELECT,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(list, 'division'),
    },
    {
      type: FilterType.SELECT,
      id: 'status',
      title: 'Status',
      values: getFilterArrayOfListForKey(list, 'status'),
    },
  ];

  const columns = [
    {
      Header: 'Date of Survey',
      accessor: 'surveyDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.lg,
      sortType: 'string',
    },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'GRC',
      accessor: 'grc',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Zone',
      accessor: 'zone',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'File Name',
      accessor: 'fileName',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Date Submitted',
      accessor: 'submissionDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Date Validated',
      accessor: 'fileValidatedDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Uploaded by',
      accessor: 'uploadedBy',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row && rowInfo.row.status !== 'FAILED WITH ERRORS') {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT_DETAIL.url, rowInfo.row._original);
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
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT.name} />

        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            {/* <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT.name, columns)}>
              Download
            </button> */}
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
            <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
          </div>
          <Footer />

          <CustomModal
            bodyClassName="is-reject-form"
            headerTitle="Upload Contractor File"
            confirmTitle="Submit"
            cancelTitle="Cancel"
            isOpen={showUploadModal}
            onConfirm={() => {
              if (listOfFile.length === 0) {
                toast.warn('No file selected.');

                return;
              }

              uploadDailyReportAction(
                {
                  files: listOfFile.map((f) => ({
                    ...f,
                    dateFileReceived: format(f.dateFileReceived),
                    deadlineDate: format(f.deadlineDate),
                  })),
                },
                (e) => {
                  setListOfFile([]);
                  setShowUploadModal(false);

                  if (e) {
                    history.push('/file-download');

                    return;
                  }

                  toast.success('Success.');

                  dailyReportListingAction();
                },
              );
            }}
            onCancel={() => {
              setShowUploadModal(false);
            }}
            type="action-modal"
            content={
              <form className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <DropBox
                      submissionType={SUBMISSION_TYPE.RODAUDIT_DR}
                      size="lg"
                      fileIdList={listOfFile.map((file) => file.fileId)}
                      onChange={(fileList) => {
                        setListOfFile(
                          fileList.map((file) => ({
                            fileId: file.fileId,
                            dateFileReceived: moment(),
                            deadlineDate: moment(),
                            companyName: '',
                          })),
                        );
                      }}
                      extractViews={(file, index) => (
                        <div className="row">
                          <div className="col my-2">
                            <div className="m-2">Company Name</div>
                            <input
                              className="ml-auto textfield"
                              placeholder="Company Name"
                              value={listOfFile[index].companyName}
                              onChange={(e) => {
                                setListOfFile(update(listOfFile, { [index]: { companyName: { $set: e.target.value } } }));
                              }}
                            />
                          </div>
                          <div className="col my-2">
                            <div className="m-2">Date File Received</div>
                            <SingleDatePickerV2
                              date={listOfFile[index].dateFileReceived}
                              className="ml-auto"
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { dateFileReceived: { $set: date } } }));
                              }}
                            />
                          </div>
                          <div className="col my-2">
                            <div className="m-2">Expected Submission Date</div>
                            <SingleDatePickerV2
                              date={listOfFile[index].deadlineDate}
                              className="ml-auto"
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { deadlineDate: { $set: date } } }));
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </form>
            }
          />
          <InPageLoading isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (
  {
    global: {
      data: { masterCodes },
    },
    rodentAuditReducers: { dailyReport },
  },
  ownProps,
) => ({
  ...ownProps,
  dailyReport,
  masterCodes,
});

const mapDispatchToProps = {
  filterListAction,
  dailyReportListingAction,
  uploadDailyReportAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DailyReport));
