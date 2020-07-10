import update from 'react-addons-update';
import { OPTIONAL_INSTANCE_CFG_FILTER, OPTIONAL_INSTANCE_CFG_LISTING, SAVE_OPTIONAL_INSTANCE_CFG } from './action';

const initialState = {
  ui: { isLoading: false },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case OPTIONAL_INSTANCE_CFG_LISTING.PENDING:
    case SAVE_OPTIONAL_INSTANCE_CFG.PENDING:
      return update(state, { ui: { isLoading: { $set: true } } });
    case OPTIONAL_INSTANCE_CFG_LISTING.SUCCESS:
      return update(state, { ui: { isLoading: { $set: false } }, data: { list: { $set: payload }, filteredList: { $set: payload } } });
    case OPTIONAL_INSTANCE_CFG_LISTING.ERROR:
    case SAVE_OPTIONAL_INSTANCE_CFG.SUCCESS:
    case SAVE_OPTIONAL_INSTANCE_CFG.ERROR:
      return update(state, { ui: { isLoading: { $set: false } } });
    case OPTIONAL_INSTANCE_CFG_FILTER:
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
