import React from 'react';
import { connect } from 'react-redux';
import { ErrorMessage } from 'formik';
import { withRouter } from 'react-router-dom';

import ValidationField from 'components/common/formik/validationField';
import PremisesAddressBlock from 'components/pages/premises-address-block';
import { WEB_ROUTES, MASTER_CODE } from 'constants/index';
import { Form3Mode } from '../helper';
// import { openNewTab } from 'utils';

const Form3InfoTab = (props) => {
  const { detail, mode, masterCodes, history } = props;

  const inspectionIds = detail?.inspectionIds || [];
  const { isStandardFormat } = detail;
  const isCreateMode = mode === Form3Mode.create;

  return (
    <div className="mainBox">
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="row mb-3">
              <div className="col-md-5 col-lg-3 d-flex align-items-center">
                <div className="font-weight-bold">Name of owner/occupier</div>
              </div>
              <div className="col col-lg-5">{isCreateMode ? <ValidationField name="ownerName" inputClassName="textfield " /> : <div className="">{detail?.ownerName}</div>}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5 col-lg-3 d-flex align-items-center">
                <div className="font-weight-bold">NRIC/FIN/UEN No.</div>
              </div>
              <div className="col col-lg-5">{isCreateMode ? <ValidationField name="ownerId" inputClassName="textfield " /> : <div className="">{detail?.ownerId}</div>}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5 col-lg-3 d-flex align-items-center">
                <div className="font-weight-bold">Address of owner/occupier</div>
              </div>
              <div className="col col-lg-5">{isCreateMode ? <ValidationField name="ownerFullAddress" inputClassName="textfield " /> : <div className="">{detail?.ownerFullAddress}</div>}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5 col-lg-3 d-flex align-items-center">
                <div className="font-weight-bold">RO</div>
              </div>
              <div className="col col-lg-5">
                {isCreateMode ? (
                  <ValidationField name="regionOfficeCode" inputComponent="react-select" placeholder="RO" options={masterCodes[MASTER_CODE.RO_CODE]} />
                ) : (
                  <div className="">{detail?.regionOfficeCode}</div>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5 col-lg-3">
                <div className="font-weight-bold">Address of Premises</div>
              </div>
              <div className="col col-lg-5">
                <div className="">
                  <span className="custom-radio paddingBottom5 mr-2">
                    <ValidationField type="radio" id="StandardMode" name="isStandardFormat" value hideError disabled={!isCreateMode} />
                    <label className="form-label" htmlFor="StandardMode">
                      Standard Address
                    </label>
                  </span>
                  <span className="custom-radio paddingBottom5">
                    <ValidationField type="radio" id="FreeText" name="isStandardFormat" value={false} hideError disabled={!isCreateMode} />
                    <label className="form-label" htmlFor="FreeText">
                      Non-standard Address
                    </label>
                  </span>
                </div>
                {!isStandardFormat && (
                  <div>
                    <br />
                    {isCreateMode ? <ValidationField inputComponent="textarea" name="premiseFullAddress" rows={5} /> : <div className="">{detail?.premiseFullAddress}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <br />
        {isStandardFormat && <PremisesAddressBlock viewOnly={!isCreateMode} labelColWidth={4} hidePremise showBlock />}
        <hr />
        <div>
          {inspectionIds.map((id, sIndex) => (
            <div key={`inspection_id_${id}_${sIndex + 1}`}>
              <span className="font-weight-bold">Inspection ID: {id}</span>
              <button
                type="button"
                className="btn btn-sec m-2"
                onClick={() => {
                  history.push(`${WEB_ROUTES.DETAILS.url}/sof`, { id });
                }}>
                Statement of Officer
              </button>
            </div>
          ))}
        </div>
        {isCreateMode && (
          <div>
            <label className="marginBottom10 mt-4 font-weight-bold">
              {detail?.contingencySwitch !== 'NO_CONTIGENCY' && 'Recommend for Enforcement'}
              <ErrorMessage className="col-form-error-label m-1" name="routeTo" component="span" />
            </label>
            {detail?.contingencySwitch !== 'NO_CONTIGENCY' && (
              <>
                <div className="custom-radio paddingBottom5">
                  <ValidationField type="radio" id="IEU" name="routeTo" value="IEU" hideError />
                  <label className="form-label" htmlFor="IEU">
                    Route to IEU
                  </label>
                </div>
                {detail?.contingencySwitch === 'YES' && (
                  <div className="custom-radio paddingBottom5">
                    <ValidationField type="radio" id="TL" name="routeTo" value="TL" hideError />
                    <label className="form-label" htmlFor="TL">
                      Route to TL
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ global }) => ({
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form3InfoTab));
