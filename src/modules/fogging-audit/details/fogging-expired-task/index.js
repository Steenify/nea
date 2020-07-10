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

import FoggingInfo from 'components/pages/fogging-audit/fogging-info';
import Assignment from 'components/pages/fogging-audit/assignment';

import { getFoggingExpiredTaskDetailService } from 'services/fogging-audit';
import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

const ExpiredTaskDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const tabNavMenu = ['Fogging Info', 'Assignment History'];
  const [activeTabNav, toggleTabNav] = useState('0');
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getDetailAction = async (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data);
      setIsLoading(false);
    };
    const onError = (error) => setIsLoading(false);
    await actionTryCatchCreator(getFoggingExpiredTaskDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL.name}`;
    if (state?.auditTaskId) {
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
          <NewBreadCrumb page={[WEB_ROUTES.MY_WORKSPACE, WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title={`Company Name: ${state?.companyName}`} />

          <nav className="tab__main">
            <div className="tabsContainer">
              <div>
                <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                <TabContent activeTab={activeTabNav}>
                  <TabPane tabId="0">
                    <FoggingInfo foggingInfo={detail?.foggingInfo} companyName={detail?.companyName} />
                  </TabPane>
                  <TabPane tabId="1">
                    <Assignment assignments={detail?.assignments} auditTaskId={state?.auditTaskId} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredTaskDetail);
