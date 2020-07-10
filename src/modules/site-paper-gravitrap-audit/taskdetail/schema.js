/* eslint-disable no-unused-vars */
const schema = {
  id: {
    type: 'string',
  },
  auditRepotType: {
    type: 'string',
  },
  trapCode: {
    type: 'string',
  },
  postalCode: {
    type: 'string',
  },
  eweekId: {
    type: 'string',
  },
  status: {
    type: 'string',
  },
  recurring: {
    type: 'boolean',
  },
  fileId: {
    type: 'string',
  },
  contractorRemarks: {
    type: 'string',
  },
  contractorLastMaintDt: {
    type: 'number',
  },
  contractorLastMainTime: {
    type: 'string',
  },
  postorPreAudit: {
    type: 'string',
  },
  sampleCount: {
    type: 'integer',
  },
  missedsampleCount: {
    type: 'integer',
  },
  showcause: {
    type: 'boolean',
  },
  missingHay: {
    type: 'string',
  },
  missingStickylining: {
    type: 'string',
  },
  waterNottopUp: {
    type: 'string',
  },
  roCode: {
    type: 'string',
  },
  divCode: {
    type: 'string',
  },
  grcCode: {
    type: 'string',
  },
  premisesCode: {
    type: 'string',
  },
  blockNo: {
    type: 'string',
  },
  label: {
    type: 'string',
  },
  roadName: {
    type: 'string',
  },
  levelNo: {
    type: 'string',
  },
  unitNo: {
    type: 'string',
  },
  managerConcurStatus: {
    type: 'string',
  },
  nonSamples: {
    type: 'string',
  },
  createdBy: {
    type: 'string',
  },
  createdDate: {
    type: 'number',
  },
  updatedBy: {
    type: 'string',
  },
  updatedDate: {
    type: 'number',
  },
  year: {
    type: 'string',
  },
  gravitrapSitePaperVo: {
    type: 'object',
    properties: {
      lapseCode: {
        type: 'string',
      },
      ldRate: {
        type: 'number',
      },
      lapseDate: {
        type: 'number',
      },
      remarks: {
        type: 'string',
      },
      lapseBy: {
        type: 'string',
      },
      auditId: {
        type: 'string',
      },
      deadline: {
        type: 'number',
      },
      actualdeploymetDate: {
        type: 'number',
      },
      noofoccassionsLate: {
        type: 'integer',
      },
      noofdaysLate: {
        type: 'integer',
      },
      fileId: {
        type: 'string',
      },
      lapseType: {
        type: 'string',
      },
      monthyear: {
        type: 'string',
      },
      totalLDAmount: {
        type: 'string',
      },
      month: {
        type: 'string',
      },
      year: {
        type: 'string',
      },
      lapseDesc: {
        type: 'string',
      },
    },
  },
  graviTrapLapsesList: {
    type: 'array',
  },
  month: {
    type: 'string',
  },
  filtyTrap: {
    type: 'string',
  },
  filthyStickyLining: {
    type: 'string',
  },
  filthySolution: {
    type: 'string',
  },
  missingTrap: {
    type: 'string',
  },
  trapOverturned: {
    type: 'string',
  },
  trapDamaged: {
    type: 'string',
  },
  missingcover: {
    type: 'string',
  },
  missingWireMesh: {
    type: 'string',
  },
  unidentifiable: {
    type: 'string',
  },
  recommendedLocationchange: {
    type: 'string',
  },
  recommendedLocation: {
    type: 'string',
  },
  resubmissionRemarks: {
    type: 'string',
  },
  seniorManagerRemarks: {
    type: 'string',
  },
  reason: {
    type: 'string',
  },
  lastLiningreplacement: {
    type: 'string',
  },
  audittask: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      taskId: {
        type: 'string',
      },
      taskType: {
        type: 'string',
      },
      purpose: {
        type: 'string',
      },
      taskReferenceType: {
        type: 'string',
      },
      taskReferenceId: {
        type: 'string',
      },
      taskTitle: {
        type: 'string',
      },
      taskDescription: {
        type: 'string',
      },
      additionalLocationDetails: {
        type: 'string',
      },
      latitude: {
        type: 'string',
      },
      longitude: {
        type: 'string',
      },
      auditedBy: {
        type: 'string',
      },
      assignmentMode: {
        type: 'integer',
      },
      taskPriority: {
        type: 'integer',
      },
      taskStatus: {
        type: 'string',
      },
      auditDate: {
        type: 'string',
      },
      actualAuditDate: {
        type: 'string',
      },
      assignedRo: {
        type: 'string',
      },
      reason: {
        type: 'string',
      },
      reasonAcceptanceFlag: {
        type: 'boolean',
      },
      isunmatched: {
        type: 'boolean',
      },
    },
  },
  orderBy: {
    type: 'string',
  },
  auditor: {
    type: 'string',
  },
  auditdate: {
    type: 'string',
  },
  sortOrder: {
    type: 'string',
  },
  addressforSearch: {
    type: 'string',
  },
  eweek: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      year: {
        type: 'integer',
      },
      month: {
        type: 'integer',
      },
      week: {
        type: 'integer',
      },
      startDate: {
        type: 'number',
      },
      endDate: {
        type: 'number',
      },
      monthList: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      createdBy: {
        type: 'string',
      },
      updatedBy: {
        type: 'string',
      },
    },
  },
  displayAuditType: {
    type: 'string',
  },
  reviewerRemarks: {
    type: 'string',
  },
  showcauseRemarks: {
    type: 'string',
  },
  managerShowcauseremarks: {
    type: 'string',
  },
  ifosRemarks: {
    type: 'string',
  },
  rejectionDate: {
    type: 'string',
  },
  rejectionTime: {
    type: 'string',
  },
};
