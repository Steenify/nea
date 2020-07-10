import React from 'react';
import ValidationField from 'components/common/formik/validationField';
import Accordion from 'components/common/accordion';
import * as Formik from 'formik';

const CaseResidentialAddress = (props) => {
  const {
    index,
    residentialCDCLOV,
    premiseTypeLOV,
    onRemove,
    onRetrieveAddress,
    onEnableIsPrimary,
    onPostalCodeChange,
    formik: { values },
  } = props;

  const fieldName = `resInfoList[${index}]`;
  const postalCodeFieldName = `${fieldName}.postalCode`;
  const postalCodeValue = Formik.getIn(values, postalCodeFieldName) || '';
  return (
    <Accordion
      isOpen
      headerChildren={
        <div className="d-flex align-items-center flex-grow-1">
          <h3 className="font-weight-bold">Address {index + 1} </h3>
          <button type="button" className="btn btn-sec ml-auto mr-5" onClick={onRemove}>
            Remove
          </button>
        </div>
      }>
      <div className="row section">
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Residential CDC</div>
            <div className="col-9">
              <ValidationField
                name={`${fieldName}.districtCode`}
                inputComponent="react-select"
                placeholder="Please select"
                options={residentialCDCLOV}
                hideError
                onChange={() => {
                  if (postalCodeValue) {
                    onPostalCodeChange(postalCodeValue, fieldName);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Premises Type</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.premiseCode`} inputComponent="react-select" placeholder="Please select" options={premiseTypeLOV} hideError />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center">Postal Code</div>
            <div className="col-9">
              <div className="row paddingLeft15 paddingRight15">
                <div>
                  <ValidationField
                    name={`${fieldName}.postalCode`}
                    inputClassName="textfield"
                    onChange={(postalCode) => {
                      onPostalCodeChange(postalCode, fieldName);
                    }}
                  />
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
            <div className="col-3 d-flex align-items-center">Premises No.</div>
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
        <div className="col-12">
          <ValidationField
            inputComponent="checkbox"
            inputClassName="wf-200"
            name={`${fieldName}.isPrimary`}
            label="Set as primary address"
            onChange={(checked) => {
              if (checked && onEnableIsPrimary) {
                onEnableIsPrimary('resInfoList', index);
              }
            }}
          />
        </div>
      </div>
    </Accordion>
  );
};

export default Formik.connect(CaseResidentialAddress);
