import {
  getTownCouncilFineRegimeDetailService,
  getTownCouncilFineRegimeSummaryService,
  confirmTownCouncilFineRegimeSummaryService,
  saveTownCouncilFineRegimeDetailService,
  rejectTownCouncilFineRegimeService,
  supportTownCouncilFineRegimeService,
  approveTownCouncilFineRegimeService,
} from 'services/inspection-management/town-council-fine-regime';
import { actionCreator, actionTryCatchCreator, dateStringFromDate } from 'utils';

export const TOWN_COUNCIL_FINE_REGIME_DETAIL = actionCreator('TOWN_COUNCIL_FINE_REGIME_DETAIL');
export const getDetailAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data?.tcRegimeDetailVoList || [];
    const mappedList = list.map((item) => ({ ...item, pcoScheduleDate: dateStringFromDate(item.pcoScheduleDate) }));
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_DETAIL.SUCCESS,
      payload: mappedList,
    });
  };
  const onError = (error) => {
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_DETAIL.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(getTownCouncilFineRegimeDetailService(params), onPending, onSuccess, onError);
};

export const SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL = actionCreator('SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL');
export const saveDetailAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(saveTownCouncilFineRegimeDetailService(params), onPending, onSuccess, onError);
};

export const TOWN_COUNCIL_FINE_REGIME_SUMMARY = actionCreator('TOWN_COUNCIL_FINE_REGIME_SUMMARY');
export const getSummaryAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_SUMMARY.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_SUMMARY.SUCCESS,
      payload: data.tcRegimeDetailSummaryVO,
    });
  };
  const onError = (error) => {
    dispatch({
      type: TOWN_COUNCIL_FINE_REGIME_SUMMARY.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(getTownCouncilFineRegimeSummaryService(params), onPending, onSuccess, onError);
};

export const CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY = actionCreator('CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY');
export const confirmSummaryAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(confirmTownCouncilFineRegimeSummaryService(params), onPending, onSuccess, onError);
};

export const REJECT_TOWN_COUNCIL_FINE_REGIME = actionCreator('REJECT_TOWN_COUNCIL_FINE_REGIME');
export const rejectAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: REJECT_TOWN_COUNCIL_FINE_REGIME.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: REJECT_TOWN_COUNCIL_FINE_REGIME.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: REJECT_TOWN_COUNCIL_FINE_REGIME.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(rejectTownCouncilFineRegimeService(params), onPending, onSuccess, onError);
};

export const SUPPORT_TOWN_COUNCIL_FINE_REGIME = actionCreator('SUPPORT_TOWN_COUNCIL_FINE_REGIME');
export const supportAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SUPPORT_TOWN_COUNCIL_FINE_REGIME.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SUPPORT_TOWN_COUNCIL_FINE_REGIME.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SUPPORT_TOWN_COUNCIL_FINE_REGIME.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(supportTownCouncilFineRegimeService(params), onPending, onSuccess, onError);
};

export const APPROVE_TOWN_COUNCIL_FINE_REGIME = actionCreator('APPROVE_TOWN_COUNCIL_FINE_REGIME');
export const approveAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: APPROVE_TOWN_COUNCIL_FINE_REGIME.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: APPROVE_TOWN_COUNCIL_FINE_REGIME.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: APPROVE_TOWN_COUNCIL_FINE_REGIME.ERROR,
      payload: error,
    });
  };
  actionTryCatchCreator(approveTownCouncilFineRegimeService(params), onPending, onSuccess, onError);
};
