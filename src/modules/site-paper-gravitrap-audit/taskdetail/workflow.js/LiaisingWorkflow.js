import React, { useState, useCallback, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';

import TabNav from 'components/ui/tabnav';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import AdHoc, { adhocValidation } from 'modules/ehi-gravitrap-audit/taskdetail/adhoc';
import GoBackButton from 'components/ui/go-back-button';
import InPageLoading from 'components/common/inPageLoading';

import { GRAVITRAP_TASK_TYPE } from 'constants/index';
import { rejectedLdDetailService, liaisingOutsourceDetailService } from 'services/site-paper-gravitrap-audit';
import { actionTryCatchCreator, formikValidate } from 'utils';

import TrapInfo from '../trapinfo';
import AuditTab from '../audit';
import ContractorTab from '../contractor-info';
import ShowCause from '../showcause';
import Correspondence from '../correspondence';
import { initialValue, initialAdHocLapse } from '../helper';
import { updateCorrespondenceAction, submitAdHocTaskAction } from '../action';

const LiaisingWorkflow = ({
  data: { id, auditRepotType },
  goBack = () => {},
  lapseLOV = [],
  finalLapseLOV = [],
  isRejected = false,
  updateCorrespondenceAction,
  submitAdHocTaskAction,
  onSuccessCallbackToGoback,
}) => {
  const [activeTab, setActiveTab] = useState('0');
  const [caseInfo, setCaseInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = initialValue(caseInfo);

  const getDetail = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setCaseInfo(data?.sitePaperList?.[0]);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    actionTryCatchCreator(isRejected ? rejectedLdDetailService({ id, auditRepotType }) : liaisingOutsourceDetailService({ id }), onPending, onSuccess, onError);
  }, [id, isRejected, auditRepotType]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const validate = (values) => {
    if (!values?.finalLapseList?.length) {
      return {
        errorCount: 1,
        errorHint: 'Lapses Observed is mandatory.',
      };
    }
    let errorCount = 0;
    const errors = [];
    values.finalLapseList.forEach((lapse) => {
      const lapseError = {};
      if (lapse.lapseCode === 'MS') {
        const countError = formikValidate(lapse.missedSampleCount, ['required', 'positive']);
        if (countError) {
          lapseError.missedSampleCount = countError;
          errorCount += 1;
        }
      }
      errors.push(lapseError);
    });
    if (errorCount > 0) {
      return {
        errorCount: 1,
        finalLapseList: errors,
        errorHint: `There are ${errorCount} missing required fields in Contractor’s Correspondence Tab. `,
      };
    }

    return {};
  };

  const onSubmit = (
    {
      isDraft = false,
      id = '',
      status = '',
      outsourcedFileList = [],
      seniorManagerFileList = [],
      contractorCorrespondenceRemarks = '',
      seniorManagerRemarks = '',
      finalLapseList = [],
      finalRemarks = '',
      // sampleCount = '0',
      // showcause = '',
      lapseInfoVO = initialAdHocLapse,
      auditRepotType,
      displayTaskId,
    },
    { setSubmitting, resetForm },
  ) => {
    setSubmitting(false);
    const isAdHoc = auditRepotType === GRAVITRAP_TASK_TYPE.AD_HOC;
    if (isAdHoc) {
      const updatedLapse = {
        ...lapseInfoVO,
        ehiLapseFileList: lapseInfoVO?.ehiLapseFileList?.map(({ fileId }) => fileId) || [],
      };
      const params = { taskId: displayTaskId, updatedLapse };

      const callback = () => onSuccessCallbackToGoback(isDraft ? 'Save' : 'Submit', isDraft ? null : resetForm);
      submitAdHocTaskAction(params, !isDraft, callback);
      return;
    }
    const inputStatus = isDraft ? 'draft' : undefined;
    // const lapseParam = lapseArrToObj(finalLapseList);
    const fileIds = outsourcedFileList.map(({ fileId = '' }) => fileId);
    const lafileIds = seniorManagerFileList.map(({ fileId = '' }) => fileId);
    const rejectedParam = { seniorManagerRemarks, contractorRemarks: contractorCorrespondenceRemarks, fileIds, lafileIds };
    const param = {
      id,
      status,
      finalRemarks,
      finalLapseList: finalLapseList.map(({ lapseCode = '', missedSampleCount }) => ({ lapseCode, missedSampleCount })),
      inputStatus,
      ...rejectedParam,
    };
    const callback = () => onSuccessCallbackToGoback(isDraft ? 'Save' : 'Submit', isDraft ? null : resetForm);
    updateCorrespondenceAction(param, callback);
  };

  return (
    <>
      <Formik enableReinitialize initialValues={{ ...initialValues }} validate={initialValues?.auditRepotType === GRAVITRAP_TASK_TYPE.AD_HOC ? adhocValidation : validate} onSubmit={onSubmit}>
        {({ values: { auditRepotType = '', _status = '', auditor = '', teamLead = '', _id = '', _reviewerRemarks = '', displayTaskId = '', displayLapse = '' }, isSubmitting, setFieldValue }) => {
          const isPaperType = auditRepotType === GRAVITRAP_TASK_TYPE.PAPER;
          const isAdHoc = auditRepotType === GRAVITRAP_TASK_TYPE.AD_HOC;
          // eslint-disable-next-line no-unused-vars
          const isFinal = auditor.length * teamLead.length > 0;
          const menu = !isPaperType ? ['Trap Info', 'Contractor’s Maintenance Info', 'Audit', 'Show Cause', 'Contractor’s Correspondence'] : ['Trap Info', 'Contractor’s Correspondence'];

          return (
            <Form>
              <GoBackButton onClick={() => goBack()} title={`Task Id: ${displayTaskId}${isPaperType && displayLapse ? `, ${displayLapse}` : ''}`}>
                <>
                  <button type="submit" className="btn btn-sec ml-auto mr-3" disabled={isSubmitting} onClick={() => setFieldValue('isDraft', true, false)}>
                    Save
                  </button>
                  <button type="submit" className="btn btn-pri " disabled={isSubmitting} onClick={() => setFieldValue('isDraft', false, false)}>
                    Submit
                  </button>
                </>
              </GoBackButton>
              <div className="tabsContainer">
                <SubmitErrorMessage />
                {isAdHoc ? (
                  <AdHoc />
                ) : isPaperType ? (
                  <>
                    <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={menu} />
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="0">
                        <TrapInfo header="Trap Information" />
                        <ShowCause isFinal />
                      </TabPane>
                      <TabPane tabId="1">
                        <Correspondence isRejected={isRejected} canEditOutsourced canEditFinalLapse lapseLOV={lapseLOV} />
                      </TabPane>
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
                        <AuditTab lapseLOV={lapseLOV} canShowApprove />
                      </TabPane>
                      <TabPane tabId="3">
                        <ShowCause isFinal />
                      </TabPane>
                      <TabPane tabId="4">
                        <Correspondence canEditSenior showSenior canEditOutsourced canEditFinalLapse lapseLOV={finalLapseLOV} isRejected={isRejected} />
                      </TabPane>
                    </TabContent>
                  </>
                )}
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

const mapDispatchToProps = { updateCorrespondenceAction, submitAdHocTaskAction };

export default connect(mapStateToProps, mapDispatchToProps)(LiaisingWorkflow);
