import { getInAppNotificationListDetailsService } from 'services/administration-configuration/email-history-detail';

import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_NOTIFICATION_HISTORY_DETAIL = actionCreator('GET_NOTIFICATION_HISTORY_DETAIL');
export const getInAppNotificationListDetailsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_NOTIFICATION_HISTORY_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_NOTIFICATION_HISTORY_DETAIL.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GET_NOTIFICATION_HISTORY_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getInAppNotificationListDetailsService(params), onPending, onSuccess, onError);
};
