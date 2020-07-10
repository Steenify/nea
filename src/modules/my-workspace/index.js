import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import Select from 'components/common/select';

import EHIWorkspaceTable from 'components/tables/ehi-workspace';

import Form3WorkspaceTable from 'components/tables/form3-workspace';
import LOIPendingApprovalTable from 'components/tables/loi-pending-approval';
import Form3NoEnforcementPendingApprovalTable from 'components/tables/form3-no-enforcement-pending-approval';
import Form3NoFurtherActionPendingApprovalTable from 'components/tables/form3-no-further-action';
import InspectionNoticePendingApprovalTable from 'components/tables/inspection-notice';
import TCFineRegimeTable from 'components/tables/town-council-fine-regime';

import EPIWorkspaceTable from 'components/tables/epi-workspace';

import FoggingExpiredTaskTable from 'components/tables/fogging-expired-task';
import FoggingProposeEnforcementTable from 'components/tables/fogging-propose-enforcement';

import RodentAuditWorkspaceTables from 'components/tables/rodent-audit';

import EHITechnicalWorkspace from 'modules/my-workspace/ehi-technical-officer';

import SitePaperPendingApprovalAndSC from 'components/tables/site-paper-workspace/pending-approval-and-show-cause';
import SitePaperPendingResubmission from 'components/tables/site-paper-workspace/pending-resubmission';
import SitePaperLiaisingWithContractor from 'components/tables/site-paper-workspace/liaising-with-outsourced-contractor';
import SitePaperRejectedLD from 'components/tables/site-paper-workspace/rejected-ld';
import SitePaperLDPendingSupport from 'components/tables/site-paper-workspace/ld-pending-support';
import SitePaperLDPendingApproval from 'components/tables/site-paper-workspace/ld-pending-approval';
// import SitePaperLDApproved from 'components/tables/site-paper-workspace/ld-approved';

import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

const WORKSPACE_MODULE = {
  SAMPLE_IDENTIFICATION: {
    name: WEB_ROUTES.SAMPLE_IDENTIFICATION.name,
    functionNames: [FUNCTION_NAMES.ehiWorkspace],
  },
  INSPECTION_MANAGEMENT: {
    name: WEB_ROUTES.INSPECTION_MANAGEMENT.name,
    functionNames: [FUNCTION_NAMES.approvalListing, FUNCTION_NAMES.getNoEnforcementListing, FUNCTION_NAMES.getForm3WorkspaceListing],
  },
  EPI_INVESTIGATION: {
    name: WEB_ROUTES.EPI_INVESTIGATION.name,
    functionNames: [FUNCTION_NAMES.getEpiWorkspaceListing],
  },
  RODENT_AUDIT: {
    name: WEB_ROUTES.RODENT_AUDIT.name,
    functionNames: [FUNCTION_NAMES.rodentAuditWorkspaceListing, FUNCTION_NAMES.getPendingLDSupport],
  },
  FOGGING_AUDIT: {
    name: WEB_ROUTES.FOGGING_AUDIT.name,
    functionNames: [FUNCTION_NAMES.getFoggingWorkspaceListing],
  },
  EHI_AUDIT: {
    name: WEB_ROUTES.EHI_GRAVITRAP_AUDIT.name,
    functionNames: [
      FUNCTION_NAMES.getWorkspaceListing,
      FUNCTION_NAMES.getPendingapprovalShowcause,
      FUNCTION_NAMES.getLocSitePaperAudit,
      FUNCTION_NAMES.geRejectedSiteAudit,
      FUNCTION_NAMES.getPendingSupportWorkspaceListing,
      FUNCTION_NAMES.viewLDSummary,
      FUNCTION_NAMES.queryLdRemarksByMonthAndYear,
    ],
  },
};

const hideSingleTabBar = [WORKSPACE_MODULE.EHI_AUDIT.name, WORKSPACE_MODULE.RODENT_AUDIT.name];

let previousModule = null;
let previousTab = '0';

const MyWorkspace = React.memo(
  ({ functionNameList, location: { state } }) => {
    const sendModule = state?.module || previousModule;
    const sendTab = state?.tab || previousTab;
    const availableFunctions = [...functionNameList];
    const modules = Object.keys(WORKSPACE_MODULE)
      .map((key) => WORKSPACE_MODULE[key])
      .filter((item) => item.functionNames.some((functionName) => availableFunctions.includes(functionName)))
      .map((item) => ({ label: item.name, value: item.name }));
    const [tabNavMenu, setTabNavMenu] = useState([]);
    const [moduleName, setModuleName] = useState(modules.find((item) => item.value === sendModule?.value) ? sendModule : modules[0]);
    const [activeTabNav, toggleTabNav] = useState(sendTab);

    useEffect(() => {
      document.title = `NEA | ${WEB_ROUTES.MY_WORKSPACE.name}`;
      previousTab = sendTab;
      // setModuleName(modules[0]);
    }, [sendTab]);

    useEffect(() => {
      previousModule = moduleName;
      const menus = [];
      switch (moduleName?.value) {
        case WORKSPACE_MODULE.SAMPLE_IDENTIFICATION.name: {
          if (availableFunctions.includes(FUNCTION_NAMES.ehiWorkspace)) {
            menus.push({
              title: 'EHI Workspace',
              component: <EHIWorkspaceTable />,
            });
          }
          break;
        }
        case WORKSPACE_MODULE.INSPECTION_MANAGEMENT.name: {
          if (
            availableFunctions.includes(FUNCTION_NAMES.approvalListing) &&
            (availableFunctions.includes(FUNCTION_NAMES.approveInspectionNotice) || availableFunctions.includes(FUNCTION_NAMES.rejectInspectionNotice))
          ) {
            menus.push({
              title: 'Inspection Notices Pending Approval',
              component: <InspectionNoticePendingApprovalTable />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getForm3WorkspaceListing)) {
            menus.push({
              title: 'Form 3 Pending Action',
              component: <Form3WorkspaceTable />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.approvalListing) && availableFunctions.includes(FUNCTION_NAMES.approveLOI)) {
            menus.push({
              title: 'LOI Pending Approval',
              component: <LOIPendingApprovalTable />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getNoEnforcementListing)) {
            menus.push({
              title: 'Pending Approval for No Enforcement',
              component: <Form3NoEnforcementPendingApprovalTable />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.approvalListing) && availableFunctions.includes(FUNCTION_NAMES.approveNoFurtherAction)) {
            menus.push({
              title: 'Pending Approval for No Further Action',
              component: <Form3NoFurtherActionPendingApprovalTable />,
            });
          }
          if (
            availableFunctions.includes(FUNCTION_NAMES.approvalListing) &&
            (availableFunctions.includes(FUNCTION_NAMES.supportTcRegime) || availableFunctions.includes(FUNCTION_NAMES.approveTcRegime))
          ) {
            const action = availableFunctions.includes(FUNCTION_NAMES.supportTcRegime) ? 'support' : availableFunctions.includes(FUNCTION_NAMES.approveTcRegime) ? 'approve' : '';
            menus.push({
              title: 'Pending Action for Town Council Fine Regime Enforcement',
              component: <TCFineRegimeTable detailAction={action} />,
            });
          }

          break;
        }
        case WORKSPACE_MODULE.EPI_INVESTIGATION.name: {
          const showExtraFilter = availableFunctions.includes(FUNCTION_NAMES.getReassignTaskListing);
          if (availableFunctions.includes(FUNCTION_NAMES.getEpiWorkspaceListing)) {
            menus.push({
              title: 'EPI Workspace',
              component: <EPIWorkspaceTable showExtraFilter={showExtraFilter} />,
            });
          }
          break;
        }
        case WORKSPACE_MODULE.RODENT_AUDIT.name: {
          if (availableFunctions.includes(FUNCTION_NAMES.rodentAuditWorkspaceListing)) {
            menus.push({
              title: '',
              component: <RodentAuditWorkspaceTables sendTab={previousTab} />,
            });
          }
          break;
        }
        case WORKSPACE_MODULE.FOGGING_AUDIT.name: {
          if (availableFunctions.includes(FUNCTION_NAMES.getFoggingWorkspaceListing)) {
            menus.push({
              title: 'Expired Tasks',
              component: <FoggingExpiredTaskTable />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getFoggingWorkspaceListing)) {
            menus.push({
              title: 'Enforcement Recommendation',
              component: <FoggingProposeEnforcementTable />,
            });
          }
          break;
        }
        case WORKSPACE_MODULE.EHI_AUDIT.name: {
          if (availableFunctions.includes(FUNCTION_NAMES.getWorkspaceListing)) {
            const isAnalyst = availableFunctions.includes(FUNCTION_NAMES.submitTechOfficerAssessment);
            const isUnitLeader = availableFunctions.includes(FUNCTION_NAMES.submitUnitLeaderAssessment);
            const isSectionLeader = availableFunctions.includes(FUNCTION_NAMES.supportAssessment);
            menus.push({
              title: 'EHI Workspace',
              component: <EHITechnicalWorkspace isAnalyst={isAnalyst} isUnitLeader={isUnitLeader} isSectionLeader={isSectionLeader} />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.geRejectedSiteAudit)) {
            menus.push({
              title: 'Pending Resubmission',
              component: <SitePaperPendingResubmission />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getPendingapprovalShowcause)) {
            const isManager = availableFunctions.includes(FUNCTION_NAMES.updateShowcauseResubmission);
            menus.push({
              title: 'Pending Approval and Show Cause',
              component: <SitePaperPendingApprovalAndSC isManager={isManager} />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getLocSitePaperAudit)) {
            const isManager = availableFunctions.includes(FUNCTION_NAMES.updateShowcauseResubmission);
            menus.push({
              title: 'Liaising with Outsourced Contractor',
              component: <SitePaperLiaisingWithContractor isManager={isManager} />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getLocSitePaperAuditRejected)) {
            menus.push({
              title: 'Rejected LD',
              component: <SitePaperRejectedLD />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.getPendingSupportWorkspaceListing)) {
            const isManager = availableFunctions.includes(FUNCTION_NAMES.updateShowcauseResubmission);
            menus.push({
              title: 'LD Pending Support',
              component: <SitePaperLDPendingSupport isManager={isManager} />,
            });
          }
          if (availableFunctions.includes(FUNCTION_NAMES.viewLDSummary)) {
            menus.push({
              title: 'LD Pending Approval',
              component: <SitePaperLDPendingApproval />,
            });
          }
          break;
        }
        default:
          break;
      }

      setTabNavMenu(menus);
      toggleTabNav(menus.length > Number(previousTab) ? previousTab : '0');
    }, [moduleName]);

    return (
      <>
        <Header />
        <div className="main-content workspace__main">
          <NavBar active="My Workspace" />
          <div className="contentWrapper">
            <div className="main-title">
              <h1>My Workspace</h1>
            </div>

            <div className="d-flex align-items-center tabsContainer">
              <label className="font-weight-bold mr-3">Module Name:</label>
              <Select className="wf-300" options={modules} onChange={setModuleName} value={moduleName} />
            </div>
            {(tabNavMenu.length > 1 || !hideSingleTabBar.includes(moduleName?.value)) && (
              <nav className="tab__main">
                <div className="tabsContainer">
                  <TabNav
                    onToggleTab={(tab) => {
                      toggleTabNav(tab);
                      previousTab = tab;
                    }}
                    activeTab={activeTabNav}
                    menu={tabNavMenu.map((item) => item.title)}
                  />
                </div>
              </nav>
            )}
            {tabNavMenu.map((menu, index) => (
              <div key={`workspace_tab_${index + 1}`} className={Number(activeTabNav) === index ? '' : 'd-none'}>
                {menu.component || <></>}
              </div>
            ))}
            {/* <div>{tabNavMenu[Number(activeTabNav) || 0]?.component || <></>}</div> */}
            <Footer />
          </div>
        </div>
      </>
    );
  },
  () => true,
);

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  functionNameList: global.data.functionNameList,
  workspaceList: global.data.workspaceList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyWorkspace));
