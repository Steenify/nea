import { actionCreator, filterFunc, actionTryCatchCreator, sortFunc } from 'utils';

import { form3CreateService, form3SampleIdentifiedListingService, form3NoFurtherActionSubmitService } from 'services/inspection-management/form3';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'address',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'breedingDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
};

export const VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST_FILTER = 'VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST_FILTER';
export const getSampleIdentifiedListFilterAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      listOfSamplesIDed: {
        data: { samples },
      },
    },
  } = getState();
  const filterData = { ...defaultFilterValue, ...data };
  const { sortValue } = filterData;
  const filteredSamples = samples.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST_FILTER,
    payload: filteredSamples,
  });
};

export const VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST = actionCreator('VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST');
export const getSampleIdentifiedListAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.SUCCESS,
      payload: data,
    });

    dispatch(getSampleIdentifiedListFilterAction());
  };
  const onError = (error) => {
    dispatch({ type: VECTOR_INSPECTION_SAMPLE_IDENTIFIED_LIST.ERROR, payload: error });
  };

  await actionTryCatchCreator(form3SampleIdentifiedListingService(), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_CREATE = actionCreator('VECTOR_INSPECTION_FORM3_CREATE');
export const form3CreateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_FORM3_CREATE.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({ type: VECTOR_INSPECTION_FORM3_CREATE.ERROR, payload: error });
  };

  await actionTryCatchCreator(form3CreateService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION = actionCreator('VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION');
export const form3NoFurtherAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({ type: VECTOR_INSPECTION_FORM3_NO_FURTHER_ACTION.ERROR, payload: error });
  };

  await actionTryCatchCreator(form3NoFurtherActionSubmitService(params), onPending, onSuccess, onError);
};
