import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import _ from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import SearchableCheckList from 'components/common/searchable-check-list';
import { WEB_ROUTES } from 'constants/index';

import { updateAction, getNonAssignedFunctionsAction, getAssignedFunctionsAction, defaultAddValue } from './action';

const RoleFunctionMappingDetail = (props) => {
  const {
    updateAction,
    getNonAssignedFunctionsAction,
    getAssignedFunctionsAction,
    location: { state },
    history,
    ui: { isLoading },
    // data,
  } = props;

  const [assignedFunctions, setAssignedFunctions] = useState([]);
  const [selectedAssignedFunction, setSelectedAssignedFunction] = useState([]);
  const [nonAssignedFunctions, setNonAssignedFunctions] = useState([]);
  const [selectedNonAssignedFunction, setSelectedNonAssignedFunction] = useState([]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING_DETAIL.name}`;

    if (!state?.detail) {
      history.replace(WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING.url);
    } else {
      getNonAssignedFunctionsAction({ role: state?.detail.roleName }, setNonAssignedFunctions);
      getAssignedFunctionsAction({ role: state?.detail.roleName }, setAssignedFunctions);
    }
  }, [state, getNonAssignedFunctionsAction, getAssignedFunctionsAction, history]);

  const addFunction = () => {
    if (selectedNonAssignedFunction.length > 0) {
      setAssignedFunctions((functions) => [...functions, ...selectedNonAssignedFunction]);
      setNonAssignedFunctions((functions) => functions.filter((item) => !selectedNonAssignedFunction.map((f) => f.value).includes(item.value)));
      setSelectedNonAssignedFunction([]);
    }
  };

  const addAllFunction = () => {
    setAssignedFunctions((functions) => [...functions, ...nonAssignedFunctions]);
    setNonAssignedFunctions([]);
  };

  const removeFunction = () => {
    if (selectedAssignedFunction.length > 0) {
      setNonAssignedFunctions((functions) => [...functions, ...selectedAssignedFunction]);
      setAssignedFunctions((functions) => functions.filter((item) => !selectedAssignedFunction.map((f) => f.value).includes(item.value)));
      setSelectedAssignedFunction([]);
    }
  };

  const removeAllFunction = () => {
    setNonAssignedFunctions((functions) => [...functions, ...assignedFunctions]);
    setAssignedFunctions([]);
  };

  const onSubmit = (values, actions) => {
    values.functionList = assignedFunctions.map((item) => item.value);
    values.role = values.roleName;
    updateAction(values).then(() => {
      actions.resetForm();
      toast.success('Success');
      history.goBack();
    });
    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = () => {
    const errors = {};
    const errorCount = 0;
    // if (!values.roleName) {
    //   errors.roleName = '(Required)';
    //   errorCount += 1;
    // }
    // if (!values.roleDescription) {
    //   errors.roleDescription = '(Required)';
    //   errorCount += 1;
    // }
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} issues.`;
    }
    return errors;
  };

  let initialValues = defaultAddValue();

  if (state?.detail) {
    initialValues = _.merge({}, defaultAddValue(), state?.detail);
  }

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb
            page={[WEB_ROUTES.AUTHENTICATION_AUTHORISATION, WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING, WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING_DETAIL]}
          />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ values, dirty }) => {
              return (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <div className="go-back d-flex align-items-center">
                    <span onClick={() => history.goBack()}>{WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING_DETAIL.name}</span>
                  </div>
                  <div className="tabsContainer">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Role Name</div>
                          </div>
                          <div className="col col-lg-5">
                            {/* <ValidationField name="roleName" inputClassName="textfield " hideError disabled /> */}
                            <div>{values.roleName}</div>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Role Description</div>
                          </div>
                          <div className="col col-lg-5">
                            {/* <ValidationField name="roleDescription" inputClassName="textfield " hideError disabled /> */}
                            <div>{values.roleDescription}</div>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                            <div className="font-weight-bold">Remarks</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField inputComponent="textarea" name="remarks" rows={5} hideError />
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-lg-8 col-12 offset-lg-2 row">
                            <div className="col-lg-5 mb-3">
                              <SearchableCheckList
                                title="Functions"
                                options={nonAssignedFunctions.sort((a, b) => a.value > b.value)}
                                placeholder="Search"
                                onChange={(list) => setSelectedNonAssignedFunction(list)}
                              />
                            </div>
                            <div className="col-lg-2 d-flex align-items-center flex-column justify-content-center">
                              <button type="button" className="btn btn-sec mb-3" onClick={addFunction}>
                                {'Add >'}
                              </button>
                              <button type="button" className="btn btn-sec mb-3" onClick={removeFunction}>
                                {'< Remove'}
                              </button>
                              <button type="button" className="btn btn-sec mb-3" onClick={addAllFunction}>
                                {'Add All >'}
                              </button>
                              <button type="button" className="btn btn-sec mb-3" onClick={removeAllFunction}>
                                {'< Remove All'}
                              </button>
                            </div>
                            <div className="col-lg-5">
                              <SearchableCheckList
                                title="Assigned Functions"
                                options={assignedFunctions.sort((a, b) => a.value > b.value)}
                                placeholder="Search"
                                onChange={(list) => setSelectedAssignedFunction(list)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormikSubmitErrorMessage />
                    <div className="text-center mb-5">
                      <button type="button" className="btn btn-sec m-1" onClick={() => history.goBack()}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-pri m-1">
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { roleFunctionMappingDetail } }, ownProps) => ({
  ...ownProps,
  ...roleFunctionMappingDetail,
});

const mapDispatchToProps = {
  updateAction,
  getAssignedFunctionsAction,
  getNonAssignedFunctionsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoleFunctionMappingDetail));
