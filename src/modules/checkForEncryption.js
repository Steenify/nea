import React, { Component } from 'react';
import { Formik, Form } from 'formik';

import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import ValidationField from 'components/common/formik/validationField';

import { actionTryCatchCreator } from 'utils';
import { checkReportEncryptionService } from 'services/check-for-encryption';

class CheckForEncryptionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: { open: false, title: 'report' },
      isLoading: false,
      encryptionRequired: props.encryptionRequired || false,
    };

    this.passwordRef = React.createRef();
  }

  componentDidMount() {
    const { type } = this.props;
    if (type !== 'upload') {
      const { functionName } = this.props;
      const onPending = () => this.setState({ isLoading: true });
      const onSuccess = (data) => {
        this.setState({ isLoading: false, encryptionRequired: data?.encryptionRequired });
      };
      const onError = () => this.setState({ isLoading: false });
      actionTryCatchCreator(checkReportEncryptionService({ functionName }), onPending, onSuccess, onError);
    }
  }

  showPasswordModal = (title = 'report') => {
    const { encryptionRequired } = this.state;
    const { onGenerate, encryptionRequired: propCheck } = this.props;
    if (encryptionRequired || propCheck) {
      this.setState({ modalState: { open: true, title } });
    } else {
      onGenerate(undefined);
    }
  };

  render() {
    const { modalState, isLoading } = this.state;
    const { onGenerate, type } = this.props;

    const validate = (values) => {
      if (!values.password) {
        return { password: 'Required' };
      }
      return {};
    };

    const onSubmitPassword = async (values, actions) => {
      // eslint-disable-next-line no-unused-expressions
      this.passwordRef.current?.blur?.();
      actions.setFieldTouched('password', false);
      try {
        await onGenerate?.(values.password);
        // console.log('CheckForEncryptionComponent -> onSubmitPassword -> result', result);
        this.setState({ modalState: { open: false } });
        actions.resetForm();
      } catch (error) {
        // console.log('CheckForEncryptionComponent -> onSubmitPassword -> error', error);
        // this.setState({ modalState: { open: false } });
      }
      actions.setSubmitting(false);
      actions.setErrors({});
    };

    return (
      <>
        <Formik enableReinitialize initialValues={{ password: '' }} validate={validate} onSubmit={onSubmitPassword}>
          {({ submitForm, resetForm }) => (
            <CustomModal
              headerTitle={`Password for ${type === 'upload' ? 'file(s)' : 'report'}`}
              confirmTitle={type === 'upload' ? 'Confirm' : 'Generate'}
              cancelTitle="Cancel"
              isOpen={modalState.open}
              onConfirm={() => submitForm()}
              onCancel={() => {
                resetForm();
                this.setState({ modalState: { open: false } });
              }}
              type="action-modal"
              className="modal-sm"
              content={
                <Form>
                  <div className="row">
                    <div className="col-lg-12">
                      <ValidationField noDebounce name="password" type="password" inputClassName="textfield form-control" innerRef={this.passwordRef} />
                    </div>
                  </div>
                </Form>
              }
            />
          )}
        </Formik>

        <InPageLoading isLoading={isLoading} />
      </>
    );
  }
}

export default CheckForEncryptionComponent;
