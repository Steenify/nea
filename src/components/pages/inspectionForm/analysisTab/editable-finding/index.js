import React, { useState, useEffect, useReducer, useCallback } from 'react';
import update from 'react-addons-update';
import { Field, ErrorMessage } from 'formik';

import { actionTryCatchCreator } from 'utils';

import { getSpeciesForSpecimenLOV } from 'services/LOV/sampleInspectionForm';
import { MASTER_CODE } from 'services/masterCode';
import CustomModal from 'components/common/modal';
import ValidationField from 'components/common/formik/validationField';

import SpecimenStage from '../specimen-stage';

const initialState = {
  specimenLOV: [],
  specimenStageLOV: [],
  speciesLOV: [],
  vectorOfDiseaseLOV: 'Non Vector',
  rejFileList: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'speciesLOV': {
      return update(state, { $merge: payload });
    }
    case 'defaultLOV': {
      return update(state, { $merge: payload });
    }
    case 'setSpecies': {
      return update(state, { $merge: payload });
    }
    case 'specimenLOV': {
      return update(state, { $merge: payload });
    }
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

const EditableFindings = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const { finding, index, isRemovable, onRemove, isSubmitting, setFieldValue, masterCodes } = props;
  const {
    // specimenLOV,
    specimenStageLOV,
    speciesLOV,
    vectorOfDiseaseLOV,
  } = state;

  const fieldName = `sampleFindingsVOs[${index}]`;
  const sampleTreatmentCode = finding?.sampleTreatmentCode;
  const isResearchTreatment = sampleTreatmentCode === 'R';
  const selectedSpecimenCode = finding?.specimenCode;
  const isSelectingRodentSpecimen = selectedSpecimenCode === 'RD';
  const selectedSpeciesCode = finding?.speciesCode;

  const getSpecies = useCallback(
    (specimenTypeCode) => {
      const onSuccess = (data) => {
        const { speciesCodeVoList, stageValueList } = data;
        const speciesLOV = speciesCodeVoList || [];
        const disease = speciesLOV.find((species) => selectedSpeciesCode === species.speciesCode)?.disease;
        setFieldValue(`${fieldName}.vectorOfDisease`, disease || 'Non Vector');
        dispatch({
          type: 'speciesLOV',
          payload: {
            specimenStageLOV: stageValueList || [],
            speciesLOV,
            vectorOfDiseaseLOV: disease || 'Non Vector',
          },
        });
      };

      actionTryCatchCreator(getSpeciesForSpecimenLOV({ specimenTypeCode }), null, onSuccess, null);
    },
    [fieldName, setFieldValue, selectedSpeciesCode],
  );

  const setSpecies = useCallback(
    (speciesCode) => {
      const species = speciesLOV.find((item) => item.speciesCode === speciesCode);
      setFieldValue(`${fieldName}.vectorOfDisease`, species?.disease || 'Non Vector');
      dispatch({
        type: 'setSpecies',
        payload: {
          isVector: species?.isVector || false,
          vectorOfDiseaseLOV: species?.disease || 'Non Vector',
        },
      });
    },
    [fieldName, setFieldValue, speciesLOV],
  );

  useEffect(() => {
    if (selectedSpecimenCode) {
      getSpecies(selectedSpecimenCode);
    }
  }, [selectedSpecimenCode, getSpecies]);

  useEffect(() => {
    setSpecies(selectedSpeciesCode);
  }, [selectedSpeciesCode, setSpecies]);

  if (!finding) return <></>;

  return (
    <div>
      <div className="row section finding-header">
        <div className="col-md-9 col-xl-6 d-flex flex-column justify-content-center">
          <div className="row form-group">
            <div className="col-md-3 col-xl-3  d-flex flex-column justify-content-center">
              <h3 className="bold-font">Findings {index + 1}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-xl-6">
          <div className="nea-btn-group">
            {isRemovable && (
              <button type="button" className="btn btn-sec mr-2" disabled={isSubmitting} onClick={() => setRemoveModalOpen(true)}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="row section">
        <div className="col-md-12 col-xl-4">
          <div className="label-group details-info">
            <label className="small-grey-text">Specimen</label>
            <ValidationField
              name={`${fieldName}.specimenCode`}
              inputComponent="react-select"
              selectClassName="d-block"
              placeholder="Please select"
              // options={specimenLOV}
              options={masterCodes[MASTER_CODE.SPECIMEN_CODE]}
            />
          </div>
          {isSelectingRodentSpecimen && (
            <div className="label-group details-info">
              <label className="small-grey-text">Specimen Type</label>
              <ValidationField
                name={`${fieldName}.specimenType`}
                inputComponent="react-select"
                selectClassName="d-block"
                placeholder="Please select"
                options={masterCodes[MASTER_CODE.SPECIMEN_RODENT_TYPE]}
              />
            </div>
          )}
          {!isSelectingRodentSpecimen && selectedSpecimenCode && specimenStageLOV.length > 0 && (
            <div className="label-group details-info mb-0">
              <label className="small-grey-text">Specimen Stage</label>
              <SpecimenStage finding={finding} fieldName={fieldName} specimenStageLOV={specimenStageLOV} setFieldValue={setFieldValue} viewOnly={false} />
              <ErrorMessage className="col-form-error-label" name={`${fieldName}.specimenStage`} component="div" />
            </div>
          )}
          {!selectedSpecimenCode && (
            <div className="label-group details-info">
              <label className="small-grey-text">Vector of Diseases</label>
              <div className="form-group">
                <div className="d-block">
                  <ValidationField type="text" name={`${fieldName}.vectorOfDisease`} inputClassName="textfield" disabled value={vectorOfDiseaseLOV} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-12 col-xl-8">
          <div className="row details-info">
            <div className="col-xl-6 col-md-12">
              <div className="label-group details-info">
                <label className="small-grey-text">Species</label>
                <ValidationField
                  name={`${fieldName}.speciesCode`}
                  inputComponent="react-select"
                  selectClassName="d-block text-italic"
                  placeholder="Please select"
                  noPortal={true}
                  disabled={!selectedSpecimenCode}
                  options={speciesLOV.map((lov) => ({ label: lov.speciesName, value: lov.speciesCode }))}
                />
              </div>
              {selectedSpecimenCode && (
                <div className="label-group details-info">
                  <label className="small-grey-text">Vector of Diseases</label>
                  <div className="form-group">
                    <div className="d-block">
                      <ValidationField type="text" name={`${fieldName}.vectorOfDisease`} inputClassName="textfield" disabled value={vectorOfDiseaseLOV} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="label-group details-info">
                <label className="small-grey-text">Sample Treatment</label>
                <div className="form-group">
                  <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
                    {masterCodes[MASTER_CODE.SAMPLE_TREATMENT] &&
                      masterCodes[MASTER_CODE.SAMPLE_TREATMENT].map((treatment) => (
                        <label key={`sample_treatment_${treatment.value}`} className={`btn btn-${sampleTreatmentCode === treatment.value ? 'pri' : 'sec'}`}>
                          <Field type="radio" name={`${fieldName}.sampleTreatmentCode`} value={treatment.value} />
                          {treatment.label}
                        </label>
                      ))}
                  </div>
                </div>
                <ErrorMessage className="col-form-error-label" name={`${fieldName}.sampleTreatmentCode`} component="div" />
              </div>
              {isResearchTreatment && (
                <>
                  <div className="label-group details-info">
                    <label className="small-grey-text">Purpose</label>
                    <ValidationField
                      name={`${fieldName}.purposeCode`}
                      inputComponent="react-select"
                      selectClassName="d-block"
                      placeholder="Please select"
                      options={masterCodes[MASTER_CODE.SAMPLE_TREATMENT_PURPOSE]}
                    />
                  </div>
                  <div className="label-group details-info">
                    <label className="small-grey-text">Officer Name</label>
                    <div className="form-group">
                      <div className=" d-block">
                        <ValidationField name={`${fieldName}.researcherName`} placeholder="Officer Name" inputComponent="input" inputClassName="textfield" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {selectedSpecimenCode && (
            <div className="row">
              <div className="col-12">
                <div className="label-group details-info">
                  <label className="small-grey-text ">Remarks</label>
                  <ValidationField name={`${fieldName}.remarks`} placeholder="Remarks" inputComponent="textarea" rows="3" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomModal
        isOpen={isRemoveModalOpen}
        type="system-modal"
        headerTitle="Remove findings?"
        cancelTitle="Cancel"
        onCancel={() => setRemoveModalOpen(false)}
        confirmTitle="Confirm"
        onConfirm={() => {
          if (onRemove) onRemove();
          setRemoveModalOpen(false);
        }}
      />
    </div>
  );
};

export default EditableFindings;
