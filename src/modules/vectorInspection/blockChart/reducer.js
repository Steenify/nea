import update from 'react-addons-update';
import { GET_BLOCK_CHART, VIEW_APPROVED_NOTICE } from './action';

const defaultResponse = {
  levels: [],
  summary: {},
};

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: defaultResponse,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BLOCK_CHART.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_BLOCK_CHART.SUCCESS: {
      const allUnits =
        payload?.levels
          ?.map(item => item?.units || [])
          ?.flat()
          ?.filter(item => item.isUnitExisted) || [];
      const totalCLIssued = allUnits.filter(item => item.isCallLetterIssued)?.length;
      const totalS35Issued = allUnits.filter(item => item.isS35Issued)?.length || 0;
      const totalS35RIssued = allUnits.filter(item => item.isS35RIssued)?.length || 0;
      const totalS36Issued = allUnits.filter(item => item.isS36Issued)?.length || 0;
      const temp = {
        ...payload,
        levels: payload.levels.sort((a, b) => {
          const numA = Number(a?.floorNo || 0) || 0;
          const numB = Number(b?.floorNo || 0) || 0;
          return numB - numA;
        }),
        totalCLIssued,
        totalS35Issued,
        totalS35RIssued,
        totalS36Issued,
      };
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: temp },
      });
    }
    case GET_BLOCK_CHART.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: defaultResponse },
      });
    case VIEW_APPROVED_NOTICE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case VIEW_APPROVED_NOTICE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case VIEW_APPROVED_NOTICE.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    default:
      return state;
  }
};

export default reducer;
