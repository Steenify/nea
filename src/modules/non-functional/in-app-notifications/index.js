import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import GoBackButton from 'components/ui/go-back-button';

const InappNotification = (props) => {
  const { history, notifications } = props;

  const columns = [
    {
      Header: 'User',
      accessor: 'soeId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Content',
      accessor: 'content',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Date',
      accessor: 'submittedDate',
      minWidth: tableColumnWidth.md,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      return {
        onClick: () =>
          history.push(`${WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_DETAIL.url}`, {
            detail: rowInfo.row._original,
          }),
        className: `cursor-pointer ${!rowInfo.row._original.readFlag ? 'bg-notification-seen' : ''}`,
      };
    }
    return {};
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Inapp Notification" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_LIST]} />
          <GoBackButton onClick={() => history.goBack()} title="In-App Notifications" />
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={notifications} columns={columns} getTrProps={getTrProps} />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  notifications: global.data.notifications,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InappNotification));
