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

import AuditResults from 'components/pages/fogging-audit/audit-results';
import FoggingInfo from 'components/pages/fogging-audit/fogging-info';
import Enforcement from 'components/pages/fogging-audit/enforcement';
import Assignment from 'components/pages/fogging-audit/assignment';
import GoBackButton from 'components/ui/go-back-button';

import { viewFoggingAuditTaskDetailService } from 'services/fogging-audit';
import { actionTryCatchCreator } from 'utils';

const QueryFoggingAuditTaskDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const tabNavMenu = ['Fogging Info', 'Audit Results', 'Enforcement Recommendation', 'Assignment History'];
  const [activeTabNav, toggleTabNav] = useState('0');
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getDetailAction = async (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    await actionTryCatchCreator(viewFoggingAuditTaskDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING_AUDIT_TASK_DETAIL.name}`;
    if (state?.scheduleId) {
      getDetailAction({ scheduleId: state?.scheduleId });
    } else if (state?.auditTaskId) {
      getDetailAction({ auditTaskId: state?.auditTaskId });
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
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING, WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING_AUDIT_TASK_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title={`Inspection ID: ${state?.inspectionId}`} />
          <nav className="tab__main">
            <div className="tabsContainer">
              <div>
                <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                <TabContent activeTab={activeTabNav}>
                  <TabPane tabId="0">
                    <FoggingInfo foggingInfo={detail?.foggingInfo} companyName={detail?.companyName} />
                  </TabPane>
                  <TabPane tabId="1">
                    <AuditResults auditResult={detail?.auditResult} />
                  </TabPane>
                  <TabPane tabId="2">
                    <Enforcement enforcements={detail?.teamLeaderEnforcements || detail?.enforcements} mode="view" />
                  </TabPane>
                  <TabPane tabId="3">
                    <Assignment assignments={detail?.assignments} />
                  </TabPane>
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

const mapStateToProps = ({ global }) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(QueryFoggingAuditTaskDetail);
