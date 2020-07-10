import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Select from 'components/common/select';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import BreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { SUBMISSION_TYPE, WEB_ROUTES } from 'constants/index';

import { toast } from 'react-toastify';
import { commonUploadAction } from 'modules/non-functional/common-upload/action';
import { caseUploadAction } from './action';

const UploadAuditFindings = (props) => {
  const {
    history: { push },
    getMastercodeAction,
    caseUploadAction,
    caseLOV,
    ui: { isLoading },
    // * use for Common Upload
    isFromCommonUpload,
    fileType,
    commonUploadAction,
  } = props;

  const dropZoneRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const onConfirm = async () => {
    const onSuccess = () => {
      setFileList([]);
      toast.success('Upload successful.');
    };
    const onError = (errorMsg) => {
      const msg = errorMsg || '';
      if (typeof msg !== 'string') return;
      if (msg.includes('File Download')) {
        setFileList([]);
        push(WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES.url);
      }
    };
    if (isFromCommonUpload) {
      const uploadVOs = fileList.map(({ fileId, selectedType }) => ({ fileId, fileType: selectedType?.value }));
      commonUploadAction({ fileType }, { uploadVOs }, onSuccess, onError);
    } else {
      const check =
        fileList.filter(({ selectedType }) => {
          if (selectedType?.value) {
            return false;
          }
          return true;
        }).length > 0;
      if (check) {
        toast.error('Please select type for all files.');
        return;
      }
      const uploadVOs = fileList.map(({ fileId, selectedType }) => ({ fileId, fileType: selectedType?.value }));

      caseUploadAction({ uploadVOs }, onSuccess, onError);
    }
  };

  useEffect(() => {
    document.title = 'NEA | Upload File';
    getMastercodeAction([MASTER_CODE.SITE_PAPER_FILE_TYPE]);
  }, [getMastercodeAction]);

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-8">
          <DropBox
            ref={dropZoneRef}
            submissionType={SUBMISSION_TYPE.SITE_FINDINGS}
            size="lg"
            extractViewsClassName="d-flex align-items-center"
            fileIdList={fileList.map((file) => file.fileId)}
            onChange={(fileList) => {
              setFileList(
                fileList.map((file) => ({
                  ...file,
                  selectedType: !isFromCommonUpload || fileType === 'AF' ? caseLOV[0] || null : undefined,
                })),
              );
            }}
            extractViews={(_file, index) => {
              const { selectedType } = fileList[index];
              return (
                <>
                  {(!isFromCommonUpload || fileType === 'AF') && (
                    <Select
                      className="wf-400 ml-auto"
                      options={caseLOV}
                      onChange={(selectedType) => {
                        setFileList(
                          fileList.map((item, i) => {
                            if (index === i) {
                              return { ...item, selectedType };
                            }
                            return item;
                          }),
                        );
                      }}
                      value={selectedType}
                    />
                  )}
                </>
              );
            }}
          />
          <div className="">
            {fileList.length > 0 && (
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
      <CustomModal isOpen={isShowModal} type="system-modal" headerTitle="Upload Successful" onCancel={() => setIsShowModal(false)} confirmTitle="OK" onConfirm={() => setIsShowModal(false)} />
    </div>
  );

  if (isFromCommonUpload) return UploadForm;
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Upload Files" />
        <div className="contentWrapper">
          <BreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOADED_FILES]} />
          <div className="paddingBottom50">
            <div className="main-title">
              <h1>Upload Files</h1>
            </div>
            {UploadForm}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, ehiGravitrapAuditReducers: { uploadFile } }, ownProps) => {
  const masterCodes = global?.data?.masterCodes || {};
  const caseLOV = masterCodes[MASTER_CODE.SITE_PAPER_FILE_TYPE] || [];
  return {
    ...ownProps,
    ...uploadFile,
    caseLOV,
  };
};

const mapDispatchToProps = { getMastercodeAction, caseUploadAction, commonUploadAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadAuditFindings));
