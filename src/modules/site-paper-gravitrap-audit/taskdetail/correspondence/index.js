import React from 'react';

import './style.scss';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';
import uuid from 'uuid/v4';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import DropBox from 'components/common/dropbox';
import { SUBMISSION_TYPE, GRAVITRAP_TASK_TYPE } from 'constants/index';
// import BinaryFile from 'components/common/binaryImage';
import BinaryFileGallery from 'components/common/binaryImageGallery';

import { initialLapse } from '../helper';

const Correspondence = ({
  formik: {
    values: {
      auditRepotType = '',
      contractorCorrespondenceRemarks = '',
      // managerShowcauseremarks = '',
      outsourcedFileList = [],
      seniorManagerFileList = [],
      smUploadDate = '',
      contractorUploadDate = '',
      seniorManagerRemarks = '',
      // reviewerRemarks = '',
      finalLapseList = [],
      finalRemarks = '',
      rejectionRemarks = '',
    },
    setFieldValue,
  },
  lapseLOV = [],
  // isFinal = false,
  // isEditable = false,
  isRejected = false,
  showSenior = false,
  canEditOutsourced = false,
  canEditFinalLapse = false,
  canEditSenior = false,
}) => {
  const fieldFinalLapse = 'finalLapseList';
  const addLapse = () => {
    setFieldValue(fieldFinalLapse, [...finalLapseList, { ...initialLapse, id: uuid(), isNew: true, missedSampleCount: '0' }], false);
  };

  const removeLapse = (index) => {
    finalLapseList.splice(index, 1);
    setFieldValue(fieldFinalLapse, finalLapseList, false);
  };
  const OutsourcedEditable = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Outsourced Contractor’s Correspondence</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2" />
            <div className="col-md-6 col-lg-8">
              <DropBox
                size="sm"
                submissionType={auditRepotType === GRAVITRAP_TASK_TYPE.PAPER ? SUBMISSION_TYPE.SITE_PAPER_PAPER : SUBMISSION_TYPE.SITE_PAPER_SITE}
                fileIdList={outsourcedFileList.map(({ fileId }) => fileId)}
                onChange={(fileList) => {
                  const fileIds = fileList.map((file) => ({ fileId: file.fileId }));
                  setFieldValue('outsourcedFileList', fileIds);
                }}
                deleteLocally
              />
            </div>
            <div className="col-md-3 col-lg-2" />
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField name="contractorCorrespondenceRemarks" inputComponent="textarea" rows={5} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SeniorLapseAssessmentEditable = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Senior Manager’s Lapse Assessment</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2" />
            <div className="col-md-6 col-lg-8">
              <DropBox
                size="sm"
                submissionType={auditRepotType === GRAVITRAP_TASK_TYPE.PAPER ? SUBMISSION_TYPE.SITE_PAPER_PAPER : SUBMISSION_TYPE.SITE_PAPER_SITE}
                fileIdList={seniorManagerFileList.map(({ fileId }) => fileId)}
                onChange={(fileList) => {
                  const fileIds = fileList.map((file) => ({ fileId: file.fileId }));
                  setFieldValue('seniorManagerFileList', fileIds);
                }}
                deleteLocally
              />
            </div>
            <div className="col-md-3 col-lg-2" />
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField name="seniorManagerRemarks" inputComponent="textarea" rows={5} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OutsourcedDisplay = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Outsourced Contractor’s Correspondence</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Uploaded as at</div>
            <div className="col-md-9 col-lg-10">{contractorUploadDate}</div>
          </div>
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Attachments</div>
            <div className="col-md-9 col-lg-10">
              <BinaryFileGallery fileIdList={outsourcedFileList?.map((photo) => photo.fileId)} />
              {/* <div className="value d-flex">
                {outsourcedFileList.map(({ fileId }, index) => (
                  <div className="mr-3 mb-3 wf-300" key={`Outsourced_${fileId}`}>
                    <BinaryFile key={index} fileId={fileId || undefined} />
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">{contractorCorrespondenceRemarks}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SeniorLapseDisplay = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Senior Manager’s Lapse Assessment</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Uploaded as at</div>
            <div className="col-md-9 col-lg-10">{smUploadDate}</div>
          </div>
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Attachments</div>
            <div className="col-md-9 col-lg-10">
              <BinaryFileGallery fileIdList={seniorManagerFileList?.map((photo) => photo.fileId)} />
              {/* <div className="value d-flex">
                {seniorManagerFileList.map(({ fileId }, index) => (
                  <div className="mr-3 mb-3 wf-300" key={`Senior_${fileId}`}>
                    <BinaryFile key={index} fileId={fileId || undefined} />
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">{seniorManagerRemarks}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const LDRejectionRemarkDisplay = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">LD Rejection Remark</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">{rejectionRemarks}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const FinalLapseAssessmentEditable = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Final Lapse Assessment</p>
      <div className="card">
        <div className="card-body">
          <div className="row marginBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Lapse(s) Observed</div>
            <div className="col-md-9 col-lg-10">
              {finalLapseList.map(({ id = '', lapseCode = '' }, index) => (
                <div className="row mb-3" key={lapseCode}>
                  <div className="col-1 d-flex align-items-center justify-content-center">
                    <CloseIcon className="cursor-pointer" onClick={() => removeLapse(index)} />
                  </div>
                  <div className="col-11">
                    <div className="row align-items-center">
                      <ValidationField name={`${fieldFinalLapse}[${index}].lapseCode`} inputComponent="react-select" selectClassName="wf-400" placeholder="Lapse" options={lapseLOV || []} hideError />
                      {lapseCode === 'MS' && <ValidationField name={`${fieldFinalLapse}[${index}].missedSampleCount`} inputClassName="textfield wf-100 ml-3" />}
                    </div>
                  </div>
                </div>
              ))}
              <AddButton className="mt-3" title="Add Lapse" onClick={addLapse} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField name="finalRemarks" inputComponent="textarea" rows={5} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FinalLapseAssessmentDisplay = (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Final Lapse Assessment</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Lapse(s) Observed</div>
            <div className="col-md-9 col-lg-10">
              {finalLapseList.map(({ lapseCode = '', missedSampleCount = '' }, index) => {
                const find = lapseLOV.find((lapse) => lapse?.value === lapseCode);
                const lapseName = find?.label || '';

                return (
                  <div className="mb-2" key={`lapse_observed_${index + 1}`}>
                    {[lapseName, missedSampleCount].filter((item) => item !== '').join(' - ')}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">{finalRemarks}</div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {canEditOutsourced ? OutsourcedEditable : OutsourcedDisplay}
      {showSenior && (canEditSenior ? SeniorLapseAssessmentEditable : SeniorLapseDisplay)}
      {isRejected && LDRejectionRemarkDisplay}
      {canEditFinalLapse ? FinalLapseAssessmentEditable : FinalLapseAssessmentDisplay}
    </>
  );

  // return isRejected ? (
  //   <>
  //     {OutsourcedDisplay}
  //     {showSenior ? SeniorLapseDisplay : null}
  //     {LDRejectionRemarkDisplay}
  //     {FinalLapseAssessmentEditable}
  //   </>
  // ) : (
  //   <>
  //     {canEditOutsourced ? OutsourcedEditable : OutsourcedDisplay}
  //     {showSenior && (canEditSenior ? SeniorLapseAssessmentEditable : SeniorLapseDisplay)}
  //     {canEditFinalLapse ? FinalLapseAssessmentEditable : FinalLapseAssessmentDisplay}
  //   </>
  // );
};
export default Formik.connect(Correspondence);
