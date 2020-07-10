import update from 'react-addons-update';
import { RODENT_AUDIT_LATE_SUBMISSION_LISTING, RODENT_AUDIT_LATE_SUBMISSION_FILTER, RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.PENDING:
    case RODENT_AUDIT_LATE_SUBMISSION_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case RODENT_AUDIT_LATE_SUBMISSION_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.SUCCESS:
    case RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.ERROR:
    case RODENT_AUDIT_LATE_SUBMISSION_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case RODENT_AUDIT_LATE_SUBMISSION_FILTER:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;
