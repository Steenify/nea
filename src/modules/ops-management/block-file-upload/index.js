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
import InPageLoading from 'components/common/inPageLoading';

import { commonUploadAction } from 'modules/non-functional/common-upload/action';

const BlockFileUpload = (props) => {
  const {
    history,
    // * use for Common Upload
    isFromCommonUpload,
    fileType,
    commonUploadAction,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const submissionType = SUBMISSION_TYPE.OPS_BF;

  const [uploadFileIds, setUploadFileIds] = useState([]);

  const onConfirm = async () => {
    const params = { fileId: uploadFileIds[0] };
    // const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      setIsLoading(false);
      setUploadFileIds([]);
      toast.success('Upload successful.');
    };
    const onError = (errorMsg) => {
      setIsLoading(false);
      const msg = errorMsg || '';
      if (msg.includes && msg.includes('File Download')) {
        setUploadFileIds([]);
        history.push(WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES.url);
      }
    };
    if (isFromCommonUpload) {
      commonUploadAction({ fileType }, params, onSuccess, onError);
    }
  };

  useEffect(() => {
    setUploadFileIds([]);
  }, [fileType]);

  useEffect(() => {
    document.title = 'NEA | Block File Upload';
  }, []);

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-12">
          <DropBox submissionType={submissionType} fileIdList={uploadFileIds} maxQuantity={1} multiple={false} onChange={(fileList) => setUploadFileIds(fileList.map((file) => file.fileId))} />
          <div className="">
            {uploadFileIds.length > 0 && (
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
              <label className="font-weight-bold mr-3">Upload File</label>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BlockFileUpload));
