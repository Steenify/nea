import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import ValidationField from 'components/common/formik/validationField';
import Accordion from 'components/common/accordion';
import RejectForm from 'components/pages/reject-form';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';

import { IdentificationStatusLOV, IdentificationStatus } from 'constants/local-lov';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import {
  submitFindingAction,
  resetReducerAction,
  setHabitatGroupsAction,
  toggleEditingSampleAction,
  changeSampleStatusAction,
  addFindingAction,
  removeFindingAction,
  clearSampleAction,
} from '../action';

import { formValidation, getClassNameFromSampleStatus, prepareForInitialize, emptyFinding, emptyFormValues } from './helper';
import SampleInfo from './sample-info';
import ReadOnlyFindings from './read-only-finding';
import EditableFindings from './editable-finding';

// import './style.scss';

const isLocalFinding = (findingsId) => {
  return findingsId?.includes('local_finding_');
};

class AnalysisTab extends React.Component {
  async componentDidMount() {
    const { scannedBarcodeId, toggleEditingSampleAction, resetReducerAction, getMastercodeAction } = this.props;
    resetReducerAction();
    if (scannedBarcodeId) {
      toggleEditingSampleAction(scannedBarcodeId);
    }
    getMastercodeAction([MASTER_CODE.SAMPLE_REJECT_REASONS, MASTER_CODE.SPECIMEN_CODE, MASTER_CODE.SPECIMEN_RODENT_TYPE, MASTER_CODE.SAMPLE_TREATMENT, MASTER_CODE.SAMPLE_TREATMENT_PURPOSE]);
  }

  render() {
    const {
      scannedBarcodeId,
      viewOnly,
      submitFindingAction,
      onSaveSuccess,
      masterCodes,
      toggleEditingSampleAction,
      detail,
      isAllExpanded,
      data: { editingSampleIds },
    } = this.props;
    const habitatGroups = detail ? detail.habitatGroups || [] : [];
    const accordionRefs = habitatGroups.map((habitat) => habitat.samples.map(() => []));
    return (
      <div className="inspection_form_analysis">
        {habitatGroups &&
          habitatGroups.map((habitat, hIndex) => (
            <div className="tab-pane__group bg-white" key={`habitat_groups_${hIndex.toString()}`}>
              <p className="tab-pane__title">
                Habitat {habitat.serialNo}: {habitat.habitatType}
                <span className="m-1">|</span>
                {habitat.habitatSize}
                <span className="m-1">|</span>
                {habitat.locationBreeding}
              </p>
              {habitat.samples &&
                habitat.samples.map((sample, sIndex) => {
                  const { identificationStatusCode, identificationStatus, sampleStatus, barcodeId, sampleId, findings, sampleRejectionVO } = sample;
                  // const sampleRejectionVO = {
                  //   remarks: 'test Reject',
                  //   rejectFileIds: [
                  //     'c468fa97-a41c-4a4e-9282-fb8abdaa065b',
                  //     '5f0f4bbb-f02e-495f-bfa6-ea61881e04d5',
                  //     'ac922951-8da8-42e2-aea6-0f3f0bf3ad95',
                  //   ],
                  //   rejectReasonCodes: ['UOS', 'TBS'],
                  //   rejectReasonOther: 'Sample is invalid',
                  // };
                  const isEditingSample = editingSampleIds.includes(sampleId) && !viewOnly && IdentificationStatusLOV.map((item) => item.code).includes(identificationStatusCode);
                  // (identificationStatus === 'Pending Certification' || identificationStatus === 'Identified');
                  const isShowEditButton =
                    !isEditingSample &&
                    IdentificationStatusLOV.map((item) => item.code).includes(identificationStatusCode) &&
                    // (identificationStatus === 'Pending Certification' || identificationStatus === 'Identified') &&
                    !viewOnly;
                  const { headerColor, badgeClass } = getClassNameFromSampleStatus(identificationStatus);
                  const modifiedFindings = prepareForInitialize(findings, sampleId, isEditingSample);
                  const initialValues = {
                    barcodeId,
                    sampleId,
                    identifyStatus: identificationStatusCode,
                    sampleFindingsVOs: modifiedFindings,
                    sampleRejectionVO,
                  };
                  const onSubmit = (values, actions) => {
                    const { identifyStatus, sampleFindingsVOs } = values;
                    if (identifyStatus === IdentificationStatus.identified.code && sampleFindingsVOs.length === 0) {
                      toast.error(`Findings is required when status is ${IdentificationStatus.identified.codeDesc}`);
                      actions.setSubmitting(false);
                      return;
                    }
                    const slimmedSampleFindingsVOs = sampleFindingsVOs.map((finding) => ({
                      findingsId: isLocalFinding(finding.findingsId) ? undefined : finding.findingsId,
                      specimenCode: finding.specimenCode,
                      speciesCode: finding.speciesCode,
                      remarks: finding.remarks,
                      specimenTypeCode: finding.specimenCode === 'RD' ? finding.specimenType : undefined,
                      sampleTreatmentCode: finding.sampleTreatmentCode,
                      researchPurpose: finding.purposeCode,
                      researchBy: finding.researcherName,
                      specimenStages: finding.specimenStage,
                      maleCount: finding.maleCount,
                      femaleCount: finding.femaleCount,
                      unidentifiedCount: finding.unidentifiedCount,
                    }));
                    const data = {
                      ...values,
                      sampleFindingsVOs: slimmedSampleFindingsVOs,
                    };
                    submitFindingAction(data, () => {
                      toggleEditingSampleAction(sampleId);
                      if (onSaveSuccess) onSaveSuccess();
                      actions.resetForm();
                      actions.setSubmitting(false);
                      actions.setErrors({});
                    });
                  };
                  const headerChildren = (values, setFieldValue, setValues) => {
                    return (
                      <div className="row d-flex align-items-center flex-grow-1">
                        <div className="col-md-12 row align-items-center">
                          <div className="col-lg-6 col-xl-4 col-md-6 d-flex xs-paddingBottom15">
                            <h3 className="mr-2">Sample ID: </h3>
                            <h3 className="bold-font">{sampleId}</h3>
                          </div>
                          <div className="col-lg-6 col-xl-8 col-md-6 d-flex align-items-center">
                            {isEditingSample ? (
                              <>
                                <h3 className="mr-2">Status: </h3>
                                <ValidationField
                                  name="identifyStatus"
                                  inputComponent="react-select"
                                  selectClassName="full-width"
                                  placeholder="Please select"
                                  errorClassName="ml-2"
                                  options={IdentificationStatusLOV.map((lov) => ({
                                    label: lov.codeDesc,
                                    value: lov.code,
                                  }))}
                                  onChange={(value) => setFieldValue('identifyStatus', value)}
                                />
                              </>
                            ) : (
                              <span className={`badge ${badgeClass}`}>{identificationStatus || sampleStatus}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12 d-flex align-items-center xs-paddingTop15">
                          {isEditingSample && (
                            <div className=" ml-auto">
                              <button type="submit" className="btn btn-pri m-1 xs-paddingBottom5">
                                Save
                              </button>
                              <button type="button" className="btn btn-sec m-1 xs-paddingBottom5" onClick={() => setValues(emptyFormValues(values))}>
                                Clear
                              </button>
                            </div>
                          )}
                          {isShowEditButton && (
                            <button
                              type="button"
                              className="btn btn-sec ml-auto"
                              onClick={() => {
                                toggleEditingSampleAction(sampleId);
                                accordionRefs[hIndex][sIndex].toggle(true);
                              }}>
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  };
                  const isAccordionOpen = scannedBarcodeId === sampleId || isAllExpanded;
                  return (
                    <Formik initialValues={initialValues} enableReinitialize validate={formValidation} onSubmit={onSubmit} key={`habitat_${hIndex + 1}_sample_${sIndex + 1}`}>
                      {({ values, isSubmitting, setFieldValue, setValues, resetForm, dirty }) => {
                        const { sampleFindingsVOs, sampleId } = values;
                        return (
                          <Form>
                            <PromptOnLeave dirty={dirty} />
                            <Accordion
                              ref={(ref) => {
                                if (editingSampleIds.includes(sampleId) && ref) ref.toggle(true);
                                accordionRefs[hIndex][sIndex] = ref;
                                return true;
                              }}
                              id={`habitat_${hIndex + 1}_sample_${sIndex + 1}`}
                              isEdit={isEditingSample}
                              isOpen={isAccordionOpen}
                              headerColor={headerColor}
                              headerChildren={headerChildren(values, setFieldValue, setValues)}>
                              <SampleInfo sample={sample} />
                              {values.identifyStatus === 'RJAN' && (
                                <>
                                  <div className="row section finding-header" />
                                  {masterCodes[MASTER_CODE.SAMPLE_REJECT_REASONS] && (
                                    <RejectForm
                                      className="section"
                                      rejectReasonLOV={masterCodes[MASTER_CODE.SAMPLE_REJECT_REASONS]}
                                      sample={{ ...sampleRejectionVO, sampleId }}
                                      onChange={(data) => isEditingSample && setFieldValue('sampleRejectionVO', data)}
                                      deleteLocally
                                      viewOnly={!isEditingSample}
                                    />
                                  )}
                                </>
                              )}
                              {values.identifyStatus !== 'RJAN' && (
                                <div>
                                  {values.sampleFindingsVOs &&
                                    values.sampleFindingsVOs.map((finding, fIndex) => {
                                      if (isEditingSample) {
                                        return (
                                          <EditableFindings
                                            key={`editable_findings_${finding.findingsId}_${fIndex + 1}`}
                                            barcodeId={sampleId}
                                            sampleId={sampleId}
                                            finding={values?.sampleFindingsVOs[fIndex]}
                                            index={fIndex}
                                            // isRemovable={this.isLocalFinding(finding.findingsId)}
                                            isRemovable
                                            onRemove={() =>
                                              setFieldValue(
                                                'sampleFindingsVOs',
                                                sampleFindingsVOs.filter((item, index) => fIndex !== index),
                                              )
                                            }
                                            isSubmitting={isSubmitting}
                                            setFieldValue={setFieldValue}
                                            masterCodes={masterCodes}
                                          />
                                        );
                                      }
                                      return <ReadOnlyFindings key={`readonly_finding_${finding.findingsId}_${fIndex + 1}`} finding={finding} index={fIndex} />;
                                    })}
                                  {isEditingSample && (
                                    <div className="d-flex justify-content-center">
                                      <button
                                        className="btn btn-sec marginBottom40 xs-marginBottom30"
                                        type="button"
                                        onClick={() => setFieldValue('sampleFindingsVOs', [...sampleFindingsVOs, emptyFinding(sampleId)])}>
                                        Add Findings
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Accordion>
                          </Form>
                        );
                      }}
                    </Formik>
                  );
                })}
            </div>
          ))}
      </div>
    );
  }
}

// export default AnalysisTab;

const mapStateToProps = ({ global, inspectionFormReducer }, ownProps) => ({
  ...ownProps,
  ...inspectionFormReducer,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  submitFindingAction,
  resetReducerAction,
  setHabitatGroupsAction,
  getMastercodeAction,
  toggleEditingSampleAction,
  changeSampleStatusAction,
  addFindingAction,
  removeFindingAction,
  clearSampleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisTab);
