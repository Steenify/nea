import { getAddressListInOpsService, updateAdHocOpsService, searchAddressByPostalCodeService } from 'services/ops-area';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const OPS_LIST_ADDRESS_POSTAL_CODE = actionCreator('OPS_LIST_ADDRESS_POSTAL_CODE');
export const searchAddressByPostalCodeAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_LIST_ADDRESS_POSTAL_CODE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const address = data.sgAddressVOList?.[0];
    dispatch({
      type: OPS_LIST_ADDRESS_POSTAL_CODE.SUCCESS,
      payload: address,
    });
    if (callback) callback(address);
  };
  const onError = (error) => {
    dispatch({
      type: OPS_LIST_ADDRESS_POSTAL_CODE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchAddressByPostalCodeService(params), onPending, onSuccess, onError);
};

export const OPS_LIST_ADDRESS = actionCreator('OPS_LIST_ADDRESS');
export const getAddressListInOpsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_LIST_ADDRESS.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data.sgAddressVOList || [];
    dispatch({
      type: OPS_LIST_ADDRESS.SUCCESS,
      payload: list,
    });
    if (callback) callback(list);
  };
  const onError = (error) => {
    dispatch({
      type: OPS_LIST_ADDRESS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getAddressListInOpsService(params), onPending, onSuccess, onError);
};

export const OPS_SUBMIT_LIST_ADDRESS = actionCreator('OPS_SUBMIT_LIST_ADDRESS');
export const submitAddressListInOpsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: OPS_SUBMIT_LIST_ADDRESS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: OPS_SUBMIT_LIST_ADDRESS.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: OPS_SUBMIT_LIST_ADDRESS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateAdHocOpsService(params), onPending, onSuccess, onError);
};
