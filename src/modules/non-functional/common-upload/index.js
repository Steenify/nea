import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import Select from 'components/common/select';

import { WEB_ROUTES } from 'constants/index';

import UploadPCO from 'modules/vectorInspection/upload-pco';
import FoggingFileUpload from 'modules/fogging-audit/upload-files-schedule';
import UploadAuditFindings from 'modules/ehi-gravitrap-audit/upload-findings';
import RodentUploadFindings from 'modules/rodent-audit/upload-findings';
import CaseFileUpload from 'modules/epi-investigation/upload-arcgis-file';
import BlockFileUpload from 'modules/ops-management/block-file-upload';
import { showCommonUploadAction, commonUploadAction, resetCommonUploadAction } from './action';

const CommonUpload = (props) => {
  const {
    showCommonUploadAction,
    resetCommonUploadAction,
    ui: { isLoading },
    data: { functionLOV },
  } = props;

  const [functionName, setFunctionName] = useState();

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.NON_FUNCTIONAL.COMMON_UPLOAD.name}`;
    resetCommonUploadAction();
    showCommonUploadAction((list) => {
      if (list.length > 0) setFunctionName(list[0]);
    });
  }, [resetCommonUploadAction, showCommonUploadAction]);

  const renderUploadForm = () => {
    switch (functionName?.value || '') {
      case 'FFUP': // * Fogging File Upload - FOGGINGAdmin
        return <FoggingFileUpload isFromCommonUpload fileType="FFUP" />;
      case 'CF': // * Contractor Findings  - GRAVIAdmin
        return <UploadAuditFindings isFromCommonUpload fileType="CF" />;
      case 'CFUP': // * Case File Upload  - EPIAdmin
        return <CaseFileUpload isFromCommonUpload fileType="CFUP" />;
      case 'MTM': // * Missed Traps Maintenance Report - GRAVIAdmin
        return <UploadAuditFindings isFromCommonUpload fileType="MTM" />;
      case 'MTNR': // * Missing Traps Not Replaced Report - GRAVIAdmin
        return <UploadAuditFindings isFromCommonUpload fileType="MTNR" />;
      case 'AF': // * Audit Findings - GRAVIAdmin
        return <UploadAuditFindings isFromCommonUpload fileType="AF" />;
      case 'INFUP': // * Inspection File Upload - INSPECAdmin
        return <UploadPCO isFromCommonUpload fileType="INFUP" />;
      case 'ROF': // * Rodent Optional File Upload - RODENTAdmin
        return <RodentUploadFindings isFromCommonUpload fileType="ROF" />;
      case 'RF': // * Rodent Feedback File Upload - RODENTAdmin
        return <RodentUploadFindings isFromCommonUpload fileType="RF" />;
      case 'RB': // * Rodent Basic File Upload - RODENTAdmin
        return <RodentUploadFindings isFromCommonUpload fileType="RB" />;
      case 'OBFUP': // * Block File Upload - OPSAdmin
        return <BlockFileUpload isFromCommonUpload fileType="OBFUP" />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.NON_FUNCTIONAL.COMMON_UPLOAD.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.NON_FUNCTIONAL.COMMON_UPLOAD]} />
          <div className="paddingBottom50">
            <div className="main-title">
              <h1>{WEB_ROUTES.NON_FUNCTIONAL.COMMON_UPLOAD.name}</h1>
            </div>
            {functionLOV && (
              <>
                <div className="d-flex align-items-center tabsContainer">
                  <label className="font-weight-bold mr-3 mb-0">Function Name:</label>
                  <Select className="wf-400" value={functionName} options={functionLOV} onChange={(functionName) => setFunctionName(functionName)} />
                </div>
                {renderUploadForm()}
              </>
            )}
          </div>
          <Footer />
          <InPageLoading isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ nonFunctionalReducers: { commonUpload } }, ownProps) => ({
  ...ownProps,
  ...commonUpload,
});

const mapDispatchToProps = { showCommonUploadAction, commonUploadAction, resetCommonUploadAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommonUpload));
