import React from 'react';

// import './style.scss';

const InfoTab = (props) => {
  const { detail, showSOFButton, onClickSOF } = props;
  if (!detail) {
    return <div />;
  }
  const {
    premisesAddress,
    // inspectionStatus,
    regionOfficeCode,
    collectorName,
    collectorDesignation,
    collectedDateTime,
    surveyPurpose,
  } = detail;

  return (
    <div className="inspection_form_info">
      {/* <p className="tab-pane__title text-bold">FORM 3 ID: </p> */}
      <div className="tab-pane__group bg-white">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="label-group mb-4">
                  <label className="small-grey-text mb-0">RO</label>
                  <p className="col-form-label font-weight-bold">{regionOfficeCode}</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="label-group mb-4">
                  <label className="small-grey-text mb-0">Date and Time Collected</label>
                  <p className="col-form-label font-weight-bold">{collectedDateTime}</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="label-group mb-4">
                  <label className="small-grey-text mb-0">Collector's Name (Designation)</label>
                  <p className="col-form-label font-weight-bold">
                    {collectorName} ({collectorDesignation})
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="label-group mb-0">
                  <label className="small-grey-text mb-0">Survey Purpose</label>
                  <p className="col-form-label font-weight-bold">{surveyPurpose}</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="label-group mb-0">
                  <label className="small-grey-text mb-0">Address of Premises</label>
                  <p className="col-form-label font-weight-bold">{premisesAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSOFButton && (
        <button type="button" className="btn btn-pri" onClick={() => onClickSOF && onClickSOF()}>
          Statement of Officer
        </button>
      )}
    </div>
  );
};

export default InfoTab;
