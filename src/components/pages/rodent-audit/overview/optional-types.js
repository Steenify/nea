import React from 'react';

const OptionalTypeOverview = (props) => {
  const { taskOverview } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Inspected Area</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              {(taskOverview?.location || taskOverview?.address) && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Location</div>
                  <div className="col-6">{taskOverview?.location || taskOverview?.address}</div>
                </div>
              )}

              {taskOverview?.division && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Division</div>
                  <div className="col-6">{taskOverview?.division}</div>
                </div>
              )}

              {taskOverview?.townCouncil && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Town Council</div>
                  <div className="col-6">{taskOverview.townCouncil}</div>
                </div>
              )}

              {taskOverview?.postalCode && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Postal Code</div>
                  <div className="col-6">{taskOverview.postalCode}</div>
                </div>
              )}

              {taskOverview?.binChuteNo && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Bin Chute No.</div>
                  <div className="col-6">{taskOverview.binChuteNo}</div>
                </div>
              )}

              {taskOverview?.noOfBinChuteWFindings && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">No. of Bin Chutes in this block with findings</div>
                  <div className="col-6">{taskOverview.noOfBinChuteWFindings}</div>
                </div>
              )}

              {taskOverview?.latitude && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Latitude</div>
                  <div className="col-6">{taskOverview?.latitude}</div>
                </div>
              )}

              {taskOverview?.longitude && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Longtitude</div>
                  <div className="col-6">{taskOverview?.longitude}</div>
                </div>
              )}

              {(taskOverview?.dateOfFinding || taskOverview?.dateOfFindings) && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Date of Findings</div>
                  <div className="col-6">{taskOverview?.dateOfFinding || taskOverview?.dateOfFindings}</div>
                </div>
              )}

              {taskOverview?.timeOfFinding && (
                <div className="row paddingBottom10">
                  <div className="col-6 font-weight-bold">Time of Findings</div>
                  <div className="col-6">{taskOverview?.timeOfFinding}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionalTypeOverview;
