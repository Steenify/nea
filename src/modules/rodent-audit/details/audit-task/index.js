import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES } from 'constants/index';
import SubmissionInfo from 'components/pages/rodent-audit/submission-info';
import Overview from 'components/pages/rodent-audit/overview';
import Assignment from 'components/pages/rodent-audit/assignment';
import ContractorFindings from 'components/pages/rodent-audit/contractor-findings';
import Audit from 'components/pages/rodent-audit/audit';
import ShowCauseRecommendation from 'components/pages/rodent-audit/show-cause-recommendation';
import ContractorCorrespondence from 'components/pages/rodent-audit/contractor-correspondence';

import { getAuditTaskDetailService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

const RodentAuditTaskDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const [activeTabNav, toggleTabNav] = useState('0');
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getDetailAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data.detailListing);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK_DETAIL.name}`;
    const id = state?.auditId || state?.id;

    if (id) {
      getDetailAction({ id, vcs2TaskType: state?.taskType });
    } else if (state?.rodentQueryAuditDetail) {
      const { reportType, overviewTab, contractorFindingsTab } = state.rodentQueryAuditDetail;

      setDetail({
        reportType,
        overviewResponseVO: overviewTab,
        contractorFindingResponseVO: contractorFindingsTab,
      });
    } else {
      history.goBack();
    }
  }, []);

  const getTabMenu = () => {
    // const currentTaskStatus = detail?.auditDetailResponseVO?.currentTaskStatus || '';
    const isLateSubmissionTask = detail?.submissionInfoVO;
    const tabMenu = [];
    if (isLateSubmissionTask) {
      tabMenu.push({
        title: 'Submission Info',
        component: (
          <>
            <SubmissionInfo submissionInfo={detail?.submissionInfoVO} />
            {detail?.submissionInfoVO?.taskAssignments && <Assignment assignments={detail?.submissionInfoVO?.taskAssignments} />}
          </>
        ),
      });
      // if (currentTaskStatus === 'LDSUP') {
      if (detail?.contractorCorrespondanceVO?.contractorVO) {
        tabMenu.push({ title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={detail?.contractorCorrespondanceVO} isLateSubmissionTask /> });
      }

      // }
    } else {
      tabMenu.push({
        title: 'Overview',
        component: (
          <>
            <Overview type={state?.taskType || detail?.reportType} taskOverview={detail?.overviewResponseVO} />
            <Assignment assignments={detail?.overviewResponseVO?.taskAssignments} taskId={state?.id} />
          </>
        ),
      });
      tabMenu.push({
        title: "Contractor's Findings",
        component: <ContractorFindings contractorsFindings={detail?.contractorFindingResponseVO} type={state?.taskType || detail?.reportType} />,
      });
      if (detail?.auditDetailResponseVO) {
        tabMenu.push({ title: 'Audit', component: <Audit type={state?.taskType} audit={detail?.auditDetailResponseVO} /> });
        if (detail?.recommendationResponseVO?.showCause !== null && detail?.recommendationResponseVO?.showCause !== undefined) {
          tabMenu.push({ title: 'Show Cause Recommendation', component: <ShowCauseRecommendation type={state?.taskType} showCause={detail?.recommendationResponseVO} /> });
          if (detail?.contractorCorrespondanceVO && detail?.contractorCorrespondanceVO?.acceptExplanation !== null && detail?.contractorCorrespondanceVO?.acceptExplanation !== undefined) {
            tabMenu.push({ title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={detail?.contractorCorrespondanceVO} /> });
          }
        }
      }
    }
    return tabMenu;
  };

  const tabNavMenu = getTabMenu();

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK, WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK_DETAIL]} />
          <GoBackButton
            onClick={() => history.goBack()}
            title={state?.rodentQueryAuditDetail?.address ? `Address: ${state?.rodentQueryAuditDetail?.address}` : `Task ID: ${state?.taskID || state?.taskId}`}
          />
          {detail && (
            <nav className="tab__main">
              <div className="tabsContainer">
                <div>
                  <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu.map((item) => item.title)} />
                  <TabContent activeTab={activeTabNav}>
                    {tabNavMenu.map((menu, index) => (
                      <TabPane key={`audit_task_detail_tabs_${index + 1}`} tabId={`${index}`}>
                        {menu.component}
                      </TabPane>
                    ))}
                  </TabContent>
                </div>
              </div>
            </nav>
          )}

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RodentAuditTaskDetail);
