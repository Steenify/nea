import React from 'react';
import { ErrorMessage, connect } from 'formik';

import ValidationField from 'components/common/formik/validationField';
import DropBox from 'components/common/dropbox';
import BinaryFileGallery from 'components/common/binaryImageGallery';

import { SUBMISSION_TYPE } from 'constants/index';

const LapseTypes = [
  { label: 'Licence Lapse', value: 'LSE' },
  { label: 'Product Lapse', value: 'PRD' },
  { label: 'Personal Protective Equipment Lapse', value: 'PPE' },
  { label: 'Notification Lapse', value: 'NTF' },
  { label: 'Other Lapses', value: 'OTH' },
];

const Enforcement = (props) => {
  const { enforcements = [], teamLeaderEnforcements, managerEnforcements, mode, formik } = props;

  // const errors = formik?.errors || [];
  const values = formik?.values || [];
  const setFieldValue = formik?.setFieldValue;

  const enforcementForm = () =>
    values.lapses.map((lapse, index) => (
      <div className="row mt-3" key={`assignment_${index + 1}`}>
        <div className="col-md-6 col-lg-3">
          {index + 1}. {lapse.lapseType} {lapse.isCompliant ? '(Compliant)' : '(Non-compliant)'}
        </div>
        <div className="col-md-6 col-lg-2">
          <div className="d-flex">
            <div className="custom-radio">
              <ValidationField type="radio" id={`lapses[${index}].isEnforced_yes`} name={`lapses[${index}].isEnforced`} value hideError />
              <label className="form-label" htmlFor={`lapses[${index}].isEnforced_yes`}>
                Yes
              </label>
            </div>
            <div className="custom-radio ml-5">
              <ValidationField type="radio" id={`lapses[${index}].isEnforced_no`} name={`lapses[${index}].isEnforced`} value={false} hideError />
              <label className="form-label" htmlFor={`lapses[${index}].isEnforced_no`}>
                No
              </label>
            </div>
          </div>
          <ErrorMessage className="col-form-error-label" name={`lapses[${index}].isEnforced`} component="div" />
        </div>
        <div className="col-md-6 col-lg-3">
          <ValidationField
            name={`lapses[${index}].remarks`}
            placeholder="Remarks"
            inputComponent="textarea"
            // hideError
            rows={5}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <DropBox
            size="sm"
            submissionType={SUBMISSION_TYPE.FOGAUDIT}
            // fileList={lapse.documents}
            fileIdList={lapse.fileIds}
            onChange={(fileList) => {
              setFieldValue(
                `lapses[${index}].fileIds`,
                fileList.map((file) => file.fileId),
              );
            }}
          />
        </div>
      </div>
    ));

  return (
    <>
      {mode === 'view' &&
        LapseTypes.map((type, index) => {
          const item = enforcements.find((en) => en.lapseTypeCode === type.value);

          return (
            <div className="tab-content" key={`enforcement_${index + 1}`}>
              <div className="tab-pane__group bg-white">
                <p className="tab-pane__title text-white">
                  {type.label}
                  {/* {type.value !== 'OTH' ? 'Lapse' : ''} */}
                </p>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-6 col-md-3 col-lg-2">
                        <div className="font-weight-bold mb-2">Date</div>
                        <div className="enforcement__value">{item?.updatedDate}</div>
                      </div>
                      <div className="col-sm-6 col-md-3 col-lg-2">
                        <div className="font-weight-bold  mb-2">Time</div>
                        <div className="enforcement__value">{item?.updatedTime}</div>
                      </div>
                      <div className="col-sm-6 col-md-3 col-lg-2">
                        <div className="font-weight-bold mb-2">Enforcement Status</div>
                        <div className="enforcement__value">{item?.enforcementStatus}</div>
                      </div>
                      <div className="col-sm-6 col-md-3 col-lg-2">
                        <div className="font-weight-bold mb-2">Team Leader's Name</div>
                        <div className="enforcement__value">{item?.teamLeaderName}</div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-2">
                        <div className="font-weight-bold mb-2">Team Leader's Remarks</div>
                        <div className="enforcement__value">{item?.teamLeaderRemarks}</div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-2">
                        <div className="font-weight-bold mb-2">Manager's Remarks</div>
                        <div className="enforcement__value">{item?.managerRemarks}</div>
                      </div>
                    </div>
                    {item?.documents && item?.documents?.length > 0 && (
                      <div className="row">
                        {item?.documents && item?.documents?.length > 0 && (
                          <div className="col-sm-12 col-md-12 col-lg-8 mt-4">
                            <div className="font-weight-bold">Supporting Documents</div>
                            <BinaryFileGallery fileIdList={item?.documents?.map((file) => file.fileId)} />
                          </div>
                        )}
                      </div>
                    )}
                    {!item && (
                      <>
                        <hr />
                        <label>No Data</label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* {mode === 'view' &&
        enforcements &&
        enforcements.map((item, index) => (
          <div className="tab-content" key={`enforcement_${index + 1}`}>
            <div className="tab-pane__group bg-white">
              <p className="tab-pane__title text-white">
                {index + 1}. {item.lapseType} Lapses
              </p>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6 col-md-3 col-lg-2">
                      <div className="font-weight-bold">Date</div>
                      <div className="enforcement__value">{item.updatedDate}</div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-2">
                      <div className="font-weight-bold">Time</div>
                      <div className="enforcement__value">{item.updatedTime}</div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-2">
                      <div className="font-weight-bold">Enforcement Status</div>
                      <div className="enforcement__value">{item.enforcementStatus}</div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-2">
                      <div className="font-weight-bold">Team Leader's Name</div>
                      <div className="enforcement__value">{item.teamLeaderName}</div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-2">
                      <div className="font-weight-bold">Team Leader's Remarks</div>
                      <div className="enforcement__value">{item.teamLeaderRemarks}</div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-2">
                      <div className="font-weight-bold">Manager's Remarks</div>
                      <div className="enforcement__value">{item.managerRemarks}</div>
                    </div>
                  </div>
                  {item.documents && item.documents.length > 0 && (
                    <div className="row">
                      {item.documents && item.documents.length > 0 && (
                        <div className="col-sm-12 col-md-12 col-lg-8 mt-4">
                          <div className="font-weight-bold">Supporting Documents</div>
                          <BinaryFileGallery fileIdList={item.documents.map((file) => file.fileId)} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))} */}

      {teamLeaderEnforcements && (
        <div className="tab-content">
          <div className="tab-pane__group bg-white">
            <p className="tab-pane__title text-white">TL's Recommendation for Enforcement</p>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-3 font-weight-bold">Type of Lapse</div>
                  <div className="col-md-6 col-lg-2 font-weight-bold">Enforce?</div>
                  <div className="col-md-6 col-lg-3 font-weight-bold">Remarks</div>
                  <div className="col-md-6 col-lg-4 font-weight-bold">Supporting Documents</div>
                </div>
                {mode !== 'propose' &&
                  LapseTypes.map((type, index) => {
                    const lapse = teamLeaderEnforcements.find((item) => item.lapseTypeCode === type.value);
                    return (
                      <div className="row mt-3" key={`confirm_enforcement_${index + 1}`}>
                        <div className="col-md-6 col-lg-3 ">
                          {index + 1}. {type?.label} {lapse?.isCompliant ? '(Compliant)' : '(Non-compliant)'}
                        </div>
                        <div className="col-md-6 col-lg-2 ">{lapse?.isEnforced ? 'Yes' : 'No'}</div>
                        <div className="col-md-6 col-lg-3 ">{lapse?.remarks}</div>
                        <div className="col-md-6 col-lg-4 ">
                          <BinaryFileGallery fileIdList={lapse?.documents.map((file) => file.fileId)} />
                        </div>
                      </div>
                    );
                  })}
                {mode === 'propose' && enforcementForm()}
              </div>
            </div>
          </div>
        </div>
      )}

      {managerEnforcements && (
        <div className="tab-content">
          <div className="tab-pane__group bg-white">
            <p className="tab-pane__title text-white">Manager's Recommendation for Enforcement</p>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-3 font-weight-bold">Type of Lapse</div>
                  <div className="col-md-6 col-lg-2 font-weight-bold">Enforce?</div>
                  <div className="col-md-6 col-lg-3 font-weight-bold">Remarks</div>
                  <div className="col-md-6 col-lg-4 font-weight-bold">Supporting Documents</div>
                </div>
                {mode !== 'confirm' &&
                  LapseTypes.map((type, index) => {
                    const lapse = managerEnforcements.find((item) => item.lapseTypeCode === type.value);
                    return (
                      <div className="row mt-3" key={`confirm_enforcement_${index + 1}`}>
                        <div className="col-md-6 col-lg-3 ">
                          {index + 1}. {type?.label} {lapse?.isCompliant ? '(Compliant)' : '(Non-compliant)'}
                        </div>
                        <div className="col-md-6 col-lg-2 ">{lapse?.isEnforced ? 'Yes' : 'No'}</div>
                        <div className="col-md-6 col-lg-3 ">{lapse?.remarks}</div>
                        <div className="col-md-6 col-lg-4 ">
                          <BinaryFileGallery fileIdList={lapse?.documents.map((file) => file.fileId)} />
                        </div>
                      </div>
                    );
                  })}
                {mode === 'confirm' && enforcementForm()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(Enforcement);
