import { getFoggingActivityListingService } from 'services/fogging-audit';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'inspectionId',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
  },
};

export const FILTER_QUERY_FOGGING = 'FILTER_QUERY_FOGGING';
export const filterQueryFoggingAction = (filterData) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      queryFogging: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_QUERY_FOGGING,
    payload: filteredList,
  });
};

export const GET_QUERY_FOGGING = actionCreator('GET_QUERY_FOGGING');
export const getFoggingListAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_QUERY_FOGGING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_QUERY_FOGGING.SUCCESS,
      payload: data.activities,
    });
    dispatch(filterQueryFoggingAction(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: GET_QUERY_FOGGING.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(getFoggingActivityListingService(), onPending, onSuccess, onError);
};
