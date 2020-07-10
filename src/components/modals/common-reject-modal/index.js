import React from 'react';

import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';

const CommonRejectModal = ({
  isOpen = false,
  headerTitle = 'Reason for Rejection',
  confirmTitle = 'Submit',
  cancelTitle = 'Cancel',
  submissionType = 'SAMPLEID',
  submissionId = undefined,
  fileIdList = [],
  onConfirm = () => {},
  onCancel = () => {},
  onTextChange = () => {},
  setFileIds = () => {},
}) => (
  <CustomModal
    headerTitle={headerTitle}
    confirmTitle={confirmTitle}
    cancelTitle={cancelTitle}
    isOpen={isOpen}
    onConfirm={onConfirm}
    onCancel={onCancel}
    type="action-modal"
    content={
      <form className="form-group">
        <div className="row paddingBottom20">
          <div className="col-lg-12">
            <textarea className="form-control" rows={3} onChange={(e) => onTextChange(e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <DropBox size="sm" submissionType={submissionType} submissionId={submissionId} fileIdList={fileIdList} onChange={(fileList) => setFileIds(fileList.map((file) => file.fileId))} />
          </div>
        </div>
      </form>
    }
  />
);

export default CommonRejectModal;
