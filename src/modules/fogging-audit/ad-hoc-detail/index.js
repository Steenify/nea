import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';

import TabNav from 'components/ui/tabnav';
import InPageLoading from 'components/common/inPageLoading';
import { WEB_ROUTES } from 'constants/index';
import GoBackButton from 'components/ui/go-back-button';

import { adHocFoggingAuditSearchAction } from './action';

import UpcomingTab from './upcoming-tab';
import PastTab from './past-tab';

const AdHocDetail = (props) => {
  const {
    adHocFoggingAuditSearchAction,
    history,
    location: { state },
    ui: { isLoading },
    data: { filteredUpcomingList, filteredPastList },
  } = props;

  const companyUen = state?.companyUen || '';

  const tabNavMenu = [`Upcoming Fogging (${filteredUpcomingList.length})`, `Past Fogging (${filteredPastList.length})`];
  const [activeTabNav, toggleTabNav] = useState('0');

  const isUpcoming = activeTabNav === '0';

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.name}`;
    if (companyUen) {
      adHocFoggingAuditSearchAction({ companyUen });
    } else {
      history.goBack();
    }
  }, [companyUen, adHocFoggingAuditSearchAction, history]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL]} />
          {/* <GoBackButton title={`Company UEN: ${companyUen}`}  onClick={history.goBack}/> */}
          <GoBackButton title={`Company Name: ${state?.companyName}`} onClick={history.goBack} />
          <nav className="tab__main">
            <div className="tabsContainer">
              <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
            </div>
          </nav>
          <div className={isUpcoming ? '' : 'd-none'}>
            <UpcomingTab />
          </div>
          <div className={isUpcoming ? 'd-none' : ''}>
            <PastTab />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { adHocFoggingAuditDetail } }, ownProps) => ({
  ...ownProps,
  ...adHocFoggingAuditDetail,
});

const mapDispatchToProps = {
  adHocFoggingAuditSearchAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdHocDetail));
