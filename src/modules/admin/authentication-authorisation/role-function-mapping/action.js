import { roleListingService } from 'services/authentication-authorisation/role-function-mapping';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const ROLE_FUNCTION_MAPPING_FILTER_LISTING = 'ROLE_FUNCTION_MAPPING_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      roleFunctionMapping: {
        data: { editingList },
        ui: { filterValue },
      },
    },
  } = getState();
  const addedList = editingList.filter((item) => item.action === 'add');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const editList = editingList.filter((item) => item.action === 'edit');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const oldList = editingList
    .filter((item) => item.action !== 'add' && item.action !== 'edit')
    .filter((item) => filterFunc(item, filterValue))
    .sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: ROLE_FUNCTION_MAPPING_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const ROLE_FUNCTION_MAPPING_UPDATE_FILTER = 'ROLE_FUNCTION_MAPPING_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const ROLE_FUNCTION_MAPPING_LISTING = actionCreator('ROLE_FUNCTION_MAPPING_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_LISTING.SUCCESS,
      payload: data.roleVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(roleListingService(), onPending, onSuccess, onError);
};

export const ROLE_FUNCTION_MAPPING_DELETE = actionCreator('ROLE_FUNCTION_MAPPING_DELETE');
export const deleteAction = ({ roleId }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_DELETE.SUCCESS,
      payload: roleId,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(roleListingService({ roleId }), onPending, onSuccess, onError);
};

// Local Actions

export const ROLE_FUNCTION_MAPPING_EDIT = 'ROLE_FUNCTION_MAPPING_EDIT';
export const editAction = (roleId) => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_EDIT,
    payload: roleId,
  });
  dispatch(filterListingAction());
};

export const ROLE_FUNCTION_MAPPING_CANCEL_EDITING = 'ROLE_FUNCTION_MAPPING_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const ROLE_FUNCTION_MAPPING_REMOVE_ADD = 'ROLE_FUNCTION_MAPPING_REMOVE_ADD';
export const removeAddAction = (roleId) => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_REMOVE_ADD,
    payload: roleId,
  });
  dispatch(filterListingAction());
};

export const ROLE_FUNCTION_MAPPING_SET_VALUE = 'ROLE_FUNCTION_MAPPING_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const ROLE_FUNCTION_MAPPING_RESET_REDUCER = 'ROLE_FUNCTION_MAPPING_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: ROLE_FUNCTION_MAPPING_RESET_REDUCER,
  });
};
