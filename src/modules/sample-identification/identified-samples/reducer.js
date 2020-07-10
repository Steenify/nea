import update from 'react-addons-update';
import {
  VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST,
  VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST_FILTER,
  VECTOR_INSPECTION_FORM3_CREATE,
  VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION,
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
    case VECTOR_INSPECTION_FORM3_CREATE.PENDING:
    case VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.PENDING:
    case VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          samples: { $set: payload.sampleIdentifiedVOs },
          filteredSamples: { $set: payload.sampleIdentifiedVOs },
        },
      });
    }
    case VECTOR_INSPECTION_FORM3_CREATE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case VECTOR_INSPECTION_FORM3_CREATE.ERROR:
    case VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.ERROR:
    case VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST_FILTER: {
      return update(state, { data: { filteredSamples: { $set: payload } } });
    }
    default:
      return { ...state };
  }
};
