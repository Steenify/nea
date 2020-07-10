import React from 'react';

import './style.scss';
import * as Formik from 'formik';
import { connect } from 'react-redux';
import ValidationField from 'components/common/formik/validationField';
import { FUNCTION_NAMES } from 'constants/index';
import { boolOptions } from '../helper';

const ShowCause = ({
  formik: {
    values: { showcause = '', showcauseRemarks = '', managerShowcauseRemarks = '', managerShowCause = '' },
    setFieldValue,
  },
  isFinal = false,
  isEditable = false,
  isManager = false,
}) => {
  const firstTitle = isManager ? "Manager's Recommendation to Show Cause" : "Team Leader's Recommendation to Show Cause";
  const TLDisplay = ({ title = '' }) =>
    showcause !== '' ? (
      <div className="tab-pane__group bg-white ">
        <p className="tab-pane__title text-white">{title}</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Recommend to show cause</div>
                  <div className="trapinfo__value">{showcause ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Remarks</div>
                  <div className="trapinfo__value">{showcauseRemarks}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  const TLEditable = ({ title = '' }) => (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">{title}</p>
      <div className="card">
        <div className="card-body">
          <div className="row marginBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold align-self-center">Recommend to show cause</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField
                name="showcause"
                inputComponent="react-select"
                selectClassName="wf-200"
                placeholder=""
                options={boolOptions}
                isClearable={false}
                onChange={(value) => {
                  if (value) {
                    setFieldValue('showcause', true, true);
                  } else {
                    setFieldValue('showcause', false, true);
                  }
                }}
                hideError
              />
            </div>
          </div>

          <div className="row marginBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField name="showcauseRemarks" inputComponent="textarea" rows={5} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const ManagerDisplay = () =>
    managerShowCause !== '' ? (
      <div className="tab-pane__group bg-white ">
        <p className="tab-pane__title text-white">Manager's Recommendation to Show Cause</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Recommend to show cause</div>
                  <div className="trapinfo__value">{managerShowCause ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="trapinfo__row">
                  <div className="trapinfo__label1">Remarks</div>
                  <div className="trapinfo__value">{managerShowcauseRemarks}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  const ManagerEditable = () => (
    <div className="tab-pane__group bg-white ">
      <p className="tab-pane__title text-white">Manager's Recommendation to Show Cause</p>
      <div className="card">
        <div className="card-body">
          <div className="row marginBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold align-self-center">Recommend to show cause</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField
                name="managerShowCause"
                inputComponent="react-select"
                selectClassName="wf-200"
                placeholder=""
                options={boolOptions}
                isClearable={false}
                onChange={(value) => {
                  if (value) {
                    setFieldValue('managerShowCause', true, true);
                  } else {
                    setFieldValue('managerShowCause', false, true);
                  }
                }}
                hideError
              />
            </div>
          </div>

          <div className="row marginBottom30">
            <div className="col-md-3 col-lg-2 font-weight-bold">Remarks</div>
            <div className="col-md-9 col-lg-10">
              <ValidationField name="managerShowcauseRemarks" inputComponent="textarea" rows={5} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isManager ? (
    <>
      {isFinal ? (
        <>
          <TLDisplay title="Team Leader's Recommendation to Show Cause" />
          {isEditable ? <ManagerEditable /> : <ManagerDisplay />}
        </>
      ) : isEditable ? (
        <ManagerEditable title={firstTitle} />
      ) : (
        <ManagerDisplay title={firstTitle} />
      )}
    </>
  ) : (
    <>{isEditable ? <TLEditable title={firstTitle} /> : <TLDisplay title={firstTitle} />}</>
  );
};

const SC = Formik.connect(ShowCause);

const mapStateToProps = ({ global }) => {
  const functionNames = global?.data?.functionNameList || [];
  const isManager = functionNames.includes(FUNCTION_NAMES.updateShowcauseResubmission) || functionNames.includes(FUNCTION_NAMES.getPendingSupportWorkspaceListing);
  return { isManager };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SC);
