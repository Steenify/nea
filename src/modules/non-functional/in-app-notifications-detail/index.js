import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { WEB_ROUTES } from 'constants/index';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';

import { viewInAppNotificationAction, updateInAppNotificationAction, downloadInAppNotificationAction } from 'store/actions';
import InPageLoading from 'components/common/inPageLoading';
import GoBackButton from 'components/ui/go-back-button';

const InappNotificationDetail = (props) => {
  const {
    location: { state },
    history,
    viewInAppNotificationAction,
    updateInAppNotificationAction,
    downloadInAppNotificationAction,
    notificationDetail,
    isLoading,
  } = props;

  useEffect(() => {
    if (state?.detail) {
      updateInAppNotificationAction({ id: state?.detail?.id });
      viewInAppNotificationAction({ id: state?.detail?.id });
    }
  }, [updateInAppNotificationAction, viewInAppNotificationAction, history, state]);

  if (!state?.detail) {
    history.replace(WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_LIST.url);
    return null;
  }
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Inapp Notification" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_LIST, WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title="In-App Notifications Detail" />
          <div className="paddingBottom50 tabsContainer mt-5">
            <div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                      <div className="font-weight-bold">User</div>
                    </div>
                    <div className="col col-lg-5">{notificationDetail?.soeId}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">Content</div>
                    </div>
                    <div className="col col-lg-5">{notificationDetail?.content}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">Date</div>
                    </div>
                    <div className="col col-lg-5">{notificationDetail?.submittedDate}</div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                {notificationDetail?.fileName ? (
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">File Name</div>
                    </div>
                    <div className="col col-lg-5">
                      {notificationDetail?.fileName}
                      <br />
                      <button type="submit" className="btn btn-pri m-2" onClick={() => downloadInAppNotificationAction({ id: notificationDetail?.id })}>
                        Download
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  notificationDetail: global.data.notificationDetail,
  isLoading: global.ui.loading,
});

const mapDispatchToProps = {
  viewInAppNotificationAction,
  updateInAppNotificationAction,
  downloadInAppNotificationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InappNotificationDetail));
