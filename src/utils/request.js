/* eslint-disable no-unused-vars */
import axios from 'axios';
import { hostConfigs } from 'constants/index';
import { getData } from 'utils';
import { stringify } from 'query-string';

const { CancelToken } = axios;
export { CancelToken };
export const request = async ({ host = '', url = '', method = 'GET', auth, params = {}, data = {}, headers = {}, functionName = '', _token, cancelToken, isBatchServer, grantType }) => {
  const token = _token || (await getData('token'));

  const isComingFromLogin = await getData('comingFromLogin');
  if (isComingFromLogin === 'true') {
    headers.LoginFlag = true;
  }

  const HostAPI = process.env.REACT_APP_API || hostConfigs.development.HostAPI;
  const HostBatch = process.env.REACT_APP_BATCH || hostConfigs.development.HostBatch;
  const GRANTTYPE = grantType || process.env.REACT_APP_GRANTTYPE;

  const hostEnv = isBatchServer ? HostBatch : HostAPI;

  try {
    const res = await axios({
      url: `${host || hostEnv}${url}`,
      method,
      data,
      params,
      auth,
      headers: {
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, FunctionName',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
        Authorization: `${GRANTTYPE} ${token}`,
        FunctionName: functionName,
        ...headers,
      },
      cancelToken,
    });
    return { ...res, functionName };
  } catch (error) {
    console.log('TCL: error', error);
    error.functionName = functionName;
    throw error;
  }
};

export default request;

export const simpleRequest = async ({ host = '', url = '', method = 'GET', auth, params, data, headers, functionName = '', _token, cancelToken, isBatchServer, grantType }) => {
  const HostAPI = process.env.REACT_APP_API || hostConfigs.development.HostAPI;
  const HostBatch = process.env.REACT_APP_BATCH || hostConfigs.development.HostBatch;

  const hostEnv = isBatchServer ? HostBatch : HostAPI;

  try {
    const res = await axios({
      url: `${host || hostEnv}${url}`,
      method,
      data,
      params,
      headers,
    });
    return { ...res, functionName };
  } catch (error) {
    console.log('TCL: error', error);
    error.functionName = functionName;
    throw error;
  }
};
