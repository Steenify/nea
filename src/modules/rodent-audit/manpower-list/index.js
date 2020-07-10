import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import moment from 'moment-timezone';
import update from 'react-addons-update';

import { tableColumnWidth, WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';

import { filterListAction, getListAction, defaultFilterValue, uploadRodentContractManpowerListAction } from './action';

const dateSelectData = [
  {
    label: 'Date Submitted',
    value: 'submittedDate',
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
    label: 'Company Name',
    value: 'companyName',
  },
  {
    label: 'Submitted By',
    value: 'submittedBy',
  },
];

const format = (date) => moment(date).format('DD/MM/YYYY');

const ManpowerList = (props) => {
  const {
    history,
    getListAction,
    filterListAction,
    uploadRodentContractManpowerListAction,
    ui: { isLoading },
    data: { filteredList = [] },
  } = props;

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [listOfFile, setListOfFile] = useState([]);

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const [debounceSearchText] = useDebounce(searchText, 500);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST.name}`;
    getListAction({});
  }, [getListAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      datePickerValue,
    });
  }, [debounceSearchText, searchType, sortValue, datePickerValue, filterListAction]);

  const columns = [
    {
      Header: 'Date Submitted',
      minWidth: tableColumnWidth.md,
      accessor: 'submittedDate',
    },
    {
      Header: 'Date Validated',
      minWidth: tableColumnWidth.md,
      accessor: 'fileValidatedDate',
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.lg,
      sortType: 'string',
    },
    // {
    //   Header: 'Contract No.',
    //   accessor: 'contractNo',
    //   minWidth: tableColumnWidth.md,
    // },
    {
      Header: 'Submitted By',
      accessor: 'submittedBy',
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
          history.push(WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST_DETAIL.url, rowInfo.row._original);
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
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            {/* <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST.name, columns)}>
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

              uploadRodentContractManpowerListAction(
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

                  getListAction({});
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
                      submissionType={SUBMISSION_TYPE.RODAUDIT_MPR}
                      size="sm"
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
                              className="ml-auto"
                              date={listOfFile[index].dateFileReceived}
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { dateFileReceived: { $set: date } } }));
                              }}
                            />
                          </div>
                          <div className="col my-2">
                            <div className="m-2">Expected Submission Date</div>
                            <SingleDatePickerV2
                              className="ml-auto"
                              date={listOfFile[index].deadlineDate}
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

const mapStateToProps = ({ rodentAuditReducers: { manpowerList } }, ownProps) => ({
  ...ownProps,
  ...manpowerList,
});

const mapDispatchToProps = {
  getListAction,
  filterListAction,
  uploadRodentContractManpowerListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ManpowerList));
