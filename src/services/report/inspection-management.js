import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    INSPECTION_MANAGEMENT: { SURVEY_BY_ROAD, QUERY_BREEDING, QUERY_VOID_INSPECTION, DAILY_HABITAT },
  },
} = API_URLS;

export const generateSurveyByRoadReportService = data =>
  request({
    data,
    ...SURVEY_BY_ROAD,
  });

export const generateQueryBreedingReportService = data =>
  request({
    data,
    ...QUERY_BREEDING,
  });

export const generateQueryVoidInspectionReportService = data =>
  request({
    data,
    ...QUERY_VOID_INSPECTION,
  });

export const generateDailyHabitatReportService = data =>
  request({
    data,
    ...DAILY_HABITAT,
  });
