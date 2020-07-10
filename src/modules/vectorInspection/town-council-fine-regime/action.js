import { getTownCouncilFineRegimeListingService } from 'services/inspection-management/town-council-fine-regime';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'tcCodeDesc',
  filterValue: null,
  sortValue: {
    id: 'tcCodeDesc',
    label: 'Town Council',
    desc: false,
  },
};

export const FILTER_TOWN_COUNCIL_FINE_REGIME = 'FILTER_TOWN_COUNCIL_FINE_REGIME';
export const filterListAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      townCouncilFineRegime: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_TOWN_COUNCIL_FINE_REGIME,
    payload: filteredList,
  });
};

export const GET_TOWN_COUNCIL_FINE_REGIME = actionCreator('GET_TOWN_COUNCIL_FINE_REGIME');
export const getListAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME.SUCCESS,
      payload: data?.tcRegimeDetailSummaryListingVoList || [],
    });
    dispatch(filterListAction(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: GET_TOWN_COUNCIL_FINE_REGIME.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getTownCouncilFineRegimeListingService(params), onPending, onSuccess, onError);
};
