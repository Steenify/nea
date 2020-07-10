import update from 'react-addons-update';

import { GET_SAMPLE_INFO, FORM_DETAIL_CERTIFY_FINDINGS, FORM_DETAIL_RESET_REDUCER } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    isSubmitted: false,
    editingFindingIds: new Set(),
  },
  data: {
    formDetail: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FORM_DETAIL_CERTIFY_FINDINGS.PENDING:
    case GET_SAMPLE_INFO.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case GET_SAMPLE_INFO.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: null },
        },
        data: {
          formDetail: { $set: payload },
        },
      });
    }
    case FORM_DETAIL_CERTIFY_FINDINGS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: null },
          isSubmitted: { $set: true },
        },
      });
    }
    case FORM_DETAIL_CERTIFY_FINDINGS.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: payload },
        },
      });
    }
    case GET_SAMPLE_INFO.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: payload },
        },
      });
    }
    case FORM_DETAIL_RESET_REDUCER:
      return update(state, {
        ui: {
          isLoading: { $set: false },
          errorMessage: { $set: null },
          isSubmitted: { $set: false },
          editingFindingIds: { $set: new Set() },
        },
        data: {
          formDetail: { $set: null },
        },
      });
    default:
      return state;
  }
};

export default reducer;
