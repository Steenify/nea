import React from 'react';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import { WEB_ROUTES } from 'constants/index';
import DropBox from 'components/common/dropbox';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import MonthYearPicker from 'components/common/monthYearPicker';

const title = WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.REJECTED_AD_HOC_AUDIT_TASK_DETAILS.name;

const RejectedAdHocAuditTaskDetails = (props) => {
  const {
    history: { goBack },
    ui: { isLoading },
  } = props;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={title} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.MY_WORKSPACE, WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.REJECTED_AD_HOC_AUDIT_TASK_DETAILS]} />

          <form className="form-group">
            <div className="go-back">
              <span onClick={() => goBack()}>Total Liquidated Damaged Amount for April</span>
              <>
                <button type="submit" className="btn btn-pri float-right" onClick={() => {}}>
                  Submit
                </button>

                <button type="submit" className="btn btn-sec float-right mr-2" onClick={() => {}}>
                  Save as Draft
                </button>
              </>
            </div>

            <div className="tabsContainer">
              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>RO</b>
                </div>
                <div className="col-lg-10">
                  <input />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>Month*</b>
                </div>
                <div className="col-lg-10">
                  <MonthYearPicker />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>Submission deadline*</b>
                </div>
                <div className="col-lg-10">
                  <SingleDatePickerV2 />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>Actual submission date*</b>
                </div>
                <div className="col-lg-10">
                  <SingleDatePickerV2 />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>Number of reports late*</b>
                </div>
                <div className="col-lg-10">
                  <SingleDatePickerV2 />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-2">
                  <b>Supporting Documents</b>
                </div>

                <div className="col-lg-10">
                  <DropBox />
                </div>
              </div>
            </div>
          </form>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (
  {
    global: {
      data: { masterCodes },
    },
    sitePaperGravitrapAuditReducers: { rejectedAdHocAuditTaskDetails },
  },
  ownProps,
) => ({
  ...ownProps,
  ...rejectedAdHocAuditTaskDetails,

  masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RejectedAdHocAuditTaskDetails);
