import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { TabContent, TabPane } from 'reactstrap';
import TabNav from 'components/ui/tabnav';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import {} from '../action';
import { GRAVITRAP_TASK_TYPE } from 'constants/index';
import { supportRejectLDAction } from 'modules/my-workspace/site-paper-team-leader/action';
import GoBackButton from 'components/ui/go-back-button';
import CustomModal from 'components/common/modal';
import AdHoc from 'modules/ehi-gravitrap-audit/taskdetail/adhoc';
import TrapInfo from '../trapinfo';
import AuditTab from '../audit';
import ContractorTab from '../contractor-info';
import ShowCause from '../showcause';
import Correspondence from '../correspondence';

const SupportLDAmountWorkflow = ({ initialValues = {}, goBack = () => {}, lapseLOV = [], supportRejectLDAction, onSuccessCallbackToGoback = () => {} }) => {
  const [activeTab, setActiveTab] = useState('0');
  const [showRejectRemark, toggleShowRejectRemark] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');

  const validate = () => ({});
  const onSubmit = ({ _status = '', _id = '' }, { setSubmitting }) => {
    toggleShowRejectRemark(true);
    setSubmitting(false);
  };

  return (
    <>
      <Formik enableReinitialize initialValues={{ ...initialValues }} validate={validate} onSubmit={onSubmit}>
        {({ values: { auditRepotType = '', _status = '', _auditor = '', _teamLead = '', _id = '', _reviewerRemarks = '', displayTaskId = '', displayLapse = '' }, isSubmitting, resetForm }) => {
          const isPaperType = auditRepotType === GRAVITRAP_TASK_TYPE.PAPER;
          const isAdHoc = auditRepotType === GRAVITRAP_TASK_TYPE.AD_HOC;

          // const isFinal = auditor.length * teamLead.length > 0;
          const menu = !isPaperType ? ['Trap Info', 'Contractor’s Maintenance Info', 'Audit', 'Show Cause', 'Contractor’s Correspondence'] : ['Trap Info', 'Contractor’s Correspondence'];

          return (
            <Form>
              <GoBackButton onClick={() => goBack()} title={`Task Id: ${displayTaskId}${isPaperType && displayLapse ? `, ${displayLapse}` : ''}`}>
                <button type="submit" className="btn btn-pri ml-auto" disabled={isSubmitting}>
                  Reject
                </button>
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
                        <Correspondence lapseLOV={lapseLOV} />
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
                        <Correspondence showSenior lapseLOV={lapseLOV} />
                      </TabPane>
                    </TabContent>
                  </>
                )}
              </div>
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
                  const taskInfoList = [{ taskId: displayTaskId, taskType: auditRepotType }];
                  supportRejectLDAction({ taskInfoList, rejectionRemarks: rejectionRemark, action: 'REJECTSUPPORT' }, () => {
                    toggleShowRejectRemark(false);
                    setRejectionRemark('');
                    onSuccessCallbackToGoback('Reject', resetForm);
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
          );
        }}
      </Formik>
    </>
  );
};

const mapStateToProps = (_reducer, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = { supportRejectLDAction };

export default connect(mapStateToProps, mapDispatchToProps)(SupportLDAmountWorkflow);
