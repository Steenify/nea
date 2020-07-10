import { activeOperationsForUserService, allActiveOperationsService, searchActiveOperationsService, getActiveOpsSGService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const ACTIVE_OPS_FOR_USER_LISTING = actionCreator('ACTIVE_OPS_FOR_USER_LISTING');
export const getActiveOperationsForUserAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ACTIVE_OPS_FOR_USER_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ACTIVE_OPS_FOR_USER_LISTING.SUCCESS,
      payload: data.operationsList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: ACTIVE_OPS_FOR_USER_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(activeOperationsForUserService(params), onPending, onSuccess, onError);
};

export const ALL_ACTIVE_OPS_LISTING = actionCreator('ALL_ACTIVE_OPS_LISTING');
export const getAllActiveOperationsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ALL_ACTIVE_OPS_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ALL_ACTIVE_OPS_LISTING.SUCCESS,
      payload: data.operationsList || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: ALL_ACTIVE_OPS_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(allActiveOperationsService(params), onPending, onSuccess, onError);
};

export const ACTIVE_OPS_SEARCH_CLUSTER = actionCreator('ACTIVE_OPS_SEARCH_CLUSTER');
export const searchActiveOperationsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ACTIVE_OPS_SEARCH_CLUSTER.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data.operationsList || [];
    dispatch({
      type: ACTIVE_OPS_SEARCH_CLUSTER.SUCCESS,
      payload: list,
    });
    if (callback) callback(list);
  };
  const onError = (error) => {
    dispatch({
      type: ACTIVE_OPS_SEARCH_CLUSTER.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchActiveOperationsService(params), onPending, onSuccess, onError);
};

export const ACTIVE_OPS_SG = actionCreator('ACTIVE_OPS_SG');
export const getActiveOpsSGAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ACTIVE_OPS_SG.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ACTIVE_OPS_SG.SUCCESS,
      payload: data.operationsList || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: ACTIVE_OPS_SG.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getActiveOpsSGService(params), onPending, onSuccess, onError);
};

export const ACTIVE_OPS_RESET = 'ACTIVE_OPS_RESET';
export const resetAreaCluster = () => (dispatch) => {
  dispatch({
    type: ACTIVE_OPS_RESET,
  });
};
