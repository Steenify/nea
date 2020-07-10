import { getGroundSurveillanceDetailService } from 'services/inspection-management/surveillance-for-red-cluster';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_GROUND_SURVEILLANCE_DETAIL = actionCreator('GET_GROUND_SURVEILLANCE_DETAIL');
export const getGroundSurveillanceDetailAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_DETAIL.SUCCESS,
      payload: data.listOfResponseVO,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getGroundSurveillanceDetailService(params), onPending, onSuccess, onError);
};
