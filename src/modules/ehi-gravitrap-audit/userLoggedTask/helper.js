import { arrayHasErrorField } from 'utils';

export const validate = (values) => {
  const errors = {};
  if (values.data && values.data.length) {
    const dataErrors = [];
    const required = '(Required)';
    values.data.forEach((item) => {
      const error = {};
      if (!item.premiseType) {
        error.premiseType = required;
      }
      if (!item.groupBy) {
        error.groupBy = required;
      }
      if (!item.groupId) {
        error.groupId = required;
      }
      // if (item.recurring && !item.endDate) {
      //   error.endDate = required;
      // }
      dataErrors.push(error);
    });
    if (arrayHasErrorField(dataErrors)) errors.data = dataErrors;
  }
  return errors;
};

export const ACTION_TYPES = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  NONE: 'NONE',
};

export const initialSector = {
  // id: '',
  premiseType: '',
  groupBy: '',
  groupId: '',
  recurring: false,
  endDate: null,
  action: ACTION_TYPES.NONE,
};
