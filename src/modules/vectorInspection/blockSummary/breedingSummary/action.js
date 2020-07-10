import { getBreedingSummaryService, getLatestBreedingSummaryService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_BREEDING_SUMMARY = actionCreator('GET_BREEDING_SUMMARY');
export const getBreedingSummaryAction = (data = {}, fromLatest = false) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_BREEDING_SUMMARY.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_BREEDING_SUMMARY.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_BREEDING_SUMMARY.ERROR,
      payload: error,
    });
  };
  if (fromLatest) {
    await actionTryCatchCreator(getLatestBreedingSummaryService(data), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(getBreedingSummaryService(data), onPending, onSuccess, onError);
  }
};
