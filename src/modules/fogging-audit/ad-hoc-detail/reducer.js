import update from 'react-addons-update';
import {
  FOGGING_AUDIT_AD_HOC_DETAIL,
  FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_FILTER,
  FOGGING_AUDIT_AD_HOC_DETAIL_PAST_FILTER,
  FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    upcomingList: [],
    pastList: [],
    filteredUpcomingList: [],
    filteredPastList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.PENDING:
    case FOGGING_AUDIT_AD_HOC_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case FOGGING_AUDIT_AD_HOC_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          upcomingList: { $set: payload.upcomingFoggings },
          filteredUpcomingList: { $set: payload.upcomingFoggings },
          pastList: { $set: payload.pastFoggings },
          filteredPastList: { $set: payload.pastFoggings },
        },
      });

    case FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.SUCCESS:
    case FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.ERROR:
    case FOGGING_AUDIT_AD_HOC_DETAIL.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_FILTER:
      return update(state, {
        data: {
          filteredUpcomingList: { $set: payload },
        },
      });
    case FOGGING_AUDIT_AD_HOC_DETAIL_PAST_FILTER:
      return update(state, {
        data: {
          filteredPastList: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;
