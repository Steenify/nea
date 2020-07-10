import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import ValidationField from 'components/common/formik/validationField';

import { formikValidate } from 'utils';

import { WEB_ROUTES } from 'constants/index';
import { getAddressListInOpsAction, submitAddressListInOpsAction, searchAddressByPostalCodeAction } from './action';
import GoBackButton from 'components/ui/go-back-button';

const AddressListInOps = (props) => {
  const {
    getAddressListInOpsAction,
    submitAddressListInOpsAction,
    searchAddressByPostalCodeAction,
    history,
    location: { state },
    ui: { isLoading },
    data: { initialAddressList },
  } = props;

  const [existingAddressList, setExistingAddressList] = useState(initialAddressList);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS.name}`;
    if (!state?.id) {
      history.goBack();
    } else {
      getAddressListInOpsAction({ id: state?.id, opsId: state?.id }, (list) => {
        setExistingAddressList(list);
      });
    }
  }, [getAddressListInOpsAction, history, state]);

  const onSubmit = (values, actions) => {
    const list = [...values.sgAddressVOList, ...existingAddressList];
    const data = {
      id: values.id,
      saveMode: 'update',
      sgAddressList: list,
      sgAddressVOList: list,
    };

    submitAddressListInOpsAction(data, () => {
      toast.success('Addresses updated');
      actions.resetForm();
      actions.setSubmitting(false);
      actions.setErrors({});
      history.goBack();
    });
  };

  const validate = () => {
    const errors = {};
    const errorCount = 0;

    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} issues.`;
    }
    return errors;
  };

  const initialValues = {
    ...state,
    sgAddressVOList: [],
  };

  const onRemoveExistingPostalCode = (postalCode) => {
    setExistingAddressList(existingAddressList.filter((item) => item.postalCode !== postalCode));
    // const data = {
    //   id: state?.id,
    //   saveMode: 'delete',
    //   sgAddressVOList: [{ postalCode }],
    // };

    // submitAddressListInOpsAction(data, () => {
    //   toast.success('Postal Code removed');
    //   setExistingAddressList(existingAddressList.filter((item) => item.postalCode !== postalCode));
    // });
  };

  const onRemoveLocalPostalCode = (sgAddressVOList, postalCode, setFieldValue) => {
    setFieldValue(
      'sgAddressVOList',
      sgAddressVOList.filter((item) => item.postalCode !== postalCode),
    );
  };

  const isEditable = state?.isEditable;
  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.LANDING_PAGE, WEB_ROUTES.OPS_AREA.OPERATION_DETAIL, WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS]} />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ values, setFieldValue, dirty }) => {
              const newAddressList = values.sgAddressVOList;
              return (
                <Form onKeyDown={onKeyDown}>
                  <PromptOnLeave dirty={dirty} />
                  <GoBackButton onClick={() => history.goBack()} title={WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS.name}>
                    {isEditable && (values.sgAddressVOList.length > 0 || initialAddressList.length > existingAddressList.length) && (
                      <button type="submit" className="btn btn-pri ml-auto">
                        Confirm
                      </button>
                    )}
                  </GoBackButton>
                  <div className="tabsContainer">
                    <FormikSubmitErrorMessage />
                    <div className="row mb-3">
                      <div className="col">
                        <div className="tables__main">
                          <div className="tblCompo">
                            <table>
                              <thead>
                                <tr className="tbl-headings">
                                  <th align="left" valign="middle" className="col1">
                                    Postal Code
                                  </th>
                                  <th align="left" valign="middle" className="col2">
                                    Premises No.
                                  </th>
                                  <th align="left" valign="middle" className="col2">
                                    Road Name
                                  </th>
                                  <th align="left" valign="middle" className="col2">
                                    Building Name
                                  </th>
                                  <th align="left" valign="middle" className="col4" />
                                </tr>
                              </thead>
                              <tbody>
                                {existingAddressList.map((item) => (
                                  <tr key={`all_active_ops_${item.postalCode}`}>
                                    <td align="left" valign="middle">
                                      {item.postalCode}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.buildingNo}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.streetName}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.buildingName}
                                    </td>
                                    <td align="left" valign="middle">
                                      {isEditable && (
                                        <button type="button" className="close" aria-label="Close" onClick={() => onRemoveExistingPostalCode(item.postalCode)}>
                                          <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {values.sgAddressVOList.map((item) => (
                                  <tr key={`all_active_ops_${item.postalCode}`}>
                                    <td align="left" valign="middle">
                                      {item.postalCode}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.buildingNo}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.streetName}
                                    </td>
                                    <td align="left" valign="middle">
                                      {item.buildingName}
                                    </td>
                                    <td align="left" valign="middle">
                                      <button type="button" className="close" aria-label="Close" onClick={() => onRemoveLocalPostalCode(values.sgAddressVOList, item.postalCode, setFieldValue)}>
                                        <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {isEditable && (
                          <Formik
                            initialValues={{ postalCode: '' }}
                            enableReinitialize
                            validate={(values) => {
                              const errors = {};
                              const postalCodeError = formikValidate(values.postalCode, ['required', 'number']);
                              if (postalCodeError) {
                                errors.postalCode = postalCodeError;
                              }
                              return errors;
                            }}
                            onSubmit={(values, actions) => {
                              const postalcode = values.postalCode;
                              if (newAddressList.filter((item) => item.postalCode === postalcode).length === 0 && existingAddressList.filter((item) => item.postalCode === postalcode).length === 0) {
                                searchAddressByPostalCodeAction({ postalcode }, (address) => {
                                  setFieldValue('sgAddressVOList', [...newAddressList, address]);
                                  actions.resetForm();
                                });
                              } else {
                                toast.error('Postal Code already added');
                              }
                              actions.setSubmitting(false);
                              actions.setErrors({});
                            }}>
                            {() => (
                              <Form>
                                <div className="d-flex align-items-center m-2">
                                  <label className="m-2">Add Address with Postal Code</label>
                                  <div className="d-flex flex-column m-2">
                                    <ValidationField inputClassName="textfield wf-200" name="postalCode" placeholder="Postal Code" />
                                  </div>

                                  <button type="submit" className="btn btn-sec m-2">
                                    Add
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        )}
                      </div>
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

const mapStateToProps = ({ opsAreaReducers: { addressListInOps } }, ownProps) => ({
  ...ownProps,
  ...addressListInOps,
});

const mapDispatchToProps = {
  getAddressListInOpsAction,
  submitAddressListInOpsAction,
  searchAddressByPostalCodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddressListInOps));
