import React from 'react';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const BaseTypeContractorFindings = (props) => {
  const { contractorsFindings } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Contractor's Findings</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Active Burrows</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.numberOfBorrows || contractorsFindings?.noOfBurrows || contractorsFindings.noOfActiveBurrows}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Defects</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.numberOfDefects || contractorsFindings?.noOfDefects}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Habitat</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.habitat}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Probable Cause</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.probableCause}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.remarks}</div>
          </div>
          {contractorsFindings?.actionTaken && (
            <div className="row mb-2">
              <div className="col-md-3 col-lg-3 font-weight-bold">Action Taken</div>
              <div className="col-md-9 col-lg-4">{contractorsFindings?.actionTaken}</div>
            </div>
          )}

          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Photos</div>
            <div className="col-12">
              {contractorsFindings?.photos && contractorsFindings?.photos.length > 0 && <BinaryFileGallery fileIdList={contractorsFindings?.photos?.map((photo) => photo.fileId)} />}
              {contractorsFindings?.fileList && contractorsFindings?.fileList.length > 0 && <BinaryFileGallery fileIdList={contractorsFindings?.fileList} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTypeContractorFindings;
