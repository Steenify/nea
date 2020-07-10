import { searchEWeekService } from 'services/administration-configuration/eweek';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const EWEEK_MAINTENANCE_FILTER_LISTING = 'EWEEK_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      eWeekListingMaintenance: {
        data: { list },
        ui: { filterValue },
      },
    },
  } = getState();
  const filteredList = list.filter((item) => filterFunc(item, filterValue)).sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: EWEEK_MAINTENANCE_FILTER_LISTING,
    payload: filteredList,
  });
};

export const EWEEK_MAINTENANCE_UPDATE_FILTER = 'EWEEK_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: EWEEK_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const EWEEK_MAINTENANCE_LISTING = actionCreator('EWEEK_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EWEEK_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EWEEK_MAINTENANCE_LISTING.SUCCESS,
      payload: data.eweekVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: EWEEK_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchEWeekService(), onPending, onSuccess, onError);
};

export const EWEEK_MAINTENANCE_RESET_REDUCER = 'EWEEK_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: EWEEK_MAINTENANCE_RESET_REDUCER,
  });
};
