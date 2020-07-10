import React from 'react';
import { connect } from 'react-redux';

const Overview = (props) => {
  const { data } = props;

  return (
    <>
      <div className="tabsContainer">
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6">
                <b>
                  <p>Nature of Complaint</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.natureOfComplaint}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Complainant’s Name</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.complainantName}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Officer Attending to Feedback</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.attendingOfficer}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Reporting NEA Officer</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.reportingOfficer}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Date/Time of Investigation</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.investigationDate}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Address of Complaint</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.addressOfComplaint}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Constituency</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.constituency}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Postal Code</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.postalCode}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>NEA Job ID No.</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.neaJobID}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Date Feedback Report was Received by Officer</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.dateReportRecieved}</p>
              </div>
            </div>
          </div>
          <div className="col-6" />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({ ...ownProps, global });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
