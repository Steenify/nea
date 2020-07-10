import { actionCreator, actionTryCatchCreator } from 'utils';
import {
  uploadRodentContractManpowerListService,
  uploadRodentOperationalSchedulesService,
  uploadDailyDevelopmentService,
  uploadDailyReportService,
  uploadRodentFeedbackService,
} from 'services/rodent-audit';

export const UPLOAD_ROD_CONTRACT_MANPOWER_LIST = actionCreator('UPLOAD_ROD_CONTRACT_MANPOWER_LIST');
export const uploadRodentContractManpowerListAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_ROD_CONTRACT_MANPOWER_LIST;
  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback();
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(uploadRodentContractManpowerListService(data), onPending, onSuccess, onError);
};

export const UPLOAD_RODENT_OPERATIONAL_SCHEDULES = actionCreator('UPLOAD_RODENT_OPERATIONAL_SCHEDULES');
export const uploadRodentOperationalSchedulesAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_RODENT_OPERATIONAL_SCHEDULES;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback();
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(uploadRodentOperationalSchedulesService(data), onPending, onSuccess, onError);
};

export const UPLOAD_DAILY_DEVELOPMENT = actionCreator('UPLOAD_DAILY_DEVELOPMENT');
export const uploadDailyDevelopmentAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_DAILY_DEVELOPMENT;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback();
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(uploadDailyDevelopmentService(data), onPending, onSuccess, onError);
};

export const UPLOAD_DAILY_REPORT = actionCreator('UPLOAD_DAILY_REPORT');
export const uploadDailyReportAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_DAILY_REPORT;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback();
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(uploadDailyReportService(data), onPending, onSuccess, onError);
};

export const UPLOAD_RODENT_FEEDBACK = actionCreator('UPLOAD_RODENT_FEEDBACK');
export const uploadRodentFeedbackAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_RODENT_FEEDBACK;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback();
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(uploadRodentFeedbackService(data), onPending, onSuccess, onError);
};
