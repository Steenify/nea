import React from 'react';

import SpecimenStage from '../specimen-stage';

class ReadOnlyFindings extends React.PureComponent {
  render() {
    const { finding, index, isShowEdit, onPressEdit } = this.props;
    const {
      // findingsId,
      findingStatus,
      specimenName,
      speciesName,
      vectorOfDisease,
      sampleTreatment,
      purpose,
      researcherName,
      // specimenStage,
      specimenType,
      remarks,
    } = finding;
    const fieldName = `sampleFindingsVOs[${index}]`;
    return (
      <div>
        <div className="row section finding-header">
          <div className="col-6 d-flex flex-column justify-content-center">
            <div className="d-flex row">
              <div className="col-md-4 col-xl-3">
                <h3 className="font-weight-bold">Findings {index + 1}</h3>
              </div>
              <div className="col-md-8 col-xl-9">
                <h3>{findingStatus}</h3>
              </div>
            </div>
          </div>
          {isShowEdit && (
            <div className="col-6">
              <div className="nea-btn-group">
                <small className="mr-3 body2" style={{ alignSelf: 'center' }}>
                  Save as at <span>01/02/2019 18:00</span>
                </small>
                <button type="button" className="btn btn-sec" onClick={onPressEdit && onPressEdit}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="row section">
          <div className="col-lg-4">
            <div className="label-group details-info">
              <label className="small-grey-text mb-0">Specimen</label>
              <p className="col-form-label font-weight-bold mb-0">{specimenName}</p>
            </div>
            {specimenName === 'Rodent' && (
              <div className="label-group details-info">
                <label className="small-grey-text mb-0">Specimen Type</label>
                <p className="col-form-label font-weight-bold mb-0">{specimenType}</p>
              </div>
            )}
            {specimenName !== 'Rodent' && (
              <div className="label-group details-info mb-0">
                <label className="small-grey-text mb-0">Specimen Stage</label>
                <div className="col-form-label font-weight-bold mb-0">
                  {/* {this.renderSpecimenStage(finding)} */}
                  <SpecimenStage
                    finding={finding}
                    specimenStageLOV={finding.specimenStage}
                    fieldName={fieldName}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-8">
            <div className="row details-info">
              <div className="col-12 col-md-6">
                <div className="label-group details-info">
                  <label className="small-grey-text mb-0">Species</label>
                  <p className="col-form-label font-weight-bold font-italic mb-0">{speciesName}</p>
                </div>
                <div className="label-group details-info">
                  <label className="small-grey-text mb-0">Vector of Disease</label>
                  <p className="col-form-label font-weight-bold font-italic mb-0">{vectorOfDisease}</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="label-group details-info">
                  <label className="small-grey-text mb-0">Sample Treatment</label>
                  <p className="col-form-label font-weight-bold mb-0">{sampleTreatment}</p>
                </div>
                {sampleTreatment === 'Research' && (
                  <>
                    <div className="label-group details-info">
                      <label className="small-grey-text mb-0">Purpose</label>
                      <p className="col-form-label font-weight-bold mb-0">{purpose}</p>
                    </div>
                    <div className="label-group details-info">
                      <label className="small-grey-text mb-0">Officer Name</label>
                      <p className="col-form-label font-weight-bold mb-0">{researcherName}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="label-group details-info">
                  <label className="small-grey-text mb-0">Remarks</label>
                  <p className="col-form-label font-weight-bold mb-0">{remarks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReadOnlyFindings;
