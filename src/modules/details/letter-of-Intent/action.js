import { loiLast12MonthsLOIListService, loiSubmitForApprovalService, loiCreateService, loiSaveService } from 'services/inspection-management/letter-of-intent';
import { actionCreator, actionTryCatchCreator, sortFunc } from 'utils';

export const LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST = actionCreator('LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST');
export const getLast12MonthsLOIListAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data.loiVOs || [];
    dispatch({
      type: LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.SUCCESS,
      payload: list.sort((a, b) => sortFunc(a, b, { id: 'createdDate', desc: false })),
    });
  };
  const onError = (error) => {
    dispatch({
      type: LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(loiLast12MonthsLOIListService(params), onPending, onSuccess, onError);
};

export const LETTER_OF_INTENT_SUBMIT_FOR_APPROVAL = actionCreator('LETTER_OF_INTENT_SUBMIT_FOR_APPROVAL');
export const loiSubmitForApporvalAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LETTER_OF_INTENT_SUBMIT_FOR_APPROVAL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: LETTER_OF_INTENT_SUBMIT_FOR_APPROVAL.SUCCESS,
      payload: data,
    });
    dispatch(getLast12MonthsLOIListAction({ form3Id: params.form3Id }));
  };
  const onError = (error) => {
    dispatch({
      type: LETTER_OF_INTENT_SUBMIT_FOR_APPROVAL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(loiSubmitForApprovalService(params), onPending, onSuccess, onError);
};

export const LETTER_OF_INTENT_CREATE = actionCreator('LETTER_OF_INTENT_CREATE');
export const loiCreateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LETTER_OF_INTENT_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: LETTER_OF_INTENT_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback(data.loiVO?.loiReferenceNo);
  };
  const onError = (error) => {
    dispatch({
      type: LETTER_OF_INTENT_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(loiCreateService(params), onPending, onSuccess, onError);
};

export const LETTER_OF_INTENT_SAVE = actionCreator('LETTER_OF_INTENT_SAVE');
export const loiSaveAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LETTER_OF_INTENT_SAVE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: LETTER_OF_INTENT_SAVE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: LETTER_OF_INTENT_SAVE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(loiSaveService(params), onPending, onSuccess, onError);
};
