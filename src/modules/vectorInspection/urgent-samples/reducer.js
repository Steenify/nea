import update from 'react-addons-update';
import {
  VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING,
  VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING_FILTER,
  VECTOR_INSPECTION_SAVE_URGENT_SAMPLE,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    samples: [],
    filteredSamples: [],
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.PENDING:
    case VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          samples: { $set: payload },
        },
      });
    }
    case VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.SUCCESS:
    case VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.ERROR:
    case VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING_FILTER: {
      return update(state, { data: { filteredSamples: { $set: payload } } });
    }
    default:
      return { ...state };
  }
};
