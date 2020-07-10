import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    SAMPLE_IDENTIFICATION: {
      SAMPLES_TREATMENT,
      SPECIMEN_SAMPLES_RECEIVED_BY_EHI,
      DAILY_SPECIMEN_RECEIVED_FROM_RO,
      SAMPLES_IDENTIFIED_BY_MONTH,
      DAILY_SUMMARY_OF_SAMPLES,
      CUSTOM_REPORT_FOR_LOCATIONS_SPECIES_HABITATS_DATES,
    },
  },
} = API_URLS;

export const generateReportForLocationsSpeciesHabitatAndDatesService = (data = {}) =>
  request({
    data,
    ...CUSTOM_REPORT_FOR_LOCATIONS_SPECIES_HABITATS_DATES,
  });

export const generateDailySummaryReportService = (data = {}) =>
  request({
    data,
    ...DAILY_SUMMARY_OF_SAMPLES,
  });
export const generateSamplesTreatmentReportService = (data = {}) =>
  request({
    data,
    ...SAMPLES_TREATMENT,
  });
export const generateSpecimenSamplesReceivedByEHIReportService = (data = {}) =>
  request({
    data,
    ...SPECIMEN_SAMPLES_RECEIVED_BY_EHI,
  });

export const generateDailySpecimenReceivedFromRoService = (data = {}) =>
  request({
    data,
    ...DAILY_SPECIMEN_RECEIVED_FROM_RO,
  });

export const generateSamplesIdentifiedByMonthService = (data = {}) =>
  request({
    data,
    ...SAMPLES_IDENTIFIED_BY_MONTH,
  });
