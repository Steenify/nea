import React from 'react';

const FeedbackTypeOverview = (props) => {
  const { taskOverview } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Inspected Area</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Nature of Complaint</div>
                <div className="col-6">{taskOverview?.natureOfComplaint}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Complainant’s Name</div>
                <div className="col-6">{taskOverview?.complainantName}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Officer Attending to Feedback</div>
                <div className="col-6">{taskOverview?.attendingOfficer}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Reporting NEA Officer</div>
                <div className="col-6">{taskOverview?.reportingOfficer}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Date/Time of Investigation</div>
                <div className="col-6">{taskOverview?.investigationDate}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Address of Complaint</div>
                <div className="col-6">{taskOverview?.addressOfComplaint}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Division</div>
                <div className="col-6">{taskOverview?.constituency}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Postal Code</div>
                <div className="col-6">{taskOverview?.postalCode}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">NEA Job ID No.</div>
                <div className="col-6">{taskOverview?.neaJobID}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Date Feedback Report was Received by Officer</div>
                <div className="col-6">{taskOverview?.dateReportRecieved}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTypeOverview;
