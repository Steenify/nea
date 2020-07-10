import React from 'react';

import './style.scss';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';
import uuid from 'uuid/v4';
import { boolOptionsYesWithNo, initialLapse } from '../helper';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import DropBox from 'components/common/dropbox';
import { SUBMISSION_TYPE, SITE_PAPER_STATUS } from 'constants/index';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const AuditFindings = Formik.connect(
  ({
    formik: {
      values: {
        recommendedLocationchange = '',
        recommendedLocation = '',
        ifosRemarks = '',
        reviewerRemarks = '',
        auditFindingsFileList = [],
        findingLapses = [],
        status = '',
        resubmissionRemarks = '',
        isApprove,
      },
      setFieldValue,
    },
    lapseLOV = [],
    canEditFindings = false,
    canShowApprove = false,
    canEditApprove = false,
  }) => {
    const lapseObservedField = 'findingLapses';
    const addLapse = () => {
      setFieldValue(lapseObservedField, [...findingLapses, { ...initialLapse, id: uuid(), isNew: true }], false);
    };

    const removeLapse = (index) => {
      findingLapses.splice(index, 1);
      setFieldValue(lapseObservedField, findingLapses, false);
    };
    const DisplayFindings = (
      <>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Recommend to Change Location</div>
              <div className="trapinfo__value">{recommendedLocationchange}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Recommended Location</div>
              <div className="trapinfo__value">{recommendedLocation}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Remarks</div>
              <div className="trapinfo__value">{resubmissionRemarks}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Lapse(s) Observed</div>
              <div className="trapinfo__value">
                {findingLapses.map(({ lapseCode = '', lapseDesc = '' }, index) => {
                  const find = lapseLOV.find((lapse) => lapse?.value === lapseCode);
                  const lapseName = find?.label || '';

                  return (
                    <div className="mb-2" key={`lapse_observed_${index + 1}`}>
                      {[lapseName, lapseDesc].filter((item) => item !== '').join(' - ')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Photo</div>
              <div className="value">
                <BinaryFileGallery fileIdList={auditFindingsFileList || []} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Remarks</div>
              <div className="trapinfo__value">{ifosRemarks}</div>
            </div>
          </div>
        </div>
      </>
    );
    const EditableFindings = (
      <>
        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold align-self-center">Recommend to Change Location*</div>
          <div className="col-md-9 col-lg-10">
            <ValidationField name="recommendedLocationchange" inputComponent="react-select" selectClassName="wf-200" placeholder="" options={boolOptionsYesWithNo} isClearable={false} hideError />
          </div>
        </div>

        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold">Suggested Location</div>
          <div className="col-md-9 col-lg-10">
            <ValidationField name="recommendedLocation" inputComponent="textarea" rows={1} placeholder="" />
          </div>
        </div>

        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
          <div className="col-md-9 col-lg-10">
            <ValidationField name="resubmissionRemarks" inputComponent="textarea" rows={5} placeholder="" hideError />
          </div>
        </div>

        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold">Lapse(s) Observed</div>
          <div className="col-md-9 col-lg-10">
            {findingLapses.map(({ id = '', lapseCode }, index) => (
              <div className="row mb-3" key={id}>
                <div className="col-1 d-flex align-items-center justify-content-center">
                  <CloseIcon className="cursor-pointer" onClick={() => removeLapse(index)} />
                </div>
                <div className="col-11">
                  <div className="row align-items-center">
                    <ValidationField name={`${lapseObservedField}[${index}].lapseCode`} inputComponent="react-select" selectClassName="wf-400" placeholder="Lapse" options={lapseLOV || []} hideError />
                    {lapseCode === 'MS' && <ValidationField name={`${lapseObservedField}[${index}].lapseDesc`} inputClassName="textfield wf-100 ml-3" />}
                  </div>
                </div>
              </div>
            ))}
            <AddButton className="mt-3" title="Add Lapse" onClick={addLapse} />
          </div>
        </div>

        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold">Photos</div>
          <div className="col-md-9 col-lg-10">
            <DropBox
              size="sm"
              submissionType={SUBMISSION_TYPE.SITE_PAPER_SITE}
              fileIdList={auditFindingsFileList}
              onChange={(fileList) => {
                const fileIds = fileList.map((file) => file.fileId);
                setFieldValue('auditFindingsFileList', fileIds);
              }}
              deleteLocally
            />
          </div>
        </div>

        <div className="row marginBottom30">
          <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
          <div className="col-md-9 col-lg-10">
            <ValidationField name="ifosRemarks" inputComponent="textarea" rows={5} placeholder="" />
          </div>
        </div>
      </>
    );
    const DisplayApprove = (
      <>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Approve Audit Information</div>
              <div className="trapinfo__value">{status === SITE_PAPER_STATUS.APPROVED ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Remarks</div>
              <div className="trapinfo__value">{reviewerRemarks}</div>
            </div>
          </div>
        </div>
      </>
    );
    const EditableApprove = (
      <>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row mb-2">
              <div className="trapinfo__label1">Approve Audit Information</div>
            </div>
          </div>
          <div className="col-12 marginBottom30">
            <button
              className={`btn ${isApprove === true ? 'btn-pri' : 'btn-sec'}`}
              type="button"
              onClick={() => {
                // setFieldValue('isDraft', false, false);
                setFieldValue('isApprove', true, true);
              }}>
              Yes
            </button>
            <button
              className={`btn ${isApprove === false ? 'btn-pri' : 'btn-sec'} ml-5`}
              type="button"
              onClick={() => {
                // setFieldValue('isDraft', false, false);
                setFieldValue('isApprove', false, true);
              }}>
              No
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="trapinfo__row">
              <div className="trapinfo__label1">Remarks</div>
              <div className="trapinfo__value">
                <ValidationField name="approveRemarks" inputComponent="textarea" rows={5} placeholder="" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
    return (
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-white">Audit Findings</p>
        <div className="card">
          <div className="card-body">
            {canEditFindings ? EditableFindings : DisplayFindings}
            {canShowApprove && (canEditApprove ? EditableApprove : DisplayApprove)}
          </div>
        </div>
      </div>
    );
  },
);

const Audit = ({
  formik: {
    values: {
      auditor = '',
      displayAuditType = '',
      auditdate = '',
      eweek: { week = '' },
      reviewerRemarks = '',
    },
  },
  lapseLOV = [],
  canEditFindings = false,
  canEditApprove = false,
  canShowApprove = false,
  isResubmission = false,
}) => {
  return (
    <>
      <div className="tab-pane__group bg-white ">
        <p className="tab-pane__title text-white">Audit Information</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Post-Audit / Pre-Audit</div>
                  <div className="trapinfo__value">{displayAuditType}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Auditor</div>
                  <div className="trapinfo__value">{auditor}</div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Audited as at</div>
                  <div className="trapinfo__value">{auditdate}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Eweek</div>
                  <div className="trapinfo__value">{week}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isResubmission && (
        <div className="tab-pane__group bg-white ">
          <p className="tab-pane__title text-white">Rejection Comments</p>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12">{reviewerRemarks}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuditFindings canEditFindings={canEditFindings} canShowApprove={canShowApprove} canEditApprove={canEditApprove} lapseLOV={lapseLOV} />
    </>
  );
};

export default Formik.connect(Audit);
