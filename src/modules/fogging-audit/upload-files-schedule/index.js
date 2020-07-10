import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DropBox from 'components/common/dropbox';

import { SUBMISSION_TYPE, WEB_ROUTES } from 'constants/index';

import { uploadFoggingScheduleService } from 'services/fogging-audit';
import { actionTryCatchCreator } from 'utils';
import { commonUploadAction } from 'modules/non-functional/common-upload/action';

const FoggingFileUpload = (props) => {
  const {
    history,
    // * use for Common Upload
    isFromCommonUpload,
    fileType,
    commonUploadAction,
  } = props;

  const [fileList, setFileList] = useState([]);

  const submissionType = isFromCommonUpload ? SUBMISSION_TYPE.FOGAUDITFINDINGS : SUBMISSION_TYPE.FOGAUDITSCHEDULE;

  const [isLoading, setIsLoading] = useState(false);

  const dropboxRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.UPLOAD_FILES_SCHEDULE.name}`;
    setFileList([]);
  }, []);

  const confirmUpload = async () => {
    const onPending = () => setIsLoading(true);
    const onError = (e) => {
      setIsLoading(false);
      if (typeof e !== 'string') return;
      if (e.includes('File Download')) {
        history.push('/file-download');
      }
    };
    const onSuccess = (_data) => {
      setIsLoading(false);
      toast.success('Upload successful.');
      setFileList([]);
    };

    const fileIds = fileList.map((file) => file.fileId);
    const dropboxState = dropboxRef.current?.getState();
    const body = { fileIds, submissionType, submissionId: dropboxState.submissionId };
    if (isFromCommonUpload) {
      commonUploadAction({ fileType }, body, onSuccess, onError);
    } else {
      actionTryCatchCreator(uploadFoggingScheduleService(body), onPending, onSuccess, onError);
    }
  };

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-8">
          <DropBox ref={dropboxRef} submissionType={submissionType} size="lg" fileIdList={fileList.map((file) => file.fileId)} onChange={(fileList) => setFileList(fileList)} />
          <div className="">
            {fileList.length > 0 && (
              <div>
                <button type="button" className="btn btn-pri" onClick={confirmUpload}>
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
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.UPLOAD_FILES_SCHEDULE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.UPLOAD_FILES_SCHEDULE]} />
          <div className="paddingBottom50">
            <div className="main-title">
              <h1>{WEB_ROUTES.FOGGING_AUDIT.UPLOAD_FILES_SCHEDULE.name}</h1>
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

const mapDispatchToProps = { commonUploadAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FoggingFileUpload));
