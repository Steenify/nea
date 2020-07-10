import React from 'react';

import ValidationField from 'components/common/formik/validationField';
import Accordion from 'components/common/accordion';
import AddButton from 'components/common/add-button';
import * as Formik from 'formik';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import uuid from 'uuid/v4';
import { initialOfficeTransportInfoValue, initialOfficeWorkInfoValue } from '../../helper';

import './style.scss';
import TransportInformation from './transport-information';

const DayLOV = ['0.5', '1', '2', '3', '4', '5', '6', '7'].map((day) => ({
  label: day,
  value: day,
}));
const HourLOV = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((hour) => ({
  label: hour,
  value: `${Number(hour) || '1'}`,
}));
const MinuteLOV = ['00', '15', '30', '45'].map((min) => ({
  label: min,
  value: min,
}));
const PeriodLOV = ['AM', 'PM'].map((period) => ({
  label: period,
  value: period,
}));

const CaseOfficeInformation = (props) => {
  const {
    index,
    residentialCDCLOV,
    premiseTypeLOV,
    transportModeLOV,
    // divisionLOV,
    busStopLOV,
    mrtStopLOV,
    onRemove,
    onRetrieveAddress,
    onEnableIsPrimary,
    onPostalCodeChange,
    formik: { values, setFieldValue },
  } = props;

  const fieldName = `offInfoList[${index}]`;
  const officeWorkInfoListFieldName = `${fieldName}.officeWorkInfoList`;
  const officeTransportInfoListFieldName = `${fieldName}.officeTransportInfoList`;
  const postalCodeFieldName = `${fieldName}.postalCode`;
  const officeWorkInfoList = Formik.getIn(values, officeWorkInfoListFieldName) || [];
  const postalCodeValue = Formik.getIn(values, postalCodeFieldName) || '';
  const officeTransportInfoList = Formik.getIn(values, officeTransportInfoListFieldName) || [];

  const addOfficeWorkInfo = () => {
    setFieldValue(officeWorkInfoListFieldName, [...officeWorkInfoList, { ...initialOfficeWorkInfoValue, id: uuid() }], false);
  };

  const removeOfficeWorkInfo = (index) => {
    officeWorkInfoList.splice(index, 1);
    setFieldValue(officeWorkInfoListFieldName, officeWorkInfoList, false);
  };

  const removeOfficeTransportInfo = (index) => {
    officeTransportInfoList.splice(index, 1);
    setFieldValue(officeTransportInfoListFieldName, officeTransportInfoList, false);
  };

  const addOfficeTransportInfo = () => {
    setFieldValue(officeTransportInfoListFieldName, [...officeTransportInfoList, { ...initialOfficeTransportInfoValue, id: uuid() }], false);
  };

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
      <div className="section">
        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center">Office CDC</div>
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
        </div>
        <div className="row">
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
              <div className="col-3 d-flex align-items-center">Company Name</div>
              <div className="col-9">
                <ValidationField name={`${fieldName}.officeWorkInfoList[0].companyName`} inputClassName="textfield" />
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
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Name of Employer / Dormitory Operator</div>
              <div className="col-9">
                <ValidationField name={`${fieldName}.officeWorkInfoList[0].employerName`} inputClassName="textfield" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Contact Number of Employer / Dormitory Operator</div>
              <div className="col-9">
                <ValidationField name={`${fieldName}.officeWorkInfoList[0].employerContactNo`} inputClassName="textfield" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className="col-3 d-flex align-items-center font-weight-bold">Date of Contract - Employer</div>
              <div className="col-9">
                <ValidationField name={`${fieldName}.officeWorkInfoList[0].contractDate`} inputComponent="singleDatePickerV2" />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row paddingLeft15"> */}
        <ValidationField
          inputComponent="checkbox"
          name={`${fieldName}.isPrimary`}
          inputClassName="wf-200"
          label="Set as primary address"
          onChange={(checked) => {
            if (checked && onEnableIsPrimary) {
              onEnableIsPrimary('offInfoList', index);
            }
          }}
        />
        {/* </div> */}
        <hr />
        <h2 className="font-weight-bold">Work Days in a Week</h2>
        <div className="row">
          {officeWorkInfoList.map((info, index) => {
            const subFieldName = `officeWorkInfoList[${index}]`;
            return (
              <div className="col-12 work-days-cont" key={`work_days_${info.id}`}>
                <CloseIcon className="close-icon" onClick={() => removeOfficeWorkInfo(index)} />
                <div className="row bg-light-grey p-2">
                  <div className="col-2 p-0">
                    <div className="mb-2">
                      <p className="col-form-label font-weight-bold">No. of Work Days</p>
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workDays`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100"
                        placeholder=""
                        options={DayLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                    </div>
                  </div>
                  <div className="col-5 p-0">
                    <div className="mb-2">
                      <p className="col-form-label font-weight-bold">From</p>
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workStartHrs`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100 marginRight20"
                        placeholder="Hr"
                        options={HourLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workStartMnts`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100 marginRight20"
                        placeholder="Min"
                        options={MinuteLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workStartAmPm`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100"
                        placeholder="AM/PM"
                        options={PeriodLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                    </div>
                  </div>
                  <div className="col-5 p-0">
                    <div className="mb-2">
                      <p className="col-form-label font-weight-bold">To</p>
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workEndHrs`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100 marginRight20"
                        placeholder="Hr"
                        options={HourLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workEndMnts`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100 marginRight20"
                        placeholder="Min"
                        options={MinuteLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                      <ValidationField
                        name={`${fieldName}.${subFieldName}.workEndAmPm`}
                        inputComponent="react-select"
                        selectClassName="d-inline-block wf-100"
                        placeholder="AM/PM"
                        options={PeriodLOV}
                        hideError
                        isClearable={false}
                        small
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {officeWorkInfoList.length < 1 && <AddButton title="Add Day" onClick={addOfficeWorkInfo} />}
        <div className="paddingTop20" />
        <h2 className="font-weight-bold">Mode of Transport</h2>
        <div className="row">
          {officeTransportInfoList.map((info, index) => {
            const subFieldName = `officeTransportInfoList[${index}]`;
            return (
              <TransportInformation
                key={`work_days_${info.id}`}
                subFieldName={subFieldName}
                fieldName={fieldName}
                onRemove={removeOfficeTransportInfo}
                transportModeLOV={transportModeLOV}
                busStopLOV={busStopLOV}
                mrtStopLOV={mrtStopLOV}
              />
            );
          })}
        </div>
        {officeTransportInfoList.length < 1 && <AddButton title="Add Mode of Transport" onClick={addOfficeTransportInfo} />}
      </div>
    </Accordion>
  );
};

export default Formik.connect(CaseOfficeInformation);
