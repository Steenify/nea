import { updateGravitapLapsesService } from 'services/site-paper-gravitrap-audit';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const UPDATE_GRAVITAP_LAPSES_ACTION = actionCreator('UPDATE_GRAVITAP_LAPSES_ACTION');

export const updateGravitapLapsesAction = (data = {}) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPDATE_GRAVITAP_LAPSES_ACTION;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS, payload: null });
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(updateGravitapLapsesService(data), onPending, onSuccess, onError);
};
