import React from 'react';

import './style.scss';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';
import uuid from 'uuid/v4';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import DropBox from 'components/common/dropbox';
import { SUBMISSION_TYPE } from 'constants/index';
import BinaryFileGallery from 'components/common/binaryImageGallery';
import { initialSpecimen } from '../helper';

const Outsourced = ({ values: { contractorRemarks = '', contractorBottleCount = '', contractorSpecimenCount = '', contractorSpeciesList = [] }, specimenLOV = [] }) => {
  return (
    <>
      <p className="tab-pane__title text-white">Outsourced Contractor’s Identification of Specimen</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6">
              <div className="specimen__number">
                <div className="label">Total Number of Sample Bottle(s)</div>
                <div className="value">{contractorBottleCount}</div>
              </div>
              <div className="specimen__number">
                <div className="label">Total Number of Specimen(s)</div>
                <div className="value">{contractorSpecimenCount}</div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="specimen__types">
                <div className="specimen__row">
                  <div className="specimen__label">Specimen:</div>
                </div>
                {contractorSpeciesList.map(({ speciesName, maleCount, femaleCount, speciesCount }, index) => {
                  const speciesCountNumber = Number(speciesCount) || 0;
                  return (
                    <div className="row" key={`list_contractir_species_list_${index.toString()}`}>
                      <div className="font-weight-bold col-5 text-italic">{speciesName}</div>
                      {speciesCountNumber > 0 ? (
                        <div className="col-7">{`Species Count: ${speciesCount}`}</div>
                      ) : (
                        <>
                          <div className="male col-4">{`Male: ${maleCount || '0'}`}</div>
                          <div className="female col-3">{`Female: ${femaleCount || '0'}`}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-12">
              <div className="specimen__remark">
                <div className="label">Remarks: </div>
                <div className="value">{contractorRemarks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NonSCAnalyst = Formik.connect(({ formik: { values, setFieldValue }, specimenLOV }) => {
  const speciesListFieldName = 'analystSpeciesList';
  const speciesList = values?.analystSpeciesList || [];
  const fileList = values?.findingsFileList || [];
  const addSpecimenInfo = () => {
    setFieldValue(speciesListFieldName, [...speciesList, { ...initialSpecimen, id: uuid(), isNew: true }], false);
  };

  const removeSpecimenInfo = (index) => {
    speciesList.splice(index, 1);
    setFieldValue(speciesListFieldName, speciesList, false);
  };
  return (
    <>
      <p className="tab-pane__title text-white">EHI Technical Officer's Identification of Specimen</p>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="specimen__number">
                <div className="label">Total Number of Sample Bottle(s)</div>
                <ValidationField name="analystBottleCount" inputClassName="value wf-100" />
              </div>
              <div className="specimen__number">
                <div className="label">Total Number of Specimen(s)</div>
                <ValidationField name="analystSpecimenCount" inputClassName="value wf-100" />
              </div>
            </div>

            <div className="col-lg-8">
              <div className="specimen__types">
                <div className="specimen__row">
                  <div className="specimen__label">Specimen:</div>
                </div>
                {speciesList.map(({ id }, index) => (
                  <div className="row" key={id}>
                    <div className="col-11">
                      <div className="specimen__type">
                        <ValidationField
                          name={`${speciesListFieldName}[${index}].speciesCode`}
                          inputComponent="react-select"
                          selectClassName="wf-400 text-italic"
                          noPortal={true}
                          placeholder="Specimen"
                          options={specimenLOV || []}
                          hideError
                        />
                        <div className="male">
                          <div className="mr-3">Male</div>
                          <ValidationField name={`${speciesListFieldName}[${index}].maleCount`} inputClassName="textfield wf-100" />
                        </div>
                        <div className="female">
                          <div className="mr-3">Female</div>
                          <ValidationField name={`${speciesListFieldName}[${index}].femaleCount`} inputClassName="textfield wf-100" />
                        </div>
                      </div>
                    </div>
                    <div className="col-1 d-flex align-items-center">
                      <CloseIcon className="cursor-pointer" onClick={() => removeSpecimenInfo(index)} />
                    </div>
                  </div>
                ))}
                <AddButton className="mt-3" title="Add Specimen" onClick={addSpecimenInfo} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="specimen__remark">
                <div className="label">Photo</div>
                <div className="value">
                  <DropBox
                    size="sm"
                    submissionType={SUBMISSION_TYPE.GRAVITRAP_SUPPORT_DOC}
                    fileIdList={fileList?.map(({ fileId }) => fileId) || []}
                    onChange={(fileList) => {
                      const fileIds = fileList.map((file) => ({ fileId: file.fileId }));
                      setFieldValue('findingsFileList', fileIds);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="specimen__remark">
                <div className="label">Remarks:</div>
                <div className="value">
                  <ValidationField name="analystFindingsRemarks" inputComponent="textarea" rows={5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
const SCAnalyst = ({ values: { analystFindingsRemarks = '', analystBottleCount = '', analystSpecimenCount = '', findingsFileList = [], analystSpeciesList = [] }, specimenLOV = [] }) => {
  return (
    <>
      <p className="tab-pane__title text-white">EHI Technical Officer's Identification of Specimen</p>
      <div className="card">
        <div className="card-body">
          <div className="row paddingBottom30">
            <div className="col-lg-4">
              <div className="specimen__number">
                <div className="label">Total Number of Sample Bottle(s)</div>
                <div className="value">{analystBottleCount}</div>
              </div>
              <div className="specimen__number">
                <div className="label">Total Number of Specimen(s)</div>
                <div className="value">{analystSpecimenCount}</div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="specimen__types">
                <div className="specimen__row">
                  <div className="specimen__label">Specimen:</div>
                </div>
                {analystSpeciesList.map((item, index) => (
                  <div className="row" key={`analystSpeciesList__${index.toString()}`}>
                    <div className="font-weight-bold col-5 text-italic">{item?.speciesName || specimenLOV.find((itemLOV) => item.speciesCode === itemLOV.value)?.label || 'Unable to Identify'}</div>
                    <div className="male col-4">{`Male: ${item?.maleCount || '0'}`}</div>
                    <div className="female col-3">{`Female: ${item?.femaleCount || '0'}`}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row paddingBottom30">
            <div className="col-12">
              <div className="specimen__remark">
                <div className="label">Photo:</div>
                <div className="value">
                  <BinaryFileGallery fileIdList={findingsFileList?.map((photo) => photo.fileId)} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="specimen__remark">
                <div className="label">Remarks:</div>
                <div className="value">{analystFindingsRemarks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Specimen = ({ formik: { values, setFieldValue }, isSC, specimenLOV }) => {
  return (
    <>
      <div className="tab-pane__group bg-white ">
        <Outsourced values={values} specimenLOV={specimenLOV} />
      </div>
      <div className="tab-pane__group bg-white">{isSC ? <SCAnalyst values={values} specimenLOV={specimenLOV} /> : <NonSCAnalyst specimenLOV={specimenLOV} />}</div>
    </>
  );
};

export default Formik.connect(Specimen);
