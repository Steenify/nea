import React, { useState, useCallback, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';

import TabNav from 'components/ui/tabnav';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import InPageLoading from 'components/common/inPageLoading';

import { SITE_PAPER_STATUS, GRAVITRAP_TASK_TYPE } from 'constants/index';
import { pendingResubmissionDetailService } from 'services/site-paper-gravitrap-audit';
import { actionTryCatchCreator, formikValidate } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

import TrapInfo from '../trapinfo';
import AuditTab from '../audit';
import ContractorTab from '../contractor-info';
import { resubmissionAction } from '../action';
import { lapseArrToObj, initialValue } from '../helper';

const PendingApprovalAndShowCauseWorkFlow = ({ data: { id }, goBack = () => {}, lapseLOV = [], resubmissionAction, onSuccessCallbackToGoback = () => {} }) => {
  const [caseInfo, setCaseInfo] = useState({});
  const [activeTab, setActiveTab] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = initialValue(caseInfo);

  const getDetail = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setCaseInfo(data?.sitePaperList?.[0]);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    actionTryCatchCreator(pendingResubmissionDetailService({ id }), onPending, onSuccess, onError);
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const validate = ({ _isSubmit = false, _status = '', _id = '', recommendedLocationchange = false, _recommendedLocation = '', _ifosRemarks = '', resubmissionRemarks = '', findingLapses = [] }) => {
    const required = 'Required';
    let errorCount = 0;
    const errors = {};
    let missingLapse = false;

    if (!recommendedLocationchange) {
      errors.recommendedLocationchange = required;
      errorCount += 1;
    }
    if ((recommendedLocationchange === true || recommendedLocationchange === 'Yes') && !resubmissionRemarks) {
      errors.resubmissionRemarks = required;
      errorCount += 1;
    }
    if (!findingLapses?.length) {
      missingLapse = true;
      errorCount += 1;
    } else {
      const findingLapsesErrors = [];
      findingLapses.forEach((lapse) => {
        const lapseErrors = {};
        if (lapse.lapseCode === 'MS') {
          const lapseDescError = formikValidate(lapse.lapseDesc, ['required', 'positive']);
          if (lapseDescError) {
            errorCount += 1;
            lapseErrors.lapseDesc = lapseDescError;
          }
        }
        findingLapsesErrors.push(lapseErrors);
      });
      errors.findingLapses = findingLapsesErrors;
    }

    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields in Audit tab. ${missingLapse ? ' Lapses Observed is mandatory.' : ''}`;
      return errors;
    }
    return {};
  };

  const onSubmit = (
    { id = '', recommendedLocationchange = false, recommendedLocation = '', ifosRemarks = '', auditFindingsFileList = [], resubmissionRemarks = '', findingLapses = [], isDraft = true },
    { setSubmitting, resetForm },
  ) => {
    const inputStatus = isDraft ? 'draft' : undefined;

    const status = SITE_PAPER_STATUS.RE_SUBMITTED;
    const param = isDraft
      ? {
          id,
          recommendedLocationchange,
          recommendedLocation,
          resubmissionRemarks,
          ifosRemarks,
          inputStatus,
          auditFindingsFileList,
          ...lapseArrToObj(findingLapses),
        }
      : {
          id,
          recommendedLocationchange,
          recommendedLocation,
          resubmissionRemarks,
          ifosRemarks,
          auditFindingsFileList,
          status,
          ...lapseArrToObj(findingLapses),
        };
    resubmissionAction(param, () => onSuccessCallbackToGoback(isDraft ? 'Save' : 'Submit', isDraft ? null : resetForm));
    setSubmitting(false);
  };

  return (
    <>
      <Formik enableReinitialize initialValues={{ ...initialValues }} validate={validate} onSubmit={onSubmit}>
        {({
          values: {
            // status = '', id = '',
            displayTaskId = '',
            displayLapse = '',
            auditRepotType = '',
          },
          isSubmitting,
          setFieldValue,
        }) => {
          const isPaperType = auditRepotType === GRAVITRAP_TASK_TYPE.PAPER;
          const menu = ['Trap Info', 'Contractor’s Maintenance Info', 'Audit'];
          return (
            <Form>
              <GoBackButton onClick={() => goBack()} title={`Task Id: ${displayTaskId} ${isPaperType && displayLapse ? `, ${displayLapse}` : ''}`}>
                <>
                  <button type="submit" className="btn btn-pri float-right" disabled={isSubmitting} onClick={() => setFieldValue('isDraft', false, false)}>
                    Submit
                  </button>
                  <button type="submit" className="btn btn-sec float-right mr-3" disabled={isSubmitting} onClick={() => setFieldValue('isDraft', true, false)}>
                    Save
                  </button>
                </>
              </GoBackButton>
              <div className="tabsContainer">
                <SubmitErrorMessage />
                <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={menu} />
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="0">
                    <TrapInfo />
                  </TabPane>
                  <TabPane tabId="1">
                    <ContractorTab />
                  </TabPane>
                  <TabPane tabId="2">
                    <AuditTab lapseLOV={lapseLOV} isResubmission canEditFindings />
                  </TabPane>
                </TabContent>
              </div>
            </Form>
          );
        }}
      </Formik>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (_reducer, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = { resubmissionAction };

export default connect(mapStateToProps, mapDispatchToProps)(PendingApprovalAndShowCauseWorkFlow);
