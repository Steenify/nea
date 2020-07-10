import {
  approveRejectFindingsService,
  updateShowCauseService,
  saveAsDraftService,
  resubmissionService,
  managerUpdateShowCauseService,
  updateCorrespondenceService,
} from 'services/site-paper-gravitrap-audit';
import { submitAdHocTaskService, saveAdHocTaskService } from 'services/ehi-gravitrap-audit/common';
import { actionCreator, actionTryCatchCreator } from 'utils';
// import { initialContractorFindings } from './helper';

export const APPROVE_FINDINGS = actionCreator('SITE_PAPER_APPROVE_FINDINGS');
export const approveRejectFindingsAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: APPROVE_FINDINGS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: APPROVE_FINDINGS.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: APPROVE_FINDINGS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(approveRejectFindingsService(params), onPending, onSuccess, onError);
};

export const UPDATE_SHOW_CAUSE = actionCreator('SITE_PAPER_UPDATE_SHOW_CAUSE');
export const updateShowCauseAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateShowCauseService(params), onPending, onSuccess, onError);
};

export const SAVE_AS_DRAFT = actionCreator('SITE_PAPER_SAVE_AS_DRAFT');
export const saveAsDraftAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAVE_AS_DRAFT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAVE_AS_DRAFT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SAVE_AS_DRAFT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(saveAsDraftService(params), onPending, onSuccess, onError);
};

export const resubmissionAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAVE_AS_DRAFT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAVE_AS_DRAFT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SAVE_AS_DRAFT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(resubmissionService(params), onPending, onSuccess, onError);
};

export const managerUpdateShowCauseAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: UPDATE_SHOW_CAUSE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(managerUpdateShowCauseService(params), onPending, onSuccess, onError);
};

export const updateCorrespondenceAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAVE_AS_DRAFT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAVE_AS_DRAFT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SAVE_AS_DRAFT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateCorrespondenceService(params), onPending, onSuccess, onError);
};

export const AD_HOC_SUBMIT = actionCreator('SITE_PAPER_SUBMIT_ADHOC');
export const submitAdHocTaskAction = (params = {}, isSubmit = false, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: AD_HOC_SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: AD_HOC_SUBMIT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: AD_HOC_SUBMIT.ERROR,
      payload: error,
    });
  };
  if (isSubmit) {
    await actionTryCatchCreator(submitAdHocTaskService(params), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(saveAdHocTaskService(params), onPending, onSuccess, onError);
  }
};
