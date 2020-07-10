import React from 'react';
import { withRouter } from 'react-router-dom';
import ValidationField from 'components/common/formik/validationField';

const ShowCauseRecommendation = (props) => {
  const { showCause, action } = props;

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-white">TL's Recommendation to Show Cause</p>
        <div className="card">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-lg-4 col-md-12">
                <div className="row">
                  <div className="col-12 mb-2 font-weight-bold">Lapses observed in number of burrows</div>
                  <div className="row col-12 mb-2">
                    <div className="col-8">Contractor Findings</div>
                    <div className="col-4">{showCause?.noOfBurrowsContractor}</div>
                  </div>
                  <div className="row col-12 mb-2">
                    <div className="col-8">Audit</div>
                    <div className="col-4">{showCause?.noOfBurrowsAudit}</div>
                  </div>
                  <div className="col-8 border-bottom mb-2 ml-3" />
                  <div className="row col-12 mb-2">
                    <div className="col-8 font-weight-bold">Discrepancies</div>
                    <div className="col-4 font-weight-bold">{showCause?.discrepancies}</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="row">
                  <div className="col-12 mb-2 font-weight-bold">Show Cause?</div>
                  <div className="col-12">
                    {action === 'submit' ? (
                      <>
                        <div className="d-flex">
                          <div className="custom-radio">
                            <ValidationField type="radio" id="isShowCause_yes" name="isShowCause" value hideError />
                            <label className="form-label" htmlFor="isShowCause_yes">
                              Yes
                            </label>
                          </div>
                          <div className="custom-radio ml-5">
                            <ValidationField type="radio" id="isShowCause_no" name="isShowCause" value={false} hideError />
                            <label className="form-label" htmlFor={`isShowCause_no`}>
                              No
                            </label>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>{showCause?.showCause ? 'Yes' : 'No'}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 font-weight-bold">Remarks</div>
              <div className="col-md-12 col-lg-6">
                {action === 'submit' ? <ValidationField inputComponent="textarea" name="showcauseRemarks" placeholder="Remarks" rows={3} /> : showCause?.showCauseRemarks}
              </div>
            </div>
          </div>
        </div>
      </div>
      {((showCause?.managerShowCause !== null && showCause?.managerShowCause !== undefined) || action === 'approve') && (
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Manager's Recommendation to Show Cause</p>
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3 mb-2 font-weight-bold">Show Cause?</div>
                <div className="col-md-3">
                  {action === 'approve' ? (
                    <>
                      <div className="d-flex">
                        <div className="custom-radio">
                          <ValidationField type="radio" id="managerShowCause_yes" name="managerShowCause" value hideError />
                          <label className="form-label" htmlFor="managerShowCause_yes">
                            Yes
                          </label>
                        </div>
                        <div className="custom-radio ml-5">
                          <ValidationField type="radio" id="managerShowCause_no" name="managerShowCause" value={false} hideError />
                          <label className="form-label" htmlFor="managerShowCause_no">
                            No
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>{showCause?.managerShowCause ? 'Yes' : 'No'}</>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Remarks {action === 'approve' && '(*)'}</div>
                <div className="col-md-12 col-lg-6">
                  {action === 'approve' ? <ValidationField inputComponent="textarea" name="managerShowCauseRemarks" placeholder="Remarks" rows={3} /> : showCause?.managerShowCauseRemarks}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(ShowCauseRecommendation);
