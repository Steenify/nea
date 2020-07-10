/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import { Formik, Form } from 'formik';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import CustomModal from 'components/common/modal';
import { EHI_STATUS, WEB_ROUTES } from 'constants/index';
import { toast } from 'react-toastify';

import TrapInfo from './trapinfo';
import Specimen from './specimen';
import ShowCause from './showcause';
import AdHoc, { adhocValidation } from './adhoc';

import { getCaseDetailAction, submitTaskAction, concurAssessmentAction, rejectAction, saveTaskAction, submitAdHocTaskAction, resetReducerAction } from './action';
import { validate } from './helper';
import './style.scss';

const TaskDetail = ({
  location: { state },
  history: { goBack },
  ui: { isLoading },
  data: { caseDetail },
  resetReducerAction,
  getCaseDetailAction,
  getMastercodeAction,
  submitTaskAction,
  concurAssessmentAction,
  rejectAction,
  saveTaskAction,
  submitAdHocTaskAction,
  masterCodes,
}) => {
  const [activeTab, setActiveTab] = useState('0');
  const [modal, setModal] = useState({ isShow: false, action: '', onConfirm: () => {} });
  const [confirmModal, setConfirmModal] = useState({ isShow: false, onConfirm: () => {}, isSave: false });
  const [showRejectRemark, toggleShowRejectRemark] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');
  const caseId = state?.caseId || '';
  const isSC = caseDetail?.status === EHI_STATUS.SHOW_CAUSE;
  const isConcur = state?.isConcur || false;
  const isSupport = state?.isSupport || false;
  const isAdHoc = state?.taskType === 'ADHOC';

  const menu = ['Trap Info', 'Specimen Identification', 'Show Cause'];

  useEffect(() => {
    getCaseDetailAction(caseId);
    getMastercodeAction([MASTER_CODE.GRAVITRAP_AUDIT_SPECIMEN, MASTER_CODE.INITIAL_LAPSE, MASTER_CODE.FINAL_LAPSE], [MASTER_CODE.GRAVITRAP_AUDIT_SPECIMEN]);
    return resetReducerAction;
  }, [caseId, getCaseDetailAction, getMastercodeAction, resetReducerAction]);

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const {
      isSubmit,
      taskId,
      findingsFileList,
      analystSpeciesList,
      analystBottleCount,
      analystSpecimenCount,
      analystFindingsRemarks,
      analystInitialLapse,
      analystFinalLapse,
      showCause,
      showCauseRemarks,
      showcaseFileList,
      concurStatus,
      managerRemarks,
      managerLapse,
    } = values;

    const onConfirm = () => {
      resetForm();
      setTimeout(() => {
        goBack();
      }, 300);
    };

    setSubmitting(false);

    if (isSupport) {
      toggleShowRejectRemark(true);
      setSubmitting(false);
      return;
    }

    if (isAdHoc) {
      const { lapseInfoVO } = values;
      const updatedLapse = {
        ...lapseInfoVO,
        ehiLapseFileList: lapseInfoVO?.ehiLapseFileList?.map(({ fileId }) => fileId) || [],
      };
      const params = { taskId: caseId, updatedLapse };
      if (isSubmit) {
        setConfirmModal({
          isShow: true,
          isSave: !isSubmit,
          onConfirm: () =>
            submitAdHocTaskAction(params, isSubmit, () => {
              setModal({ isShow: true, action: `${isSubmit ? 'Submit' : 'Save'}`, onConfirm });
            }),
        });
      } else {
        submitAdHocTaskAction(params, isSubmit, () => {
          setModal({ isShow: true, action: `${isSubmit ? 'Submit' : 'Save'}`, onConfirm });
        });
      }
      return;
    }

    if (isConcur) {
      const param = {
        caseId: taskId || caseId,
        concurStatus: concurStatus ? 'Yes' : 'No',
        managerRemarks,
        managerLapses: concurStatus ? undefined : managerLapse,
      };
      if (isSubmit) {
        setConfirmModal({
          isShow: true,
          isSave: !isSubmit,
          onConfirm: () =>
            concurAssessmentAction(param, isSubmit, () => {
              setModal({ isShow: true, action: `${isSubmit ? 'Submit' : 'Save'} Concur`, onConfirm });
            }),
        });
      } else {
        concurAssessmentAction(param, isSubmit, () => {
          setModal({ isShow: true, action: `${isSubmit ? 'Submit' : 'Save'} Concur`, onConfirm });
        });
      }
    } else {
      let param = {};
      if (isSC) {
        param = {
          caseId: taskId || caseId,
          finalLapses: analystFinalLapse,
          showCauseFileList: showcaseFileList.map(({ fileId }) => fileId),
        };
      } else {
        param = {
          caseId: taskId || caseId,
          bottlesCount: analystBottleCount,
          specimenCount: analystSpecimenCount,
          speciesList: analystSpeciesList.map((item) => ({ ...item, id: undefined })),
          showCause: showCause ? 'Yes' : 'No',
          showCauseRemarks,
          findingsFileList: findingsFileList.map(({ fileId }) => fileId),
          analystFindingsRemarks,
          initialLapses: analystInitialLapse,
        };
      }
      if (isSubmit) {
        setConfirmModal({
          isShow: true,
          isSave: false,
          onConfirm: () =>
            submitTaskAction(param, () => {
              setModal({ isShow: true, action: 'Submit', onConfirm });
            }),
        });
      } else {
        saveTaskAction(param, () => {
          setModal({ isShow: true, action: 'Save as Draft', onConfirm });
        });
      }
    }
  };

  const specimenLOV = masterCodes[MASTER_CODE.GRAVITRAP_AUDIT_SPECIMEN] || [];
  const initialLapseLOV = masterCodes[MASTER_CODE.INITIAL_LAPSE] || [];
  const finalLapseLOV = masterCodes[MASTER_CODE.FINAL_LAPSE] || [];

  // const initialValues = { ...initialCaseDetail, ...caseDetail };
  return (
    <Formik enableReinitialize initialValues={{ ...caseDetail, isConcur, isSC, isSupport }} validate={isAdHoc ? adhocValidation : validate} onSubmit={onSubmit}>
      {({ values, isSubmitting, setFieldValue, dirty, resetForm }) => (
        <>
          <PromptOnLeave dirty={dirty} />
          <Header />
          <div className="main-content">
            <NavBar active="My Workspace" />
            <div className="contentWrapper">
              <NewBreadCrumb page={[WEB_ROUTES.MY_WORKSPACE]} />
              <Form>
                <div className="go-back">
                  <span onClick={() => goBack()}>Task Id: {caseId}</span>
                  <>
                    <button type="submit" className="btn btn-pri float-right" disabled={isSubmitting} onClick={() => setFieldValue('isSubmit', true, false)}>
                      {isSupport ? 'Reject' : 'Submit'}
                    </button>
                    {!isSupport && (
                      <button type="submit" className="btn btn-sec mr-3 float-right" disabled={isSubmitting} onClick={() => setFieldValue('isSubmit', false, false)}>
                        Save as draft
                      </button>
                    )}
                  </>
                </div>
                <div className="tabsContainer">
                  <SubmitErrorMessage />
                  {isAdHoc ? (
                    <AdHoc />
                  ) : (
                    <>
                      <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={menu} />
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="0">
                          <TrapInfo values={values} />
                        </TabPane>
                        <TabPane tabId="1">
                          <Specimen isSC={isConcur || isSC || isSupport} specimenLOV={specimenLOV} />
                        </TabPane>
                        <TabPane tabId="2">
                          <ShowCause isSC={isSC} isConcur={isConcur || isSupport} isSupport={isSupport} initialLapseLOV={initialLapseLOV} finalLapseLOV={finalLapseLOV} />
                        </TabPane>
                      </TabContent>
                    </>
                  )}
                </div>
                <InPageLoading isLoading={isLoading} />
                <Footer />
                <CustomModal isOpen={modal.isShow} type="system-modal" headerTitle={`${modal.action} Successfully`} confirmTitle="OK" onConfirm={modal.onConfirm} />
                <CustomModal
                  isOpen={confirmModal.isShow}
                  type="system-modal"
                  headerTitle="Confirmation"
                  content="Please check that all the fields are correctly entered"
                  cancelTitle="Cancel"
                  confirmTitle={confirmModal.isSave ? 'Save' : 'Submit'}
                  onCancel={() => setConfirmModal({ isShow: false, onConfirm: () => {} })}
                  onConfirm={() => {
                    setConfirmModal({ isShow: false, onConfirm: () => {} });
                    confirmModal.onConfirm && confirmModal.onConfirm();
                  }}
                />
                <CustomModal
                  headerTitle="Remarks for Rejection"
                  confirmTitle="Reject"
                  cancelTitle="Cancel"
                  isOpen={showRejectRemark}
                  onConfirm={() => {
                    if (!rejectionRemark) {
                      toast.error('Please enter Remarks for Rejection');
                      return;
                    }
                    rejectAction({ taskIds: [values?.taskId || caseId], rejectionRemark }, () => {
                      toggleShowRejectRemark(false);
                      setRejectionRemark('');
                      setModal({
                        isShow: true,
                        action: 'Reject',
                        onConfirm: () => {
                          resetForm();
                          setTimeout(() => {
                            goBack();
                          }, 300);
                        },
                      });
                    });
                  }}
                  onCancel={() => {
                    toggleShowRejectRemark(false);
                    setRejectionRemark('');
                  }}
                  type="action-modal"
                  content={
                    <form className="form-group">
                      <div className="row paddingBottom20">
                        <div className="col-lg-12">
                          <textarea className="form-control" rows={3} onChange={(e) => setRejectionRemark(e.target.value)} />
                        </div>
                      </div>
                    </form>
                  }
                />
              </Form>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ global, ehiGravitrapAuditReducers: { caseDetail } }, ownProps) => ({
  ...ownProps,
  ...caseDetail,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getCaseDetailAction,
  getMastercodeAction,
  submitTaskAction,
  concurAssessmentAction,
  rejectAction,
  saveTaskAction,
  submitAdHocTaskAction,
  resetReducerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaskDetail));
