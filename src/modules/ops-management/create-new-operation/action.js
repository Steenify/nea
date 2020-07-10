import { searchAddressByPostalCodeService, createAdHocOperationService, updateAdHocOpsService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const OPS_SEARCH_ADDRESS_BY_POSTAL_CODE = actionCreator('OPS_SEARCH_ADDRESS_BY_POSTAL_CODE');
export const searchAddressByPostalCodeAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const address = data.sgAddressVOList?.[0];
    dispatch({
      type: OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.SUCCESS,
      payload: address,
    });
    if (callback) callback(address);
  };
  const onError = (error) => {
    dispatch({
      type: OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchAddressByPostalCodeService(params), onPending, onSuccess, onError);
};

export const OPS_CREATE_ADHOC = actionCreator('OPS_CREATE_ADHOC');
export const createOpsAdhocAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_CREATE_ADHOC.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_CREATE_ADHOC.SUCCESS,
      payload: data,
    });
    if (callback) callback(data.sgAddressList || []);
  };
  const onError = (error) => {
    dispatch({
      type: OPS_CREATE_ADHOC.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(createAdHocOperationService(params), onPending, onSuccess, onError);
};

export const OPS_UPDATE_ADHOC = actionCreator('OPS_UPDATE_ADHOC');
export const updateOpsAdhocAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_UPDATE_ADHOC.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_UPDATE_ADHOC.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_UPDATE_ADHOC.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateAdHocOpsService(params), onPending, onSuccess, onError);
};
