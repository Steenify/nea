import React, { Component } from 'react';
import BinaryFileSlider from 'components/common/binaryImageSlider';

import CustomModal from 'components/common/modal';

import { getMasterCodeListLOV, MASTER_CODE } from 'services/masterCode';

class RejectSampleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SampleRejectReasons: [],
    };
  }

  async componentDidMount() {
    const data = await getMasterCodeListLOV([MASTER_CODE.SAMPLE_REJECT_REASONS]);
    this.setState({
      SampleRejectReasons: data[0],
    });
  }

  render() {
    const { isOpen, onCancel, onSubmit, sample } = this.props;
    const { SampleRejectReasons } = this.state;
    const rejectReasonCodes = sample?.rejectReasonCodes || [];
    const rejectReasonOther = sample?.rejectReasonOther || '';
    const rejectFileIds = sample?.rejectFileIds || [];
    return (
      <CustomModal
        isOpen={isOpen}
        type="action-modal"
        bodyClassName="is-preview-upload"
        headerTitle="Reasons & Images"
        cancelTitle="Cancel"
        onCancel={onCancel}
        confirmTitle="Edit Reason"
        onConfirm={onSubmit}
        content={
          <div>
            {rejectReasonCodes &&
              rejectReasonCodes.map((code, index) => {
                const codeDesc = SampleRejectReasons.find((reason) => reason.code === code)?.codeDesc;
                if (code === 'OTH') {
                  return <></>;
                }
                return <p key={`review_reason_${index.toString()}`}>• {codeDesc}</p>;
              })}
            {rejectReasonCodes && rejectReasonCodes.find((code) => code === 'OTH') && <p>• Others: {rejectReasonOther}</p>}
            {rejectFileIds.length > 0 && <BinaryFileSlider fileList={rejectFileIds.map((fileId) => ({ fileId }))} />}
          </div>
        }
      />
    );
  }
}

export default RejectSampleModal;
