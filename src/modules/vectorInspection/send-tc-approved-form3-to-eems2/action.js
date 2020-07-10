import {
  getApprovedTcForm3ListService,
  sendToEEMSService,
} from 'services/inspection-management/town-council-fine-regime';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST = actionCreator(
  'GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST',
);
export const getApprovedTcForm3ListAction = () => async dispatch => {
  const onPending = () => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.SUCCESS,
      payload: data?.tcRegimeDetailApprovedListingVo || [],
    });
  };
  const onError = error => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getApprovedTcForm3ListService(), onPending, onSuccess, onError);
};

export const SEND_TC_APPROVED_FORM3_TO_EEMS2 = actionCreator('SEND_TC_APPROVED_FORM3_TO_EEMS2');
export const sentToEEMSAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: SEND_TC_APPROVED_FORM3_TO_EEMS2.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: SEND_TC_APPROVED_FORM3_TO_EEMS2.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: SEND_TC_APPROVED_FORM3_TO_EEMS2.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sendToEEMSService(params), onPending, onSuccess, onError);
};
