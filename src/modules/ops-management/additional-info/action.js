import { getAdditionalInfoService, updateAdditionalInfoService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const OPS_GET_ADDITIONAL_INFO = actionCreator('OPS_GET_ADDITIONAL_INFO');
export const getAdditionalInfoAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_GET_ADDITIONAL_INFO.PENDING,
    });
  };
  const onSuccess = (data) => {
    if (data?.operationsList?.length > 0) {
      dispatch({
        type: OPS_GET_ADDITIONAL_INFO.SUCCESS,
        payload: data.operationsList[0],
      });
      if (callback) callback();
    }
  };
  const onError = (error) => {
    dispatch({
      type: OPS_GET_ADDITIONAL_INFO.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getAdditionalInfoService(params), onPending, onSuccess, onError);
};

export const OPS_UPDATE_ADDITIONAL_INFO = actionCreator('OPS_UPDATE_ADDITIONAL_INFO');
export const updateAdditionalInfoAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_UPDATE_ADDITIONAL_INFO.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_UPDATE_ADDITIONAL_INFO.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_UPDATE_ADDITIONAL_INFO.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateAdditionalInfoService(params), onPending, onSuccess, onError);
};

export const OPS_RESET_ADDITIONAL_INFO = 'OPS_RESET_ADDITIONAL_INFO';
export const resetAdditionInfoReducer = () => (dispatch) => {
  dispatch({
    type: OPS_RESET_ADDITIONAL_INFO,
  });
};
