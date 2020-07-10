import { arrayHasErrorField, formikValidate } from 'utils';
import { NEA_ONSET_DATE_TYPE } from 'constants/index';

export const initialAttemptValue = {
  id: '',
  contactDate: '',
  contactMode: '',
  contactOutcome: '',
  contactPerson: '',
  relation: '',
  isNew: true,
};

export const initialResInfoValue = {
  addressId: '',
  districtCode: '',
  premiseCode: '',
  postalCode: '',
  roadName: '',
  buildingName: '',
  premiseNo: '',
  levelNo: '',
  unitNo: '',
  isPrimary: false,
  isNew: true,
  isValid: false,
};

export const initialOfficerInfoValue = {
  addressId: '',
  districtCode: '',
  premiseCode: '',
  postalCode: '',
  roadName: '',
  buildingName: '',
  premiseNo: '',
  levelNo: '',
  unitNo: '',
  officeWorkInfoList: [],
  officeTransportInfoList: [],
  isPrimary: false,
  isNew: true,
  isValid: false,
};

export const initialOfficeWorkInfoValue = {
  id: '',
  workHoursType: '',
  workHours: '',
  workDays: '',
  workStartHrs: '12',
  workStartMnts: '00',
  workEndHrs: '12',
  workEndMnts: '00',
  workStartAmPm: 'AM',
  workEndAmPm: 'AM',
  isNew: true,
};

export const initialOfficeTransportInfoValue = {
  id: '',
  transportMode: '',
  transportFrom: '',
  transportTo: '',
  isNew: true,
};

export const initialClinicInfoValue = {
  id: '',
  visitDate: '',
  clinicName: '',
  addressId: '',
  premiseCode: '',
  postalCode: '',
  roadName: '',
  buildingName: '',
  premiseNo: '',
  levelNo: '',
  unitNo: '',
  isNew: true,
};

export const initialSymptomInfoValue = {
  id: '',
  symptomsCode: '',
  isNew: true,
};

export const initialOverseaMovementValue = {
  id: '',
  dateTravelFrom: '',
  dateTravelTo: '',
  countryCode: '',
  city: '',
  isNew: true,
};

export const initialLocalTravelInfoValue = {
  id: '',
  noVisit: '',
  address1: '',
  address2: '',
  fromVisitHrs: '',
  toVisitHrs: '',
  fromVisitMts: '',
  toVisitMts: '',
  fromVisitAmPm: '',
  toVisitAmPm: '',
  isNew: true,
};

export const initialValues = {
  isSubmitButton: false,
  clusterId: '',
  caseType: '',
  caseId: '',
  status: '',
  lastSavedDate: '',
  remarks: '',
  name: '',
  idType: '',
  idNo: '',
  sex: '',
  ethnicCode: '',
  age: '',
  countryCode: '',
  occupationCode: '',
  occupationOther: '',
  homeNo: '',
  mobileNo: '',
  firstDiagnosisDate: '',
  mohOnSetDate: '',
  initSymptDate: '',
  treatmentRemarks: '',
  neaRecommendStatus: '',
  neaRecommendRemarks: '',
  neaQuery: '',
  neaOnsetDateType: NEA_ONSET_DATE_TYPE.MOH,
  attemptList: [],
  resInfoList: [],
  offInfoList: [],
  localTravInfoList: [],
  overseaTravInfoList: [],
  clinicInfoList: [],
  symptomsList: [],
};

export const validate = (values) => {
  const errors = {};
  let overviewErrorCount = 0;
  if (!values.status) {
    errors.status = '(Required)';
    overviewErrorCount += 1;
  }
  if (values.attemptList && values.attemptList.length) {
    const attemptListErrors = [];
    values.attemptList.forEach((attempt) => {
      const attemptError = {};
      if (!attempt.contactDate) {
        attemptError.contactDate = '(Required)';
        overviewErrorCount += 1;
      }
      if (!attempt.contactMode) {
        attemptError.contactMode = '(Required)';
        overviewErrorCount += 1;
      }
      if (!attempt.contactOutcome) {
        attemptError.contactOutcome = '(Required)';
        overviewErrorCount += 1;
      }
      attemptListErrors.push(attemptError);
    });
    if (arrayHasErrorField(attemptListErrors)) errors.attemptList = attemptListErrors;
  }

  let personalErrorCount = 0;
  // if (values.idNo && !isValid_NRIC_FIN(values.idNo)) {
  //   errors.idNo = 'Invalid NRIC';
  //   personalErrorCount += 1;
  // }
  if (!values.initSymptDate) {
    errors.initSymptDate = '(Required)';
    personalErrorCount += 1;
  }
  if (values.idNo) {
    const error = formikValidate(values.idNo, ['idNo']);
    if (error) {
      errors.idNo = error;
      personalErrorCount += 1;
    }
  }
  if (values.age) {
    const error = formikValidate(values.age, ['positive']);
    if (error) {
      errors.age = error;
      personalErrorCount += 1;
    }
  }
  if (values.homeNo) {
    const error = formikValidate(values.homeNo, ['phone']);
    if (error) {
      errors.homeNo = error;
      personalErrorCount += 1;
    }
  }
  if (values.mobileNo) {
    const error = formikValidate(values.mobileNo, ['phone']);
    if (error) {
      errors.mobileNo = error;
      personalErrorCount += 1;
    }
  }

  if (values.resInfoList && values.resInfoList.length) {
    let resInfoListErrors = [];
    values.resInfoList.forEach((resInfo) => {
      const resInfoError = {};
      const { districtCode, isValid, postalCode, unitNo, levelNo } = resInfo;
      if (isValid) {
        if (!districtCode) {
          resInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else if (postalCode == '999999') {
        if (!districtCode) {
          resInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else {
        resInfoError.postalCode = 'Invalid Postal Code';
        personalErrorCount += 1;
      }

      if (levelNo) {
        const error = formikValidate(levelNo, ['positive']);
        if (error) {
          resInfoError.levelNo = error;
          personalErrorCount += 1;
        }
      }
      if (unitNo) {
        const error = formikValidate(unitNo, ['positive']);
        if (error) {
          resInfoError.unitNo = error;
          personalErrorCount += 1;
        }
      }
      resInfoListErrors.push(resInfoError);
    });
    const bool = values.resInfoList.map((item) => item?.isPrimary || false).reduce((acc, curr) => acc || curr, false);
    if (!bool && values.resInfoList.length > 1) {
      resInfoListErrors = resInfoListErrors.map((item, index) => {
        if (index === 0) {
          return { ...item, isPrimary: 'Please select a primary address.' };
        }
        return item;
      });
      personalErrorCount += 1;
    }
    if (arrayHasErrorField(resInfoListErrors)) errors.resInfoList = resInfoListErrors;
  }

  if (values.offInfoList && values.offInfoList.length) {
    let offInfoListErrors = [];
    values.offInfoList.forEach((offInfo) => {
      const { districtCode, isValid, postalCode, unitNo, levelNo, officeWorkInfoList } = offInfo;
      const offInfoError = {};
      if (levelNo) {
        const error = formikValidate(levelNo, ['positive']);
        if (error) {
          offInfoError.levelNo = error;
          personalErrorCount += 1;
        }
      }
      if (unitNo) {
        const error = formikValidate(unitNo, ['positive']);
        if (error) {
          offInfoError.unitNo = error;
          personalErrorCount += 1;
        }
      }
      if (isValid) {
        if (!districtCode) {
          offInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else if (postalCode == '999999') {
        if (!districtCode) {
          offInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else {
        offInfoError.postalCode = 'Invalid Postal Code';
        personalErrorCount += 1;
      }
      if (officeWorkInfoList?.length > 0) {
        offInfoError.officeWorkInfoList = [{}];
        officeWorkInfoList.forEach((officeWorkInfo) => {
          const { employerContactNo } = officeWorkInfo;
          if (employerContactNo) {
            const error = formikValidate(employerContactNo, ['phone']);
            if (error) {
              offInfoError.officeWorkInfoList[0].employerContactNo = error;
              personalErrorCount += 1;
            }
          }
        });
      }
      offInfoListErrors.push(offInfoError);
    });
    const bool = values.offInfoList.map((item) => item?.isPrimary || false).reduce((acc, curr) => acc || curr, false);
    if (!bool && values.offInfoList.length > 1) {
      offInfoListErrors = offInfoListErrors.map((item, index) => {
        if (index === 0) {
          return { ...item, isPrimary: 'Please select a primary address.' };
        }
        return item;
      });
      personalErrorCount += 1;
    }
    if (arrayHasErrorField(offInfoListErrors)) errors.offInfoList = offInfoListErrors;
  }

  if (values.clinicInfoList && values.clinicInfoList.length) {
    let clinicInfoListErrors = [];
    values.clinicInfoList.forEach((clinicInfo) => {
      const { districtCode, isValid, postalCode, unitNo, levelNo } = clinicInfo;
      const clinicInfoError = {};
      if (isValid) {
        if (!districtCode) {
          clinicInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else if (postalCode == '999999') {
        if (!districtCode) {
          clinicInfoError.districtCode = '(Required)';
          personalErrorCount += 1;
        }
      } else {
        clinicInfoError.postalCode = 'Invalid Postal Code';
        personalErrorCount += 1;
      }
      if (levelNo) {
        const error = formikValidate(levelNo, ['positive']);
        if (error) {
          clinicInfoError.levelNo = error;
          personalErrorCount += 1;
        }
      }
      if (unitNo) {
        const error = formikValidate(unitNo, ['positive']);
        if (error) {
          clinicInfoError.unitNo = error;
          personalErrorCount += 1;
        }
      }
      clinicInfoListErrors.push(clinicInfoError);
    });
    const bool = values.offInfoList.map((item) => item?.isPrimary || false).reduce((acc, curr) => acc || curr, false);
    if (!bool && values.offInfoList.length > 1) {
      clinicInfoListErrors = clinicInfoListErrors.map((item, index) => {
        if (index === 0) {
          return { ...item, isPrimary: 'Please select a primary address.' };
        }
        return item;
      });
      personalErrorCount += 1;
    }
    if (arrayHasErrorField(clinicInfoListErrors)) errors.clinicInfoList = clinicInfoListErrors;
  }

  // * Movement History tab
  let movementErrorCount = 0;
  if (values.localTravInfoList && values.localTravInfoList.length) {
    const localTravInfoListErrors = [];
    let localTravInfoListCount = 0;
    values.localTravInfoList.forEach((item) => {
      const { postalCode, unitNo, levelNo, noVisit, isValid } = item;
      const localTravInfoError = {};
      if (formikValidate(postalCode, ['positive'])) {
        localTravInfoError.postalCode = formikValidate(postalCode, ['positive']);
        localTravInfoListCount += 1;
      }
      if (unitNo) {
        const error = formikValidate(unitNo, ['positive']);
        if (error) {
          localTravInfoError.unitNo = error;
          localTravInfoListCount += 1;
        }
      }
      if (levelNo) {
        const error = formikValidate(levelNo, ['positive']);
        if (error) {
          localTravInfoError.levelNo = error;
          localTravInfoListCount += 1;
        }
      }
      if (noVisit) {
        const error = formikValidate(noVisit, ['positive']);
        if (error) {
          localTravInfoError.noVisit = error;
          localTravInfoListCount += 1;
        }
      }

      localTravInfoListErrors.push(localTravInfoError);
    });
    if (localTravInfoListCount) {
      errors.localTravInfoList = localTravInfoListErrors;
      movementErrorCount += localTravInfoListCount;
    }
  }
  if (values.overseaTravInfoList && values.overseaTravInfoList.length) {
    const overseaTravInfoListErrors = [];
    if (overseaTravInfoListErrors.length) {
      errors.overseaTravInfoList = overseaTravInfoListErrors;
      movementErrorCount += 1;
    }
  }

  const errorCount = overviewErrorCount + movementErrorCount + personalErrorCount;

  if (errorCount) {
    let errorHint = '';
    errors.errorCount = errorCount;
    if (overviewErrorCount) errorHint += `There are ${overviewErrorCount} missing required fields in Overview tab. `;
    if (personalErrorCount) errorHint += `There are ${personalErrorCount} missing required fields in Personal Info tab. `;
    if (movementErrorCount) errorHint += `There are ${movementErrorCount} missing required fields in Movement History tab. `;
    errors.errorHint = errorHint;
  }
  return errors;
};
