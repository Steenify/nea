import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DashboardDetail from './dashboard-detail';

// import TotalGravitrap from './total-gravitrap';
// import GravitrapAuditLapses from './gravitrap-audit-lapses';

import './style.scss';

const UserDashboard = (props) => {
  const { functionNameList } = props;
  return (
    <>
      {/* <Header />
      <div className="main-content workspace__main">
        <NavBar active="Dashboard" />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>Dashboard</h1>
          </div> */}
      <div className="card">
        <div className="row equal">
          {functionNameList.includes('getDashboardDetail') && <DashboardDetail />}
          {/* <div className="col-lg-6 mb-4">
            <div className="dCont">
              <div className="secHeader">
                <div className="row">
                  <div className="col-md-12">Burrow Count</div>
                </div>
              </div>
              <div className="dCardDetails">
                <div className="row paddingBottom15">
                  <div className="col-md-3 paddingTop5">RO</div>
                  <div className="col-md-8">
                    <select className="form-control" placeholder="Please select">
                      <option>Option</option>
                      <option>Option</option>
                      <option>Option</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TotalGravitrap />
          <GravitrapAuditLapses /> */}
        </div>
      </div>
      {/* <Footer />
        </div>
      </div> */}
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDashboard));
