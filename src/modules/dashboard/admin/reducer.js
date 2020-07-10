import update from 'react-addons-update';
import {
  ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT,
  ADMIN_DASHBOARD_APPLICATION_STATUS,
  ADMIN_DASHBOARD_BATCH_JOB_STATUS,
  ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT,
  ADMIN_DASHBOARD_SERVICE_STATUS,
  ADMIN_DASHBOARD_PERFORMANCE_METRICS,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    amountEmailSent: 0,
    amountNotificationSent: 0,
    applicationStatus: [],
    batchJobStatus: [],
    diskSummary: [
      {
        NodeID: 1,
        VolumeID: 3,
        Caption: 'C:\\ Label:Windows 2A0C40E5',
        Size: 135838822400.0,
        VolumePercentUsed: 52.5352135,
        VolumeDescription: 'C:\\ Label:Windows  Serial Number 2A0C40E5',
        VolumeSize: 135838822400.0,
        VolumeSpaceUsed: 71363215360.0,
        VolumeSpaceAvailable: 64475607040.0,
        DisplayName: 'C:\\ Label:Windows 2A0C40E5',
        VolumePercentAvailable: 47.4647865,
        VolumeSpaceAvailableExp: 64475607040.0,
        DeviceId: 'C:',
      },
      {
        NodeID: 1,
        VolumeID: 4,
        Caption: 'D:\\ Label:Temporary Storage DAE735FF',
        Size: 34358620160.0,
        VolumePercentUsed: 19.6301289,
        VolumeDescription: 'D:\\ Label:Temporary Storage  Serial Number DAE735FF',
        VolumeSize: 34358620160.0,
        VolumeSpaceUsed: 6744641536.0,
        VolumeSpaceAvailable: 27613978624.0,
        DisplayName: 'D:\\ Label:Temporary Storage DAE735FF',
        VolumePercentAvailable: 80.36987,
        VolumeSpaceAvailableExp: 27613978624.0,
        DeviceId: 'D:',
      },
    ],
    performanceMetrics: [
      {
        IPAddress: '10.4.0.5',
        Status: 3,
        StatusDescription: 'Node status is Warning',
        MemoryAvailable: 1.58508646e9,
        MemoryUsed: 7004377088.0,
        TotalMemory: 8.58946355e9,
        caption: 'neavcs2devSFTP',
        cpuCount: 2,
        cpuload: 0,
        percentmemoryused: 81,
        VolumePercentUsed: 81.9451,
        VolumeSize: 8589463552.0,
        VolumeSpaceUsed: 7038644224.0,
        VolumeSpaceAvailable: 1550819328.0,
      },
    ],
    serviceStatuses: [
      {
        ApplicationID: 1,
        Name: 'SOLARWINDS_ORION',
        DisplayName: 'SOLARWINDS_ORION',
        NodeID: 1,
        Status: 1,
        StatusDescription: 'Up',
      },
      {
        ApplicationID: 2,
        Name: 'Microsoft IIS',
        DisplayName: 'Microsoft IIS',
        NodeID: 1,
        Status: 0,
        StatusDescription: 'Unknown',
      },
    ],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.PENDING:
    case ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.PENDING:
    case ADMIN_DASHBOARD_APPLICATION_STATUS.PENDING:
    case ADMIN_DASHBOARD_BATCH_JOB_STATUS.PENDING:
    case ADMIN_DASHBOARD_SERVICE_STATUS.PENDING:
    case ADMIN_DASHBOARD_PERFORMANCE_METRICS.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          amountNotificationSent: { $set: payload },
        },
      });
    case ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          amountEmailSent: { $set: payload },
        },
      });
    case ADMIN_DASHBOARD_APPLICATION_STATUS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          applicationStatus: { $set: payload },
        },
      });
    }
    case ADMIN_DASHBOARD_PERFORMANCE_METRICS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          performanceMetrics: { $set: payload },
        },
      });
    }
    case ADMIN_DASHBOARD_SERVICE_STATUS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          serviceStatuses: { $set: payload },
        },
      });
    }
    case ADMIN_DASHBOARD_BATCH_JOB_STATUS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          batchJobStatus: { $set: payload },
        },
      });
    }
    case ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.ERROR:
    case ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.ERROR:
    case ADMIN_DASHBOARD_APPLICATION_STATUS.ERROR:
    case ADMIN_DASHBOARD_BATCH_JOB_STATUS.ERROR:
    case ADMIN_DASHBOARD_PERFORMANCE_METRICS.ERROR:
    case ADMIN_DASHBOARD_SERVICE_STATUS.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    default:
      return state;
  }
};

export default reducer;
