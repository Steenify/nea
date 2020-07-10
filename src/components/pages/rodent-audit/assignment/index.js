import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import DropBox from 'components/common/dropbox';
import InPageLoading from 'components/common/inPageLoading';
import CommonRejectModal from 'components/modals/common-reject-modal';
import BinaryFileGallery from 'components/common/binaryImageGallery';

import { SUBMISSION_TYPE } from 'constants/index';
import { actionTryCatchCreator } from 'utils';

import { approveRejectExpiredShowcauseService, updateExplanationService } from 'services/rodent-audit';

const Assignment = (props) => {
  const { assignments, taskId, history, isEditable } = props;

  const [reason, setReason] = useState();
  const [fileIds, setFileIdList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    fileIds: [],
    reason: '',
  });

  const submitForApproval = async () => {
    if (!reason) {
      toast.error('Reason is required');
      return;
    }
    const params = { taskId, reason, fileIds, saveMode: 'submit' };

    const onPending = () => setIsLoading(true);
    const onError = () => setIsLoading(false);
    const onSuccess = () => {
      toast.success('Task submitted.');
      setIsLoading(false);
      history.goBack();
    };
    await actionTryCatchCreator(updateExplanationService(params), onPending, onSuccess, onError);
  };

  const approveOrReject = (isApprove) => {
    const onPending = () => setIsLoading(true);
    const onError = () => setIsLoading(false);
    const onSuccess = () => {
      toast.success(isApprove ? 'Reason approved.' : 'Reason rejected');
      setIsLoading(false);
      setModalState({ open: false });
      history.goBack();
    };
    const params = { taskId, approveExpiration: isApprove };
    if (!isApprove) {
      if (!modalState.reason) {
        toast.error('Reason is required.');
        return;
      }
      params.reason = modalState.reason || '';
      params.fileIds = modalState.fileIds || [];
    }
    actionTryCatchCreator(approveRejectExpiredShowcauseService(params), onPending, onSuccess, onError);
  };

  if (!assignments || assignments?.length === 0) return <></>;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Assignment</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Assigned Date</div>
            <div className="col-md-3 col-lg-2 font-weight-bold">Assigned to</div>
            <div className="col-md-3 col-lg-2 font-weight-bold">Audit Task status</div>
            <div className="col-md-3 col-lg-6 font-weight-bold">Reason</div>
          </div>
          {assignments &&
            assignments.map((item, index) => (
              <div className="row mt-3" key={`assignment_${index + 1}`}>
                <div className="col-md-3 col-lg-2">{item.assignedAt || item.taskUpdatedDate}</div>
                <div className="col-md-3 col-lg-2">{item.assignedTo}</div>
                <div className="col-md-3 col-lg-2">{item.statusDescription || item.taskStatus}</div>
                {/* <div className="col-md-3 col-lg-2">{item.statusDescription}</div> */}
                <div className="col-md-3 col-lg-6">
                  {!item.submissionRequired && !item.acceptanceRequired && item.reason?.trim() && (
                    <>
                      <label className="font-weight-bold">{item.isManagerRejected !== undefined ? "Manager's Rejection Reasons" : "TL's Reason for Expired Task"}</label>
                      <label>{item.reason}</label>
                      <BinaryFileGallery fileIdList={item?.documents?.map((photo) => photo.fileId)} />
                      {(item.isReasonAccepted === true || item.isReasonAccepted === false) && (
                        <div className={`text-center audit__results__license__badge__${item.isReasonAccepted ? 'yes' : 'no'}`}>{item.isReasonAccepted ? 'Reason aceepted' : 'Reason rejected'}</div>
                      )}
                    </>
                  )}
                  {isEditable && (
                    <>
                      {item.submissionRequired && (
                        <>
                          <label className="font-weight-bold">TL&apos;s Reason for Expired Task</label>
                          <textarea className="form-control textField " type="text" placeholder="Please state reason" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} />
                          <label className="font-weight-bold mt-2">Upload document</label>
                          <DropBox
                            size="sm"
                            submissionType={SUBMISSION_TYPE.RODAUDITSUPPORTDOC}
                            fileIdList={fileIds.map(({ fileId }) => fileId)}
                            onChange={(fileList) => {
                              setFileIdList([...fileList.map((file) => file.fileId)]);
                            }}
                          />
                          <button type="button" className="btn btn-pri" disabled={!reason} onClick={submitForApproval}>
                            Submit to Manager
                          </button>
                        </>
                      )}
                      {item.acceptanceRequired && (
                        <>
                          {/* {item.reason && (
                        <>
                          <label className="font-weight-bold">Manager's Reason for Expired Task</label>
                          <label>{item.reason}</label>
                        </>
                      )} */}

                          <button type="button" className="btn btn-sec m-2" onClick={() => approveOrReject(true)}>
                            Approve
                          </button>
                          <button type="button" className="btn btn-sec m-2" onClick={() => setModalState({ open: true })}>
                            Reject
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <InPageLoading isLoading={isLoading} />
      <CommonRejectModal
        submissionType={SUBMISSION_TYPE.RODAUDITSUPPORTDOC}
        isOpen={modalState.open}
        onConfirm={() => approveOrReject(false)}
        onCancel={() => setModalState({ open: false })}
        onTextChange={(reason) => setModalState({ ...modalState, reason })}
        fileIdList={modalState?.fileIds}
        setFileIds={(fileIds) => setModalState({ ...modalState, fileIds })}
      />
    </div>
  );
};

export default withRouter(Assignment);
