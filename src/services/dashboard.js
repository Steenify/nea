import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  DASHBOARD: {
    DETAIL,
    WIDGET_CONFIGURATION: { GET_ROLE_WIDGET_LIST, SAVE, DELETE },
    PERFORMANCE_METRICS,
    SERVICE_STATUS,
    SERVICE_NODES,
  },
} = API_URLS;

export const getDashboardDetailService = (data) =>
  request({
    data,
    ...DETAIL,
  });

export const getWidgetByRoleService = (data) =>
  request({
    data,
    ...GET_ROLE_WIDGET_LIST,
  });

export const saveWidgetByRoleService = (data) =>
  request({
    data,
    ...SAVE,
  });

export const deleteWidgetByRoleService = (data) =>
  request({
    data,
    ...DELETE,
  });

export const getServiceStatusService = (data) =>
  request({
    ...SERVICE_STATUS,
    data,
  });

export const getPerformanceMetricsService = (data) =>
  request({
    ...PERFORMANCE_METRICS,
    data,
  });

export const getServiceNodesService = (data) =>
  request({
    ...SERVICE_NODES,
    data,
  });
