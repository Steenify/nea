import { activeOperationsForUserService, linkToExistingOperationService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const EXISTING_OPERATIONS = actionCreator('EXISTING_OPERATIONS');
export const getExistingOperationsAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: EXISTING_OPERATIONS.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: EXISTING_OPERATIONS.SUCCESS,
      payload: data.operationsList || [],
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: EXISTING_OPERATIONS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(activeOperationsForUserService(params), onPending, onSuccess, onError);
};

export const LINK_EXISTING_OPERATIONS = actionCreator('LINK_EXISTING_OPERATIONS');
export const linkExistingOperationsAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: LINK_EXISTING_OPERATIONS.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: LINK_EXISTING_OPERATIONS.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: LINK_EXISTING_OPERATIONS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(linkToExistingOperationService(params), onPending, onSuccess, onError);
};
