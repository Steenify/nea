import React, { useState, useCallback, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';

import TabNav from 'components/ui/tabnav';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import InPageLoading from 'components/common/inPageLoading';

import { GRAVITRAP_TASK_TYPE, SITE_PAPER_STATUS, FUNCTION_NAMES } from 'constants/index';

import { pendingApprovalDetailService } from 'services/site-paper-gravitrap-audit';
import { actionTryCatchCreator } from 'utils';

import TrapInfo from '../trapinfo';
import AuditTab from '../audit';
import ContractorTab from '../contractor-info';
import ShowCause from '../showcause';
import { initialValue } from '../helper';
import { approveRejectFindingsAction, updateShowCauseAction, managerUpdateShowCauseAction } from '../action';

const { APPROVED, REJECTED } = SITE_PAPER_STATUS;
const PendingApprovalAndShowCauseWorkFlow = ({
  data: { id },
  goBack = () => {},
  lapseLOV = [],
  approveRejectFindingsAction,
  updateShowCauseAction,
  managerUpdateShowCauseAction,
  onSuccessCallbackToGoback = () => {},
  isManager,
}) => {
  const [caseInfo, setCaseInfo] = useState();
  const [activeTab, setActiveTab] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const getDetail = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setCaseInfo(data?.sitePaperList?.[0]);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    actionTryCatchCreator(pendingApprovalDetailService({ id }), onPending, onSuccess, onError);
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const validate = ({
    // isSubmit = false,
    // status = '',
    showcauseRemarks = '',
    managerShowcauseRemarks = '',
    showcause = '',
    teamLead = '',
    auditor = '',
    isApprove = '',
    approveRemarks = '',
    managerShowCause = '',
    auditRepotType = '',
    // isDraft = true,
  }) => {
    const isFinal = isManager ? auditor.length * teamLead.length > 0 : false;
    let errorCount = 0;
    const errors = {};
    const isPaperType = auditRepotType.toUpperCase() === GRAVITRAP_TASK_TYPE.PAPER;
    if (isPaperType) {
      if (isManager) {
        if (managerShowCause === '') {
          errors.managerShowCause = 'Required';
          errorCount += 1;
        }
        if (managerShowCause === false) {
          if (!managerShowcauseRemarks) {
            errors.managerShowcauseRemarks = 'Required';
            errorCount += 1;
          }
        }
        if (errorCount) {
          errors.errorCount = errorCount;
          errors.errorHint = `There are ${errorCount} missing required fields in Show Cause tab.`;
        }
      } else {
        if (showcause === '') {
          errors.showcause = 'Required';
          errorCount += 1;
        }
        if (showcause === false) {
          if (!showcauseRemarks) {
            errors.showcauseRemarks = 'Required';
            errorCount += 1;
          }
        }
        if (errorCount) {
          errors.errorCount = errorCount;
          errors.errorHint = `There are ${errorCount} missing required fields in Show Cause tab.`;
        }
      }
    } else if (isApprove === false) {
      if (!approveRemarks) {
        errors.approveRemarks = 'Required';
        errorCount += 1;
        errors.errorCount = 1;
        errors.errorHint = `There is ${1} missing field in Audit tab.`;
      }
    } else if (isFinal) {
      if (managerShowCause === '') {
        errors.managerShowCause = 'Required';
        errorCount += 1;
      }
      if (managerShowCause === false) {
        if (!managerShowcauseRemarks) {
          errors.managerShowcauseRemarks = 'Required';
          errorCount += 1;
        }
      }
      if (errorCount) {
        errors.errorCount = errorCount;
        errors.errorHint = `There are ${errorCount} missing required fields in Show Cause tab.`;
      }
    } else if (isApprove === '') {
      errors.errorCount = 1;
      errors.errorHint = 'Approve Audit Information is mandatory filed';
    } else if (isManager) {
      if (managerShowCause === '') {
        errors.managerShowCause = 'Required';
        errorCount += 1;
      }
      if (managerShowCause === false) {
        if (!managerShowcauseRemarks) {
          errors.managerShowcauseRemarks = 'Required';
          errorCount += 1;
        }
      }
      if (errorCount) {
        errors.errorCount = errorCount;
        errors.errorHint = `There are ${errorCount} missing required fields in Show Cause tab.`;
      }
    } else {
      if (showcause === '') {
        errors.showcause = 'Required';
        errorCount += 1;
      }
      if (showcause === false) {
        if (!showcauseRemarks) {
          errors.showcauseRemarks = 'Required';
          errorCount += 1;
        }
      }
      if (errorCount) {
        errors.errorCount = errorCount;
        errors.errorHint = `There are ${errorCount} missing required fields in Show Cause tab.`;
      }
    }
    return errors;
  };

  const onSubmit = async (
    {
      // isSubmit = false,
      // status = '',
      showcauseRemarks = '',
      managerShowcauseRemarks = '',
      showcause = '',
      teamLead = '',
      auditor = '',
      id = '',
      // reviewerRemarks = '',
      isApprove = '',
      approveRemarks = '',
      auditRepotType = '',
      isDraft = true,
      managerShowCause = '',
    },
    { setSubmitting, resetForm },
  ) => {
    setSubmitting(false);
    const isFinal = auditor.length * teamLead.length > 0;
    const inputStatus = isDraft ? { inputStatus: 'draft', reviewerRemarks: approveRemarks, status: isApprove ? APPROVED : REJECTED, isApprove } : { reviewerRemarks: approveRemarks };
    const isPaperType = auditRepotType.toUpperCase() === GRAVITRAP_TASK_TYPE.PAPER;
    if (isApprove === false && !isDraft) {
      approveRejectFindingsAction({ status: REJECTED, reviewerRemarks: approveRemarks, id }, () => {
        onSuccessCallbackToGoback('Reject', resetForm);
      });
    } else {
      if ((!isFinal || !isManager) && !isDraft && !isPaperType) {
        await approveRejectFindingsAction({ status: APPROVED, reviewerRemarks: approveRemarks, id });
      }
      const callback = () => onSuccessCallbackToGoback(isDraft ? 'Save' : 'Submit', isDraft ? null : resetForm);

      if (isManager && (isFinal || isPaperType)) {
        managerUpdateShowCauseAction(
          {
            id,
            managerShowcauseRemarks,
            showcause: managerShowCause,
            status: APPROVED,
            ...inputStatus,
          },
          callback,
        );
      } else if (isManager) {
        managerUpdateShowCauseAction(
          {
            id,
            managerShowcauseRemarks,
            showcause: managerShowCause,
            status: APPROVED,
            ...inputStatus,
          },
          callback,
        );
      } else {
        updateShowCauseAction(
          {
            id,
            showcauseRemarks,
            showcause,
            status: APPROVED,
            ...inputStatus,
          },
          callback,
        );
      }
    }
  };

  const initialValues = initialValue(caseInfo);
  return (
    <>
      {caseInfo && (
        <Formik
          // enableReinitialize
          initialValues={{ ...initialValues, approveRemarks: initialValues?.reviewerRemarks || '' }}
          validate={validate}
          onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue }) => {
            const { auditRepotType = '', auditor = '', teamLead = '', displayTaskId = '', isApprove, displayLapse = '' } = values;
            const isPaperType = auditRepotType === GRAVITRAP_TASK_TYPE.PAPER;
            const showSC = isApprove === true;
            const isFinal = auditor.length * teamLead.length > 0;
            const menu = showSC ? ['Trap Info', 'Contractor’s Maintenance Info', 'Audit', 'Show Cause'] : ['Trap Info', 'Contractor’s Maintenance Info', 'Audit'];

            return (
              <Form>
                <div className="go-back">
                  <span onClick={() => goBack()}>
                    Task Id: {displayTaskId}
                    {isPaperType && displayLapse ? `, ${displayLapse}` : ''}
                  </span>
                  <>
                    <button type="submit" className="btn btn-pri float-right" disabled={isSubmitting} onClick={() => setFieldValue('isDraft', false, false)}>
                      Submit
                    </button>
                    {/* {(showSC || isPaperType) && ( */}
                    <button type="submit" className="btn btn-sec float-right mr-3" disabled={isSubmitting} onClick={() => setFieldValue('isDraft', true, false)}>
                      Save
                    </button>
                    {/* )} */}
                  </>
                </div>
                <div className="tabsContainer">
                  <SubmitErrorMessage />
                  {isPaperType ? (
                    <>
                      <TabContent>
                        <TrapInfo header="Trap Information" />
                        <ShowCause isFinal={isManager} isEditable />
                      </TabContent>
                    </>
                  ) : (
                    <>
                      <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={menu} />
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="0">
                          <TrapInfo />
                        </TabPane>
                        <TabPane tabId="1">
                          <ContractorTab />
                        </TabPane>
                        <TabPane tabId="2">
                          <AuditTab lapseLOV={lapseLOV} canShowApprove canEditApprove={isManager ? !isFinal : true} />
                        </TabPane>
                        <TabPane tabId="3">
                          <ShowCause isFinal={isManager ? isFinal : false} isEditable />
                        </TabPane>
                      </TabContent>
                    </>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      )}

      <InPageLoading isLoading={isLoading} />
    </>
  );
};
const mapStateToProps = ({ global }) => {
  const functionNames = global?.data?.functionNameList || [];
  const isManager = functionNames.includes(FUNCTION_NAMES.updateShowcauseResubmission);
  return { isManager };
};

const mapDispatchToProps = {
  approveRejectFindingsAction,
  updateShowCauseAction,
  managerUpdateShowCauseAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PendingApprovalAndShowCauseWorkFlow);
