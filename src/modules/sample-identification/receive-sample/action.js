import { validateScannedBarcode, submitReceivedSample } from 'services/sample-identification';
import { actionCreator, sortFunc, actionTryCatchCreator } from 'utils';
// API actions
// Local actions

export const RECEIVE_SAMPLE_FILTER = 'RECEIVE_SAMPLE_FILTER';
export const receiveSampleFilter = (_data) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      receiveSample: {
        data: { filteredTaskList },
      },
    },
  } = getState();

  const sortValue = {
    id: 'scannedTime',
    desc: true,
  };

  const urgentList = filteredTaskList.filter((item) => item.isUrgentCase).sort((a, b) => sortFunc(a, b, sortValue));

  const notUrgentList = filteredTaskList.filter((item) => !item.isUrgentCase).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RECEIVE_SAMPLE_FILTER,
    payload: [...urgentList, ...notUrgentList],
  });
};

export const RECEIVE_SAMPLE_REACCEPT = 'RECEIVE_SAMPLE_REACCEPT';
export const reacceptSample = (data) => (dispatch) => {
  dispatch({
    type: RECEIVE_SAMPLE_REACCEPT,
    payload: data,
  });
};

export const RECEIVE_SAMPLE_REJECT = 'RECEIVE_SAMPLE_REJECT';
export const rejectSample = (data) => (dispatch) => {
  dispatch({
    type: RECEIVE_SAMPLE_REJECT,
    payload: data,
  });
};

export const RECEIVE_SAMPLE_ACCEPT_URGENT = 'RECEIVE_SAMPLE_ACCEPT_URGENT';
export const acceptUrgentSample = (data) => (dispatch) => {
  dispatch({
    type: RECEIVE_SAMPLE_ACCEPT_URGENT,
    payload: data,
  });
};

export const RECEIVE_SAMPLE_RESET_REDUCER = 'RECEIVE_SAMPLE_RESET_REDUCER';
export const resetReceiveSampleReducer = () => async (dispatch) => {
  dispatch({
    type: RECEIVE_SAMPLE_RESET_REDUCER,
  });
};

export const RECEIVE_SAMPLE_VALIDATE_BARCODE = actionCreator('RECEIVE_SAMPLE_VALIDATE_BARCODE');
export const receiveValidateBarcode = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: RECEIVE_SAMPLE_VALIDATE_BARCODE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: RECEIVE_SAMPLE_VALIDATE_BARCODE.SUCCESS,
      payload: data.sampleVO,
    });
    dispatch(receiveSampleFilter());
  };
  const onError = (error) => {
    dispatch({
      type: RECEIVE_SAMPLE_VALIDATE_BARCODE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(validateScannedBarcode(params), onPending, onSuccess, onError);
};

export const RECEIVE_SAMPLE_SUBMIT = actionCreator('RECEIVE_SAMPLE_SUBMIT');
export const submitReceivedSamples = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: RECEIVE_SAMPLE_SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: RECEIVE_SAMPLE_SUBMIT.SUCCESS,
      payload: data.samples,
    });
  };
  const onError = (error) => {
    dispatch({
      type: RECEIVE_SAMPLE_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitReceivedSample(params), onPending, onSuccess, onError);
};

export const RECEIVE_SAMPLE_SELECT = 'RECEIVE_SAMPLE_SELECT';
export const selectSampleAction = (data) => (dispatch) => {
  dispatch({
    type: RECEIVE_SAMPLE_SELECT,
    payload: data,
  });
};
