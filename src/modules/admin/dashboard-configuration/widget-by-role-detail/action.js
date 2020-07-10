import { saveWidgetByRoleService } from 'services/dashboard';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const WIDGET_BY_ROLE_SAVE = actionCreator('WIDGET_BY_ROLE_SAVE');
export const saveAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: WIDGET_BY_ROLE_SAVE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: WIDGET_BY_ROLE_SAVE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: WIDGET_BY_ROLE_SAVE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(saveWidgetByRoleService(params), onPending, onSuccess, onError);
};
