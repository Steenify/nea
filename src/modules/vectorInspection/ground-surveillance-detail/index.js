import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import { connect } from 'react-redux';
import DataTable from 'components/common/data-table';
import { WEB_ROUTES } from 'constants/index';
import { getGroundSurveillanceDetailAction } from './action';

class GroundSurveillanceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rccId: '',
    };
  }

  componentDidMount() {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS.name}`;
    const {
      getGroundSurveillanceDetailAction,
      location: { search },
    } = this.props;
    const { rccId } = queryString.parse(search);
    if (rccId) {
      getGroundSurveillanceDetailAction({ rccId });
      this.setState({
        rccId,
      });
    }
  }

  getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      const {
        _original: { targetFlag },
      } = rowInfo.row;
      if (targetFlag !== null && targetFlag !== undefined) {
        if (targetFlag) return { className: 'bg-success' };
        return { className: 'bg-danger' };
      }
    }
    return {};
  };

  handleBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { rccId } = this.state;
    const {
      ui: { isLoading },
      data: { clusters },
    } = this.props;

    const columns = [
      {
        Header: 'Date of Inspection',
        // Cell: (cellInfo) => `${cellInfo.row._original.startDateOfInspection} to ${cellInfo.row._original.endDateOfInspection}`,
        accessor: 'endDateOfInspection',
      },
      {
        Header: 'Actual no. of Burrows Detected',
        accessor: 'actualNoOfBurrows',
      },
      {
        Header: 'Target no. of burrows',
        accessor: 'targetNoOfBurrows',
      },
    ];
    return (
      <>
        <Header />
        <div className="main-content workspace__main">
          <NavBar active={WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS.name} />
          <div className="contentWrapper">
            <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS]} />
            <div className="paddingBottom50">
              <div className="go-back">
                <span onClick={this.handleBack}>RCCID: {rccId}</span>
              </div>
              <div className="tabsContainer">
                <DataTable data={clusters} columns={columns} getTrProps={this.getTrProps} />
              </div>
            </div>
            <InPageLoading isLoading={isLoading} />
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ vectorInspectionReducers: { groundSurveillanceDetail } }, ownProps) => ({
  ...ownProps,
  ...groundSurveillanceDetail,
});

const mapDispatchToProps = {
  getGroundSurveillanceDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroundSurveillanceDetail));
