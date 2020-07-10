import React from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';
import uuid from 'uuid/v4';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import ValidationField from 'components/common/formik/validationField';

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import AddButton from 'components/common/add-button';
import FrequentLocation from './frequent-location';
import { initialOverseaMovementValue, initialLocalTravelInfoValue } from '../helper';

const MovementHistory = (props) => {
  const {
    //
    // isAmending,
    // isEditing,
    formik: { values, setFieldValue },
    masterCodes,
    onRetrieveAddress,
  } = props;
  const countryLOV = masterCodes[MASTER_CODE.COUNTRY];
  const { localTravInfoList, overseaTravInfoList } = values;

  const addLocalTravelInfo = () => {
    setFieldValue('localTravInfoList', [...localTravInfoList, { ...initialLocalTravelInfoValue, id: uuid() }], false);
  };

  const removeLocalTravelInfo = (index) => {
    localTravInfoList.splice(index, 1);
    setFieldValue('localTravInfoList', localTravInfoList, false);
  };

  const removeOverseaMovement = (index) => {
    overseaTravInfoList.splice(index, 1);
    setFieldValue('overseaTravInfoList', overseaTravInfoList, false);
  };

  const addOverseaMovement = () => {
    setFieldValue('overseaTravInfoList', [...overseaTravInfoList, { ...initialOverseaMovementValue, id: uuid() }], false);
  };

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Places Frequented in Singapore</p>
        {localTravInfoList?.map((location, lIndex) => (
          <FrequentLocation key={`frequent_location_${location.id}`} index={lIndex} onRemove={() => removeLocalTravelInfo(lIndex)} onRetrieveAddress={onRetrieveAddress} />
        ))}
        {localTravInfoList?.length < 3 && <AddButton className="m-3" title="Add New Location" onClick={addLocalTravelInfo} />}
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Overseas Movement History</p>
        <div className="card">
          <div className="card-body">
            {overseaTravInfoList?.map((info, index) => (
              <div key={`attempt_table_row_${info.id}`}>
                <div className="row mb-3">
                  <div className="col-10">
                    <div className="row">
                      <div className="col-md-6 col-lg-3">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">From</p>
                          <ValidationField name={`overseaTravInfoList[${index}].dateTravelFrom`} placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" hideError />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">To</p>
                          <ValidationField name={`overseaTravInfoList[${index}].dateTravelTo`} placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" hideError />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Country Visited</p>
                          <ValidationField name={`overseaTravInfoList[${index}].countryCode`} inputComponent="react-select" placeholder="Please select" options={countryLOV} hideError />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">City Visited</p>
                          <ValidationField name={`overseaTravInfoList[${index}].city`} inputClassName="textfield" hideError />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 d-flex align-items-center">
                    <CloseIcon className="cursor-pointer" onClick={() => removeOverseaMovement(index)} />
                  </div>
                </div>
                <hr />
              </div>
            ))}
            {overseaTravInfoList?.length < 1 && <AddButton className="row" title="Add New Row" onClick={addOverseaMovement} />}
          </div>
        </div>
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Movement History Remarks (Optional)</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <ValidationField name="movementRemarks" inputComponent="textarea" rows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(MovementHistory));
