import { simpleRequest, request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ANA: { LOGIN, LOGOUT },
} = API_URLS;

export const loginService = (data) =>
  simpleRequest({
    data,
    headers: { FunctionName: LOGIN.functionName },
    ...LOGIN,
  });

export const logoutService = (data) =>
  request({
    data,
    ...LOGOUT,
  });
