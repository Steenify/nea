import uuid from 'uuid/v4';

import {
  notificationTemplateListingService,
  notificationTemplateDeleteService,
} from 'services/administration-configuration/notification-template';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'notificationName',
    label: 'Notification Name',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'notificationName',
};

export const defaultAddValue = () => ({
  id: uuid(),
  notificationType: '',
  notificationName: '',
  remarks: '',
  action: 'add',
});

export const NOTIFICATION_TEMPLATE_MAINTENANCE_FILTER_LISTING = 'NOTIFICATION_TEMPLATE_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    adminReducers: {
      notificationTemplate: {
        data: { editingList },
      },
    },
  } = getState();
  const addedList = editingList
    .filter(item => item.action === 'add')
    .filter(item => filterFunc(item, data))
    .sort((a, b) => sortFunc(a, b, data.sortValue));
  const oldList = editingList
    .filter(item => item.action !== 'add')
    .filter(item => filterFunc(item, data))
    .sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...oldList],
  });
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING');
export const getListingAction = () => async dispatch => {
  const onPending = () => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.SUCCESS,
      payload: data.notiVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(notificationTemplateListingService(), onPending, onSuccess, onError);
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(notificationTemplateDeleteService({ id }), onPending, onSuccess, onError);
};

// Local Actions

export const NOTIFICATION_TEMPLATE_MAINTENANCE_EDIT = 'NOTIFICATION_TEMPLATE_MAINTENANCE_EDIT';
export const editAction = id => dispatch => {
  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_CANCEL_EDITING = 'NOTIFICATION_TEMPLATE_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => dispatch => {
  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_ADD = 'NOTIFICATION_TEMPLATE_MAINTENANCE_ADD';
export const addAction = () => dispatch => {
  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_REMOVE_ADD = 'NOTIFICATION_TEMPLATE_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = id => dispatch => {
  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_SET_VALUE = 'NOTIFICATION_TEMPLATE_MAINTENANCE_SET_VALUE';
export const setValueAction = params => dispatch => {
  dispatch({
    type: NOTIFICATION_TEMPLATE_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};
