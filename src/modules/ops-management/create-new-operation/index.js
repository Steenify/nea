import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import ValidationField from 'components/common/formik/validationField';
import GoBackButton from 'components/ui/go-back-button';

import { WEB_ROUTES } from 'constants/index';

import { formikValidate } from 'utils';

import { createOpsAdhocAction, updateOpsAdhocAction, searchAddressByPostalCodeAction } from './action';

const CreateAdhocOperation = (props) => {
  const {
    createOpsAdhocAction,
    updateOpsAdhocAction,
    searchAddressByPostalCodeAction,
    history,
    ui: { isLoading },
    data: { opsCreationDate, userVO },
  } = props;

  const [newAddressList, setNewAddressList] = useState([]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.CREATE_OPERATION.name}`;
    createOpsAdhocAction({}, (_list) => {
      // setExistingAddressList(list);
    });
  }, [createOpsAdhocAction]);

  const onSubmit = () => {
    if (newAddressList.length === 0) {
      toast.error('Address is required');
      return;
    }
    const data = {
      opsPlanningOfficer: userVO?.soeId,
      opsCreationDate,
      sgAddressVOList: newAddressList,
      sgAddressList: newAddressList,
      opsType: 'Ad-hoc',
    };
    updateOpsAdhocAction(data, () => {
      history.push(WEB_ROUTES.OPS_AREA.LANDING_PAGE.url);
    });
  };

  const onRemoveLocalPostalCode = (postalCode) => {
    setNewAddressList(newAddressList.filter((item) => item.postalCode !== postalCode));
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.OPS_AREA.CREATE_OPERATION.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.CREATE_OPERATION]} />
          <GoBackButton onClick={() => history.replace(WEB_ROUTES.OPS_AREA.LANDING_PAGE.url)} title={WEB_ROUTES.OPS_AREA.CREATE_OPERATION.name}>
            <button type="button" className="btn btn-pri ml-auto" onClick={onSubmit}>
              Confirm
            </button>
          </GoBackButton>
          <div className="tabsContainer">
            <div className="row mb-3">
              <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                <div className="font-weight-bold">Operation Planning Officer</div>
              </div>
              <div className="col col-lg-5">{userVO?.fullName}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                <div className="font-weight-bold">Operation Creation Date</div>
              </div>
              <div className="col col-lg-5">{opsCreationDate}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                <div className="font-weight-bold text-right">List of Addresses in Operation</div>
              </div>
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
                        {newAddressList.map((item) => (
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
                              <button type="button" className="close" aria-label="Close" onClick={() => onRemoveLocalPostalCode(item.postalCode)}>
                                <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    if (newAddressList.filter((item) => item.postalCode === postalcode).length === 0) {
                      searchAddressByPostalCodeAction({ postalcode }, (address) => {
                        setNewAddressList([...newAddressList, address]);
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
              </div>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ opsAreaReducers: { createAdhocOperation } }, ownProps) => ({
  ...ownProps,
  ...createAdhocOperation,
});

const mapDispatchToProps = {
  createOpsAdhocAction,
  updateOpsAdhocAction,
  searchAddressByPostalCodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateAdhocOperation));
