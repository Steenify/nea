import React from 'react';
import ValidationField from 'components/common/formik/validationField';

const CasePersonalInformation = (props) => {
  const { countryLOV, ethnicLOV, occupationLOV, genderLOV } = props;

  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Name</div>
              <div className="col-9">
                <ValidationField name="name" inputClassName="textfield" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Ethnic</div>
              <div className="col-9">
                <ValidationField name="ethnicCode" inputComponent="react-select" placeholder="Please select" options={ethnicLOV} hideError />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Country of Origin</div>
              <div className="col-9">
                <ValidationField name="countryCode" inputComponent="react-select" placeholder="Please select" options={countryLOV} hideError />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Occupation</div>
              <div className="col-9">
                <ValidationField name="occupationCode" inputComponent="react-select" selectClassName="mb-2" placeholder="Please select" options={occupationLOV} hideError />
                <ValidationField name="occupationOther" inputClassName="textfield" placeholder="If Others, please specify" />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Gender</div>
              <div className="col-9">
                <ValidationField name="sex" inputComponent="react-select" placeholder="Please select" options={genderLOV} hideError />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">ID No.</div>
              <div className="col-9">
                <ValidationField name="idNo" inputClassName="textfield" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Age</div>
              <div className="col-9">
                <ValidationField name="age" inputClassName="textfield" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Home Phone No.</div>
              <div className="col-9">
                <ValidationField name="homeNo" inputClassName="textfield" type="tel" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">HP No.</div>
              <div className="col-9">
                <ValidationField name="mobileNo" inputClassName="textfield" type="tel" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePersonalInformation;
