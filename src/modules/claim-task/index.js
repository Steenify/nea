import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FUNCTION_NAMES } from 'constants/index';

import EHIAnalyst from 'modules/claim-task/ehi-analyst';
import EPIInspector from 'modules/claim-task/epi-inspector';
import EPICOB1 from 'modules/claim-task/epi-cob1';
import EHITechnicalOfficer from 'modules/claim-task/ehi-technical-officer';
import IEUOfficer from 'modules/claim-task/ieu_officer';
// import IEUManager from 'modules/claim-task/ieu-manager';
import Blocked from 'pages/blocked';

const ClaimTask = (props) => {
  const { functionNameList } = props;
  if (functionNameList.includes(FUNCTION_NAMES.ehiCommonpool)) {
    return <EHIAnalyst />;
  }
  if (functionNameList.includes(FUNCTION_NAMES.getClaimTaskListing) && !functionNameList.includes(FUNCTION_NAMES.reassignEpiCase)) {
    return <EPIInspector />;
  }
  if (functionNameList.includes(FUNCTION_NAMES.getClaimTaskListing) && functionNameList.includes(FUNCTION_NAMES.reassignEpiCase)) {
    return <EPICOB1 />;
  }
  if (functionNameList.includes(FUNCTION_NAMES.getEHIAuditTasksCommonPoolListing)) {
    return <EHITechnicalOfficer />;
  }
  if (functionNameList.includes(FUNCTION_NAMES.getForm3CommonPoolListing)) {
    return <IEUOfficer />;
  }

  return <Blocked />;

  // const userRole = getObject('userRole');
  // switch (userRole.name) {
  //   case UserRole.IEU_Manager.name: {
  //     return <IEUManager />;
  //   }

  //   default:
  //     return <></>;
  // }
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
