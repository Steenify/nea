import { roleListingService } from 'services/authentication-authorisation/role-function-mapping';
import { getWidgetByRoleService, deleteWidgetByRoleService } from 'services/dashboard';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const WIDGET_BY_ROLE_FILTER_LISTING = 'WIDGET_BY_ROLE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      widgetByRole: {
        data: { list },
        ui: { filterValue },
      },
    },
  } = getState();
  const filteredList = list.filter((item) => filterFunc(item, filterValue)).sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: WIDGET_BY_ROLE_FILTER_LISTING,
    payload: filteredList,
  });
};

export const WIDGET_BY_ROLE_UPDATE_FILTER = 'WIDGET_BY_ROLE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: WIDGET_BY_ROLE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const WIDGET_BY_ROLE_LISTING = actionCreator('WIDGET_BY_ROLE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: WIDGET_BY_ROLE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: WIDGET_BY_ROLE_LISTING.SUCCESS,
      payload: data.roleVoList || [],
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: WIDGET_BY_ROLE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(roleListingService(), onPending, onSuccess, onError);
};

export const WIDGET_BY_ROLE_ASSIGNED_LISTING = actionCreator('WIDGET_BY_ROLE_ASSIGNED_LISTING');
export const getAssignedListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: WIDGET_BY_ROLE_ASSIGNED_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: WIDGET_BY_ROLE_ASSIGNED_LISTING.SUCCESS,
      payload: data.widgetResponseVO || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: WIDGET_BY_ROLE_ASSIGNED_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getWidgetByRoleService(), onPending, onSuccess, onError);
};

export const WIDGET_BY_ROLE_DELETE = actionCreator('WIDGET_BY_ROLE_DELETE');
export const deleteAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: WIDGET_BY_ROLE_DELETE.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: WIDGET_BY_ROLE_DELETE.SUCCESS,
    });
    dispatch(getAssignedListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: WIDGET_BY_ROLE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(deleteWidgetByRoleService(params), onPending, onSuccess, onError);
};

export const WIDGET_BY_ROLE_RESET_REDUCER = 'WIDGET_BY_ROLE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: WIDGET_BY_ROLE_RESET_REDUCER,
  });
};
