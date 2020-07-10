import React from 'react';

const FoggingInfo = (props) => {
  const { foggingInfo, companyName } = props;

  return (
    <div className="tab-pane__group bg-white">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="row paddingBottom10">
                <div className="col-6">Company Name</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.companyName || companyName}</div>
              </div>

              <div className="row paddingBottom10">
                <div className="col-6">UEN</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.companyUen}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Fogging Date</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.foggingDate}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Fogging Period</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.foggingPeriod}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Block/House</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.blockHouseNo}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Floor/Unit No.</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.floorUnitNo}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Street Name</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.streetName}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Building Name</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.buildingName}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Postal Code</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.postalCode}</div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="row paddingBottom10">
                <div className="col-6">Premises Type</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.premisesType}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Products</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.product}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Dosage Used (ml/L)</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.dosageUsed}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Mode of Application</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.applicationMode}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Purpose of Fogging</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.foggingPurpose}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Source Reduction</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.sourceReduction}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Notification</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.notification}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Contact Person</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.contactPerson}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-6">Contact Number</div>
                <div className="col-6 font-weight-bold">{foggingInfo?.contactNo}</div>
              </div>
            </div>
          </div>
          {foggingInfo?.notification === 'No' && (
            <>
              <hr />
              <div className="label-group mb-4">
                <label>Reason for No Notification</label>
                <p className="col-form-label font-weight-bold">{foggingInfo?.reasonForNotNotifying}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoggingInfo;
