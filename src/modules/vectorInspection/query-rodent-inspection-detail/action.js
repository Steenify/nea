import { getRodentInspectionDetailService } from 'services/inspection-management/rodent';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_RODENT_INSPECTION_DETAIL = actionCreator('GET_RODENT_INSPECTION_DETAIL');
export const getRodentInspectionDetailAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: GET_RODENT_INSPECTION_DETAIL.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: GET_RODENT_INSPECTION_DETAIL.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: GET_RODENT_INSPECTION_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getRodentInspectionDetailService(params), onPending, onSuccess, onError);
};
