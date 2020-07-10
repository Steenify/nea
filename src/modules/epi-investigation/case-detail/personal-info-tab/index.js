import React from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';

import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import uuid from 'uuid/v4';
import { NEA_ONSET_DATE_TYPE } from 'constants/index';

import CasePersonalInformation from './personal-information';
import CaseResidentialAddress from './residential-address';
import CaseOfficeInformation from './office-information';
import ClinicInformation from './clinic-information';
import { initialResInfoValue, initialOfficerInfoValue, initialClinicInfoValue } from '../helper';

// const

const PersonalInfo = (props) => {
  const {
    formik: { values, setFieldValue },
    masterCodes,
    onRetrieveAddress,
    onPostalCodeChange,
  } = props;

  const { NA, MOH, INITIAL_SYMPTOM } = NEA_ONSET_DATE_TYPE;
  const ethnicLOV = masterCodes[MASTER_CODE.ETHNIC_TYPE];
  const countryLOV = masterCodes[MASTER_CODE.COUNTRY];
  const genderLOV = masterCodes[MASTER_CODE.GENDER];
  const occupationLOV = masterCodes[MASTER_CODE.OCCUPATION_TYPE];
  const residentialCDCLOV = masterCodes[MASTER_CODE.RESIDENTIAL_TYPE];
  const premiseTypeLOV = masterCodes[MASTER_CODE.PREMISES_TYPE];
  const transportModeLOV = masterCodes[MASTER_CODE.TRANSPORT_MODE];
  const divisionLOV = masterCodes[MASTER_CODE.DIVISION_CODE];
  const symptomLOV = masterCodes[MASTER_CODE.SYMPTOMS];
  const busStopLOV = masterCodes[MASTER_CODE.BUS_STOP];
  const mrtStopLOV = masterCodes[MASTER_CODE.MRT_STOP];
  const { resInfoList, offInfoList, clinicInfoList, mohOnSetDate, firstDiagnosisDate, diagnosis, diagnosisStatus, neaOnsetDateType } = values;

  const onEnableIsPrimary = (fieldName, index) => {
    const array = Formik.getIn(values, fieldName) || [];
    for (let i = 0; i < array.length; i++) {
      if (i !== index) {
        const field = `${fieldName}[${i}].isPrimary`;
        setFieldValue(field, false, false);
      }
    }
  };

  const addResTravelInfo = () => {
    setFieldValue('resInfoList', [...resInfoList, { ...initialResInfoValue, addressId: uuid() }], true);
  };

  const removeResTravelInfo = (index) => {
    resInfoList.splice(index, 1);
    setFieldValue('resInfoList', resInfoList, true);
  };

  const addClinicInfo = () => {
    setFieldValue('clinicInfoList', [...clinicInfoList, { ...initialClinicInfoValue, id: uuid() }], false);
  };

  const removeClinicInfo = (index) => {
    clinicInfoList.splice(index, 1);
    setFieldValue('clinicInfoList', clinicInfoList, false);
  };

  const addOfficeInfo = () => {
    setFieldValue('offInfoList', [...offInfoList, { ...initialOfficerInfoValue, addressId: uuid() }], true);
  };

  const removeOfficeInfo = (index) => {
    offInfoList.splice(index, 1);
    setFieldValue('offInfoList', offInfoList, true);
  };

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Profile</p>
        <CasePersonalInformation countryLOV={countryLOV} ethnicLOV={ethnicLOV} occupationLOV={occupationLOV} genderLOV={genderLOV} />
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Residential Address</p>
        {resInfoList?.map((info, index) => (
          <CaseResidentialAddress
            key={`res_info_${info.addressId}`}
            residentialCDCLOV={residentialCDCLOV}
            premiseTypeLOV={premiseTypeLOV}
            index={index}
            onRemove={() => removeResTravelInfo(index)}
            onRetrieveAddress={onRetrieveAddress}
            onPostalCodeChange={onPostalCodeChange}
            onEnableIsPrimary={onEnableIsPrimary}
          />
        ))}
        {resInfoList?.length < 2 && <AddButton className="m-3" title="Add New Residential Address" onClick={addResTravelInfo} />}
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Office Information</p>
        {offInfoList?.map((info, index) => (
          <CaseOfficeInformation
            key={`office_info_${info.addressId}`}
            residentialCDCLOV={residentialCDCLOV}
            premiseTypeLOV={premiseTypeLOV}
            transportModeLOV={transportModeLOV}
            divisionLOV={divisionLOV}
            busStopLOV={busStopLOV}
            mrtStopLOV={mrtStopLOV}
            index={index}
            onRemove={() => removeOfficeInfo(index)}
            onRetrieveAddress={onRetrieveAddress}
            onPostalCodeChange={onPostalCodeChange}
            onEnableIsPrimary={onEnableIsPrimary}
          />
        ))}
        {offInfoList?.length < 2 && <AddButton className="m-3" title="Add New Office Information" onClick={addOfficeInfo} />}
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Treatment History</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="row mb-3">
                  <div className="col-5 d-flex align-items-center font-weight-bold">First Diagnosis Date</div>
                  <div className="col-7">{firstDiagnosisDate}</div>
                </div>
                <div className="font-weight-bold">NEA Onset Date</div>
                <div className="tab-pane__group pl-3 pr-3" style={{ maxWidth: '350px' }}>
                  <div className={`row pb-3 pt-3 cursor-pointer ${neaOnsetDateType === MOH ? 'bg-light-blue' : ''}`} onClick={() => setFieldValue('neaOnsetDateType', MOH, false)}>
                    <div className="col-12 font-weight-bold">MOH Onset Date</div>
                    <div className="col-12">
                      <div>{mohOnSetDate}</div>
                    </div>
                  </div>
                  <div
                    className={`row pb-3 pt-3 cursor-pointer ${neaOnsetDateType === INITIAL_SYMPTOM ? 'bg-light-blue' : ''}`}
                    onClick={() => setFieldValue('neaOnsetDateType', INITIAL_SYMPTOM, false)}>
                    <div className="col-12 font-weight-bold">Date of Initial Symptoms</div>
                    <div className="col-12">
                      <ValidationField name="initSymptDate" placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" inputClassName="d-contents" hideError />
                    </div>
                  </div>
                  <div className={`row pb-3 pt-3 cursor-pointer ${neaOnsetDateType === NA ? 'bg-light-blue' : ''}`} onClick={() => setFieldValue('neaOnsetDateType', NA, false)}>
                    <div className="col-12 d-flex align-items-center font-weight-bold">N/A - Does Not Have Disease</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row mb-3">
                  <div className="col-3 d-flex align-items-center font-weight-bold">Symptom(s)</div>
                  <div className="col-9">
                    <ValidationField name="symptomsTempList" inputComponent="react-multi-select" placeholder="Please select" options={symptomLOV} optionsCompareField="value" hideError />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-3 d-flex align-items-center font-weight-bold">Diagnosis</div>
                  <div className="col-9">
                    <div>{diagnosis}</div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-3 d-flex align-items-center font-weight-bold">Status</div>
                  <div className="col-9">{diagnosisStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {clinicInfoList?.map((info, index) => (
          <ClinicInformation
            key={`res_info_${info.id}`}
            residentialCDCLOV={residentialCDCLOV}
            premiseTypeLOV={premiseTypeLOV}
            index={index}
            onRemove={() => removeClinicInfo(index)}
            onRetrieveAddress={onRetrieveAddress}
          />
        ))}
        {clinicInfoList?.length < 2 && <AddButton className="m-3" title="Add New Visit to GP/Polyclinic/Hospital" onClick={addClinicInfo} />}
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Treatment History Remarks (Optional)</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <ValidationField name="treatmentRemarks" inputComponent="textarea" rows={5} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(PersonalInfo));
