import { generateSampleKPIMonthlyService, getSampleKPIMonthlyDetailService } from 'services/sample-identification';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const SAMPLE_KPI_MONTHLY = actionCreator('SAMPLE_KPI_MONTHLY');
export const generateSampleKPIMonthlyAction = (data = {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY.SUCCESS,
      payload: data?.sampleKpiReportVOList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(generateSampleKPIMonthlyService(data), onPending, onSuccess, onError);
};

export const SAMPLE_KPI_MONTHLY_DETAIL = actionCreator('SAMPLE_KPI_MONTHLY_DETAIL');
export const getSampleKPIMonthlyDetailAction = (data = {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY_DETAIL.SUCCESS,
      payload: data?.sampleKpiReportDetailsVOList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: SAMPLE_KPI_MONTHLY_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getSampleKPIMonthlyDetailService(data), onPending, onSuccess, onError);
};
