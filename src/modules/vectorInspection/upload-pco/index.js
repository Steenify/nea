import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import CustomModal from 'components/common/modal';
import MonthYearPicker from 'components/common/monthYearPicker';
import DropBox from 'components/common/dropbox';

import { firstDayInPreviousMonth } from 'utils';
import moment from 'moment';
import { commonUploadAction } from 'modules/non-functional/common-upload/action';
import { SUBMISSION_TYPE, WEB_ROUTES } from 'constants/index';

import { pcoUploadAction } from './action';

const UploadPCO = (props) => {
  const {
    history: { push },
    pcoUploadAction,
    ui: { isLoading },
    // * use for Common Upload
    isFromCommonUpload,
    fileType,
    commonUploadAction,
  } = props;

  // const [dragging, setDragging] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const initFromDate = firstDayInPreviousMonth(new Date());
  const initToDate = new Date();

  const parentName = WEB_ROUTES.INSPECTION_MANAGEMENT.PCO_SCHEDULE.name;

  const onDateChange = (changeObj, index) => {
    setFileList(
      fileList.map((item, i) => {
        if (index === i) {
          return { ...item, ...changeObj };
        }
        return item;
      }),
    );
  };

  const onConfirm = async () => {
    const params = fileList.map(({ fileId, fromDate, toDate }) => {
      const [fromMonth, fromYear] = moment(fromDate).format('M/YYYY').split('/');
      const [toMonth, toYear] = moment(toDate).format('M/YYYY').split('/');
      return { fileId, fromMonth, fromYear, toMonth, toYear };
    });
    const onSuccess = () => {
      setFileList([]);
      // setIsShowModal(true);
      toast.success('Upload successful.');
    };
    const onError = (errorMsg) => {
      const msg = errorMsg || '';
      if (msg.includes('File Download')) {
        setFileList([]);
        push(WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES.url);
      }
    };
    if (isFromCommonUpload) {
      commonUploadAction({ fileType }, params, onSuccess, onError);
    } else {
      pcoUploadAction(params, onSuccess, onError);
    }
  };

  useEffect(() => {
    document.title = 'NEA | Upload Files';
  }, []);

  const UploadForm = (
    <div className="tabsContainer">
      <div className="row">
        <div className="col-lg-8">
          <DropBox
            submissionType={SUBMISSION_TYPE.PCO_SCHEDULE}
            size="lg"
            fileIdList={fileList.map((file) => file.fileId)}
            onChange={(fileList) => {
              setFileList(
                fileList.map((file) => ({
                  ...file,
                  fromDate: initFromDate,
                  toDate: initToDate,
                })),
              );
            }}
            extractViews={(_file, index) => {
              const { fromDate, toDate } = fileList[index];
              return (
                <>
                  <div className="ml-auto mr-3">
                    <MonthYearPicker className="ml-auto" label="From" selected={fromDate} onChange={(fromDate) => onDateChange({ fromDate }, index)} dateFormat="MMMM, yyyy" maxDate={toDate} />
                  </div>

                  <MonthYearPicker label="To" selected={toDate} onChange={(toDate) => onDateChange({ toDate }, index)} dateFormat="MMMM, yyyy" minDate={fromDate} />
                </>
              );
            }}
          />
          <div>
            {fileList.length > 0 && (
              <button type="button" className="btn btn-pri" onClick={onConfirm}>
                Confirm
              </button>
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
        <NavBar active={parentName} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.UPLOAD_PCO_SCHEDULE]} />
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

const mapStateToProps = ({ vectorInspectionReducers: { uploadPCO } }, ownProps) => ({
  ...ownProps,
  ...uploadPCO,
});

const mapDispatchToProps = {
  pcoUploadAction,
  commonUploadAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadPCO));
