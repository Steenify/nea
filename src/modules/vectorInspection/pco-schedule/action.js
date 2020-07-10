import { uploadTownCouncilFineRegimePCOService } from 'services/inspection-management/town-council-fine-regime';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'townCouncil',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'submittedDate',
    label: 'Submitted Date',
    desc: false,
  },
};

export const FILTER_UPLOADED_PCO_SCHEDULE = 'FILTER_UPLOADED_PCO_SCHEDULE';
export const filterUploadedPCOScheduleAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      pcoSchedule: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_UPLOADED_PCO_SCHEDULE,
    payload: filteredList,
  });
};

export const GET_UPLOADED_PCO_SCHEDULE = actionCreator('GET_UPLOADED_PCO_SCHEDULE');
export const getUploadedPCOScheduleAction = () => async () => {
  // const onPending = () => {
  //   dispatch({
  //     type: GET_UPLOADED_PCO_SCHEDULE.PENDING,
  //   });
  // };
  // const onSuccess = data => {
  //   dispatch({
  //     type: GET_UPLOADED_PCO_SCHEDULE.SUCCESS,
  //     payload: data.InspectionRodentQueryResponseVO.queryRodentList,
  //   });
  //   dispatch(filterUploadedPCOScheduleAction(defaultFilterValue));
  // };
  // const onError = error => {
  //   dispatch({
  //     type: GET_UPLOADED_PCO_SCHEDULE.ERROR,
  //     payload: error,
  //   });
  // };
  // await actionTryCatchCreator(, onPending, onSuccess, onError);
};

export const UPLOAD_PCO_SCHEDULE = actionCreator('UPLOAD_PCO_SCHEDULE');
export const uploadedPCOScheduleAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: UPLOAD_PCO_SCHEDULE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: UPLOAD_PCO_SCHEDULE.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: UPLOAD_PCO_SCHEDULE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(uploadTownCouncilFineRegimePCOService(), onPending, onSuccess, onError);
};
