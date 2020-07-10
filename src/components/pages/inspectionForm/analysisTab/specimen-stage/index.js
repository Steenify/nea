import React from 'react';

import { Field, FieldArray } from 'formik';

import { LarvalInstars, SpecimenStageMappingLOV } from 'constants/local-lov';

const SpecimenStage = (props) => {
  const { finding, fieldName, specimenStageLOV, setFieldValue, disabled, viewOnly } = props;
  const { specimenStage, isLarvalInstarSelected } = finding;
  // if (!specimenStage || specimenStage === '') {
  //   return <></>;
  // }

  const actualSpecimenStageLOV = specimenStageLOV || [];
  const specimenStageName = `${fieldName}.specimenStage`;
  const larvalInstarName = `${fieldName}.isLarvalInstarSelected`;
  const maleCountName = `${fieldName}.maleCount`;
  const femaleCountName = `${fieldName}.femaleCount`;
  const unidentifiedCountName = `${fieldName}.unidentifiedCount`;
  const selectedStages = specimenStage || (viewOnly ? actualSpecimenStageLOV : []);
  const isLarvalInstar = isLarvalInstarSelected !== null && isLarvalInstarSelected !== undefined ? isLarvalInstarSelected : LarvalInstars.some((item) => selectedStages.includes(item));
  const resultHtml = [];
  const isAdultStage = (stage) => {
    return stage === 'Adult' || stage === 'A';
  };
  const isLarvalInstarStage = (stage) => {
    return LarvalInstars.includes(stage);
  };
  if (actualSpecimenStageLOV.some((stage) => isLarvalInstarStage(stage))) {
    resultHtml.push(
      <li className="form-nea__block" key="specimen_stage_larval_instar_og">
        <div className="nea-chkbx form-group">
          <label className="custom-chckbbox">
            Larval Instar
            <Field
              type="checkbox"
              name={larvalInstarName}
              className={`form-control ${isLarvalInstar && 'checked'}`}
              checked={isLarvalInstar}
              disabled={disabled}
              key="specimen_stage_larval_instar_og"
              onChange={(e) => {
                const check = e.target.checked;
                const stages = new Set(selectedStages);
                if (!check) {
                  LarvalInstars.forEach((item) => {
                    stages.delete(item);
                  });
                  setFieldValue(specimenStageName, Array.from(stages));
                }
                setFieldValue(larvalInstarName, check);
              }}
            />
            <span className="checkmark" />
          </label>
        </div>
        {isLarvalInstar && (
          <FieldArray
            name={specimenStageName}
            render={(arrayHelpers) => (
              <ul className="form-nea__checkgroup-ul show">
                {LarvalInstars.map((item) =>
                  actualSpecimenStageLOV.includes(item) ? (
                    <li className="form-nea__inline" style={{ width: '65px' }} key={`specimen_stage_larval_instar_${item}`}>
                      <div className="nea-chkbx form-group">
                        <label className="custom-chckbbox">
                          {item}
                          <input
                            className={`form-control ${selectedStages.includes(item) && 'checked'}`}
                            name={specimenStageName}
                            disabled={disabled}
                            type="checkbox"
                            value={item.toString()}
                            checked={selectedStages.includes(item)}
                            onChange={(e) => {
                              if (e.target.checked) arrayHelpers.push(item);
                              else {
                                const idx = selectedStages.indexOf(item);
                                arrayHelpers.remove(idx);
                              }
                            }}
                          />
                          <span className="checkmark" />
                        </label>
                      </div>
                    </li>
                  ) : (
                    <></>
                  ),
                )}
              </ul>
            )}
          />
        )}
      </li>,
    );
  }
  actualSpecimenStageLOV.forEach((stage, index) => {
    if (isAdultStage(stage)) {
      const code = 'A';
      const codeDesc = 'Adult';
      const isChecked = selectedStages.includes(code) || selectedStages.includes(codeDesc);
      resultHtml.push(
        <FieldArray
          key={`specimen_stage_field_array_${stage}`}
          name={specimenStageName}
          render={(arrayHelpers) => (
            <li className="form-nea__block form-group" key={`specimen_stage_${stage}_${index.toString()}`}>
              <div className="nea-chkbx form-group mb-0">
                <label className="custom-chckbbox">
                  Adult
                  <input
                    className={`form-control ${isChecked && 'checked'}`}
                    name={specimenStageName}
                    type="checkbox"
                    value={code}
                    checked={isChecked}
                    disabled={disabled}
                    onChange={(e) => {
                      if (e.target.checked) arrayHelpers.push(code);
                      else {
                        const idx = selectedStages.indexOf(code);
                        arrayHelpers.remove(idx);
                      }
                    }}
                  />
                  <span className="checkmark" />
                </label>
              </div>
              {isChecked && (
                <ul className="form-nea__checkgroup-ul show">
                  <li className="form-nea__inline sm-w-30p">
                    <div className="form-group">
                      <label className="custom-textbox">
                        <div className="small-grey-text mb-0" style={{ paddingBottom: '3px' }}>
                          Male(s)
                        </div>
                        <Field className="form-control textField" name={maleCountName} placeholder="00" disabled={disabled} />
                      </label>
                    </div>
                  </li>
                  <li className="form-nea__inline sm-w-30p">
                    <div className="form-group hasError">
                      <label className="custom-textbox">
                        <div className="small-grey-text mb-0" style={{ paddingBottom: '3px' }}>
                          Female(s)
                        </div>
                        <Field className="form-control textField" name={femaleCountName} placeholder="00" disabled={disabled} />
                      </label>
                    </div>
                  </li>
                  <li className="form-nea__inline sm-w-30p">
                    <div className="form-group hasError">
                      <label className="custom-textbox">
                        <div className="small-grey-text mb-0" style={{ paddingBottom: '3px' }}>
                          Not Identifiable
                        </div>
                        <Field className="form-control textField" name={unidentifiedCountName} placeholder="00" disabled={disabled} />
                      </label>
                    </div>
                  </li>
                </ul>
              )}
            </li>
          )}
        />,
      );
    } else if (!isLarvalInstarStage(stage)) {
      const mappedStage = SpecimenStageMappingLOV.find((item) => item.code === stage);
      const codeDesc = mappedStage?.codeDesc || '';
      const code = mappedStage?.code || '';
      const isChecked = selectedStages.includes(code);
      resultHtml.push(
        <FieldArray
          key={`specimen_stage_field_array_${stage}`}
          name={specimenStageName}
          render={(arrayHelpers) => (
            <li className="form-nea__block" key={`specimen_stage_${stage}_${index.toString()}`}>
              <div className="nea-chkbx form-group">
                <label className="custom-chckbbox">
                  {codeDesc}
                  <input
                    className={`form-control ${isChecked && 'checked'}`}
                    type="checkbox"
                    value={code}
                    checked={isChecked}
                    disabled={disabled}
                    onChange={(e) => {
                      if (e.target.checked) arrayHelpers.push(code);
                      else {
                        const idx = selectedStages.indexOf(code);
                        arrayHelpers.remove(idx);
                      }
                    }}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </li>
          )}
        />,
      );
    }
  });

  return <ul className="form-nea__checkgroup mt-1-tablet">{resultHtml}</ul>;
};

export default SpecimenStage;
