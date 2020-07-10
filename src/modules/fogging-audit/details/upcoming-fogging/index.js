import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { TabContent, TabPane } from 'reactstrap';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import InPageLoading from 'components/common/inPageLoading';
import { WEB_ROUTES } from 'constants/index';

import FoggingInfo from 'components/pages/fogging-audit/fogging-info';
import { actionTryCatchCreator } from 'utils';
import { adHocUpcomingDetailService } from 'services/fogging-audit';
import GoBackButton from 'components/ui/go-back-button';

const UpcomingFogging = (props) => {
  const {
    history,
    location: { state },
    //
  } = props;

  const tabNavMenu = ['Fogging Info'];
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
    await actionTryCatchCreator(adHocUpcomingDetailService(params), onPending, onSuccess, onError);
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.AD_HOC_UPCOMING_FOGGING_DETAIL.name}`;
    if (state?.scheduleId) {
      getDetailAction({ scheduleId: state?.scheduleId });
    } else if (state?.auditTaskId) {
      getDetailAction({ auditTaskId: state?.auditTaskId });
    } else {
      history.goBack();
    }
  }, [history, state]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.AD_HOC_UPCOMING_FOGGING_DETAIL.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL, WEB_ROUTES.FOGGING_AUDIT.AD_HOC_UPCOMING_FOGGING_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title={`Company Name: ${detail?.companyName}`} />
          <nav className="tab__main">
            <div className="tabsContainer">
              <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
              <TabContent activeTab={activeTabNav}>
                <TabPane tabId="0">
                  <FoggingInfo foggingInfo={detail?.foggingInfo} companyName={detail?.companyName} />
                </TabPane>
              </TabContent>
            </div>
          </nav>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UpcomingFogging));
