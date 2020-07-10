import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import TabNav from 'components/ui/tabnav';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { getFeedbackReportDetailService } from 'services/rodent-audit';

import { WEB_ROUTES } from 'constants/index';

import { actionTryCatchCreator } from 'utils';

import Overview from './overview';
import ContractorFindings from './contractor-findings';
import Audit from './audit';

const previousTab = '0';

const FeedbackReportDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const [tabNavMenu, setTabNavMenu] = useState([]);
  const [activeTabNav, toggleTabNav] = useState(previousTab);
  const [isLoading, setIsLoading] = useState(false);

  const getListingAction = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (res) => {
      setIsLoading(false);

      setTabNavMenu([
        {
          title: 'Overview',
          component: <Overview data={res.reportDetails} />,
        },
        {
          title: "Contractor's Findings",
          component: <ContractorFindings data={res.reportFindings} />,
        },
        {
          title: 'Audit',
          component: <Audit data={res.reportAudits} />,
        },
      ]);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(getFeedbackReportDetailService({ reportId: state?.reportId }), onPending, onSuccess, onError);
  }, [state]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT_DETAIL.name}`;
    if (state?.reportId) {
      getListingAction();
    } else {
      history.goBack();
    }
  }, [getListingAction, history, state]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT, WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT_DETAIL]} />

          <div className="go-back d-flex align-items-center">
            {/* <span onClick={() => history.goBack()}>{detail ? `${detail?.surveyDate} - ${detail?.ro} - ${detail?.division} ${detail?.grc}` : 'Go Back'}</span> */}
            <span onClick={() => history.goBack()}>{`${state.companyName}`}</span>
            {/* {detail && (
              <button type="button" className="btn btn-sec m-1 ml-auto" onClick={() => {}}>
                Download
              </button>
            )} */}
          </div>
          <nav className="tab__main">
            <div className="tabsContainer">
              <TabNav
                onToggleTab={(tab) => {
                  toggleTabNav(tab);
                  // previousTab = tab;
                }}
                activeTab={activeTabNav}
                menu={tabNavMenu.map((item) => item.title)}
              />
            </div>
          </nav>
          {tabNavMenu.map((menu, index) => (
            <div className={Number(activeTabNav) === index ? '' : 'd-none'} key={`${index + 1}`}>
              {menu.component}
            </div>
          ))}

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default withRouter(FeedbackReportDetail);
