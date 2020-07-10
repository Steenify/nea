import React from 'react';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const Audit = (props) => {
  const { audit } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Audit</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Auditor Name</div>
                <div className="col-6">{audit?.auditor}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Date of NEA Audit</div>
                <div className="col-6">{audit?.neaAuditDate}</div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Period of NEA Audit</div>
                <div className="col-6">{audit?.neaAuditTime}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">High Risk Area?</div>
                <div className="col-6">{`${audit?.highRisk}`}</div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Type of High Risk Area</div>
                <div className="col-6">{audit?.typeOfHighRiskArea}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Number of Burrows Observed</div>
                <div className="col-6">
                  {
                    // audit?.noOfBurrowsContractor ||
                    audit?.noOfBurrows
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 col-md-12 font-weight-bold">Remarks</div>
            <div className="col-9 col-md-12">{audit?.remarks}</div>
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

export default Audit;
