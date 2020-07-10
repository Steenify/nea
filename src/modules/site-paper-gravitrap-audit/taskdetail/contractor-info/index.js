import React from 'react';

import './style.scss';
import * as Formik from 'formik';

const index = ({
  formik: {
    values: {
      contractorLastMaintDt = '',
      // contractorLastMainTime = '',
      sampleCount = '',
      lastLiningreplacement = '',
      trapStatus = '',
      reason = '',
      contractorRemarks = '',
      contractorReason = '',
      eweek: { week = '' },
    },
  },
}) => {
  return (
    <>
      <div className="tab-pane__group bg-white ">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="specimen__number">
                  <div className="label">Last Maintenance as at</div>
                  <div className="value">{contractorLastMaintDt}</div>
                </div>
                <div className="specimen__number">
                  <div className="label">Number of Samples Collected Based on contractor’s weekly submission</div>
                  <div className="value">{sampleCount}</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="specimen__remark">
                  <div className="label">Trap Status</div>
                  <div className="value">{trapStatus}</div>
                </div>
                <div className="specimen__remark">
                  <div className="label">Eweek</div>
                  <div className="value">{week}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="specimen__remark">
                  <div className="label">Reason</div>
                  <div className="value">{contractorReason}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="specimen__remark">
                  <div className="label">Remarks</div>
                  <div className="value">{contractorRemarks}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="specimen__number">
                  <div className="label">Last Lining Replacement as at</div>
                  <div className="value">{lastLiningreplacement}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Formik.connect(index);
