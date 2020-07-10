import React from 'react';
import ValidationField from 'components/common/formik/validationField';
import Accordion from 'components/common/accordion';
import { ordinal_suffix_of } from 'utils';

const ClinicInformation = (props) => {
  const { index, onRemove, onRetrieveAddress } = props;

  const fieldName = `clinicInfoList[${index}]`;
  return (
    <Accordion
      isOpen
      headerChildren={
        <div className="d-flex align-items-center flex-grow-1">
          <h3 className="font-weight-bold">{`${ordinal_suffix_of(index + 1)} Visit to GP/Polyclinic/Hospital`}</h3>
          <button type="button" className="btn btn-sec ml-auto mr-5" onClick={onRemove}>
            Remove
          </button>
        </div>
      }>
      <div className="row section">
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Date of Visit</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.visitDate`} placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" hideError />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">GP/ Clinic/ Hospital</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.clinicName`} inputClassName="textfield" hideError />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Postal Code</div>
            <div className="col-9">
              <div className="row paddingLeft15 paddingRight15">
                <div>
                  <ValidationField name={`${fieldName}.postalCode`} inputClassName="textfield" />
                </div>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-sec small ml-3" onClick={() => onRetrieveAddress(fieldName)}>
                    Retrieve Address
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Road Name</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.roadName`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Building Name</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.buildingName`} inputClassName="textfield" />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Premise No.</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.premiseNo`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Level</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.levelNo`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Unit No.</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.unitNo`} inputClassName="textfield" />
            </div>
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default ClinicInformation;
