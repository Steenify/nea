import { sofDetailService, sofSaveService, sofSubmitService } from 'services/inspection-management/sof';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const VECTOR_INSPECTION_SOF_DETAIL = actionCreator('VECTOR_INSPECTION_SOF_DETAIL');
export const getSOFDetailAction = inspectionId => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_DETAIL.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_DETAIL.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sofDetailService({ inspectionId }), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_SOF_SAVE = actionCreator('VECTOR_INSPECTION_SOF_SAVE');
export const sofSaveAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SAVE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SAVE.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SAVE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sofSaveService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_SOF_SUBMIT = actionCreator('VECTOR_INSPECTION_SOF_SUBMIT');
export const sofSubmitAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SUBMIT.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SUBMIT.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_SOF_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sofSubmitService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_RESET_SOF_DETAIL = 'VECTOR_INSPECTION_RESET_SOF_DETAIL';
export const resetSOFDetailAction = () => dispatch => {
  dispatch({
    type: VECTOR_INSPECTION_RESET_SOF_DETAIL,
  });
};
