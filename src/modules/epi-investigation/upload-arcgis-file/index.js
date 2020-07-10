import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import Select from 'components/common/select';
import DropBox from 'components/common/dropbox';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { SUBMISSION_TYPE, WEB_ROUTES } from 'constants/index';
import CustomModal from 'components/common/modal';
import { commonUploadAction } from 'modules/non-functional/common-upload/action';

import { caseUploadAction } from './action';

const UploadArcGRISFile = (props) => {
  const {
    history: { push },
    getMastercodeAction,
    caseUploadAction,
    caseLOV,
    ui: { isLoading },
    commonUploadAction,
    isFromCommonUpload,
    fileType,
  } = props;

  const dropZoneRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const onConfirm = async () => {
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
    const caseUploadVOs = fileList.map(({ fileId, selectedType }) => ({ fileId, fileType: selectedType?.value || '' }));
    const onSuccess = () => {
      setFileList([]);
      toast.success('Upload successful.');
    };
    const onError = (errorMsg) => {
      const msg = errorMsg || '';
      if (msg?.includes?.('File Download')) {
        setFileList([]);
        push(WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES.url);
      }
    };
    if (isFromCommonUpload) {
      commonUploadAction({ fileType }, { caseUploadVOs }, onSuccess, onError);
    } else {
      caseUploadAction({ caseUploadVOs }, onSuccess, onError);
    }
  };

  useEffect(() => {
    document.title = 'NEA | Upload Files';
    getMastercodeAction([MASTER_CODE.CASE_TYPE]);
  }, [getMastercodeAction]);

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-8">
          <DropBox
            ref={dropZoneRef}
            submissionType={SUBMISSION_TYPE.EPI_CASE}
            size="lg"
            fileIdList={fileList.map((file) => file.fileId)}
            onChange={(fileList) => {
              setFileList(
                fileList.map((file) => ({
                  ...file,
                  selectedType: caseLOV[0] || null,
                })),
              );
            }}
            extractViewsClassName="d-flex align-items-center"
            extractViews={(_file, index) => {
              const { selectedType } = fileList[index];
              return (
                <>
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
          <NewBreadCrumb page={[WEB_ROUTES.EPI_INVESTIGATION, WEB_ROUTES.EPI_INVESTIGATION.UPLOAD_ARCGIS_FILE]} />
          <div className="paddingBottom50">
            <div className="main-title">
              <h1>File Upload</h1>
            </div>
            {UploadForm}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, epiInvestigationReducers: { uploadFile } }, ownProps) => {
  const masterCodes = global?.data?.masterCodes || {};
  const caseLOV = masterCodes[MASTER_CODE.CASE_TYPE] || [];
  return {
    ...ownProps,
    ...uploadFile,

    caseLOV,
  };
};

const mapDispatchToProps = { getMastercodeAction, caseUploadAction, commonUploadAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadArcGRISFile));
