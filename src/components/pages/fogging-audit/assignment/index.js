import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import DropBox from 'components/common/dropbox';
import InPageLoading from 'components/common/inPageLoading';
import CommonRejectModal from 'components/modals/common-reject-modal';
import BinaryFileGallery from 'components/common/binaryImageGallery';

import { SUBMISSION_TYPE } from 'constants/index';
import { actionTryCatchCreator } from 'utils';

import { submitFoggingExpiredTaskService, approveOrRejectFoggingExpiredTaskService } from 'services/fogging-audit';

import '../audit-results/style.scss';

const Assignment = (props) => {
  const { assignments, auditTaskId, history } = props;

  const [reason, setReason] = useState();
  const [fileIds, setFileIdList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ open: false, fileIds: [], reason: '' });

  const submitForApproval = async () => {
    if (!reason) {
      toast.error('Reason is required');
      return;
    }
    const params = { auditTaskId, reason, fileIds };

    const onPending = () => setIsLoading(true);
    const onError = () => setIsLoading(false);
    const onSuccess = (data) => {
      toast.success('Task submitted for approval.');
      setIsLoading(false);
      history.goBack();
    };
    await actionTryCatchCreator(submitFoggingExpiredTaskService(params), onPending, onSuccess, onError);
  };

  const approveOrReject = async (isApprove) => {
    const onPending = () => setIsLoading(true);
    const onError = () => setIsLoading(false);
    const onSuccess = (data) => {
      toast.success(isApprove ? 'Task approved.' : 'Task rejected.');
      setIsLoading(false);
      setModalState({ open: false });
      history.goBack();
    };
    const params = { auditTaskId, isApprove };
    if (!isApprove) {
      if (!modalState.reason) {
        toast.error('Reason is required.');
        return;
      }
      params.reason = modalState.reason || '';
      params.fileIds = modalState.fileIds || [];
    }
    await actionTryCatchCreator(approveOrRejectFoggingExpiredTaskService(params), onPending, onSuccess, onError);
  };

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Assignment History</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Assigned/Updated as at</div>
            <div className="col-md-3 col-lg-2 font-weight-bold">Assigned to</div>
            <div className="col-md-3 col-lg-2 font-weight-bold">Audit Task Status</div>
            <div className="col-md-3 col-lg-6 font-weight-bold">Reason</div>
          </div>
          {assignments &&
            assignments.map((item, index) => (
              <div className="row mt-3 audit__results__section" key={`assignment_${index + 1}`}>
                <div className="col-md-3 col-lg-2">{item.taskUpdatedDate}</div>
                <div className="col-md-3 col-lg-2">{item.assignedTo}</div>
                <div className="col-md-3 col-lg-2">{item.taskStatus}</div>
                <div className="col-md-3 col-lg-6">
                  {!item.submissionRequired && !item.acceptanceRequired && item.reason && (
                    <>
                      <div className="font-weight-bold">{item.isManagerRejected !== undefined ? "Manager's Rejection Reasons" : "TL's Reason for Expired Task"}</div>
                      <div>{item.reason}</div>
                      <BinaryFileGallery fileIdList={item?.documents?.map((photo) => photo.fileId)} />
                      {(item.isReasonAccepted === true || item.isReasonAccepted === false) && (
                        <div className={`text-center audit__results__license__badge__${item.isReasonAccepted ? 'yes' : 'no'}`}>{item.isReasonAccepted ? 'Reason aceepted' : 'Reason rejected'}</div>
                      )}
                    </>
                  )}
                  {item.submissionRequired && (
                    <>
                      <div className="font-weight-bold">TL's Reason for Expired Task</div>
                      <textarea className="form-control textField " type="text" placeholder="Please state reason" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} />
                      <div className="font-weight-bold mt-2">Supporting Documents</div>
                      <DropBox
                        size="sm"
                        submissionType={SUBMISSION_TYPE.FOGAUDIT}
                        onChange={(fileList) => {
                          setFileIdList([...fileList.map((file) => file.fileId)]);
                        }}
                      />
                      <button type="button" className="btn btn-pri" disabled={!reason} onClick={submitForApproval}>
                        Submit for Approval
                      </button>
                    </>
                  )}
                  {item.acceptanceRequired && (
                    <>
                      <button type="button" className="btn btn-sec m-2" onClick={() => approveOrReject(true)}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-sec m-2" onClick={() => setModalState({ open: true })}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          {(!assignments || assignments?.length === 0) && (
            <>
              <hr />
              <label>No Data</label>
            </>
          )}
        </div>
      </div>
      <InPageLoading isLoading={isLoading} />
      <CommonRejectModal
        submissionType={SUBMISSION_TYPE.FOGAUDIT}
        isOpen={modalState.open}
        onConfirm={() => approveOrReject(false)}
        onCancel={() => setModalState({ open: false })}
        onTextChange={(reason) => setModalState({ ...modalState, reason })}
        setFileIds={(fileIds) => setModalState({ ...modalState, fileIds })}
      />
    </div>
  );
};

export default withRouter(Assignment);
