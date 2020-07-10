import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
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

import { defaultFilterValue, filterListAction, dailyDeploymentListingAction, uploadDailyDevelopmentAction } from './action';

const dateSelectData = [
  {
    label: 'Date',
    value: 'date',
    useExactField: true,
  },
  {
    label: 'Date Submitted',
    value: 'uploadAt',
    useExactField: true,
  },
];

const searchData = [
  {
    label: 'Name of Technician/Worker',
    value: 'technicianName',
  },
  {
    label: 'Licence No.',
    value: 'licenceCertificateNo',
  },
  {
    label: 'Zones',
    value: 'zones',
  },
  {
    label: 'Submitted By',
    value: 'uploadBy',
  },
];

const format = (date) => moment(date).format('DD/MM/YYYY');

const DailyDeployment = (props) => {
  const {
    history,

    dailyDeployment: {
      ui: { isLoading = false },
      data: { filteredList = [], list },
    },
    filterListAction,
    dailyDeploymentListingAction,
    uploadDailyDevelopmentAction,
  } = props;

  useEffect(() => {
    dailyDeploymentListingAction();
  }, [dailyDeploymentListingAction]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [listOfFile, setListOfFile] = useState([]);

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
      datePickerValue,
    });
  }, [sortValue, searchType, searchText, datePickerValue, filterValue, filterListAction]);

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'contractType',
        title: 'Contract Type',
      },
      {
        type: FilterType.SELECT,
        id: 'ro',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SELECT,
        id: 'licenceType',
        title: 'License Type',
      },
      {
        type: FilterType.SELECT,
        id: 'status',
        title: 'Status',
      },
    ],
    [],
  );

  const columns = [
    {
      Header: 'Contract Type',
      accessor: 'contractType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Date',
      minWidth: tableColumnWidth.md,
      accessor: 'date',
      // Cell: ({ index }) => format(filteredList[index].createdDate),
    },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Zones',
      accessor: 'zones',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Name of\nTechnician/Worker',
      accessor: 'technicianName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'License Type',
      accessor: 'licenceType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'License/Certification No.',
      accessor: 'licenceCertificateNo',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'License Status',
      accessor: 'licenceStatus',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Date Submitted',
      minWidth: tableColumnWidth.md,
      accessor: 'uploadAt',
    },
    {
      Header: 'Submitted By',
      accessor: 'uploadBy',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.DAILY_DEPLOYMENT.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.DAILY_DEPLOYMENT]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.DAILY_DEPLOYMENT.name}</h1>

            <button type="button" className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            {/* <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.DAILY_DEPLOYMENT.name, columns)}>
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
            <DataTable data={filteredList} columns={columns} />
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

              uploadDailyDevelopmentAction(
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

                  dailyDeploymentListingAction();
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
                      fileStatus="PUBLISHED"
                      submissionType={SUBMISSION_TYPE.RODAUDIT_DD}
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
    rodentAuditReducers: { dailyDeployment },
  },
  ownProps,
) => ({
  ...ownProps,
  dailyDeployment,

  masterCodes,
});

const mapDispatchToProps = {
  filterListAction,
  dailyDeploymentListingAction,
  uploadDailyDevelopmentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyDeployment);
