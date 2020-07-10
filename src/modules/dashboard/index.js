import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import { FUNCTION_NAMES } from 'constants/index';

import UserDashboard from './user';
import AdminDashboard from './admin';
import './user/style.scss';

const Dashboard = (props) => {
  const { functionNameList } = props;
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Dashboard" />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>Dashboard</h1>
          </div>
          <AdminDashboard />
          {functionNameList.includes(FUNCTION_NAMES.getDashboardDetail) && <UserDashboard />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));
