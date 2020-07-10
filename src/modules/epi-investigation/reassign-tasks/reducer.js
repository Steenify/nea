import update from 'react-addons-update';
import { REASSIGN_LISTING, REASSIGN_TASK_FILTER, ASSIGN_TASK_TO_GROUP, EPI_COB1_CASE_REASSIGN } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EPI_COB1_CASE_REASSIGN.PENDING:
    case REASSIGN_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case REASSIGN_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case EPI_COB1_CASE_REASSIGN.ERROR:
    case EPI_COB1_CASE_REASSIGN.SUCCESS:
    case REASSIGN_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case REASSIGN_TASK_FILTER:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case ASSIGN_TASK_TO_GROUP: {
      const { caseId, assignedGroupCode, assignedGroup } = payload;

      const mapFunc = (item) => (item.caseId === caseId ? { ...item, assignedGroupCode, assignedGroup } : item);

      return update(state, {
        data: {
          list: {
            $set: state.data.list.map(mapFunc),
          },
          filteredList: { $set: state.data.filteredList.map(mapFunc) },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
