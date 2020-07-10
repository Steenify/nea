import { enforceS35Service } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const ENFORCE_S35 = actionCreator('ENFORCE_S35_ENFORCE_S35');
export const enforceS35Action = (
  data = {
    postalCode: '',
    blockHouseNo: '',
    enforcements: [],
  },
  callback,
) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ENFORCE_S35.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ENFORCE_S35.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: ENFORCE_S35.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(enforceS35Service(data), onPending, onSuccess, onError);
};
