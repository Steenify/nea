import React from 'react';
import ValidationField from 'components/common/formik/validationField';
import Accordion from 'components/common/accordion';

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

const FrequentLocation = (props) => {
  const { index, onRemove, onRetrieveAddress } = props;
  const fieldName = `localTravInfoList[${index}]`;
  return (
    <Accordion
      isOpen
      headerChildren={
        <div className="d-flex align-items-center flex-grow-1">
          <h3 className="font-weight-bold">Location {index + 1} </h3>
          <button type="button" className="btn btn-sec ml-auto mr-5" onClick={onRemove}>
            Remove
          </button>
        </div>
      }>
      <div className="row section">
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Postal Code</div>
            <div className="col-9">
              <div className="row paddingLeft15 paddingRight15">
                <div>
                  <ValidationField name={`${fieldName}.postalCode`} inputClassName="textfield wf-200" />
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
            <div className="col-3 d-flex align-items-center font-weight-bold">Road Name</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.roadName`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Building Name</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.buildingName`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Premises No.</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.premiseNo`} inputClassName="textfield" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Level</div>
            <div className="col-3">
              <ValidationField name={`${fieldName}.levelNo`} inputClassName="textfield" />
            </div>
            <div className="col-3 d-flex align-items-center font-weight-bold">Unit No.</div>
            <div className="col-3">
              <ValidationField name={`${fieldName}.unitNo`} inputClassName="textfield" />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">No. of Times Per Week</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.noVisit`} inputClassName="textfield wf-100" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Time of Visit</div>
            <div className="col-9">
              <div>
                <div className="d-inline-block wf-50 font-weight-bold">From</div>
                <ValidationField
                  name={`${fieldName}.fromVisitHrs`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="Hr"
                  options={HourLOV}
                  hideError
                  isClearable={false}
                />
                <ValidationField
                  name={`${fieldName}.fromVisitMts`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="Min"
                  options={MinuteLOV}
                  hideError
                  isClearable={false}
                />
                <ValidationField
                  name={`${fieldName}.fromVisitAmPm`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="AM/PM"
                  options={PeriodLOV}
                  hideError
                  isClearable={false}
                />
              </div>
              <div>
                <div className="d-inline-block wf-50 font-weight-bold">To</div>
                <ValidationField
                  name={`${fieldName}.toVisitHrs`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="Hr"
                  options={HourLOV}
                  hideError
                  isClearable={false}
                />
                <ValidationField
                  name={`${fieldName}.toVisitMts`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="Min"
                  options={MinuteLOV}
                  hideError
                  isClearable={false}
                />
                <ValidationField
                  name={`${fieldName}.toVisitAmPm`}
                  inputComponent="react-select"
                  selectClassName="d-inline-block wf-100 m-1"
                  placeholder="AM/PM"
                  options={PeriodLOV}
                  hideError
                  isClearable={false}
                />
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3 d-flex align-items-center font-weight-bold">Location</div>
            <div className="col-9">
              <ValidationField name={`${fieldName}.location`} inputClassName="textfield" />
            </div>
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default FrequentLocation;
