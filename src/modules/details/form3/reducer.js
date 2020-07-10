import update from 'react-addons-update';
import {
  VECTOR_INSPECTION_FORM3_DETAIL,
  VECTOR_INSPECTION_FORM3_SAVE,
  VECTOR_INSPECTION_FORM3_SUBMIT,
  VECTOR_INSPECTION_FORM3_VOID,
} from './action';

const initialState = {
  ui: {
    isDetailLoaded: false,
    isLoading: false,
    errorMessage: null,
  },
  data: {
    form3VO: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case VECTOR_INSPECTION_FORM3_SUBMIT.PENDING:
    case VECTOR_INSPECTION_FORM3_SAVE.PENDING:
    case VECTOR_INSPECTION_FORM3_VOID.PENDING:
    case VECTOR_INSPECTION_FORM3_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case VECTOR_INSPECTION_FORM3_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
          isDetailLoaded: { $set: true },
        },
        data: { $merge: payload },
      });
    case VECTOR_INSPECTION_FORM3_VOID.SUCCESS:
    case VECTOR_INSPECTION_FORM3_SAVE.SUCCESS:
    case VECTOR_INSPECTION_FORM3_SUBMIT.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case VECTOR_INSPECTION_FORM3_VOID.ERROR:
    case VECTOR_INSPECTION_FORM3_SAVE.ERROR:
    case VECTOR_INSPECTION_FORM3_SUBMIT.ERROR:
    case VECTOR_INSPECTION_FORM3_DETAIL.ERROR:
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
