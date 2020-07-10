import update from 'react-addons-update';
import { CHANGE_LD_STATUS } from 'modules/my-workspace/site-paper-team-leader/action';
import { APPROVE_FINDINGS, SAVE_AS_DRAFT, UPDATE_SHOW_CAUSE, AD_HOC_SUBMIT } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CHANGE_LD_STATUS.PENDING:
    case UPDATE_SHOW_CAUSE.PENDING:
    case SAVE_AS_DRAFT.PENDING:
    case APPROVE_FINDINGS.PENDING:
    case AD_HOC_SUBMIT.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });

    case CHANGE_LD_STATUS.ERROR:
    case CHANGE_LD_STATUS.SUCCESS:
    case UPDATE_SHOW_CAUSE.SUCCESS:
    case SAVE_AS_DRAFT.SUCCESS:
    case UPDATE_SHOW_CAUSE.ERROR:
    case SAVE_AS_DRAFT.ERROR:
    case APPROVE_FINDINGS.SUCCESS:
    case APPROVE_FINDINGS.ERROR:
    case AD_HOC_SUBMIT.SUCCESS:
    case AD_HOC_SUBMIT.ERROR:
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
