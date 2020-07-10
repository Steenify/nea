import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';
import Overview from 'components/pages/rodent-audit/overview';
import Assignment from 'components/pages/rodent-audit/assignment';
import ContractorFindings from 'components/pages/rodent-audit/contractor-findings';
import ContractorCorrespondence from 'components/pages/rodent-audit/contractor-correspondence';
import Audit from 'components/pages/rodent-audit/audit';
import ShowCauseRecommendation from 'components/pages/rodent-audit/show-cause-recommendation';

import { getAuditTaskDetailService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';

const RodentExpiredTaskDetail = (props) => {
  const {
    history,
    location: { state },

    functionNameList,
  } = props;

  // const tabNavMenu = [
  //   // 'Overview',
  //   // "Contractor's Findings",
  //   // 'Assignment History',
  // ];

  const [tabNavMenu, setTabNavMenu] = useState([]);

  const [activeTabNav, toggleTabNav] = useState('0');
  // const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getDetailAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      // setDetail(data.detailListing);

      const detail = data?.detailListing;

      if (detail?.overviewResponseVO) {
        tabNavMenu.push({
          name: 'Overview',
          component: (
            <>
              <Overview type={state?.taskType} taskOverview={detail.overviewResponseVO} />
              {detail.overviewResponseVO?.taskAssignments && <Assignment assignments={detail.overviewResponseVO.taskAssignments} taskId={state?.id} isEditable />}
            </>
          ),
        });
      }

      if (detail?.contractorFindingResponseVO) {
        tabNavMenu.push({
          name: "Contractor's Findings",
          component: <ContractorFindings type={state?.taskType} contractorsFindings={detail.contractorFindingResponseVO} />,
        });
      }

      if (detail?.auditDetailResponseVO) {
        tabNavMenu.push({
          name: 'Audit',
          component: <Audit type={state?.taskType} audit={detail?.auditDetailResponseVO} />,
        });
      }

      if (detail?.recommendationResponseVO) {
        tabNavMenu.push({
          name: 'Show Cause Recommendation',
          component: <ShowCauseRecommendation type={state?.taskType} showCause={detail?.recommendationResponseVO} action={state?.action} />,
        });
      }
      if (detail?.contractorCorrespondanceVO) {
        tabNavMenu.push({
          name: "Contractor's Correspondence",
          component: <ContractorCorrespondence type={state?.taskType} correspondence={detail?.contractorCorrespondanceVO} />,
        });
      }

      setTabNavMenu(tabNavMenu);

      // toggleTabNav(`${tabNavMenu.length - 1}`);

      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    if (functionNameList.includes(FUNCTION_NAMES.getAssignmentDetail)) {
      actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
    } else if (functionNameList.includes(FUNCTION_NAMES.getExpiredPendingTaskDetail)) {
      actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
    }
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.EXPIRED_SHOWCAUSE_DETAIL.name}`;
    if (state?.taskId) {
      getDetailAction({ id: state?.id, vcs2TaskType: state?.taskType });
      // getDetailAction({ taskId: state?.taskId });
    } else {
      history.goBack();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.EXPIRED_SHOWCAUSE_DETAIL]} />
          <div className="go-back">
            <span onClick={() => history.goBack()}>Task ID: {state?.taskId}</span>
          </div>

          <nav className="tab__main">
            <div className="tabsContainer">
              <div>
                <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu.map((tab) => tab.name)} />
                <TabContent activeTab={activeTabNav}>
                  {tabNavMenu.map((tab, index) => {
                    return (
                      <TabPane tabId={`${index}`} key={`${index + 1}`}>
                        {tab.component}
                      </TabPane>
                    );
                  })}
                  {/* <TabPane tabId="0">
                    <Overview type={state?.taskType} taskOverview={detail?.overviewResponseVO} />
                    <Assignment assignments={detail?.overviewResponseVO?.taskAssignments} taskId={state?.id} />
                  </TabPane>
                  <TabPane tabId="1">
                    <ContractorFindings type={state?.taskType} contractorsFindings={detail?.contractorFindingResponseVO} />
                  </TabPane> */}
                  {/* <TabPane tabId="2">
                    <Assignment assignments={detail?.overviewResponseVO?.assignments} taskId={state?.id} />
                  </TabPane> */}
                </TabContent>
              </div>
            </div>
          </nav>
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

export default connect(mapStateToProps, mapDispatchToProps)(RodentExpiredTaskDetail);
