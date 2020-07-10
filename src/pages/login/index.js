import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';

import { UserRoleByModuleAndRole } from 'constants/index';
import { storeData, storeObject, actionTryCatchCreator } from 'utils';
import { common } from 'assets';
import { updateUserRole, getAllFunctionsForRoleAction, resetGlobalReducerAction } from 'store/actions';

import './style.scss';
import InPageLoading from 'components/common/inPageLoading';
import Accordion from 'components/common/accordion';
import ValidationField from 'components/common/formik/validationField';

import { loginService } from 'services/ana';

import { encrypt } from 'utils/encryption';

const Login = (props) => {
  const { history, updateUserRoleAction, getAllFunctionsForRoleAction, resetGlobalReducerAction, loading } = props;
  const [stateLoading, setStateLoading] = useState();

  const onLoginSuccess = (token, comingFromLogin, frontEndName) => {
    storeData('token', token);
    resetGlobalReducerAction();
    storeData('comingFromLogin', comingFromLogin);
    getAllFunctionsForRoleAction((functionNameList, fullName) => {
      // TODO: remove after 6097
      const userRole = { name: frontEndName || fullName, token };
      storeObject('userRole', userRole);
      updateUserRoleAction(userRole);
      storeData('functionNameList', functionNameList);
      if (history) {
        history.push('/dashboard');
      }
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const token = event.target.getAttribute('token');
    const dataRole = event.target.getAttribute('data-role');
    onLoginSuccess(token, false, dataRole);
  };

  useEffect(() => {
    document.title = 'NEA | Login';
  }, []);

  const onSubmit = (values, actions) => {
    const onPending = () => setStateLoading(true);
    const onSuccess = (data) => {
      setStateLoading(false);
      onLoginSuccess(data.token, true);
      actions.resetForm();
    };
    const onError = () => setStateLoading(false);

    const params = {
      soeId: values.soeId,
      password: encrypt(values.password),
    };

    actionTryCatchCreator(loginService(params), onPending, onSuccess, onError);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};
    if (!values.soeId) {
      errors.soeId = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  return (
    <div className="loginBG">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="loginWrapper mb-5 mt-5">
              <div className="row">
                <div className="col-md-12 neaLogo">
                  <img src={common.logo} alt="logo" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 paddingTop10 paddingBottom10 bold-font">
                  <h3>Login to VCS2</h3>
                </div>
                {process.env.REACT_APP_BUILD !== 'uat' && (
                  <div className="col-md-12 paddingTop10 paddingBottom10 bold-font">
                    <Formik initialValues={{ soeId: '', password: '' }} validate={validate} onSubmit={onSubmit}>
                      {() => (
                        <Form>
                          <div className="d-flex align-items-center flex-column">
                            <div className="d-flex align-items-start flex-column">
                              <ValidationField type="text" inputClassName="textfield wf-300 mb-2" name="soeId" placeholder="SOE ID" />
                            </div>
                            <div className="d-flex align-items-start flex-column">
                              <ValidationField type="password" inputClassName="textfield wf-300 mb-2" name="password" placeholder="Password" />
                            </div>

                            <button type="submit" className="btn btn-pri">
                              Login
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                )}
              </div>
              <form>
                <div className="row">
                  <div className="col-12 paddingTop20">
                    {UserRoleByModuleAndRole.map((roleModule, index) => (
                      <div className="" key={`module_1_${index + 1}`}>
                        <Accordion isOpen={false} headerChildren={roleModule.name}>
                          <div className="modules">
                            {roleModule.roles.map((group) => (
                              <div key={`user_role_${group.name}`}>
                                <h3 className=" text-left ml-1 mt-2 mb-2">{group.name}</h3>
                                <div className="content d-flex flex-wrap align-items-center">
                                  {group.items.map((role) => (
                                    <button onClick={handleLogin} token={role.token} data-role={role.name} type="button" className="btn btn-pri mr-3 mb-2 mt-2 test" key={`user_role_${role.name}`}>
                                      Sign in {role.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <InPageLoading isLoading={loading || stateLoading} text="Logging In..." />
      </div>
    </div>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  userRole: global.ui.userRole,
  loading: global.ui.loading,
});

const mapDispatchToProps = {
  updateUserRoleAction: updateUserRole,
  getAllFunctionsForRoleAction,
  resetGlobalReducerAction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
