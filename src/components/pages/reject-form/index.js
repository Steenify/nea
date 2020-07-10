import React, { useState, useEffect } from 'react';
import { ErrorMessage } from 'formik';
import _ from 'lodash';

import BinaryFileGallery from 'components/common/binaryImageGallery';
import DropBox from 'components/common/dropbox';

const RejectForm = (props) => {
  const { sample, onChange, className, deleteLocally, viewOnly, rejectReasonLOV } = props;
  // const { sampleId } = sample;

  const [rejectReasonCodes, setReasonCodes] = useState(sample?.rejectReasonCodes || []);
  const [rejectReasonOther, setReasonOther] = useState(sample?.rejectReasonOther || '');
  const [rejectFileIds, setFileIds] = useState(sample?.rejectFileIds || []);

  useEffect(() => {
    if (onChange) {
      onChange({ rejectReasonCodes, rejectReasonOther, rejectFileIds });
    }
  }, [rejectReasonCodes, rejectReasonOther, rejectFileIds, onChange]);

  const onCheckReason = (code) => {
    const codes = _.clone(rejectReasonCodes);
    const index = codes.indexOf(code);
    if (index > -1) {
      codes.splice(index, 1);
    } else {
      codes.push(code);
    }
    setReasonCodes(codes);
  };

  return (
    <div className={`row ${className}`}>
      <div className="col-lg-6 mb-4">
        <p className="font-weight-bold">
          Reasons <ErrorMessage className="col-form-error-label" name="sampleRejectionVO" component="span" />
        </p>
        <div className="form-nea__checkgroup">
          {rejectReasonLOV.map((reason, i) => {
            const isChecked = rejectReasonCodes.includes(reason.value);
            const isOthers = reason.value === 'OTH';
            if (!isChecked && viewOnly) {
              return <div className="form-nea__block" key={`reject_reason__${i.toString()}`} />;
            }
            return (
              <div className="form-nea__block" key={`reject_reason__${i.toString()}`}>
                <div className={`nea-chkbx form-group ${isOthers ? 'mb-2' : ''}`}>
                  <label className="custom-chckbbox">
                    {reason.label}
                    <input className={`form-control ${isChecked && 'checked'}`} type="checkbox" checked={isChecked} onChange={() => onCheckReason(reason.value)} disabled={viewOnly} />
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
                          disabled={!isChecked || viewOnly}
                          onChange={(e) => setReasonOther(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {rejectReasonLOV.length === 0 && <p>Loading Reject Reasons....</p>}
        </div>
      </div>
      <div className="col-lg-6 mb-4">
        <p className="font-weight-bold">Images (Optional)</p>
        {viewOnly ? (
          <BinaryFileGallery fileIdList={rejectFileIds} />
        ) : (
          <DropBox
            submissionType="SAMPLEID"
            // submissionId={sampleId}
            fileIdList={rejectFileIds}
            onChange={(fileList) => setFileIds(fileList.map((file) => file.fileId))}
            deleteLocally={deleteLocally}
          />
        )}
      </div>
    </div>
  );
};

export default RejectForm;
