import {
  getCaseDetailService,
  submitTaskService,
  concurAssessmentService,
  rejectAssessmentService,
  saveTaskService,
  saveConcurAssessmentService,
  submitAdHocTaskService,
  saveAdHocTaskService,
} from 'services/ehi-gravitrap-audit/common';
import { actionCreator, actionTryCatchCreator } from 'utils';
import { initialCaseDetail, initialContractorFindings, initialAdHocLapse } from './helper';

export const DETAIL = actionCreator('EHI_GET_CASE_DETAIL');
export const getCaseDetailAction = (caseId) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    const caseDetail = data?.graviTrapFindVO || initialCaseDetail;
    const lapseInfoVO = caseDetail?.lapseInfoVO || initialAdHocLapse;

    const payload = {
      ...initialCaseDetail,
      ...caseDetail,
      concurStatus: caseDetail?.managerConcurStatus,
      contractorFindings: { ...initialContractorFindings, ...caseDetail.contractorFindings },
      lapseInfoVO: { ...initialAdHocLapse, ...lapseInfoVO, ehiLapseFileList: lapseInfoVO?.ehiLapseFileVOList || [] },
    };
    dispatch({
      type: DETAIL.SUCCESS,
      payload,
    });
  };
  const onError = (error) => {
    dispatch({
      type: DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getCaseDetailService({ caseId }), onPending, onSuccess, onError);
};

export const SUBMIT = actionCreator('EHI_SUBMIT_CASE_DETAIL');
export const submitTaskAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SUBMIT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitTaskService(params), onPending, onSuccess, onError);
};

export const CONCUR = actionCreator('EHI_CONCUR_ASSESSMENT');
export const concurAssessmentAction = (params = {}, isSubmit = false, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CONCUR.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: CONCUR.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: CONCUR.ERROR,
      payload: error,
    });
  };
  if (isSubmit) {
    await actionTryCatchCreator(concurAssessmentService(params), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(saveConcurAssessmentService(params), onPending, onSuccess, onError);
  }
};

export const REJECT = actionCreator('EHI_TASK_DETAIL_REJECT_ASSESSMENT');
export const rejectAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: REJECT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: REJECT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: REJECT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(rejectAssessmentService(params), onPending, onSuccess, onError);
};

export const SAVE = actionCreator('EHI_SAVE_CASE_DETAIL');
export const saveTaskAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAVE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAVE.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SAVE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(saveTaskService(params), onPending, onSuccess, onError);
};

export const AD_HOC_SUBMIT = actionCreator('EHI_SUBMIT_ADHOC');
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

export const RESET_REDUCER = 'EHI_DETAIL_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => dispatch({ type: RESET_REDUCER });
