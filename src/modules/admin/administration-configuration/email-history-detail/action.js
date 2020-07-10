import { getEmailHistoryDetails } from 'services/administration-configuration/email-history-detail';

import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_EMAIL_HISTORY_DETAIL = actionCreator('GET_EMAIL_HISTORY_DETAIL');
export const getListEmailHistory = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: GET_EMAIL_HISTORY_DETAIL.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: GET_EMAIL_HISTORY_DETAIL.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: GET_EMAIL_HISTORY_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getEmailHistoryDetails(params), onPending, onSuccess, onError);
};
