import update from 'react-addons-update';
import {
  VECTOR_INSPECTION_GET_TRACK_LISTING,
  VECTOR_INSPECTION_GET_TRACK_LISTING_FILTER,
  VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    samples: [],
    filteredSamples: [],
    totalCollected: 0,
    totalDeposited: 0,
    totalSent: 0,
    totalReceived: 0,
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.PENDING:
    case VECTOR_INSPECTION_GET_TRACK_LISTING.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case VECTOR_INSPECTION_GET_TRACK_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          samples: { $set: payload.samples },
          totalCollected: { $set: payload.totalCollected },
          totalDeposited: { $set: payload.totalDeposited },
          totalReceived: { $set: payload.totalReceived },
          totalSent: { $set: payload.totalSent },
        },
      });
    }
    case VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.ERROR:
    case VECTOR_INSPECTION_GET_TRACK_LISTING.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case VECTOR_INSPECTION_GET_TRACK_LISTING_FILTER: {
      return update(state, { data: { filteredSamples: { $set: payload } } });
    }
    default:
      return { ...state };
  }
};
