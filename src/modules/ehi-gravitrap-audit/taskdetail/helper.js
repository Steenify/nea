import { arrayHasErrorField, formikValidate } from 'utils';

// const tempSpecimens = [
//   { maleCount: '6', femaleCount: '10', speciesCode: 'AEI' },
//   { maleCount: '10', femaleCount: '14', speciesCode: 'AMS' },
//   { maleCount: '3', femaleCount: '4', speciesCode: 'CDsa' },
// ];
// const tempFiles = ['e21851c0-60cc-4a71-9756-c12da840e1ca', '0965a154-d26a-4451-88e4-0536b834844e'];
// const excelTempFiles = ['066fefd2-fcd1-499c-a51c-c994ad32ec32', 'e7e8562e-6c94-440c-bb69-17f6ce83f05e'];
// const taskId = '2020-4-140081-2A';

export const validate = (values) => {
  const {
    isConcur,
    isSC,
    isSupport,
    // findingsFileList,
    analystSpeciesList,
    analystBottleCount,
    analystSpecimenCount,
    // analystFindingsRemarks,
    analystInitialLapse,
    analystFinalLapse,
    showCause,
    // showCauseRemarks,
    // showcaseFileList,
    concurStatus,
    // managerRemarks,
    managerLapse,
  } = values;
  const required = 'Required';
  let specimenIdentificationErrorCount = 0;
  let showCauseErrorCount = 0;
  const errors = {};
  if (isSupport) return {};
  if (isConcur) {
    if (concurStatus === '') {
      errors.concurStatus = required;
      showCauseErrorCount += 1;
    }
    if (concurStatus === false && !managerLapse.lapseCode) {
      errors.managerLapse = { lapseCode: required };
      showCauseErrorCount += 1;
    }
  } else if (isSC) {
    if (!analystFinalLapse.lapseCode) {
      errors.analystFinalLapse = { lapseCode: required };
      showCauseErrorCount += 1;
    }
  } else {
    const analystBottleCountError = formikValidate(analystBottleCount, ['required', 'positive']);
    if (analystBottleCountError) {
      errors.analystBottleCount = analystBottleCountError;
      specimenIdentificationErrorCount += 1;
    }
    const analystSpecimenCountError = formikValidate(analystSpecimenCount, ['required', 'positive']);
    if (analystSpecimenCountError) {
      errors.analystSpecimenCount = analystSpecimenCountError;
      specimenIdentificationErrorCount += 1;
    }
    if (analystSpeciesList && analystSpeciesList.length) {
      const analystSpeciesListErrors = [];
      analystSpeciesList.forEach((specie) => {
        const { maleCount, femaleCount, speciesCode } = specie;
        const specieError = {};

        const maleCountError = formikValidate(maleCount, ['required', 'positive']);
        if (maleCountError) {
          specieError.maleCount = maleCountError;
          specimenIdentificationErrorCount += 1;
        }
        const femaleCountError = formikValidate(femaleCount, ['required', 'positive']);
        if (femaleCountError) {
          specieError.femaleCount = femaleCountError;
          specimenIdentificationErrorCount += 1;
        }
        if (!speciesCode) {
          specieError.speciesCode = required;
          specimenIdentificationErrorCount += 1;
        }
        analystSpeciesListErrors.push(specieError);
      });
      if (arrayHasErrorField(analystSpeciesListErrors)) errors.analystSpeciesList = analystSpeciesListErrors;
    }
    if (showCause === '') {
      errors.showCause = required;
      showCauseErrorCount += 1;
    }
    if (!analystInitialLapse.lapseCode) {
      errors.analystInitialLapse = { lapseCode: required };
      showCauseErrorCount += 1;
    }
  }
  const errorCount = specimenIdentificationErrorCount + showCauseErrorCount;

  if (errorCount) {
    let errorHint = '';
    errors.errorCount = errorCount;
    if (specimenIdentificationErrorCount) errorHint += `There are ${specimenIdentificationErrorCount} missing required fields in Specimen Identification tab. `;
    if (showCauseErrorCount) errorHint += `There are ${showCauseErrorCount} missing required fields in Show Cause tab. `;
    errors.errorHint = errorHint;
  }
  return errors;
};

export const initialSpecimen = {
  maleCount: '',
  femaleCount: '',
  speciesCode: '',
};

export const initialContractorFindings = {
  noofSampleBottles: '0',
  remarks: '',
  noOfSpecimens: '',
  specimens: [],
};

export const initialAdHocLapse = {
  submissionDate: '',
  submissionDeadline: '',
  totalBatches: '',
  month: '',
  notificationDate: '',
  lapseCode: '',
  lapseDescription: '',
  ehiLapseFileList: [],
  ehiLapseFileVOList: [],
  year: '',
};

export const initialCaseDetail = {
  isSubmit: true,

  taskId: '',
  trapCode: '',
  week: 0,
  year: 0,
  ro: '',
  grc: '',
  constituency: '',
  street: '',
  block: '',
  premiseType: '',
  postalCode: '',
  unit: '',
  level: '',
  status: '',

  // map later
  showcaseFileList: [],
  findingsFileList: [],
  analystSpeciesList: [],
  analystBottleCount: '',
  analystSpecimenCount: '',
  analystFindingsBy: '',
  analystFindingsDate: '',
  analystFindingsRemarks: '',
  showCauseRemarks: '',
  showCause: '',
  managerConcurStatus: '',
  userId: '',
  rejectFlag: false,
  contractorFindings: {},
  analystInitialLapse: {
    lapseCode: '',
    remarks: '',
  },
  analystFinalLapse: {
    lapseCode: '',
    remarks: '',
  },
  managerLapse: {
    lapseCode: '',
    remarks: '',
  },
  concurStatus: '',
  managerRemarks: '',

  contractorRemarks: '',
  contractorBottleCount: '',
  contractorSpecimenCount: '',
  contractorSpeciesList: [],
};
