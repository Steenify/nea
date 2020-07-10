import { isValidUEN, isValid_NRIC_FIN, formikValidate } from 'utils';

export const Form3Mode = {
  view: 'view',
  create: 'edit',
  enforce: 'enforce',
  void: 'void',
};

export const form3Validation = (mode, values) => {
  const { routeTo, premiseFullAddress, isStandardFormat, enforcement, contingencySwitch } = values;
  const errors = {};
  let infoErrorCount = 0;
  let enforcementErrorCount = 0;

  if (mode === Form3Mode.create) {
    if (!values.regionOfficeCode) {
      errors.regionOfficeCode = 'Required';
      infoErrorCount += 1;
    }
    if (!values.ownerName) {
      errors.ownerName = 'Required';
      infoErrorCount += 1;
    }
    if (!values.ownerId) {
      errors.ownerId = 'Required';
      infoErrorCount += 1;
    }
    if (!values.ownerFullAddress) {
      errors.ownerFullAddress = 'Required';
      infoErrorCount += 1;
    }
    if (!routeTo && contingencySwitch !== 'NO_CONTIGENCY') {
      errors.routeTo = 'Required';
      infoErrorCount += 1;
    }
    if (!isStandardFormat) {
      if (!premiseFullAddress) {
        errors.premiseFullAddress = 'Required';
        infoErrorCount += 1;
      }
    } else {
      if (!values.postalCode) {
        errors.postalCode = 'Required';
        infoErrorCount += 1;
      }
      if (!values.streetName) {
        errors.streetName = 'Required';
        infoErrorCount += 1;
      }
      if (values.floorNo) {
        const message = formikValidate(values.floorNo, ['positive']);
        if (message) {
          errors.floorNo = message;
          infoErrorCount += 1;
        }
      }
      if (values.unitNo) {
        const message = formikValidate(values.unitNo, ['positive']);
        if (message) {
          errors.unitNo = message;
          infoErrorCount += 1;
        }
      }
    }
  }

  if (mode === Form3Mode.enforce) {
    const enforcementError = {};
    if (!enforcement.offenderIdType) {
      enforcementError.offenderIdType = 'Required';
      enforcementErrorCount += 1;
    }
    if (!enforcement.offenderId) {
      enforcementError.offenderId = 'Required';
      enforcementErrorCount += 1;
    } else {
      if (enforcement.offenderIdType === 'UEN' && !isValidUEN(enforcement.offenderId)) {
        enforcementError.offenderId = 'Invalid UEN';
        enforcementErrorCount += 1;
      }
      if ((enforcement.offenderIdType === 'FIN' || enforcement.offenderIdType === 'NRIC') && !isValid_NRIC_FIN(enforcement.offenderId)) {
        enforcementError.offenderId = `Invalid ${enforcement.offenderIdType}`;
        enforcementErrorCount += 1;
      }
    }

    if (!enforcement.offenceCode) {
      enforcementError.offenceCode = 'Required';
      enforcementErrorCount += 1;
    }
    if (enforcement.isEnforcementToEEMS2 !== false && enforcement.isEnforcementToEEMS2 !== true) {
      enforcementError.isEnforcementToEEMS2 = 'Required';
      enforcementErrorCount += 1;
    }
    if (enforcementErrorCount > 0) errors.enforcement = enforcementError;
  }

  if (infoErrorCount + enforcementErrorCount) {
    errors.errorCount = infoErrorCount + enforcementErrorCount;
    let errorHint = '';
    if (infoErrorCount) errorHint += `There are ${infoErrorCount} missing required fields in Info Tab. `;
    if (enforcementErrorCount) errorHint += `There are ${enforcementErrorCount} missing required fields in Enforcement Tab. `;
    errors.errorHint = errorHint;
  }
  return errors;
};
