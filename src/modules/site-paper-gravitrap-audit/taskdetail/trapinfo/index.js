import React from 'react';

import './style.scss';
import * as Formik from 'formik';
const TrapInfo = ({
  formik: {
    values: {
      blockNo = '',
      roadName = '',
      trapCode = '',
      levelNo = '',
      unitNo = '',
      postalCode = '',
      divCode = '',
      roCode = '',
      grcCode = '',
      auditdate = '',
      eweek: { week = '' },
      lastLiningreplacement = '',
    },
  },
  header = '',
}) => {
  return (
    <>
      <div className="tab-pane__group bg-white">
        {header && <p className="tab-pane__title text-white">{header}</p>}
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">RO</div>
                  <div className="trapinfo__value">{roCode}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Division</div>
                  <div className="trapinfo__value">{divCode}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">GRC</div>
                  <div className="trapinfo__value">{grcCode}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Scheduled Maintenance Day</div>
                  <div className="trapinfo__value">{auditdate}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Week</div>
                  <div className="trapinfo__value">{week}</div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Block</div>
                  <div className="trapinfo__value">{blockNo}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Road</div>
                  <div className="trapinfo__value">{roadName}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Level</div>
                  <div className="trapinfo__value">{levelNo}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Unit</div>
                  <div className="trapinfo__value">{unitNo}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Trap Code</div>
                  <div className="trapinfo__value">{trapCode}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Postal Code</div>
                  <div className="trapinfo__value">{postalCode}</div>
                </div>
              </div>
            </div>
            {header && (
              <div className="row">
                <div className="col-12">
                  <div className="trapinfo__row">
                    <div className="trapinfo__label1">Last Lining Replacement as at</div>
                    <div className="trapinfo__value">{lastLiningreplacement}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Formik.connect(TrapInfo);
