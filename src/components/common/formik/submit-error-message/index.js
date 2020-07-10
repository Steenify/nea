import React, { useState } from 'react';
import { connect } from 'formik';
import OnFormikSubmitValidationError from 'components/common/formik/on-submit-error-handler';

import { ReactComponent as WarningIcon } from 'assets/svg/warning.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';

import './style.scss';

const FormikSubmitErrorMessage = (props) => {
  const { formik } = props;
  const { errors: validationErrors } = formik;
  const [showError, setShowError] = useState(false);

  if (!validationErrors.errorCount && showError) {
    setShowError(false);
  }

  return (
    <>
      <OnFormikSubmitValidationError
        callback={({ errors }) => {
          if (errors.errorCount) {
            setShowError(true);
          }
        }}
      />
      {showError && (
        <div className="submit-error-message">
          <div className="d-flex align-items-center">
            <WarningIcon className="warning-icon" width={45} height={45} />
          </div>

          <div className="d-flex align-items-center">
            <div className="m-2">
              <div className="font-weight-bold">Error:</div>
              <span>{validationErrors.errorHint}</span>
            </div>
          </div>
          <div className="d-flex align-items-center ml-auto">
            <span className="cursor-pointer" onClick={() => setShowError(false)}>
              <CloseIcon width={36} height={36} />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(FormikSubmitErrorMessage);
