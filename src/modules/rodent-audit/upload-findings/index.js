import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import DropBox from 'components/common/dropbox';
import { SUBMISSION_TYPE, WEB_ROUTES } from 'constants/index';
import Select from 'components/common/select';
import InPageLoading from 'components/common/inPageLoading';

import moment from 'moment';
import { commonUploadAction } from 'modules/non-functional/common-upload/action';
import { actionTryCatchCreator } from 'utils';
import { uploadBaseTaskFindingsService, uploadOptionalTaskFindingsService, uploadFeedbackTaskFindingsService } from 'services/rodent-audit';

const format = (date) => moment(date).format('DD/MM/YYYY');

const RodentUploadFindings = (props) => {
  const {
    history,
    // * use for Common Upload
    isFromCommonUpload,
    fileType,
    commonUploadAction,
  } = props;

  const functionLOV = [];
  // if (functionNameList.includes(FUNCTION_NAMES.uploadBaseTaskFindings)) {
  functionLOV.push({ value: 'RB', label: 'Basic File Upload' });
  // }
  // if (functionNameList.includes(FUNCTION_NAMES.uploadOptionalTaskFindings)) {
  functionLOV.push({ value: 'ROF', label: 'Optional File Upload' });
  // }
  // if (functionNameList.includes(FUNCTION_NAMES.uploadFeedbackTaskFindings)) {
  functionLOV.push({ value: 'RF', label: 'Feedback File Upload' });
  // }

  const [functionName, setFunctionName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const submissionType = SUBMISSION_TYPE.RODAUDITFINDINGS;

  const [uploadFileIds, setUploadFileIds] = useState([]);

  const [listOfFile, setListOfFile] = useState([]);

  const selectedUpload = functionName?.value || fileType;

  const onConfirm = async () => {
    const params = {
      files: listOfFile.map((f) => ({
        ...f,
        dateFileReceived: format(f.dateFileReceived),
        deadlineDate: format(f.deadlineDate),
      })),
    };
    // return;
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      setIsLoading(false);
      setListOfFile([]);
      setUploadFileIds([]);
      toast.success('Upload successful.');
    };
    const onError = (errorMsg) => {
      setIsLoading(false);
      const msg = errorMsg || '';
      if (msg.includes && msg.includes('File Download')) {
        setListOfFile([]);
        setUploadFileIds([]);
        history.push(WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES.url);
      }
    };
    if (isFromCommonUpload) {
      commonUploadAction({ fileType }, params, onSuccess, onError);
    } else {
      if (selectedUpload === 'RB') {
        actionTryCatchCreator(uploadBaseTaskFindingsService(params), onPending, onSuccess, onError);
      }
      if (selectedUpload === 'ROF') {
        actionTryCatchCreator(uploadOptionalTaskFindingsService(params), onPending, onSuccess, onError);
      }
      if (selectedUpload === 'RF') {
        actionTryCatchCreator(uploadFeedbackTaskFindingsService(params), onPending, onSuccess, onError);
      }
    }
  };

  useEffect(() => {
    setUploadFileIds([]);
    setListOfFile([]);
  }, [fileType, functionName]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.UPLOAD_FILES.name}`;
  }, []);

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-12">
          <DropBox
            submissionType={submissionType}
            fileIdList={uploadFileIds}
            onChange={(fileList) => {
              setUploadFileIds(fileList.map((file) => file.fileId));
              setListOfFile(
                fileList.map((file) => {
                  if (selectedUpload === 'RF') {
                    return {
                      fileId: file.fileId,
                      // dateOfReportRecieved: moment(),
                      // dateOfAcknowledgement: moment(),
                      // deadlineDate: moment(),
                      // companyName: '',
                    };
                  }
                  return {
                    fileId: file.fileId,
                    // dateFileReceived: moment(),
                    // deadlineDate: moment(),
                    // companyName: '',
                  };
                }),
              );
            }}
            // extractViews={(file, index) => (
            //   <div className="row">
            //     <div className="col my-2">
            //       <div className="m-2">Company Name</div>
            //       <input
            //         className={`ml-auto textfield ${!listOfFile[index]?.companyName ? 'form-error' : ''}`}
            //         placeholder="Company Name"
            //         value={listOfFile[index]?.companyName}
            //         onChange={(e) => {
            //           setListOfFile(update(listOfFile, { [index]: { companyName: { $set: e.target.value } } }));
            //         }}
            //       />
            //     </div>
            //     {selectedUpload === 'RF' && (
            //       <>
            //         <div className="col my-2">
            //           <div className="m-2">Date of report received</div>
            //           <SingleDatePickerInput
            //             date={listOfFile[index]?.dateOfReportRecieved}
            //             className="ml-auto"
            //             onChangeDate={(date) => {
            //               setListOfFile(update(listOfFile, { [index]: { dateOfReportRecieved: { $set: date } } }));
            //             }}
            //             isOutsideRange={() => false}
            //           />
            //         </div>
            //         <div className="col my-2">
            //           <div className="m-2">Date of acknowledgement</div>
            //           <SingleDatePickerInput
            //             date={listOfFile[index]?.dateOfAcknowledgement}
            //             className="ml-auto"
            //             onChangeDate={(date) => {
            //               setListOfFile(update(listOfFile, { [index]: { dateOfAcknowledgement: { $set: date } } }));
            //             }}
            //             isOutsideRange={() => false}
            //           />
            //         </div>
            //       </>
            //     )}
            //     {selectedUpload !== 'RF' && (
            //       <div className="col my-2">
            //         <div className="m-2">Date File Received</div>
            //         <SingleDatePickerInput
            //           date={listOfFile[index]?.dateFileReceived}
            //           className="ml-auto"
            //           onChangeDate={(date) => {
            //             setListOfFile(update(listOfFile, { [index]: { dateFileReceived: { $set: date } } }));
            //           }}
            //           isOutsideRange={() => false}
            //         />
            //       </div>
            //     )}
            //     <div className="col my-2">
            //       <div className="m-2">Expected Submission Date</div>
            //       <SingleDatePickerInput
            //         date={listOfFile[index]?.deadlineDate}
            //         className="ml-auto"
            //         onChangeDate={(date) => {
            //           setListOfFile(update(listOfFile, { [index]: { deadlineDate: { $set: date } } }));
            //         }}
            //         isOutsideRange={() => false}
            //       />
            //     </div>
            //   </div>
            // )}
          />
          <div className="">
            {listOfFile.length > 0 && (
              <div>
                <button type="button" className="btn btn-pri" onClick={onConfirm}>
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <InPageLoading isLoading={isLoading} />
    </div>
  );

  if (isFromCommonUpload) return UploadForm;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb />
          <div className="paddingBottom50">
            <div className="d-flex align-items-center tabsContainer">
              <label className="font-weight-bold mr-3">Upload file</label>
            </div>
            <div className="d-flex align-items-center tabsContainer">
              <label className="font-weight-bold mr-3 mb-0">Function Name:</label>
              <Select className="wf-400" value={functionName} options={functionLOV} onChange={(functionName) => setFunctionName(functionName)} />
            </div>
            {UploadForm}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {
  commonUploadAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RodentUploadFindings));
