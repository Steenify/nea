import React from 'react';

import './style.scss';

const TrapInfo = ({
  values: {
    ro = '',
    constituency = '',
    grc = '',
    block = '',
    street = '',
    trapCode = '',
    level = '',
    unit = '',
    postalCode = '',
  },
}) => {
  return (
    <>
      <div className="tab-pane__group bg-white">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label">RO</div>
                  <div className="trapinfo__value">{ro}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Division</div>
                  <div className="trapinfo__value">{constituency}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">GRC</div>
                  <div className="trapinfo__value">{grc}</div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Block</div>
                  <div className="trapinfo__value">{block}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Road</div>
                  <div className="trapinfo__value">{street}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Level</div>
                  <div className="trapinfo__value">{level}</div>
                </div>
                <div className="trapinfo__row">
                  <div className="trapinfo__label">Unit</div>
                  <div className="trapinfo__value">{unit}</div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default TrapInfo;
