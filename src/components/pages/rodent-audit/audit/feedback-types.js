import React from 'react';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const FeedbackTypeAudit = (props) => {
  const { audit } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Audit</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Date of Audit</div>
                <div className="col-6">{audit?.auditDate}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Name of Auditing Officer</div>
                <div className="col-6">{audit?.auditorName}</div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Number of Discrepancies</div>
                <div className="col-6">{audit?.noOfDiscrepancies}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 col-lg-3 font-weight-bold">Photos</div>
            <div className="col-12">
              <BinaryFileGallery fileIdList={audit?.fileList || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTypeAudit;
