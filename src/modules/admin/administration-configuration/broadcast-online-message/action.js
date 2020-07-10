import uuid from 'uuid/v4';

import {
  broadcastMessageOnlineListingService,
  broadcastMessageOnlineDeleteService,
} from 'services/administration-configuration/broadcast-online-message';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'broadcastTitle',
    label: 'Broadcast Title',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'broadcastTitle',
};

export const defaultAddValue = () => ({
  id: uuid(),
  broadcastTitle: '',
  broadcastMessageContent: '',
  startDate: '',
  endDate: '',
  publishUserGroup: [],
  urgency: '',
  remark: '',
  action: 'add',
});

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_FILTER_LISTING =
  'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    adminReducers: {
      broadcastOnlineMessage: {
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
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...oldList],
  });
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_LISTING = actionCreator(
  'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_LISTING',
);
export const getListingAction = () => async dispatch => {
  const onPending = () => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_LISTING.SUCCESS,
      payload: data.broadcastMessageVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(broadcastMessageOnlineListingService(), onPending, onSuccess, onError);
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_DELETE = actionCreator('BROADCAST_ONLINE_MESSAGE_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(broadcastMessageOnlineDeleteService({ id }), onPending, onSuccess, onError);
};

// Local Actions

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_EDIT = 'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_EDIT';
export const editAction = id => dispatch => {
  dispatch({
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CANCEL_EDITING =
  'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => dispatch => {
  dispatch({
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_ADD = 'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_ADD';
export const addAction = () => dispatch => {
  dispatch({
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_REMOVE_ADD = 'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = id => dispatch => {
  dispatch({
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_SET_VALUE = 'BROADCAST_ONLINE_MESSAGE_MAINTENANCE_SET_VALUE';
export const setValueAction = params => dispatch => {
  dispatch({
    type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};
