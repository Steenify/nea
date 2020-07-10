import React from 'react';

const SampleInfo = (props) => {
  const { sample } = props;
  const {
    // sampleId,
    collectedDateTime,
    receivedDateTime,
    receivedBy,
    sentDateTime,
    firstExaminedDateTime,
    identifiedBy,
    densityInContainer,
    densityPerDip,
  } = sample;

  return (
    <div className="row section">
      {/* <div className="col-xl-3 col-4 mb-2">
        <p className="small-grey-text mb-0">Sample ID:</p>
        <p className="mb-0">{sampleId}</p>
      </div> */}
      <div className="col-12">
        {/* <div className="col-xl-9 col-8"> */}
        <div className="row">
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">Date and Time Collected</p>
            <p className="font-weight-bold mb-0">{collectedDateTime}</p>
          </div>
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">Received as at</p>
            <p className="font-weight-bold mb-0">{receivedDateTime}</p>
          </div>
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">Received by</p>
            <p className="font-weight-bold mb-0">{receivedBy}</p>
          </div>
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">Sent as at</p>
            <p className="font-weight-bold mb-0">{sentDateTime}</p>
          </div>
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">First examined at</p>
            <p className="font-weight-bold mb-0">{firstExaminedDateTime}</p>
          </div>
          <div className="col-12 col-md-4 details-info marginBottom30">
            <p className="small-grey-text mb-0">Identified by</p>
            <p className="font-weight-bold mb-0">{identifiedBy}</p>
          </div>
          <div className="col-12 col-md-4 details-info">
            <p className="small-grey-text mb-0">Density</p>
            <p className="font-weight-bold mb-0">
              {densityInContainer}
              {densityPerDip && densityInContainer && ', '}
              {densityPerDip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleInfo;
