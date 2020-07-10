import React, { useState, useEffect, useCallback } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { getMastercodeAction } from 'store/actions';
import './style.scss';
import CustomModal from 'components/common/modal';
import { FUNCTION_NAMES, GRAVITRAP_LAPSE_TYPE, WEB_ROUTES } from 'constants/index';
import { lapseListingService } from 'services/ehi-gravitrap-audit/upload-adhoc-lapse';
import { actionTryCatchCreator } from 'utils';
import { PendingApprovalAndShowCauseWorkFlow, PendingResubmissionWorkflow, LiaisingWorkflow, SupportLDAmountWorkflow } from './workflow.js';
import { initialValue } from './helper';

const TaskDetail = ({ location: { state }, history: { goBack }, ui: { isLoading } }) => {
  const [modal, setModal] = useState({ isShow: false, action: '', onConfirm: () => {} });
  const [lapseLOV, setLapseLOV] = useState([]);
  const [finalLapseLOV, setFinalLapseLOV] = useState([]);
  const caseInfo = state?.caseInfo || {};
  const fromFunction = state?.fromFunction || '';
  const [isLocalLoading, setIsLoading] = useState(false);

  const getLapseLOVAction = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.ehiLapseRequestVOList || [];
      const payload = list?.map(({ lapseCode, lapseDescription }) => ({ value: lapseCode, label: lapseDescription })) || [];
      setLapseLOV(payload);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(lapseListingService(caseInfo?.auditRepotType || ''), onPending, onSuccess, onError);
  }, [caseInfo]);

  const getFinalLapseLOVAction = () => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.ehiLapseRequestVOList || [];
      const payload = list?.map(({ lapseCode, lapseDescription }) => ({ value: lapseCode, label: lapseDescription })) || [];
      setFinalLapseLOV(payload);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(lapseListingService(GRAVITRAP_LAPSE_TYPE.FINAL_SITE), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getLapseLOVAction();
    getFinalLapseLOVAction();
  }, [getLapseLOVAction]);

  const onSuccessCallbackToGoback = (action = '', resetForm) => {
    const onConfirm = () => {
      setModal({ isShow: false, action: '', onConfirm: () => {} });
      if (resetForm) {
        resetForm();
        goBack();
      }
    };
    setModal({ isShow: true, action, onConfirm });
  };

  const initialValues = initialValue(caseInfo);

  const renderWorkFlow = () => {
    const { getPendingapprovalShowcause, geRejectedSiteAudit, getLocSitePaperAudit, getLocSitePaperAuditRejected, getPendingSupportWorkspaceListing } = FUNCTION_NAMES;
    switch (fromFunction) {
      case getPendingapprovalShowcause:
        return <PendingApprovalAndShowCauseWorkFlow data={caseInfo} goBack={goBack} lapseLOV={lapseLOV} onSuccessCallbackToGoback={onSuccessCallbackToGoback} />;
      case geRejectedSiteAudit:
        return <PendingResubmissionWorkflow data={caseInfo} goBack={goBack} lapseLOV={lapseLOV} onSuccessCallbackToGoback={onSuccessCallbackToGoback} />;
      case getLocSitePaperAuditRejected:
      case getLocSitePaperAudit:
        return (
          <LiaisingWorkflow
            data={caseInfo}
            goBack={goBack}
            lapseLOV={lapseLOV}
            finalLapseLOV={finalLapseLOV}
            onSuccessCallbackToGoback={onSuccessCallbackToGoback}
            isRejected={fromFunction === getLocSitePaperAuditRejected}
          />
        );
      case getPendingSupportWorkspaceListing:
        return <SupportLDAmountWorkflow initialValues={initialValues} goBack={goBack} lapseLOV={lapseLOV} onSuccessCallbackToGoback={onSuccessCallbackToGoback} />;

      default:
        return null;
    }
  };
  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active="My Workspace" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.MY_WORKSPACE]} />
          {renderWorkFlow()}
          <Footer />
        </div>
        <InPageLoading isLoading={isLoading || isLocalLoading} />
        <CustomModal isOpen={modal.isShow} type="system-modal" headerTitle={`${modal.action} Successful`} confirmTitle="OK" onConfirm={modal.onConfirm} />
      </div>
    </>
  );
};

const mapStateToProps = ({ global, sitePaperGravitrapAuditReducers: { taskDetail } }, ownProps) => ({
  ...ownProps,
  ...taskDetail,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = { getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaskDetail));
