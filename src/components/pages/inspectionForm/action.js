import { certifyFindings, submitFindingService } from 'services/sample-identification';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const INSPECTION_FORM_CERTIFY_FINDINGS = actionCreator('INSPECTION_FORM_CERTIFY_FINDINGS');
export const certifyFindingWithEmails = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: INSPECTION_FORM_CERTIFY_FINDINGS.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: INSPECTION_FORM_CERTIFY_FINDINGS.SUCCESS,
      payload: data,
    });
  };
  const onError = error => {
    dispatch({
      type: INSPECTION_FORM_CERTIFY_FINDINGS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(certifyFindings(params), onPending, onSuccess, onError);
};

export const INSPECTION_FORM_SUBMIT_FINDINGS = actionCreator('INSPECTION_FORM_SUBMIT_FINDINGS');
export const submitFindingAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: INSPECTION_FORM_SUBMIT_FINDINGS.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: INSPECTION_FORM_SUBMIT_FINDINGS.SUCCESS,
      payload: params,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: INSPECTION_FORM_SUBMIT_FINDINGS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitFindingService(params), onPending, onSuccess, onError);
};

export const INSPECTION_FORM_RESET_REDUCER = 'INSPECTION_FORM_RESET_REDUCER';
export const resetReducerAction = () => dispatch => {
  dispatch({
    type: INSPECTION_FORM_RESET_REDUCER,
  });
};

export const INSPECTION_FORM_SET_HABITAT_GROUPS = 'INSPECTION_FORM_SET_HABITAT_GROUPS';
export const setHabitatGroupsAction = data => dispatch => {
  dispatch({
    type: INSPECTION_FORM_SET_HABITAT_GROUPS,
    payload: data,
  });
};

export const INSPECTION_FORM_TOGGLE_EDITING_SAMPLE = 'INSPECTION_FORM_TOGGLE_EDITING_SAMPLE';
export const toggleEditingSampleAction = sampleId => dispatch => {
  dispatch({
    type: INSPECTION_FORM_TOGGLE_EDITING_SAMPLE,
    payload: sampleId,
  });
};

export const INSPECTION_FORM_CHANGE_SAMPLE_STATUS = 'INSPECTION_FORM_CHANGE_SAMPLE_STATUS';
export const changeSampleStatusAction = data => dispatch => {
  dispatch({
    type: INSPECTION_FORM_CHANGE_SAMPLE_STATUS,
    payload: data,
  });
};

export const INSPECTION_FORM_ADD_FINDING = 'INSPECTION_FORM_ADD_FINDING';
export const addFindingAction = data => dispatch => {
  dispatch({
    type: INSPECTION_FORM_ADD_FINDING,
    payload: data,
  });
};

export const INSPECTION_FORM_REMOVE_FINDING = 'INSPECTION_FORM_REMOVE_FINDING';
export const removeFindingAction = data => dispatch => {
  dispatch({
    type: INSPECTION_FORM_REMOVE_FINDING,
    payload: data,
  });
};

export const INSPECTION_FORM_CLEAR_SAMPLE = 'INSPECTION_FORM_CLEAR_SAMPLE';
export const clearSampleAction = data => dispatch => {
  dispatch({
    type: INSPECTION_FORM_CLEAR_SAMPLE,
    payload: data,
  });
};
