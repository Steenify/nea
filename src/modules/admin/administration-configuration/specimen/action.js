import uuid from 'uuid/v4';

import { specimenListingService, specimenDeleteService, specimenCreateService, specimenUpdateService } from 'services/administration-configuration/specimen';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  specimenTypeCd: '',
  specimenName: '',
  stage: [],
  action: 'add',
});

export const SPECIMEN_MAINTENANCE_FILTER_LISTING = 'SPECIMEN_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      specimenMaintenance: {
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
    type: SPECIMEN_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const SPECIMEN_MAINTENANCE_UPDATE_FILTER = 'SPECIMEN_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_LISTING = actionCreator('SPECIMEN_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_LISTING.SUCCESS,
      payload: data.specimenCdVOList,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(specimenListingService(), onPending, onSuccess, onError);
};

export const SPECIMEN_MAINTENANCE_DELETE = actionCreator('SPECIMEN_MAINTENANCE_DELETE');
export const deleteAction = ({ id, specimenTypeCd }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(specimenDeleteService({ specimenTypeCd }), onPending, onSuccess, onError);
};

export const SPECIMEN_MAINTENANCE_CREATE = actionCreator('SPECIMEN_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_CREATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(specimenCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const SPECIMEN_MAINTENANCE_UPDATE = actionCreator('SPECIMEN_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SPECIMEN_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(specimenUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const SPECIMEN_MAINTENANCE_EDIT = 'SPECIMEN_MAINTENANCE_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_CANCEL_EDITING = 'SPECIMEN_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_ADD = 'SPECIMEN_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_REMOVE_ADD = 'SPECIMEN_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_SET_VALUE = 'SPECIMEN_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const SPECIMEN_MAINTENANCE_RESET_REDUCER = 'SPECIMEN_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: SPECIMEN_MAINTENANCE_RESET_REDUCER,
  });
};
