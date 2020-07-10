import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import CustomModal from 'components/common/modal';

import { WEB_ROUTES } from 'constants/index';
import SubmissionInfo from 'components/pages/rodent-audit/submission-info';
import Overview from 'components/pages/rodent-audit/overview';
import Assignment from 'components/pages/rodent-audit/assignment';
import ContractorFindings from 'components/pages/rodent-audit/contractor-findings';
import ContractorCorrespondence from 'components/pages/rodent-audit/contractor-correspondence';
import Audit from 'components/pages/rodent-audit/audit';
import ShowCauseRecommendation from 'components/pages/rodent-audit/show-cause-recommendation';

import { getAuditTaskDetailService, submitContractorCorrespondenceService, supportLDService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

const PendingContractorExplanationDetail = (props) => {
  const {
    history,
    location: { state },
    getMastercodeAction,
    masterCodes,
  } = props;

  const taskId = state?.auditId || state?.id;
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [contractorCorrespondanceVO, setContractorCorrespondanceVO] = useState();
  const isLateSubmissionTask = detail?.submissionInfoVO;
  const tabNavMenu = isLateSubmissionTask
    ? [
        {
          title: 'Submission Info',
          component: (
            <>
              <SubmissionInfo submissionInfo={detail?.submissionInfoVO} />
              {detail?.submissionInfoVO?.taskAssignments && <Assignment assignments={detail?.submissionInfoVO?.taskAssignments} />}
            </>
          ),
        },
        { title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={contractorCorrespondanceVO} action={state?.action} isLateSubmissionTask /> },
      ]
    : [
        {
          title: 'Overview',
          component: (
            <>
              <Overview type={state?.taskType} taskOverview={detail?.overviewResponseVO} />
              {detail?.overviewResponseVO?.taskAssignments && <Assignment assignments={detail?.overviewResponseVO?.taskAssignments} />}
            </>
          ),
        },
        { title: "Contractor's Findings", component: <ContractorFindings type={state?.taskType} contractorsFindings={detail?.contractorFindingResponseVO} /> },
        { title: 'Audit', component: <Audit type={state?.taskType} audit={detail?.auditDetailResponseVO} /> },
        { title: 'Show Cause Recommendation', component: <ShowCauseRecommendation type={state?.taskType} showCause={detail?.recommendationResponseVO} /> },
        { title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={contractorCorrespondanceVO} action={state?.action} /> },
      ];

  const [activeTabNav, toggleTabNav] = useState('0');

  const getDetailAction = useCallback(() => {
    const params = { id: taskId, vcs2TaskType: state?.taskType };
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data.detailListing);

      setIsLoading(false);

      const con = data.detailListing?.contractorCorrespondanceVO || {};

      if (con && con.contractorVO) {
        con.contractorVO.fileId = (con?.contractorVO?.files || []).map((file) => file.fileId);
      }

      if (con && con.seniorManagerVO) {
        con.seniorManagerVO.fileId = (con?.seniorManagerVO?.files || []).map((file) => file.fileId);
      }

      if (con && con.lapses) {
        const lapses = (masterCodes[MASTER_CODE.LAPSE_TYPE] || []).filter((type) => con.lapses.includes(type.label));

        con.lapses = lapses.map((l) => l.value);
      }

      setContractorCorrespondanceVO(con);
    };
    const onError = () => setIsLoading(false);
    if (taskId && masterCodes[MASTER_CODE.LAPSE_TYPE]) {
      actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
    }
  }, [masterCodes, taskId, state]);

  useEffect(() => {
    getMastercodeAction([MASTER_CODE.LAPSE_TYPE]);
  }, [getMastercodeAction]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.SHOW_CAUSE_DETAIL.name}`;
    getDetailAction();
  }, [getDetailAction]);

  const onSubmit = (values, actions) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      setIsLoading(false);
      toast.success('LD Amount submitted for approval.');
      actions.resetForm();
      history.goBack();
    };
    const onError = () => setIsLoading(false);
    const params = values.acceptExplanation ? { ...values, burrowCount: undefined, lapses: undefined } : values;
    actionTryCatchCreator(submitContractorCorrespondenceService(params), onPending, onSuccess, onError);

    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {
      contractorVO: {},
      seniorManagerVO: {},
    };
    let errorCount = 0;
    if (!values.contractorVO.remarks) {
      errors.contractorVO.remarks = '(Required)';
      errorCount += 1;
    }
    if (!values.contractorVO.fileId || values.contractorVO.fileId.length === 0) {
      errors.contractorVO.fileId = '(Required)';
      errorCount += 1;
    }
    if (!values.acceptExplanation) {
      if (!values.seniorManagerVO.remarks) {
        errors.seniorManagerVO.remarks = '(Required)';
        errorCount += 1;
      }
      if (!values.seniorManagerVO.fileId || values.seniorManagerVO.fileId.length === 0) {
        errors.seniorManagerVO.fileId = '(Required)';
        errorCount += 1;
      }
      if (!values.burrowCount) {
        // errors.burrowCount = 'Required';
        // errorCount += 1;
      } else if (isNaN(values.burrowCount)) {
        errors.burrowCount = 'Must be a number';
        errorCount += 1;
      } else if (values.burrowCount < 0) {
        errors.burrowCount = 'Must be equal or greater than 0';
        errorCount += 1;
      }
      if (!values.lapses || values.lapses.length === 0) {
        errors.lapses = '(Required)';
        errorCount += 1;
      } else {
        const lapses = [];
        let lapseErrorCount = 0;
        values.lapses.forEach((lapse) => {
          if (lapse) {
            lapses.push(undefined);
          } else {
            lapses.push('(Required)');
            lapseErrorCount += 1;
          }
        });

        if (lapseErrorCount > 0) {
          errors.lapses = lapses;
          errorCount += lapseErrorCount;
        }
      }
    }
    if ((values.lapses || []).includes('RD_BCD') && values.burrowCount < 1) {
      errors.burrowCount = 'Must be greater than 0';
      errorCount += 1;
    }
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields Contractor's Correspondence tab.`;
      return errors;
    }
    return {};
  };

  const initialValues = {
    taskId,
    contractorVO: {
      fileId: [],
      remarks: '',
    },
    seniorManagerVO: {
      fileId: [],
      remarks: '',
    },
    burrowCount: 0,
    acceptExplanation: false,
    lapses: [''],
    remarks: '',
    saveMode: 'submit',
    ...contractorCorrespondanceVO,
  };

  const [modalState, setModalState] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState();
  const rejectLDAction = () => {
    actionTryCatchCreator(
      supportLDService({ taskIds: [state?.id], remarks: rejectionRemark, support: false }),
      () => setIsLoading(true),
      () => {
        setModalState({ open: false });
        setRejectionRemark(undefined);
        setIsLoading(false);
        history.goBack();
      },
      () => setIsLoading(false),
    );
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.PENDING_CONTRACTOR_EXPLANATION_DETAIL]} />
          {contractorCorrespondanceVO && (
            <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
              {({ dirty }) => (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <GoBackButton onClick={() => history.goBack()} title={`Task ID: ${state?.taskId}`}>
                    {state?.action !== 'reject' && (
                      <div className="ml-auto">
                        <button type="submit" className="btn btn-pri">
                          Submit
                        </button>
                      </div>
                    )}
                    {state?.action === 'reject' && (
                      <div className="ml-auto">
                        <button type="button" className="btn btn-sec" onClick={() => setModalState({ open: true, type: 'reject' })}>
                          Reject
                        </button>
                      </div>
                    )}
                  </GoBackButton>

                  {detail && (
                    <nav className="tab__main">
                      <div className="tabsContainer">
                        <FormikSubmitErrorMessage />
                        <div>
                          <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu.map((item) => item.title)} />
                          <TabContent activeTab={activeTabNav}>
                            {tabNavMenu.map((menu, index) => (
                              <TabPane key={`audit_task_detail_tabs_${index + 1}`} tabId={`${index}`}>
                                {menu.component}
                              </TabPane>
                            ))}
                          </TabContent>
                        </div>
                      </div>
                    </nav>
                  )}
                </Form>
              )}
            </Formik>
          )}

          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            headerTitle="Remarks for Rejection"
            confirmTitle="Reject"
            cancelTitle="Cancel"
            isOpen={modalState.open && modalState.type === 'reject'}
            onConfirm={() => {
              if (!rejectionRemark) {
                toast.error('Please enter Remarks for Rejection');
                return;
              }
              rejectLDAction();
            }}
            onCancel={() => {
              setModalState({ open: false });
              setRejectionRemark(undefined);
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
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PendingContractorExplanationDetail);
