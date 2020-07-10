import { adHocUpcomingDetailService } from 'services/fogging-audit';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const FOGGING_AUDIT_AD_HOC_UPCOMING = actionCreator('FOGGING_AUDIT_AD_HOC_UPCOMING');
export const upcomingFoggingDetailAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_UPCOMING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_UPCOMING.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_UPCOMING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(adHocUpcomingDetailService(params), onPending, onSuccess, onError);
};
