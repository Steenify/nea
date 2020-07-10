/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
import { getSampleInfo, certifyFindings } from 'services/sample-identification';
import { getQueryInspectionFormDetail } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_SAMPLE_INFO = actionCreator('GET_SAMPLE_INFO');
export const getFormDetailAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: GET_SAMPLE_INFO.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: GET_SAMPLE_INFO.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: GET_SAMPLE_INFO.ERROR,
      payload: error,
    });
  };

  const { barcodeId } = params;
  if (barcodeId) {
    await actionTryCatchCreator(getSampleInfo(params), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(getQueryInspectionFormDetail(params), onPending, onSuccess, onError);
  }
};

export const FORM_DETAIL_CERTIFY_FINDINGS = actionCreator('FORM_DETAIL_CERTIFY_FINDINGS');
export const certifyFindingWithEmails = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: FORM_DETAIL_CERTIFY_FINDINGS.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: FORM_DETAIL_CERTIFY_FINDINGS.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: FORM_DETAIL_CERTIFY_FINDINGS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(certifyFindings(params), onPending, onSuccess, onError);
};

export const FORM_DETAIL_RESET_REDUCER = 'FORM_DETAIL_RESET_REDUCER';
export const resetFormDetailReducer = () => dispatch => {
  dispatch({
    type: FORM_DETAIL_RESET_REDUCER,
  });
};
