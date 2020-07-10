import update from 'react-addons-update';
import moment from 'moment';
import { GET_BLOCK_SUMMARY, SET_DEFAULT_VALUE, FILTER_BLOCK_SUMMARY } from './action';

export const defaultValue = {
  searchText: '',
  searchType: 'roadName',
  datePicker: {
    startDateValueOf: moment().startOf('day').add(-30, 'days').valueOf(),
    endDateValueOf: moment().endOf('day').valueOf(),
  },
  filterValue: {
    division: [],
    premisesType: [],
    regionOffice: [],
  },
  premiseType: 'BLOCK',
  sortValue: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
};

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    defaultValue,
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BLOCK_SUMMARY.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_BLOCK_SUMMARY.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
        },
      });
    case GET_BLOCK_SUMMARY.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    case FILTER_BLOCK_SUMMARY:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case SET_DEFAULT_VALUE:
      return update(state, {
        data: {
          defaultValue: { $merge: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;
