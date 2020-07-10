import React from 'react';

const SubmissionInfo = (props) => {
  const { submissionInfo } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Submission Info</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Report file name</div>
            <div className="col-md-9 col-lg-4">{submissionInfo?.fileName}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Expected date</div>
            <div className="col-md-9 col-lg-4">{submissionInfo?.expectedDate}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Actual date</div>
            <div className="col-md-9 col-lg-4">{submissionInfo?.actualDate}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of days of delay</div>
            <div className="col-md-9 col-lg-4">{submissionInfo?.noOfDaysDelay}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionInfo;
