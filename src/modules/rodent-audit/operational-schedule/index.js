import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

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
import Filter, { FilterType } from 'components/common/filter';

import { tableColumnWidth, WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';

import { defaultFilterValue, filterListAction, uploadRodentOperationalSchedulesAction, opsTaskScheduleListingAction } from './action';

const dateSelectData = [
  {
    label: 'Ops Period From',
    value: 'periodFrom',
    useExactField: true,
  },
  {
    label: 'Ops Period To',
    value: 'periodTo',
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
    value: 'uploadedBy',
  },
];

const format = (date) => moment(date).format('DD/MM/YYYY');

const OperationalSchedule = (props) => {
  const {
    history,

    operationalSchedule: {
      ui: { isLoading = false },
      data: { filteredList = [], list },
    },
    filterListAction,
    uploadRodentOperationalSchedulesAction,
    opsTaskScheduleListingAction,
  } = props;

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [listOfFile, setListOfFile] = useState([]);

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  useEffect(() => {
    opsTaskScheduleListingAction();
  }, [opsTaskScheduleListingAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'ro',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'fileStatus',
        title: 'Status',
      },
    ],
    [],
  );

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText,
      datePickerValue,
      filterValue,
    });
  }, [sortValue, searchType, searchText, datePickerValue, filterValue, filterListAction]);

  const columns = [
    {
      Header: 'Ops Period From',
      accessor: 'periodFrom',
      minWidth: tableColumnWidth.md,
      // Cell: ({ index }) => {
      //   const from = filteredList[index].periodFrom;

      //   const to = filteredList[index].periodTo;

      //   return `${moment(from).format('MM/DD/YYYY')} to ${moment(from).format('MM/DD/YYYY')}`;
      // },
    },
    {
      Header: 'Ops Period To',
      accessor: 'periodTo',
      minWidth: tableColumnWidth.md,
      // Cell: ({ index }) => {
      //   const from = filteredList[index].periodFrom;

      //   const to = filteredList[index].periodTo;

      //   return `${moment(from).format('MM/DD/YYYY')} to ${moment(from).format('MM/DD/YYYY')}`;
      // },
    },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.md,
      sortType: 'string',
    },
    {
      Header: 'Submitted Date',
      accessor: 'uploadedAt',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Submitted Time',
      accessor: 'uploadedTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Submitted By',
      accessor: 'uploadedBy',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Status',
      accessor: 'fileStatus',
      minWidth: tableColumnWidth.lg,
    },
    // {
    //   Header: '',
    //   minWidth: tableColumnWidth.lg,
    //   Cell: ({ index }) => (
    //     <button
    //       type="button"
    //       className="btn btn-sec"
    //       onClick={async () => {
    //         const { fileId } = filteredList[index];

    //         if (!fileId) return;

    //         setLocalLoading(true);

    //         try {
    //           const { status, data } = await downloadFile({ fileId }).request;
    //           if (status === 200 && data.status === 'Pass') {
    //             const { fileName = '', fileData = '', fileType = '' } = data;
    //             const base64 = byteArrayToBase64(fileData);
    //             autoGenerateDownloadLink(fileName, fileType, base64);

    //             setLocalLoading(false);
    //           } else {
    //             setLocalLoading(false);

    //             throw String(`Unable to load this file. (ID: ${fileId})`);
    //           }
    //         } catch (error) {
    //           setLocalLoading(false);

    //           throw String(`Unable to load this file. (ID: ${fileId})`);
    //         }
    //       }}>
    //       Download
    //     </button>
    //   ),
    // },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE.name} />

        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            {/* <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE.name, columns)}>
              Download
            </button> */}
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable
              data={filteredList}
              columns={columns}
              getTrProps={(state, rowInfo) => {
                if (rowInfo && rowInfo.row && rowInfo.row.fileStatus !== 'FAILED WITH ERRORS') {
                  return {
                    onClick: () => {
                      history.push(WEB_ROUTES.RODENT_AUDIT.SURVEILLANCE_ACTIVITIES_LISTED.url, { operationalSchedule: rowInfo.original });
                    },
                    className: 'cursor-pointer',
                  };
                }

                return {};
              }}
            />
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

              uploadRodentOperationalSchedulesAction(
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

                  opsTaskScheduleListingAction();
                },
              );
            }}
            onCancel={() => {
              // setListOfFile([]);
              setShowUploadModal(false);
            }}
            type="action-modal"
            content={
              <form className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <DropBox
                      submissionType={SUBMISSION_TYPE.RODAUDIT_OPS}
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
                              date={listOfFile[index].dateFileReceived}
                              className="ml-auto"
                              onChangeDate={(date) => {
                                setListOfFile(update(listOfFile, { [index]: { dateFileReceived: { $set: date } } }));
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

const mapStateToProps = (
  {
    global: {
      data: { masterCodes },
    },
    rodentAuditReducers: { operationalSchedule },
  },
  ownProps,
) => ({
  ...ownProps,

  masterCodes,
  operationalSchedule,
});

const mapDispatchToProps = {
  filterListAction,
  uploadRodentOperationalSchedulesAction,
  opsTaskScheduleListingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OperationalSchedule);
