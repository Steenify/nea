import { getBlockSummaryList } from 'services/vector-inspection';
import { actionCreator, sortFunc, actionTryCatchCreator, filterFunc } from 'utils';

const defaultFilterValue = {
  searchText: '',
  searchType: 'roadName',
  filterValue: {
    division: [],
    regionOffice: [],
    premisesType: [],
  },
  sortValue: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
};

export const SET_DEFAULT_VALUE = 'SET_DEFAULT_VALUE_BLOCK_SUMMARY';
export const setDefaultValueAction = (payload) => (dispatch) => {
  dispatch({
    type: SET_DEFAULT_VALUE,
    payload,
  });
};

export const FILTER_BLOCK_SUMMARY = 'FILTER_BLOCK_SUMMARY';
export const filterBlockSummaryAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      blockSummary: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));
  dispatch({
    type: FILTER_BLOCK_SUMMARY,
    payload: filteredList,
  });
};

export const GET_BLOCK_SUMMARY = actionCreator('GET_BLOCK_SUMMARY');

export const getBlockSummaryListAction = (
  data = {
    searchType: 'string',
    searchKeyword: '',
    inspectionDateFrom: 'string',
    inspectionDateTo: 'string',
    propertyType: 'BLOCK || LANDED',
    regionOffice: 'string',
    divisions: ['string'],
  },
  filterData = defaultFilterValue,
) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_BLOCK_SUMMARY.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_BLOCK_SUMMARY.SUCCESS,
      payload: data.inspections || [],
    });
    dispatch(filterBlockSummaryAction(filterData));
  };
  const onError = (error) => {
    dispatch({
      type: GET_BLOCK_SUMMARY.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getBlockSummaryList(data), onPending, onSuccess, onError);
};
