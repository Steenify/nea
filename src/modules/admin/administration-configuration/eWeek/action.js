import moment from 'moment';
import uuid from 'uuid/v4';

import { generateEWeekService, confirmEWeekService, getPreviousYearService } from 'services/administration-configuration/eweek';
import { actionCreator, actionTryCatchCreator, dateStringFromDate } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'year',
    label: 'Year',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'week',
};

export const defaultAddValue = () => ({
  id: uuid(),
  year: moment().get('years'),
  month: moment().get('months'),
  week: '',
  startDate: dateStringFromDate(moment()),
  endDate: dateStringFromDate(moment()),
  action: 'add',
});

export const EWEEK_MAINTENANCE_RESET_REDUCER = 'EWEEK_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: EWEEK_MAINTENANCE_RESET_REDUCER,
  });
};

export const EWEEK_MAINTENANCE_PREVIOUS_YEAR = actionCreator('EWEEK_MAINTENANCE_PREVIOUS_YEAR');
export const previousYearAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EWEEK_MAINTENANCE_PREVIOUS_YEAR.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EWEEK_MAINTENANCE_PREVIOUS_YEAR.SUCCESS,
      payload: data.eweekVo.year,
    });
  };
  const onError = (error) => {
    dispatch({
      type: EWEEK_MAINTENANCE_PREVIOUS_YEAR.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getPreviousYearService(), onPending, onSuccess, onError);
};

export const EWEEK_MAINTENANCE_GENERATE = actionCreator('EWEEK_MAINTENANCE_GENERATE');
export const generateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EWEEK_MAINTENANCE_GENERATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EWEEK_MAINTENANCE_GENERATE.SUCCESS,
      payload: data.eweekVoList || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: EWEEK_MAINTENANCE_GENERATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(generateEWeekService(params), onPending, onSuccess, onError);
};

export const EWEEK_MAINTENANCE_CONFIRM = actionCreator('EWEEK_MAINTENANCE_CONFIRM');
export const confirmAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EWEEK_MAINTENANCE_CONFIRM.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EWEEK_MAINTENANCE_CONFIRM.SUCCESS,
      payload: data,
    });
    dispatch(resetReducerAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: EWEEK_MAINTENANCE_CONFIRM.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(confirmEWeekService(params), onPending, onSuccess, onError);
};
