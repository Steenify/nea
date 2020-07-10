import { getDashboardDetailService } from 'services/dashboard';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const DASHBOARD_SAMPLE_DETAIL = actionCreator('DASHBOARD_SAMPLE_DETAIL');
export const getDashboardDetailAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DASHBOARD_SAMPLE_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: DASHBOARD_SAMPLE_DETAIL.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: DASHBOARD_SAMPLE_DETAIL.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(getDashboardDetailService(params), onPending, onSuccess, onError);
};
