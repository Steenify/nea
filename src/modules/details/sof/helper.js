export const sofInitialValues = {
  isSaving: false,
  inspectionId: '',
  sof: {
    officerInfo: {
      inspectionDate: '',
      inspectionTime: '',
      breedingLocation: '',
      vectorType: '',
      witnessRelationship: '',
      witnessName: '',
      witnessIdType: '',
      witnessId: '',
    },
    uploadedFileIds: [],
    dateOfStatement: '',
    remarks: '',
  },
  additionalInfo: {
    isEditable: true,
    isElderResidents: null,
    isMaidDomesticHelper: null,
    isOtherOccupants: null,
    isPersonWithDisabilities: null,
    isHoardingIssues: null,
    isHousekeepingIssues: null,
    elderResidentsRemark: '',
    maidDomesticHelperRemark: '',
    otherOccupantsRemark: '',
    personWithDisabilitiesRemark: '',
    hoardingIssuesRemark: '',
    housekeepingIssuesRemark: '',
  },
};

export const sofValidation = (values) => {
  let sofErrorCount = 0;
  let additionalErrorCount = 0;

  // Officer Info
  const officerInfo = {};
  // if (!values.sof?.officerInfo?.inspectionDate) {
  //   officerInfo.inspectionDate = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.inspectionTime) {
  //   officerInfo.inspectionTime = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.breedingLocation) {
  //   officerInfo.breedingLocation = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.vectorType) {
  //   officerInfo.vectorType = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.witnessRelationship) {
  //   officerInfo.witnessRelationship = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.witnessName) {
  //   officerInfo.witnessName = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.witnessIdType) {
  //   officerInfo.witnessIdType = '(Required)';
  //   sofErrorCount += 1;
  // }
  // if (!values.sof?.officerInfo?.witnessId) {
  //   officerInfo.witnessId = '(Required)';
  //   sofErrorCount += 1;
  // }
  let dateOfStatement;
  let remarks;
  if (values.sof?.isEditable) {
    if (!values.sof?.dateOfStatement) {
      dateOfStatement = '(Required)';
      sofErrorCount += 1;
    }
    if (!values.sof?.remarks) {
      remarks = '(Required)';
      sofErrorCount += 1;
    }
  }

  // Additional Info
  const {
    isEditable,
    isElderResidents,
    elderResidentsRemark,
    isMaidDomesticHelper,
    maidDomesticHelperRemark,
    isOtherOccupants,
    otherOccupantsRemark,
    isPersonWithDisabilities,
    personWithDisabilitiesRemark,
    isHoardingIssues,
    hoardingIssuesRemark,
    isHousekeepingIssues,
    housekeepingIssuesRemark,
  } = values.additionalInfo;
  const additionalInfo = {};
  if (isEditable) {
    if (isElderResidents == null) {
      additionalInfo.isElderResidents = '(Required)';
      additionalErrorCount += 1;
    }
    if (isElderResidents && !elderResidentsRemark) {
      additionalInfo.elderResidentsRemark = '(Required)';
      additionalErrorCount += 1;
    }

    if (isMaidDomesticHelper == null) {
      additionalInfo.isMaidDomesticHelper = '(Required)';
      additionalErrorCount += 1;
    }
    if (isMaidDomesticHelper && !maidDomesticHelperRemark) {
      additionalInfo.maidDomesticHelperRemark = '(Required)';
      additionalErrorCount += 1;
    }

    if (isOtherOccupants == null) {
      additionalInfo.isOtherOccupants = '(Required)';
      additionalErrorCount += 1;
    }
    if (isOtherOccupants && !otherOccupantsRemark) {
      additionalInfo.otherOccupantsRemark = '(Required)';
      additionalErrorCount += 1;
    }

    if (isPersonWithDisabilities == null) {
      additionalInfo.isPersonWithDisabilities = '(Required)';
      additionalErrorCount += 1;
    }
    if (isPersonWithDisabilities && !personWithDisabilitiesRemark) {
      additionalInfo.personWithDisabilitiesRemark = '(Required)';
      additionalErrorCount += 1;
    }

    if (isHoardingIssues == null) {
      additionalInfo.isHoardingIssues = '(Required)';
      additionalErrorCount += 1;
    }
    if (isHoardingIssues && !hoardingIssuesRemark) {
      additionalInfo.hoardingIssuesRemark = '(Required)';
      additionalErrorCount += 1;
    }

    if (isHousekeepingIssues == null) {
      additionalInfo.isHousekeepingIssues = '(Required)';
      additionalErrorCount += 1;
    }
    if (isHousekeepingIssues && !housekeepingIssuesRemark) {
      additionalInfo.housekeepingIssuesRemark = '(Required)';
      additionalErrorCount += 1;
    }
  }

  const errors = {};
  if (sofErrorCount + additionalErrorCount > 0) {
    let errorHint = '';
    if (sofErrorCount > 0) {
      errors.sof = { officerInfo, dateOfStatement, remarks };
      errorHint += `There are ${sofErrorCount} missing required fields in Statement of Officer tab. `;
    }
    if (additionalErrorCount > 0) {
      errors.additionalInfo = additionalInfo;
      errorHint += `There are ${additionalErrorCount} missing required fields in Additional Info tab. `;
    }
    errors.errorCount = sofErrorCount + additionalErrorCount;
    errors.errorHint = errorHint;
  }

  return errors;
};

export const sofSampleResponse = {
  status: 'Pass',
  inspectionId: 'VC-20215-11700',
  sof: {
    officerInfo: {
      officerName: 'Ben Wong',
      officerId: 'S9001234T',
      designation: 'Officer Name',
      regionOffice: 'Central',
      division: 'Eunos',
      inspectionDate: '13/10/2019',
      inspectionTime: '10:30 AM',
      breedingLocation: 'Blk 250, Ang Mo Kio Street',
      vectorType: 'MQ',
      witnessRelationship: 'TENANT',
      witnessName: 'Tan See Min',
      witnessIdType: 'NRIC_C',
      witnessId: 'S1234567T',
    },
    habitatInfos: [
      {
        serialNo: 1,
        habitatType: 'Flower Pots',
        habitatTypeRemarks: '',
        habitatSize: '15 cm2/m2',
        locationBreeding: 'Garden',
        locationBreedingRemarks: '',
        densityInContainer: '10 In Container',
        densityPerDip: '100 Per dip (80cc)',
      },
    ],
    uploadedFiles: [
      {
        fileId: 'A8EF0897-C9E3-4B5E-BF4E-5EE1A6E16348',
        fileName: 'Image.jpg',
      },
    ],
    uploadedFileIds: ['a185c24a-3e2a-439c-bfa1-02e3012d981e', '542fc955-afdf-4070-908c-d2c29ad959ef', 'ec60d501-70c8-427b-a87b-e372298ca3d7'],
    remarks: 'Lorem ipsum dolor sit amet',
    dateOfStatement: '15/10/2019',
    reasonForAmendment: 'Lorem ipsum dolor sit amet',
    dateOfAmendment: '16/10/2019',
  },
  additionalInfo: {
    isEditable: true,
    isElderResidents: true,
    isMaidDomesticHelper: false,
    isOtherOccupants: true,
    isPersonWithDisabilities: false,
    isHoardingIssues: false,
    isHousekeepingIssues: false,
    elderResidentsRemark: 'Lorem ipsum dolor sit amet',
    otherOccupantsRemark: 'Lorem ipsum dolor sit amet',
  },
};
