import React, { useState, useEffect } from 'react';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';
import { lapseListingService } from 'services/ehi-gravitrap-audit/upload-adhoc-lapse';
import InPageLoading from 'components/common/inPageLoading';
import { actionTryCatchCreator, configMissingFieldMessage, formikValidate } from 'utils';
import { SUBMISSION_TYPE, GRAVITRAP_TASK_TYPE } from 'constants/index';
import { TabContent } from 'reactstrap';
import BinaryFileGallery from 'components/common/binaryImageGallery';
import { submissionDateTitle, submissionDeadlineTitle, totalBatchesTitle, notificationDateTitle, FormRow, newLapse } from '../../upload-adhoc-lapse/helper';

const AdHoc = Formik.connect(({ formik: { values, setFieldValue }, prefixName = 'lapseInfoVO' }) => {
  const [lapseLOV, setLapseLOV] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditable = values?.lapseInfoVO?.isEditable;

  const getLapseLOVAction = () => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.ehiLapseRequestVOList || [];
      const payload = list?.map(({ lapseCode, lapseDescription }) => ({ value: lapseCode, label: lapseDescription })) || [];
      setLapseLOV(payload);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(lapseListingService(GRAVITRAP_TASK_TYPE.AD_HOC), onPending, onSuccess, onError);
  };

  useEffect(() => {
    if (isEditable) {
      getLapseLOVAction();
    }
  }, [isEditable, values]);

  const lapseCode = Formik.getIn(values, `${prefixName}.lapseCode`);

  const setLapseCode = (param = {}) => {
    const detail = Formik.getIn(values, prefixName);
    setFieldValue(prefixName, { ...detail, ...newLapse, ...param }, true);
  };

  const EditableLapse = (
    <div className="tab-pane__group bg-white mt-3">
      <div className="card">
        <div className="card-body">
          <FormRow isPaddingBottom label="Lapse">
            <ValidationField
              name={`${prefixName}.lapseCode`}
              inputComponent="react-select"
              options={lapseLOV}
              selectClassName="wf-650"
              isClearable={false}
              hideError
              onChange={(value) => {
                const find = lapseLOV.find((item) => item?.value === value);
                setLapseCode({ lapseCode: find?.value || '', lapseDescription: find?.label });
              }}
            />
          </FormRow>
          <FormRow isPaddingBottom label="Year*">
            {values?.lapseInfoVO?.year}
          </FormRow>
          <FormRow isPaddingBottom label="Month*">
            {values?.lapseInfoVO?.month}
          </FormRow>
          {notificationDateTitle(lapseCode) && (
            <FormRow isPaddingBottom label={notificationDateTitle(lapseCode)}>
              <ValidationField name={`${prefixName}.notificationDate`} inputComponent="singleDatePickerV2" inputClassName="d-contents" hideError />
            </FormRow>
          )}
          {submissionDeadlineTitle(lapseCode) && (
            <FormRow isPaddingBottom label={submissionDeadlineTitle(lapseCode)}>
              <ValidationField name={`${prefixName}.submissionDeadline`} inputComponent="singleDatePickerV2" inputClassName="d-contents" hideError />
            </FormRow>
          )}
          {submissionDateTitle(lapseCode) && (
            <FormRow isPaddingBottom label={submissionDateTitle(lapseCode)}>
              <ValidationField name={`${prefixName}.submissionDate`} inputComponent="singleDatePickerV2" inputClassName="d-contents" hideError />
            </FormRow>
          )}
          {totalBatchesTitle(lapseCode) && (
            <FormRow isPaddingBottom label={totalBatchesTitle(lapseCode)}>
              <ValidationField name={`${prefixName}.totalBatches`} inputClassName="textfield wf-200" hideError />
            </FormRow>
          )}
          <div className="row">
            <div className="col-12 font-weight-bold">Supporting Documents</div>
          </div>
          <div className="mb-2" />
          <FormRow isPaddingBottom>
            <ValidationField name={`${prefixName}.ehiLapseFileList`} deleteLocally submissionType={SUBMISSION_TYPE.GRAVITRAP_SUPPORT_DOC} inputClassName="textfield wf-200" inputComponent="dropbox" />
          </FormRow>
        </div>
      </div>
    </div>
  );

  const fileListDisplay = values?.lapseInfoVO?.ehiLapseFileVOList || [];
  const DisplayLapse = (
    <div className="tab-pane__group bg-white mt-3">
      <div className="card">
        <div className="card-body">
          <FormRow isPaddingBottom label="Lapse">
            {values?.lapseInfoVO?.lapseDescription}
          </FormRow>
          <FormRow isPaddingBottom label="Year*">
            {values?.lapseInfoVO?.year}
          </FormRow>
          <FormRow isPaddingBottom label="Month*">
            {values?.lapseInfoVO?.month}
          </FormRow>
          {notificationDateTitle(lapseCode) && (
            <FormRow isPaddingBottom label={notificationDateTitle(lapseCode)}>
              {values?.lapseInfoVO?.notificationDate}
            </FormRow>
          )}
          {submissionDeadlineTitle(lapseCode) && (
            <FormRow isPaddingBottom label={submissionDeadlineTitle(lapseCode)}>
              {values?.lapseInfoVO?.submissionDeadline}
            </FormRow>
          )}
          {submissionDateTitle(lapseCode) && (
            <FormRow isPaddingBottom label={submissionDateTitle(lapseCode)}>
              {values?.lapseInfoVO?.submissionDate}
            </FormRow>
          )}
          {totalBatchesTitle(lapseCode) && (
            <FormRow isPaddingBottom label={totalBatchesTitle(lapseCode)}>
              {values?.lapseInfoVO?.totalBatches}
            </FormRow>
          )}
          <div className="row">
            <div className="col-12 font-weight-bold">Supporting Documents</div>
          </div>
          <div className="mb-2" />
          <FormRow isPaddingBottom>
            <BinaryFileGallery fileIdList={fileListDisplay?.map((photo) => photo.fileId)} />
          </FormRow>
        </div>
      </div>
    </div>
  );

  // const

  return (
    <TabContent>
      {values?.lapseInfoVO?.isEditable && (
        <div className="tab-pane__group bg-white ">
          <p className="tab-pane__title text-white">Rejection Remark</p>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
                <div className="col-md-9 col-lg-10">{values?.rejectRemark}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {values?.lapseInfoVO?.isEditable ? EditableLapse : DisplayLapse}
      <InPageLoading isLoading={isLoading} />
    </TabContent>
  );
});

export default AdHoc;

export const adhocValidation = (values) => {
  const { lapseInfoVO } = values;
  const { submissionDate = '', submissionDeadline = '', totalBatches = '', year = '', month = '', notificationDate = '', lapseCode = '' } = lapseInfoVO;

  const errors = {};
  const result = {};
  let errorCount = 0;
  if (lapseInfoVO?.isEditable === false) return {};
  const required = 'Required';
  if (!year) {
    errors.year = required;
    errorCount += 1;
  }
  if (!month) {
    errors.month = required;
    errorCount += 1;
  }
  if (submissionDateTitle(lapseCode) && !submissionDate) {
    errors.submissionDate = required;
    errorCount += 1;
  }
  if (submissionDeadlineTitle(lapseCode) && !submissionDeadline) {
    errors.submissionDeadline = required;
    errorCount += 1;
  }
  if (notificationDateTitle(lapseCode) && !notificationDate) {
    errors.notificationDate = required;
    errorCount += 1;
  }
  if (totalBatchesTitle(lapseCode)) {
    const totalBatchesError = formikValidate(totalBatches, ['positive']);
    if (totalBatchesError) {
      errors.totalBatches = totalBatchesError;
      errorCount += 1;
    }
  }
  if (errorCount) {
    result.errorCount = errorCount;
    result.errorHint = configMissingFieldMessage(errorCount);
    result.lapseInfoVO = errors;
  }
  return result;
};
