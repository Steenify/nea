import React from 'react';
import ValidationField from 'components/common/formik/validationField';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import * as Formik from 'formik';

const TransportInformation = (props) => {
  const {
    index,
    onRemove,
    fieldName,
    subFieldName,
    transportModeLOV,
    mrtStopLOV,
    busStopLOV,
    formik: { values, setFieldValue },
  } = props;

  const transportModeFieldName = `${fieldName}.${subFieldName}.transportMode`;
  const transportFromFieldName = `${fieldName}.${subFieldName}.transportFrom`;
  const transportToFieldName = `${fieldName}.${subFieldName}.transportTo`;
  const transportModeValue = Formik.getIn(values, transportModeFieldName);

  const renderFromToField = () => {
    if (!transportModeValue) {
      return null;
    }
    // if (transportModeValue === 'BUS' || transportModeValue === 'TRAIN') {
    const isBusOrTrain = transportModeValue === 'TRAIN' || transportModeValue === 'BUS';
    return (
      <>
        <div className="col-5 p-0">
          <div className="mb-2">
            <p className="col-form-label font-weight-bold">From</p>
            <ValidationField
              name={transportFromFieldName}
              inputComponent={isBusOrTrain ? 'react-select' : ''}
              inputClassName="textfield wf-300"
              selectClassName="d-inline-block wf-300"
              placeholder=""
              options={transportModeValue === 'BUS' ? busStopLOV : mrtStopLOV?.sort((a, b) => (a.value < b.value ? -1 : 1)) || []}
              hideError
              isClearable={false}
            />
          </div>
        </div>
        <div className="col-5 p-0">
          <div className="mb-2">
            <p className="col-form-label font-weight-bold">To</p>
            <ValidationField
              name={transportToFieldName}
              inputComponent={isBusOrTrain ? 'react-select' : ''}
              selectClassName="d-inline-block wf-300"
              inputClassName="textfield wf-300"
              placeholder=""
              options={transportModeValue === 'BUS' ? busStopLOV : mrtStopLOV}
              hideError
              isClearable={false}
            />
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="col-12 work-days-cont">
      <CloseIcon className="close-icon" onClick={() => onRemove(index)} />
      <div className="row bg-light-grey p-2">
        <div className="col-2 p-0">
          <div className="mb-2">
            <p className="col-form-label font-weight-bold">Mode of Transport</p>
            <ValidationField
              name={transportModeFieldName}
              inputComponent="react-select"
              selectClassName="d-inline-block wf-150"
              placeholder=""
              options={transportModeLOV}
              hideError
              isClearable={false}
              small
              onChange={() => {
                setFieldValue(transportFromFieldName, '', false);
                setFieldValue(transportToFieldName, '', false);
              }}
            />
          </div>
        </div>
        {renderFromToField()}
      </div>
    </div>
  );
};

// const mapStateToProps = () => ({});

// const mapDispatchToProps = {
//   // retrieveAddressAction,
// };

export default Formik.connect(TransportInformation);
