import uuid from 'uuid/v4';
import * as _ from 'lodash';
import { IdentificationStatus } from 'constants/local-lov';

export const formValidation = (values) => {
  const { identifyStatus, sampleFindingsVOs, sampleRejectionVO } = values;
  const errors = {};
  if (!identifyStatus) errors.identifyStatus = 'Required';
  else if (identifyStatus === IdentificationStatus.rejected.code) {
    const { rejectReasonCodes, rejectReasonOther } = sampleRejectionVO;
    if (rejectReasonCodes && rejectReasonCodes.length > 0) {
      if (rejectReasonCodes.includes('OTH') && !rejectReasonOther) {
        errors.sampleRejectionVO = '(Additional reason must be provided if you choose "Others")';
      }
    } else {
      errors.sampleRejectionVO = '(Please choose at least one reason)';
    }
  } else if (sampleFindingsVOs?.length > 0) {
    const sampleErrors = sampleFindingsVOs.map(() => ({}));
    sampleFindingsVOs.forEach((finding, index) => {
      const { specimenCode, specimenStage, speciesCode, specimenType, sampleTreatmentCode, researcherName, purposeCode, maleCount, femaleCount, unidentifiedCount, remarks } = finding;
      const findingErrors = {};
      if (!specimenCode) {
        findingErrors.specimenCode = 'Required';
      } else if (specimenCode === 'RD') {
        if (!specimenType) {
          findingErrors.specimenType = 'Required';
        }
      } else if (specimenCode === 'MQ') {
        if (!specimenStage || specimenStage.length === 0) {
          findingErrors.specimenStage = 'Specimen Stage is required when Specimen is Mosquito';
        } else if (specimenStage && specimenStage.includes('A')) {
          if (maleCount === undefined || maleCount === null) {
            findingErrors.specimenStage = 'Male Count Required';
          } else if (_.isFinite(Number(maleCount))) {
            if (Number(maleCount) < 0) {
              findingErrors.specimenStage = 'Male Count must be equal or greater than 0';
            }
          } else {
            findingErrors.specimenStage = 'Male Count must be number';
          }

          if (femaleCount === undefined || femaleCount === null) {
            findingErrors.specimenStage = 'Female Count Required';
          } else if (_.isFinite(Number(femaleCount))) {
            if (Number(femaleCount) < 0) {
              findingErrors.specimenStage = 'Female Count must be equal or greater than 0';
            }
          } else {
            findingErrors.specimenStage = 'Female Count must be number';
          }

          if (unidentifiedCount === undefined || unidentifiedCount === null) {
            findingErrors.specimenStage = 'Not-Identified Count Required';
          } else if (_.isFinite(Number(unidentifiedCount))) {
            if (Number(unidentifiedCount) < 0) {
              findingErrors.specimenStage = 'Not-Identified Count must be equal or greater than 0';
            }
          } else {
            findingErrors.specimenStage = 'Not-Identified Count must be number';
          }
        }
      } else if (specimenCode === 'OTH') {
        if (!remarks) findingErrors.remarks = 'Remark must be entered if Specimen is ‘Others’.';
      }
      if (!speciesCode) findingErrors.speciesCode = 'Required';
      if (!sampleTreatmentCode) findingErrors.sampleTreatmentCode = 'Required';
      else if (sampleTreatmentCode === 'R') {
        if (!purposeCode) findingErrors.purposeCode = 'Required';
        if (!researcherName) findingErrors.researcherName = 'Required';
      }
      if (Object.keys(findingErrors).length > 0) {
        sampleErrors[index] = findingErrors;
      }
    });
    if (sampleErrors.some((error) => error !== undefined && Object.keys(error).length > 0)) {
      errors.sampleFindingsVOs = sampleErrors;
    }
  }
  return errors;
};

export const emptyFormValues = (values) => ({
  ...values,
  identifyStatus: '',
  sampleFindingsVOs: values.sampleFindingsVOs.map((finding) => ({
    ...finding,
    specimenCode: '',
    speciesCode: '',
    remarks: '',
    specimenTypeCode: '',
    sampleTreatmentCode: '',
    researchPurpose: '',
    researchBy: '',
    specimenStages: [],
    maleCount: 0,
    femaleCount: 0,
    unidentifiedCount: 0,
  })),
  sampleRejectionVO: {
    remarks: '',
    rejectFileIds: [],
    rejectReasonCodes: [],
    rejectReasonOther: '',
  },
});

export const prepareForInitialize = (findings, sampleId, isEditingSample) => {
  if (findings.length === 0 && isEditingSample) {
    return [emptyFinding(sampleId)];
  }
  return findings.map((finding) => ({
    specimenCode: '',
    speciesCode: '',
    specimenTypeCode: '',
    specimenStage: [],
    remarks: '',
    vectorOfDisease: '',
    sampleTreatmentCode: '',
    purposeCode: '',
    researcherName: '',
    maleCount: 0,
    femaleCount: 0,
    unidentifiedCount: 0,
    ...finding,
  }));
};

export const emptySample = (sample) => {
  const findings = sample.findings.map((finding) => ({
    ...finding,
    specimenCode: '',
    speciesCode: '',
    specimenTypeCode: '',
    specimenStage: [],
    remarks: '',
    vectorOfDisease: '',
    sampleTreatmentCode: '',
    purposeCode: '',
    researcherName: '',
    maleCount: 0,
    femaleCount: 0,
    unidentifiedCount: 0,
  }));
  return {
    ...sample,
    identificationStatusCode: '',
    findings,
  };
};

export const emptyFinding = (sampleId) => ({
  sampleId,
  findingsId: `local_finding_${uuid()}`,
  specimenCode: '',
  speciesCode: '',
  specimenName: '',
  speciesName: '',
  vectorOfDisease: '',
  purpose: '',
  researcherName: '',
  specimenStage: [],
  specimenType: '',
  remarks: '',
  sampleTreatment: '',
  sampleTreatmentCode: '',
  purposeCode: '',
  maleCount: 0,
  femaleCount: 0,
  unidentifiedCount: 0,
});

export const getClassNameFromSampleStatus = (status) => {
  let headerColor = '';
  let badgeClass = '';
  let isSampleEdittable = false;

  switch (status) {
    case 'Identified': {
      headerColor = 'grey';
      badgeClass = 'badge-success';
      isSampleEdittable = false;
      break;
    }
    case 'Pending Certification': {
      headerColor = 'grey';
      badgeClass = 'badge-warning';
      isSampleEdittable = true;
      break;
    }
    case 'Sending to EHI': {
      headerColor = 'grey';
      badgeClass = 'badge-purple';
      isSampleEdittable = true;
      break;
    }
    case 'Rejected': {
      headerColor = 'grey';
      badgeClass = 'badge-danger';
      isSampleEdittable = true;
      break;
    }
    default: {
      headerColor = 'grey';
      badgeClass = 'badge-light';
      isSampleEdittable = false;
      break;
    }
  }

  return { headerColor, badgeClass, isSampleEdittable };
};
