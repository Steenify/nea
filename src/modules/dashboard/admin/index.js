import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { WEB_ROUTES, FUNCTION_NAMES, tableColumnWidth } from 'constants/index';

import Button from 'components/common/button';
import DataTable from 'components/common/data-table';

// import { ReactComponent as Avatar } from 'assets/svg/user-big.svg';
import { ReactComponent as Bell } from 'assets/svg/bell-big.svg';
import { ReactComponent as Letter } from 'assets/svg/letter.svg';

import {
  getAmountEmailSentAction,
  getAmtOfNotificationSentAction,
  viewApplicationStatusAction,
  // getServiceStatusAction, getPerformanceMetricsAction
} from './action';

// import PerformanceMetrics from './performance-metrics';
import BatchJobStatus from './batch-job-status';
import ServiceStatus from './service-status';
import './style.scss';

const AdminDashboard = (props) => {
  const {
    data: {
      amountEmailSent,
      applicationStatus,
      amountNotificationSent,
      // performanceMetrics, serviceStatuses
    },
    getAmountEmailSentAction,
    viewApplicationStatusAction,
    getAmtOfNotificationSentAction,
    // getPerformanceMetricsAction,
    // getServiceStatusAction,
    functionNameList,
    // history,
  } = props;

  useEffect(() => {
    if (functionNameList.includes(FUNCTION_NAMES.getAmtOfNotificationSent)) {
      getAmtOfNotificationSentAction();
    }
    if (functionNameList.includes(FUNCTION_NAMES.getAmountOfEmailSent)) {
      getAmountEmailSentAction();
    }
    if (functionNameList.includes(FUNCTION_NAMES.viewApplicationStatus)) {
      viewApplicationStatusAction();
      // getServiceStatusAction();
      // getPerformanceMetricsAction();
    }
  }, [functionNameList, getAmtOfNotificationSentAction, getAmountEmailSentAction, viewApplicationStatusAction]);

  return (
    <>
      <div className="dashboard__admin paddingBottom50 tabsContainer">
        <div className="dashboard_status">
          <div className="row">
            {functionNameList.includes(FUNCTION_NAMES.getAmountOfEmailSent) && (
              <div className="col-md-4">
                <div className="dashboard_status__item">
                  <div className="dashboard_status__top">
                    <div className="dashboard_status__icon">
                      <Letter width="50px" height="50px" />
                    </div>
                    <div className="dashboard_status__info">
                      <div className="dashboard_status__title">No. of Emails sent</div>
                      <div className="dashboard_status__number">{amountEmailSent}</div>
                    </div>
                  </div>
                  <div className="dashboard_status__bottom">
                    <Link to={WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL.url}>
                      <Button type="secondary" className="dashboard_status__link">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {functionNameList.includes(FUNCTION_NAMES.getAmtOfNotificationSent) && (
              <div className="col-md-4">
                <div className="dashboard_status__item">
                  <div className="dashboard_status__top">
                    <div className="dashboard_status__icon">
                      <Bell width="50px" height="50px" />
                    </div>
                    <div className="dashboard_status__info">
                      <div className="dashboard_status__title">No of Notification Sent</div>
                      <div className="dashboard_status__number">{amountNotificationSent}</div>
                    </div>
                  </div>
                  <div className="dashboard_status__bottom">
                    <Link to={WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL.url}>
                      <Button type="secondary" className="dashboard_status__link">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="dashboard_table tab-content">
          <div className="row">
            <div className="col">
              <div className="row">
                {functionNameList.includes(FUNCTION_NAMES.viewApplicationStatus) && (
                  <div className="col-lg-12">
                    <div className="tab-pane__group bg-white">
                      <p className="tab-pane__title text-bold">Application Status</p>
                      <div className="card p-0">
                        <div className="card-body">
                          <DataTable
                            data={applicationStatus}
                            tableClassName="header-white"
                            columns={[
                              {
                                Header: 'Service',
                                accessor: 'service',
                                minWidth: tableColumnWidth.xxl,
                              },
                              {
                                Header: 'Status',
                                accessor: 'status',
                                minWidth: tableColumnWidth.md,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {functionNameList.includes(FUNCTION_NAMES.viewBatchJobStatus) && (
                  <div className="col-lg-12">
                    <BatchJobStatus />
                  </div>
                )}
              </div>
            </div>
            <div className="col">{functionNameList.includes(FUNCTION_NAMES.serviceStatus) && <ServiceStatus />}</div>
          </div>
        </div>
      </div>
      {/* <Footer />
        </div>
      </div> */}
    </>
  );
};

const mapStateToProps = ({ global, dashboardReducers: { adminDashboard } }, ownProps) => ({
  ...ownProps,
  ...adminDashboard,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getAmountEmailSentAction,
  viewApplicationStatusAction,
  getAmtOfNotificationSentAction,
  // getServiceStatusAction,
  // getPerformanceMetricsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminDashboard));
