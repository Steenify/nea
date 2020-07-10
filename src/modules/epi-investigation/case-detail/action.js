import { caseDetailService, caseSubmitService } from 'services/epi-investigation/case';
import { actionCreator, actionTryCatchCreator } from 'utils';
import { retrieveAddressService } from 'services/administration-configuration/address';
import { initialValues, initialAttemptValue, initialResInfoValue, initialLocalTravelInfoValue, initialOverseaMovementValue, initialClinicInfoValue, initialOfficerInfoValue } from './helper';

export const EPI_INVESTIGATION_CASE_DETAIL = actionCreator('EPI_INVESTIGATION_CASE_DETAIL');
export const getCaseDetailAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_INVESTIGATION_CASE_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    const caseInfo = data?.caseInfo || initialValues;
    const mapInitValue = (item, init) => ({ ...init, ...item, isNew: false });
    const attemptLength = caseInfo?.attemptList?.length || 0;
    const initialFormValues = {
      ...initialValues,
      ...caseInfo,
      attemptList: attemptLength > 0 ? caseInfo.attemptList.map((item) => mapInitValue(item, initialAttemptValue)) : [initialAttemptValue],
      resInfoList: caseInfo.resInfoList.map((item) => mapInitValue(item, initialResInfoValue)),
      localTravInfoList: caseInfo.localTravInfoList.map((item) => mapInitValue(item, initialLocalTravelInfoValue)),
      overseaTravInfoList: caseInfo.overseaTravInfoList.map((item) => mapInitValue(item, initialOverseaMovementValue)),
      clinicInfoList: caseInfo.clinicInfoList.map((item) => mapInitValue(item, initialClinicInfoValue)),
      offInfoList: caseInfo.offInfoList.map((item) => mapInitValue(item, initialOfficerInfoValue)),
    };
    dispatch({
      type: EPI_INVESTIGATION_CASE_DETAIL.SUCCESS,
      payload: initialFormValues,
    });
  };
  const onError = (error) => {
    dispatch({
      type: EPI_INVESTIGATION_CASE_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseDetailService(params), onPending, onSuccess, onError);
};

export const GET_ADDRESS = actionCreator('EPI_INVESTIGATION_RETRIEVE_ADDRESS');
export const retrieveAddressAction = (postalCode = 0, callback = () => {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_ADDRESS.PENDING,
    });
  };
  const onSuccess = (data) => {
    const addresses = data?.sgAddressVOList || [];
    dispatch({
      type: GET_ADDRESS.SUCCESS,
      payload: addresses,
    });
    callback(addresses);
  };
  const onError = (error) => {
    dispatch({
      type: GET_ADDRESS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(retrieveAddressService({ postalCode }), onPending, onSuccess, onError);
};

export const EPI_INVESTIGATION_CASE_SUBMIT = actionCreator('EPI_INVESTIGATION_CASE_SUBMIT');
export const caseSubmitAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_INVESTIGATION_CASE_SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EPI_INVESTIGATION_CASE_SUBMIT.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: EPI_INVESTIGATION_CASE_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseSubmitService(params), onPending, onSuccess, onError);
};

export const RESET_REDUCER = 'EPI_DETAIL_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => dispatch({ type: RESET_REDUCER });
