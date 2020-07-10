import update from 'react-addons-update';
import { LISTING, UPDATE } from './action';
import { initialSector } from './helper';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    list: [],
    nextTaskListGenerationDate: '',
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE.PENDING:
    case LISTING.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case LISTING.SUCCESS: {
      const { gtUserLoggedTasksList = [], nextTaskListGenerationDate = '' } = payload;
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: gtUserLoggedTasksList.map((item) => ({ ...initialSector, ...item })) },
          nextTaskListGenerationDate: { $set: nextTaskListGenerationDate },
        },
      });
    }
    case UPDATE.SUCCESS:
    case UPDATE.ERROR:
    case LISTING.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
