import uuid from 'uuid/v4';

import { lapseConfigListingService, lapseConfigDeleteService, lapseConfigCreateService, lapseConfigUpdateService } from 'services/administration-configuration/lapse-configuration';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  lapseCode: '',
  lapseDescription: '',
  ldRate: '',
  lapseType: '',
  roles: [],
  action: 'add',
});

export const LAPSE_CONFIGURATION_FILTER_LISTING = 'LAPSE_CONFIGURATION_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      lapseConfiguration: {
        data: { editingList },
        ui: { filterValue },
      },
    },
  } = getState();
  const addedList = editingList.filter((item) => item.action === 'add');
  const editList = editingList.filter((item) => item.action === 'edit');
  const oldList = editingList
    .filter((item) => item.action !== 'add' && item.action !== 'edit')
    .filter((item) => filterFunc(item, filterValue))
    .sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: LAPSE_CONFIGURATION_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const LAPSE_CONFIGURATION_UPDATE_FILTER = 'LAPSE_CONFIGURATION_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_LISTING = actionCreator('LAPSE_CONFIGURATION_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LAPSE_CONFIGURATION_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data.responseVOList || [];
    dispatch({
      type: LAPSE_CONFIGURATION_LISTING.SUCCESS,
      payload: list,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: LAPSE_CONFIGURATION_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(lapseConfigListingService(), onPending, onSuccess, onError);
};

export const LAPSE_CONFIGURATION_DELETE = actionCreator('LAPSE_CONFIGURATION_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LAPSE_CONFIGURATION_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: LAPSE_CONFIGURATION_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: LAPSE_CONFIGURATION_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(lapseConfigDeleteService({ id }), onPending, onSuccess, onError);
};

export const LAPSE_CONFIGURATION_CREATE = actionCreator('LAPSE_CONFIGURATION_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LAPSE_CONFIGURATION_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.divisionCdVo.id;
    dispatch({
      type: LAPSE_CONFIGURATION_CREATE.SUCCESS,
      payload: { oldId: params.id, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: LAPSE_CONFIGURATION_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(lapseConfigCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const LAPSE_CONFIGURATION_UPDATE = actionCreator('LAPSE_CONFIGURATION_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LAPSE_CONFIGURATION_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: LAPSE_CONFIGURATION_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: LAPSE_CONFIGURATION_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(lapseConfigUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const LAPSE_CONFIGURATION_EDIT = 'LAPSE_CONFIGURATION_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_CANCEL_EDITING = 'LAPSE_CONFIGURATION_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_ADD = 'LAPSE_CONFIGURATION_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_REMOVE_ADD = 'LAPSE_CONFIGURATION_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_SET_VALUE = 'LAPSE_CONFIGURATION_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const LAPSE_CONFIGURATION_RESET_REDUCER = 'LAPSE_CONFIGURATION_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: LAPSE_CONFIGURATION_RESET_REDUCER,
  });
};
