import update from 'react-addons-update';
import { combineReducers } from 'redux';

import { getObject, getData } from 'utils';

import dashboardReducers from 'modules/dashboard/reducer';
import inspectionFormReducer from 'components/pages/inspectionForm/reducer';
import myWorkspaceReducers from 'modules/my-workspace/reducer';
import sampleIdentificationReducers from 'modules/sample-identification/reducer';
import vectorInspectionReducers from 'modules/vectorInspection/reducer';
import rodentAuditReducers from 'modules/rodent-audit/reducer';
import claimTaskReducers from 'modules/claim-task/reducer';
import foggingAuditReducers from 'modules/fogging-audit/reducer';
import epiInvestigationReducers from 'modules/epi-investigation/reducer';
import detailReducers from 'modules/details/reducer';
import adminReducers from 'modules/admin/reducer';
import opsAreaReducers from 'modules/ops-management/reducer';
import nonFunctionalReducers from 'modules/non-functional/reducer';
import ehiGravitrapAuditReducers from 'modules/ehi-gravitrap-audit/reducer';
import sitePaperGravitrapAuditReducers from 'modules/site-paper-gravitrap-audit/reducer';

import {
  GLOBAL_ACTIONS,
  GLOBAL_LOAD_MASTER_CODE,
  GLOBAL_ALL_FUNCTIONS_FOR_ROLE,
  GLOBAL_IN_APP_NOTIFICATION_LIST,
  GLOBAL_IN_APP_NOTIFICATION_VIEW,
  GLOBAL_IN_APP_NOTIFICATION_UPDATE,
  GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD,
  GLOBAL_BROADCAST_ONLINE_MESSAGE,
  GLOBAL_BROADCAST_ONLINE_MESSAGE_TOGGLE,
  GLOBAL_LOG_OUT,
  GLOBAL_ALL_RESET_REDUCER,
} from './actions';

const initialState = {
  ui: {
    loading: false,
    showMenu: false,
    fontSize: 16,
    isShowBroadcastOnlineMessages: null,
    userRole: getObject('userRole') || {},
  },
  data: {
    masterCodes: {},
    functionNameList: (getData('functionNameList') || '').split(','),
    commonPoolList: [],
    workspaceList: [],
    notifications: [],
    notificationDetail: null,
    broadcastOnlineMessages: [
      // {
      //   date: '2019-08-23 00:00:00',
      //   messageTitle: 'title 1',
      //   messageContent:
      //     'In view of the current COVID-19 situation, please use our e-services (www.eportal.nea.gov.sg) or call our NEA hotline (6225-5632), to minimise time spent in crowded public areas such as our service centres. Thank you for your cooperation.',
      // },
      // {
      //   messageTitle: 'title 2',
      //   date: '2019-08-23 00:00:00',
      //   messageContent:
      //     'In view of the current COVID-19 situation, please use our e-services (www.eportal.nea.gov.sg) or call our NEA hotline (6225-5632), to minimise time spent in crowded public areas such as our service centres. Thank you for your cooperation.',
      // },
    ],
  },
};

const global = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_ACTIONS.TOGGLE_MENU:
      return update(state, {
        ui: {
          showMenu: { $set: !state.ui.showMenu },
        },
      });

    case GLOBAL_ACTIONS.CHANGE_FONT_SIZE:
      return update(state, {
        ui: {
          fontSize: { $set: action.payload },
        },
      });
    case GLOBAL_ACTIONS.UPDATE_USER_ROLE:
      return update(state, {
        ui: {
          userRole: { $set: action.payload },
        },
      });
    case GLOBAL_LOAD_MASTER_CODE.SUCCESS: {
      return update(state, {
        data: {
          masterCodes: { $merge: action.payload },
        },
      });
    }
    case GLOBAL_LOAD_MASTER_CODE.PENDING:
    case GLOBAL_LOG_OUT.PENDING:
    case GLOBAL_BROADCAST_ONLINE_MESSAGE.PENDING:
    case GLOBAL_IN_APP_NOTIFICATION_LIST.PENDING:
    case GLOBAL_IN_APP_NOTIFICATION_VIEW.PENDING:
    case GLOBAL_IN_APP_NOTIFICATION_UPDATE.PENDING:
    case GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.PENDING:
    case GLOBAL_ALL_FUNCTIONS_FOR_ROLE.PENDING: {
      return update(state, {
        ui: {
          loading: { $set: true },
        },
      });
    }
    case GLOBAL_IN_APP_NOTIFICATION_LIST.SUCCESS: {
      return update(state, {
        ui: {
          loading: { $set: false },
        },
        data: {
          notifications: { $set: action.payload.inAppNotiList },
        },
      });
    }
    case GLOBAL_ALL_FUNCTIONS_FOR_ROLE.SUCCESS: {
      const functionNameList = action.payload.functionNameList || [];
      const commonPoolList = action.payload.commonPoolList || [];
      const workspaceList = action.payload.workspaceList || [];
      const fullName = action.payload.fullName || '';
      const role = action.payload.role || '';
      return update(state, {
        ui: {
          loading: { $set: false },
        },
        data: {
          fullName: { $set: fullName },
          role: { $set: role },
          functionNameList: {
            $set: [...functionNameList, ...commonPoolList, ...workspaceList].map((functionRole) => functionRole.functionName),
          },
          commonPoolList: { $set: commonPoolList.map((functionRole) => functionRole.functionName) },
          workspaceList: { $set: workspaceList.map((functionRole) => functionRole.functionName) },
        },
      });
    }
    case GLOBAL_IN_APP_NOTIFICATION_VIEW.SUCCESS: {
      return update(state, {
        ui: {
          loading: { $set: false },
        },
        data: {
          notificationDetail: { $set: action.payload.inAppNotiList[0] },
        },
      });
    }
    case GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.SUCCESS: {
      return update(state, {
        ui: {
          loading: { $set: false },
        },
      });
    }
    case GLOBAL_BROADCAST_ONLINE_MESSAGE.SUCCESS: {
      const list = action.payload || [];
      const showBC = state.ui.isShowBroadcastOnlineMessages;
      return update(state, {
        ui: {
          loading: { $set: false },
          isShowBroadcastOnlineMessages: { $set: showBC === null ? list.length > 0 : showBC },
        },
        data: {
          broadcastOnlineMessages: { $set: list },
        },
      });
    }
    case GLOBAL_LOAD_MASTER_CODE.ERROR:
    case GLOBAL_LOG_OUT.SUCCESS:
    case GLOBAL_LOG_OUT.ERROR:
    case GLOBAL_BROADCAST_ONLINE_MESSAGE.ERROR:
    case GLOBAL_IN_APP_NOTIFICATION_LIST.ERROR:
    case GLOBAL_IN_APP_NOTIFICATION_VIEW.ERROR:
    case GLOBAL_IN_APP_NOTIFICATION_UPDATE.ERROR:
    case GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.ERROR:
    case GLOBAL_ALL_FUNCTIONS_FOR_ROLE.ERROR: {
      return update(state, {
        ui: {
          loading: { $set: false },
        },
      });
    }
    case GLOBAL_BROADCAST_ONLINE_MESSAGE_TOGGLE: {
      return update(state, {
        ui: {
          isShowBroadcastOnlineMessages: { $set: !state.ui.isShowBroadcastOnlineMessages },
        },
      });
    }
    case GLOBAL_ALL_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default combineReducers({
  global,
  nonFunctionalReducers,
  dashboardReducers,
  claimTaskReducers,
  myWorkspaceReducers,
  sampleIdentificationReducers,
  vectorInspectionReducers,
  foggingAuditReducers,
  inspectionFormReducer,
  epiInvestigationReducers,
  ehiGravitrapAuditReducers,
  rodentAuditReducers,
  detailReducers,
  adminReducers,
  opsAreaReducers,
  sitePaperGravitrapAuditReducers,
});
