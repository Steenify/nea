import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import moment from 'moment-timezone';
import update from 'react-addons-update';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { tableColumnWidth, WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';

import { defaultFilterValue, filterListAction, feedbackReportListingAction, uploadRodentFeedbackAction } from './action';

const dateSelectData = [
  {
    label: 'Date Submitted',
    value: 'dateSubmitted',
    useExactField: true,
  },
  {
    label: 'Date Validated',
    value: 'dateValidated',
    useExactField: true,
  },
];

const searchData = [
  {
    label: 'Company Name',
    value: 'companyName',
  },
  {
    label: 'Uploaded By',
    value: 'uploadedBy',
  },
];

const format = (date) => moment(date).format('DD/MM/YYYY');

const FeedbackInvestigationReport = (props) => {
  const {
    history,
    feedbackInvestigationReport: {
      ui: { isLoading = false },
      data: { filteredList = [] },
    },
    filterListAction,
    feedbackReportListingAction,
    uploadRodentFeedbackAction,
  } = props;

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [listOfFile, setListOfFile] = useState([]);

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const columns = [
    {
      Header: 'Date Submitted',
      accessor: 'dateSubmitted',
      minWidth: tableColumnWidth.md,
      // Cell: ({ index }) => format(filteredList[index].submittedDate),
    },
    {
      Header: 'Date Validated',
      accessor: 'dateValidated',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.lg,
      sortType: 'string',
    },
    {
      Header: 'File Name',
      accessor: 'fileName',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Uploaded By',
      accessor: 'uploadedBy',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Status',
      accessor: 'fileStatus',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row && rowInfo.row.fileStatus !== 'FAILED WITH ERRORS') {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT_DETAIL.url, rowInfo.row._original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  useEffect(() => {
    feedbackReportListingAction();
  }, [feedbackReportListingAction]);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      datePickerValue,
    });
  }, [sortValue, searchType, debounceSearchText, datePickerValue, filterListAction]);

  return (
    <>
      <Header />

      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            {/* <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT.name, columns)}>
              Download
            </button> */}
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
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

              uploadRodentFeedbackAction(
                {
                  files: listOfFile.map((f) => ({
                    ...f,
                    dateOfReportRecieved: format(f.dateOfReportRecieved),
                    dateOfAcknowledgement: format(f.dateOfAcknowledgement),
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

                  feedbackReportListingAction();
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
                      submissionType={SUBMISSION_TYPE.RODAUDIT_FI}
                      size="sm"
                      fileIdList={listOfFile.map((file) => file.fileId)}
                      onChange={(fileList) => {
                        setListOfFile(
                          fileList.map((file) => ({
                            fileId: file.fileId,
                            dateOfReportRecieved: moment(),
                            dateOfAcknowledgement: moment(),
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
                            <div className="m-2">Date of report received</div>
                            <SingleDatePickerV2
                              date={listOfFile[index].dateOfReportRecieved}
                              className="ml-auto"
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { dateOfReportRecieved: { $set: date } } }));
                              }}
                            />
                          </div>
                          <div className="col my-2">
                            <div className="m-2">Date of acknowledgement</div>
                            <SingleDatePickerV2
                              date={listOfFile[index].dateOfAcknowledgement}
                              className="ml-auto"
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { dateOfAcknowledgement: { $set: date } } }));
                              }}
                            />
                          </div>
                          <div className="col my-2">
                            <div className="m-2">Expected submission date</div>
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

const mapStateToProps = ({ rodentAuditReducers: { feedbackInvestigationReport } }, ownProps) => ({
  ...ownProps,
  feedbackInvestigationReport,
});

const mapDispatchToProps = {
  filterListAction,
  feedbackReportListingAction,
  uploadRodentFeedbackAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeedbackInvestigationReport));
