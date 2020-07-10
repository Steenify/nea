import { actionCreator, actionTryCatchCreator } from 'utils';
import {
  form3DetailService,
  form3SaveService,
  form3VoidService,
  form3SubmitService,
  form3EnforcementSubmitService,
} from 'services/inspection-management/form3';

export const VECTOR_INSPECTION_FORM3_DETAIL = actionCreator('VECTOR_INSPECTION_FORM3_DETAIL');
export const viewForm3DetailAction = data => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_DETAIL.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_DETAIL.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3DetailService(data), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_SAVE = actionCreator('VECTOR_INSPECTION_FORM3_SAVE');
export const saveForm3DetailAction = (data, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SAVE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SAVE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SAVE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3SaveService(data), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_SUBMIT = actionCreator('VECTOR_INSPECTION_FORM3_SUBMIT');
export const submitForm3DetailAction = (data, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SUBMIT.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SUBMIT.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3SubmitService(data), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_VOID = actionCreator('VECTOR_INSPECTION_FORM3_VOID');
export const voidForm3DetailAction = (data, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_VOID.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_VOID.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_VOID.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3VoidService(data), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_ENFORCEMENT_SUBMIT = actionCreator('VECTOR_INSPECTION_FORM3_ENFORCEMENT_SUBMIT');
export const submitForm3EnforcementAction = (data, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_ENFORCEMENT_SUBMIT.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_ENFORCEMENT_SUBMIT.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_ENFORCEMENT_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3EnforcementSubmitService(data), onPending, onSuccess, onError);
};
