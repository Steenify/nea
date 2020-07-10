import { submitDepositService, validateBarcodeDepositService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator, sortFunc } from 'utils';

export const VECTOR_INSPECTION_DEPOSIT_FILTER = 'VECTOR_INSPECTION_DEPOSIT_FILTER';
export const sampleFilterAction = () => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      depositSamples: {
        data: { scannedSamples },
      },
    },
  } = getState();

  const scannedList = scannedSamples
    // .filter(sample => sample.isScanned)
    .sort((a, b) => sortFunc(a, b, { id: 'scannedTime', desc: true }));
  if (scannedList.length > 0) {
    scannedList[scannedList.length - 1].hasBottomDivider = true;
  }

  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_FILTER,
    payload: scannedList,
  });
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_VALIDATE = actionCreator('VECTOR_INSPECTION_DEPOSIT_SAMPLE_VALIDATE');
export const validateBarcodeDepositAction = (barcodeId, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_VALIDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_VALIDATE.SUCCESS,
      payload: data.sample,
    });
    dispatch(sampleFilterAction());
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_VALIDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(validateBarcodeDepositService({ barcodeId }), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_SUBMIT = actionCreator('VECTOR_INSPECTION_DEPOSIT_SAMPLE_SUBMIT');
export const submitDepositAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_SUBMIT.SUCCESS,
      payload: data.samples,
    });
    // dispatch(sampleFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitDepositService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_REJECT = 'VECTOR_INSPECTION_DEPOSIT_SAMPLE_REJECT';
export const rejectSampleAction = (data) => (dispatch) => {
  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_REJECT,
    payload: data,
  });
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_SELECT = 'VECTOR_INSPECTION_DEPOSIT_SAMPLE_SELECT';
export const selectSampleAction = (data) => (dispatch) => {
  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_SELECT,
    payload: data,
  });
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_REACCEPT = 'VECTOR_INSPECTION_DEPOSIT_SAMPLE_REACCEPT';
export const reacceptSampleAction = (data) => (dispatch) => {
  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_REACCEPT,
    payload: data,
  });
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_RESET = 'VECTOR_INSPECTION_DEPOSIT_SAMPLE_RESET';
export const resetReducerAction = () => async (dispatch) => {
  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_RESET,
  });
};

export const VECTOR_INSPECTION_DEPOSIT_SAMPLE_SHOW_CONFIRM = 'VECTOR_INSPECTION_DEPOSIT_SAMPLE_SHOW_CONFIRM';
export const toggleConfirmScreenAction = (payload = false) => async (dispatch) => {
  dispatch({
    type: VECTOR_INSPECTION_DEPOSIT_SAMPLE_SHOW_CONFIRM,
    payload,
  });
};
