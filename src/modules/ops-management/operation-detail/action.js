import { closeOperationService, getOpsDataTableService, reassignOpsService, searchActiveOperationsService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const OPS_SEARCH = actionCreator('OPS_SEARCH');
export const searchOperationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data.operationsList || [];
    dispatch({
      type: OPS_SEARCH.SUCCESS,
      payload: list[0],
    });
    if (callback) callback(list[0]);
  };
  const onError = (error) => {
    dispatch({
      type: OPS_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchActiveOperationsService(params), onPending, onSuccess, onError);
};

export const OPS_CLOSE_OPERATION = actionCreator('OPS_CLOSE_OPERATION');
export const closeOperationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_CLOSE_OPERATION.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_CLOSE_OPERATION.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_CLOSE_OPERATION.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(closeOperationService(params), onPending, onSuccess, onError);
};

export const OPS_DATA_TABLE = actionCreator('OPS_DATA_TABLE');
export const getOpsDataTableAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_DATA_TABLE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_DATA_TABLE.SUCCESS,
      payload: data.operationsSummaryVO || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_DATA_TABLE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getOpsDataTableService(params), onPending, onSuccess, onError);
};

export const OPS_REASSIGN_OPERATION = actionCreator('OPS_REASSIGN_OPERATION');
export const reassignOperationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_REASSIGN_OPERATION.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_REASSIGN_OPERATION.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_REASSIGN_OPERATION.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(reassignOpsService(params), onPending, onSuccess, onError);
};
