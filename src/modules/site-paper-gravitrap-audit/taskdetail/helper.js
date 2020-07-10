import uuid from 'uuid/v4';

export const validate = () => ({});

export const initialLapse = {
  lapseCode: '',
  lapseDesc: '',
};

export const initialAdHocLapse = {
  submissionDate: '',
  submissionDeadline: '',
  totalBatches: '',
  month: '',
  year: '',
  notificationDate: '',
  lapseCode: '',
  lapseDescription: '',
  ehiLapseFileList: [],
  ehiLapseFileVOList: [],
};

export const initialGravitrapSitePaperVo = {
  lapseCode: '',
  ldRate: '',
  lapseDate: '',
  remarks: '',
  lapseBy: '',
  auditId: '',
  deadline: '',
  actualdeploymetDate: '',
  noofoccassionsLate: '',
  noofdaysLate: '',
  fileId: '',
  lapseType: '',
  monthyear: '',
  totalLDAmount: '',
  month: '',
  year: '',
  lapseDesc: '',
};

export const initialAuditTask = {
  id: '',
  taskId: '',

  taskType: '',
  purpose: '',
  taskReferenceType: '',
  taskReferenceId: '',

  taskTitle: '',
  taskDescription: '',
  additionalLocationDetails: '',
  latitude: '',
  longitude: '',
  auditedBy: '',
  assignmentMode: '',
  taskPriority: '',
  taskStatus: '',
  auditDate: '',
  actualAuditDate: '',
  assignedRo: '',
  reason: '',
  reasonAcceptanceFlag: '',
  isunmatched: '',
};

export const initialEweek = {
  id: '',
  year: '',
  month: '',
  week: '',
  startDate: '',
  endDate: '',
  monthList: [],
  updatedBy: '',
};

const initialCaseDetail = {
  id: '',
  auditRepotType: '',
  trapCode: '',
  postalCode: '',
  eweekId: '',
  status: '',
  recurring: '',
  fileId: '',
  contractorRemarks: '',
  contractorLastMaintDt: '',
  contractorLastMainTime: '',
  postorPreAudit: '',
  sampleCount: '',
  showcause: '',
  roCode: '',
  divCode: '',
  grcCode: '',
  premisesCode: '',
  blockNo: '',
  label: '',
  roadName: '',
  levelNo: '',
  unitNo: '',
  managerConcurStatus: '',
  createdBy: '',
  createdDate: '',
  updatedBy: '',
  updatedDate: '',
  year: '',
  gravitrapSitePaperVo: {},
  graviTrapLapsesList: [],
  month: '',
  recommendedLocationchange: '',
  contractorCorrespondenceRemarks: '',
  recommendedLocation: '',
  resubmissionRemarks: '',
  seniorManagerRemarks: '',
  showcauseRemarks: '',
  managerShowCause: '',
  managerShowcauseRemarks: '',
  reason: '',
  lastLiningreplacement: '',
  audittask: {},
  auditor: '',
  auditdate: '',
  eweek: {},
  trapStatus: '',
  displayAuditType: '',
  reviewerRemarks: '',
  ifosRemarks: '',
  rejectionDate: '',
  rejectionTime: '',
  teamLead: '',
  lapseDescription: '',
  missedSampleCount: '',
  missingHay: '',
  missingStickylining: '',
  waterNottopUp: '',
  nonSamples: '',
  filtyTrap: '',
  filthyStickyLining: '',
  filthySolution: '',
  missingTrap: '',
  trapOverturned: '',
  trapDamaged: '',
  missingcover: '',
  missingWireMesh: '',
  unidentifiable: '',

  // Frontend property
  auditFindingsFileList: [],
  findingLapses: [],
  isApprove: '',
  approveRemarks: '',
  isChangeLocation: '',
  suggestedLocation: '',
  locationChangedRemarks: '',
  finalRemarks: '',
  seniorManagerFileList: [],
  finalLapseList: [],
  outsourcedFileList: [],
  contractorUploadDate: '',
  smUploadDate: '',
  inputStatus: '',
  isDraft: true,
};

export const boolOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const boolOptionsYesWithNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

export const nameToCodeLapse = {
  filthySolution: 'FS',
  filthyStickyLining: 'FSL',
  filtyTrap: 'FT',
  missedsampleCount: 'MS',
  missingcover: 'MC',
  unidentifiable: 'LUN',
  trapDamaged: 'TD',
  trapOverturned: 'TO',
  waterNottopUp: 'WNTP',
  missingHay: 'MH',
  nonSamples: 'NS',
  missingWireMesh: 'MWM',
  missingTrap: 'MT',
  missingStickylining: 'MSL',
};

export const codeToNameLapse = {
  FS: 'filthySolution',
  FSL: 'filthyStickyLining',
  FT: 'filtyTrap',
  MS: 'missedsampleCount',
  MC: 'missingcover',
  LUN: 'unidentifiable',
  TD: 'trapDamaged',
  TO: 'trapOverturned',
  WNTP: 'waterNottopUp',
  MH: 'missingHay',
  NS: 'nonSamples',
  MWM: 'missingWireMesh',
  MT: 'missingTrap',
  MSL: 'missingStickylining',
};

const isLapseEmpty = (value) => value === undefined || value === 0 || value === '0' || value === false || value === 'No' || value === '';

export const lapseArrToObj = (array) => {
  const result = {
    missedsampleCount: 0,
    missingHay: 'No',
    missingStickylining: 'No',
    waterNottopUp: 'No',
    nonSamples: 'No',
    filtyTrap: 'No',
    filthyStickyLining: 'No',
    filthySolution: 'No',
    missingTrap: 'No',
    trapOverturned: 'No',
    trapDamaged: 'No',
    missingcover: 'No',
    missingWireMesh: 'No',
  };
  array.forEach(({ lapseCode, lapseDesc }) => {
    const fieldName = codeToNameLapse[lapseCode] || 'unidentifiable';
    if (lapseCode === 'MS') {
      result[fieldName] = Number(lapseDesc) || 0;
    } else {
      result[fieldName] = 'Yes';
    }
  });
  return result;
};

const lapseObjToArr = (values) => {
  const result = Object.keys(nameToCodeLapse)
    .map((key) => {
      const lapseCode = nameToCodeLapse[key];
      const v = values?.[key];
      if (isLapseEmpty(v)) {
        return false;
      }
      if (key === 'missedsampleCount') {
        return { lapseCode, lapseDesc: v.toString(), id: uuid() };
      }
      return { lapseCode, lapseDesc: '', id: uuid() };
    })
    .filter((item) => item !== false);
  return result;
};

export const initialValue = (info) => {
  const gravitrapSitePaperVo = info?.gravitrapSitePaperVo || {};
  const audittask = info?.audittask || {};
  const eweek = info?.eweek || {};
  const findingLapses = lapseObjToArr(info);

  const outsourcedFileList = info?.fileIds?.map((fileId) => ({ fileId })) || [];
  const seniorManagerFileList = info?.lafileIds?.map((fileId) => ({ fileId })) || [];
  const lapseInfoVO = info?.lapseInfoVO || initialAdHocLapse;
  return {
    ...initialCaseDetail,
    ...info,
    gravitrapSitePaperVo: { ...initialGravitrapSitePaperVo, ...gravitrapSitePaperVo },
    audittask: { ...initialAuditTask, ...audittask },
    eweek: { ...initialEweek, ...eweek },
    findingLapses,
    outsourcedFileList,
    seniorManagerFileList,
    lapseInfoVO: { ...initialAdHocLapse, ...lapseInfoVO, ehiLapseFileList: lapseInfoVO?.ehiLapseFileVOList || [] },
  };
};
