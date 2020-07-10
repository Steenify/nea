import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    HQ: {
      INSPECTION_AND_BREEDING,
      ACCESSIBILITY_RATE,
      AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EWEEK,
      AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EMONTH,
      AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK,
      AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EMONTH,
      AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EWEEK,
      AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EMONTH,
      AEDES_BREEDING_MASTER_LIST_SUMMARY,
      FRIENDSHIP_BOARD,
      CONSTRUCTION_SITE_INSPECTION,
      CONSTRUCTION_SITE_MONITORING,
      ENFORCEMENT_MONITORING,
    },
  },
} = API_URLS;

export const generateInspectionAndBreedingReportService = data =>
  request({
    data,
    ...INSPECTION_AND_BREEDING,
  });

export const generateAccessibilityRateReportService = data =>
  request({
    data,
    ...ACCESSIBILITY_RATE,
  });

export const generateBreedingInspectionEweekReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EWEEK,
  });

export const generateBreedingInspectionEmonthReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EMONTH,
  });

export const generatePremisesWithBreedingEweekReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK,
  });

export const generateAbmListPremiseWithBreedingEMonthService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EMONTH,
  });

export const generatePremisesWithBreedingHabitatsEweekReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EWEEK,
  });

export const generatePremisesWithBreedingHabitatsEmonthReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EMONTH,
  });

export const generateSummaryBreedingReportService = data =>
  request({
    data,
    ...AEDES_BREEDING_MASTER_LIST_SUMMARY,
  });

export const generateFriendshipBoardReportService = data =>
  request({
    data,
    ...FRIENDSHIP_BOARD,
  });

export const generateConstructionSiteInspectionReportService = data =>
  request({
    data,
    ...CONSTRUCTION_SITE_INSPECTION,
  });

export const generateConstructionSiteMonitoringReportService = data =>
  request({
    data,
    ...CONSTRUCTION_SITE_MONITORING,
  });

export const generateEnforcementMonitoringReportService = data =>
  request({
    data,
    ...ENFORCEMENT_MONITORING,
  });
