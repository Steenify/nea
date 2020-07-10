import update from 'react-addons-update';
import { DASHBOARD_SAMPLE_DETAIL } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    sampleCollectedDashboardVoList: undefined,
    sampleIdentifiedPeriodDashboardVoList: undefined,
    sampleIdentifiedDashboardVoList: undefined,
    activeDengueDashboardVoList: undefined,
    activeDenguePreviousDayDashboardRequestVO: undefined,
    activeDengueCurrentEweekComparisonDashboardRequestVO: undefined,
    activeDenguePriorTwoEweekComparisonDashboardRequestVO: undefined,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case DASHBOARD_SAMPLE_DETAIL.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case DASHBOARD_SAMPLE_DETAIL.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case DASHBOARD_SAMPLE_DETAIL.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          sampleCollectedDashboardVoList: { $set: payload?.sampleCollectedDashboardVoList },
          sampleIdentifiedPeriodDashboardVoList: { $set: payload?.sampleIdentifiedPeriodDashboardVoList },
          sampleIdentifiedDashboardVoList: { $set: payload?.sampleIdentifiedDashboardVoList },
          activeDengueDashboardVoList: { $set: payload?.activeDengueDashboardVoList },
          activeDenguePreviousDayDashboardRequestVO: { $set: payload?.activeDenguePreviousDayDashboardRequestVO },
          activeDengueCurrentEweekComparisonDashboardRequestVO: {
            $set: payload?.activeDengueCurrentEweekComparisonDashboardRequestVO,
          },
          activeDenguePriorTwoEweekComparisonDashboardRequestVO: {
            $set: payload?.activeDenguePriorTwoEweekComparisonDashboardRequestVO,
          },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
