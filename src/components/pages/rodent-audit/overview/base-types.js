import React from 'react';

const BaseTypeOverview = (props) => {
  const { taskOverview } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Inspected Area</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Location</div>
                <div className="col-6">{taskOverview?.location || taskOverview?.address}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Division</div>
                <div className="col-6">{taskOverview?.division}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Town Council</div>
                <div className="col-6">{taskOverview?.townCouncil}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Postal Code</div>
                <div className="col-6">{taskOverview?.postalCode}</div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Latitude</div>
                <div className="col-6">{taskOverview?.latitude}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Longtitude</div>
                <div className="col-6">{taskOverview?.longitude}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Date of Findings</div>
                <div className="col-6">{taskOverview?.dateOfFinding || taskOverview?.dateOfFindings}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6 font-weight-bold">Time of Findings</div>
                <div className="col-6">{taskOverview?.timeOfFinding}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTypeOverview;
