import React from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import moment from 'moment';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import uuid from 'uuid/v4';
import { initialAttemptValue } from '../helper';

const CaseOverview = (props) => {
  const {
    masterCodes,
    formik: { values, setFieldValue },
  } = props;
  const relationLOV = masterCodes[MASTER_CODE.RELATION];
  const contactModeLOV = masterCodes[MASTER_CODE.CONTACT_MODE_DURING_ATTEMPS];
  const contactOutcomeLOV = masterCodes[MASTER_CODE.CONTACT_OUTCOME_DURING_ATTEMPS];
  const statusLOV = masterCodes[MASTER_CODE.EPI_STATUS];
  const personalContactLOV = masterCodes[MASTER_CODE.PERSONAL_CONTACT];
  const attemptList = values?.attemptList || [];
  // const contactBy = values?.name || '';

  const removeAttempt = (index) => {
    attemptList.splice(index, 1);
    setFieldValue('attemptList', attemptList, true);
  };

  const addAttempt = () => {
    setFieldValue('attemptList', [...attemptList, { ...initialAttemptValue, id: uuid() }], true);
  };

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-white">Task Status</p>
        <div className="card">
          <div className="card-body">
            <div className="row paddingBottom10">
              <div className="col-md-3 col-lg-2 font-weight-bold">Task Status</div>
              <div className="col-md-9 col-lg-10">
                <ValidationField name="status" inputComponent="react-select" selectClassName="d-inline-block wf-200" placeholder="Please select" options={statusLOV} hideError />
              </div>
            </div>
            <div className="row paddingBottom10">
              <div className="col-md-3 col-lg-2 font-weight-bold">Remarks (Optional)</div>
              <div className="col-md-9 col-lg-6">
                <ValidationField name="remarks" inputComponent="textarea" rows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Attempt History</p>
        <div className="card">
          <div className="card-body">
            {attemptList.map((attempt, index) => (
              <div key={`attempt_table_row_${attempt.id}_${index + 1}`}>
                <div className="row mb-3">
                  <div className="col-1 font-weight-bold d-flex align-items-center">{index + 1}.</div>
                  <div className="col-10">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Date Contacted</p>

                          <ValidationField
                            minDate={moment().add(2, 'days')}
                            name={`attemptList[${index}].contactDate`}
                            placeholder="DD/MM/YYYY"
                            inputComponent="singleDatePickerV2"
                            inputClassName="d-contents"
                            hideError
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Via</p>
                          <ValidationField name={`attemptList[${index}].contactMode`} inputComponent="react-select" placeholder="Please select" options={contactModeLOV} hideError />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Officer</p>
                          <input className="textfield form-control" readOnly value={attempt.contactBy}></input>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Outcome</p>
                          <ValidationField name={`attemptList[${index}].contactOutcome`} inputComponent="react-select" placeholder="Please select" options={contactOutcomeLOV} hideError />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="mb-2">
                          <p className="col-form-label font-weight-bold">Person Contacted (optional)</p>
                          <ValidationField name={`attemptList[${index}].contactPerson`} inputComponent="react-select" placeholder="Please select" options={personalContactLOV} hideError />
                          {/* <ValidationField name={`attemptList[${index}].contactPerson`} inputClassName="textfield" hideError /> */}
                        </div>
                      </div>
                      {Formik.getIn(values, `attemptList[${index}].contactPerson`) === 'NC' && (
                        <div className="col-md-6 col-lg-4">
                          <div className="mb-2">
                            <p className="col-form-label font-weight-bold ">Association (optional)</p>
                            <ValidationField name={`attemptList[${index}].relation`} inputComponent="react-select" placeholder="Please select" options={relationLOV} hideError />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-1 d-flex align-items-center">
                    <CloseIcon className="cursor-pointer" onClick={() => removeAttempt(index)} />
                  </div>
                </div>
                <hr />
              </div>
            ))}
            {attemptList.length < 9 && <AddButton title="Add New Row" onClick={addAttempt} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(CaseOverview));
