import { listingService, updateService } from 'services/ehi-gravitrap-audit/userLoggedTask';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const LISTING = actionCreator('EHI_GRAVITRAP_AUDIT_USER_LOGGED_TASK_LISTING');
export const listingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LISTING.PENDING,
    });
  };
  const onSuccess = (payload) => {
    dispatch({
      type: LISTING.SUCCESS,
      payload,
    });
  };
  const onError = (error) => {
    dispatch({
      type: LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(listingService(), onPending, onSuccess, onError);
};

export const UPDATE = actionCreator('EHI_GRAVITRAP_AUDIT_USER_LOGGED_TASK_UPDATE');
export const updateAction = (data = [], callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: UPDATE.SUCCESS,
      // payload: data?.gtUserLoggedTasksList || [],
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateService({ gtUserLoggedTasksList: data }), onPending, onSuccess, onError);
};
