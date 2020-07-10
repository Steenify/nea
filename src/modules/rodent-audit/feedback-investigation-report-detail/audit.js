import React from 'react';
import { connect } from 'react-redux';

import BinaryFileGallery from 'components/common/binaryImageGallery';

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
                  <p>Date of Audit</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.auditDate}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Name of Auditing Officer</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.auditorName}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Number of Discrepancies</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.noOfDiscrepancies}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Remarks</p>
                </b>
              </div>
              <div className="col-6">
                <p>{data?.remarks}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <b>
                  <p>Photos</p>
                </b>
              </div>
              <div className="col-6">
                {data?.photos && data?.photos.length > 0 && <BinaryFileGallery fileIdList={data?.photos?.map((photo) => photo.fileId)} />}
                {data?.fileList && data?.fileList.length > 0 && <BinaryFileGallery fileIdList={data?.fileList} />}
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
