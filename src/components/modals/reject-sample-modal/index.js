import React, { Component } from 'react';
import { toast } from 'react-toastify';

import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';

import { getMasterCodeListLOV, MASTER_CODE } from 'services/masterCode';

class RejectSampleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen,
      SampleRejectReasons: [],
      rejectReasonCodes: [],
      rejectReasonOther: '',
      rejectFileIds: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isOpen !== state.isOpen) {
      const { isOpen, sample } = props;
      return {
        isOpen,
        rejectReasonCodes: sample?.rejectReasonCodes || [],
        rejectReasonOther: sample?.rejectReasonOther || '',
        rejectFileIds: sample?.rejectFileIds || [],
      };
    }
    return null;
  }

  async componentDidMount() {
    const data = await getMasterCodeListLOV([MASTER_CODE.SAMPLE_REJECT_REASONS]);
    this.setState({
      SampleRejectReasons: data[0] || [],
    });
  }

  onSubmit = () => {
    const { onSubmit } = this.props;
    const { rejectReasonCodes, rejectReasonOther } = this.state;
    if (rejectReasonCodes.length > 0) {
      const isOthers = rejectReasonCodes.find((code) => code === 'OTH') !== undefined;
      if (isOthers && !rejectReasonOther) {
        toast.error('Additional reason must be provided if you choose "Others"');
        return;
      }
      const rejectFileIds = this.dropBoxRef.getFileList().map((file) => file.fileId);
      if (onSubmit) {
        onSubmit({
          rejectReasonCodes,
          rejectReasonOther: isOthers ? rejectReasonOther : '',
          rejectFileIds,
        });
      }
    } else {
      toast.error('Please select at least one reason');
    }
  };

  onCheckReason = (code) => {
    const { rejectReasonCodes } = this.state;
    const temp = rejectReasonCodes;
    const index = temp.indexOf(code);
    if (index > -1) {
      temp.splice(index, 1);
    } else {
      temp.push(code);
    }
    this.setState({
      rejectReasonCodes: temp,
    });
  };

  render() {
    const {
      isOpen,
      onCancel,
      // sampleId
    } = this.props;
    const { rejectReasonCodes, rejectReasonOther, rejectFileIds, SampleRejectReasons } = this.state;
    return (
      <CustomModal
        isOpen={isOpen}
        type="action-modal"
        bodyClassName="is-reject-form"
        headerTitle="Reason & Images (optional)"
        cancelTitle="Cancel"
        onCancel={onCancel}
        confirmTitle="Save"
        onConfirm={this.onSubmit}
        content={
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="form-nea__checkgroup">
                {SampleRejectReasons.map((reason, i) => {
                  const isChecked = rejectReasonCodes.includes(reason.code);
                  const isOthers = reason.code === 'OTH';
                  return (
                    <div className="form-nea__block" key={`reject_reason__${i.toString()}`}>
                      <div className={`nea-chkbx form-group ${isOthers ? 'mb-0' : ''}`}>
                        <label className="custom-chckbbox">
                          {reason.codeDesc}
                          <input className={`form-control ${isChecked ? 'checked' : ''}`} type="checkbox" checked={isChecked} onChange={() => this.onCheckReason(reason.code)} />
                          <span className="checkmark" />
                        </label>
                      </div>
                      {isOthers && (
                        <div className="form-nea__checkgroup-ul show">
                          <div className="form-group modal-others">
                            <label className="custom-textbox d-block">
                              <textarea
                                className="form-control textField modal-reason"
                                type="text"
                                placeholder="Please state reason"
                                value={rejectReasonOther}
                                disabled={!isChecked}
                                onChange={(e) => this.setState({ rejectReasonOther: e.target.value })}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <DropBox
                submissionType="SAMPLEID"
                // submissionId={sampleId}
                fileIdList={rejectFileIds}
                ref={(ref) => {
                  this.dropBoxRef = ref;
                }}
              />
            </div>
          </div>
        }
      />
    );
  }
}

export default RejectSampleModal;
