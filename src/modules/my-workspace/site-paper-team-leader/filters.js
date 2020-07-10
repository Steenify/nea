import { getFilterArrayOfListForKey } from 'utils';
import { FilterType } from 'components/common/filter';

export const PendingApprovalShowCauseFilterData = (list = []) => [
  {
    type: FilterType.SEARCH,
    id: 'auditRepotType',
    title: 'Type',
    values: getFilterArrayOfListForKey(list, 'auditRepotType'),
  },
  {
    type: FilterType.SEARCH,
    id: 'divCode',
    title: 'Division',
    values: getFilterArrayOfListForKey(list, 'divCode'),
  },
  {
    type: FilterType.SELECT,
    id: 'mappedWeek',
    title: 'Eweek',
    values: getFilterArrayOfListForKey(list, 'mappedWeek'),
  },
  {
    type: FilterType.SEARCH,
    id: 'auditor',
    title: 'Auditor',
    values: getFilterArrayOfListForKey(list, 'auditor'),
  },
];

export const PendingResubmissionFilterData = (list = []) => [
  {
    type: FilterType.SEARCH,
    id: 'divCode',
    title: 'Division',
    values: getFilterArrayOfListForKey(list, 'divCode'),
  },
  {
    type: FilterType.SELECT,
    id: 'mappedWeek',
    title: 'Eweek',
    values: getFilterArrayOfListForKey(list, 'mappedWeek'),
  },
];

export const LiaisingFilterData = (list = []) => [
  {
    type: FilterType.SEARCH,
    id: 'auditRepotType',
    title: 'Type',
    values: getFilterArrayOfListForKey(list, 'auditRepotType'),
  },
  {
    type: FilterType.SEARCH,
    id: 'divCode',
    title: 'Division',
    values: getFilterArrayOfListForKey(list, 'divCode'),
  },
  {
    type: FilterType.SELECT,
    id: 'mappedWeek',
    title: 'Eweek',
    values: getFilterArrayOfListForKey(list, 'mappedWeek'),
  },
  {
    type: FilterType.SEARCH,
    id: 'auditor',
    title: 'Auditor',
    values: getFilterArrayOfListForKey(list, 'auditor'),
  },
];

export const RejectedLdFilterData = (list = []) => [
  {
    type: FilterType.SEARCH,
    id: 'auditRepotType',
    title: 'Type',
    values: getFilterArrayOfListForKey(list, 'auditRepotType'),
  },
  {
    type: FilterType.SEARCH,
    id: 'divCode',
    title: 'Division',
    values: getFilterArrayOfListForKey(list, 'divCode'),
  },
  {
    type: FilterType.SELECT,
    id: 'mappedWeek',
    title: 'Eweek',
    values: getFilterArrayOfListForKey(list, 'mappedWeek'),
  },
  {
    type: FilterType.SEARCH,
    id: 'auditor',
    title: 'Auditor',
    values: getFilterArrayOfListForKey(list, 'auditor'),
  },
  {
    type: FilterType.SELECT,
    id: 'lapses',
    title: 'Lapses',
    values: getFilterArrayOfListForKey(list, 'lapses'),
  },
];
