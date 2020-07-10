import uuid from 'uuid/v4';

import { sysConfigListingService, sysConfigDeleteService, sysConfigCreateService, sysConfigUpdateService } from 'services/administration-configuration/system-configuration';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  configName: '',
  configValue: '',
  configDescription: '',
  roles: 'UserAdmin',
  updateable: true,
  action: 'add',
});

export const SYSCONFIG_MAINTENANCE_FILTER_LISTING = 'SYSCONFIG_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      systemConfiguration: {
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
    type: SYSCONFIG_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const SYSCONFIG_MAINTENANCE_UPDATE_FILTER = 'SYSCONFIG_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_LISTING = actionCreator('SYSCONFIG_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_LISTING.SUCCESS,
      payload: data.sysConfigurationVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sysConfigListingService(), onPending, onSuccess, onError);
};

export const SYSCONFIG_MAINTENANCE_DELETE = actionCreator('SYSCONFIG_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sysConfigDeleteService({ id }), onPending, onSuccess, onError);
};

export const SYSCONFIG_MAINTENANCE_CREATE = actionCreator('SYSCONFIG_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.sysConfigurationVo.id;
    const updateable = data.sysConfigurationVo.updateable;
    dispatch({
      type: SYSCONFIG_MAINTENANCE_CREATE.SUCCESS,
      payload: { oldId: params.id, newId, updateable },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sysConfigCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const SYSCONFIG_MAINTENANCE_UPDATE = actionCreator('SYSCONFIG_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SYSCONFIG_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sysConfigUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const SYSCONFIG_MAINTENANCE_EDIT = 'SYSCONFIG_MAINTENANCE_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_CANCEL_EDITING = 'SYSCONFIG_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_ADD = 'SYSCONFIG_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_REMOVE_ADD = 'SYSCONFIG_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_SET_VALUE = 'SYSCONFIG_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const SYSCONFIG_MAINTENANCE_RESET_REDUCER = 'SYSCONFIG_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: SYSCONFIG_MAINTENANCE_RESET_REDUCER,
  });
};
