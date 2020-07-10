import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form, FieldArray } from 'formik';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import DataTable from 'components/common/data-table';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import GoBackButton from 'components/ui/go-back-button';

import { generateAction, confirmAction, previousYearAction } from './action';

const EWeekGeneration = (props) => {
  const {
    generateAction,
    confirmAction,
    previousYearAction,
    history,
    ui: { isLoading, isGenerated },
    data: { eweekVoList, previousYear },
  } = props;

  const [params, setParams] = useState(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.EWEEK_GENERATE.name}`;
    previousYearAction();
  }, [previousYearAction]);

  const onSubmit = (values, actions) => {
    generateAction(values);
    setParams(values);
    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};
    let errorCount = 0;

    if (!values.year) {
      errorCount += 1;
      errors.year = '(Required)';
    }
    if (!values.week) {
      errorCount += 1;
      errors.week = '(Required)';
    } else {
      if (values.week === 52 && values.monthList.length < 4) {
        errorCount += 1;
        errors.errorHint = 'If No. of eweeks is 52, 4 months should be selected';
      }
      if (values.week === 53 && values.monthList.length < 5) {
        errorCount += 1;
        errors.errorHint = 'If No. of eweeks is 53, 5 months should be selected';
      }
    }

    if (errorCount) {
      errors.errorCount = errorCount;
      // errors.errorHint = `There are ${errorCount} issues.`;
    }
    return errors;
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const initialValues = { year: previousYear, week: 52, monthList: [] };

  const columns = [
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'EWeek No',
      accessor: 'week',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Start Date',
      accessor: 'startDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.sm,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.EWEEK.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.EWEEK, WEB_ROUTES.ADMINISTRATION.EWEEK_GENERATE]} />
          <GoBackButton onClick={() => history.goBack()} title={WEB_ROUTES.ADMINISTRATION.EWEEK_GENERATE.name} />
          {!isGenerated && (
            <Formik enableReinitialize initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
              {({ values }) => {
                const monthList = values.monthList || [];
                return (
                  <>
                    <div className="paddingBottom50 tabsContainer">
                      <div>
                        <Form>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="row mb-3">
                                <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                                  <div className="font-weight-bold">Year</div>
                                </div>
                                <div className="col col-lg-5">
                                  <ValidationField name="year" inputClassName="textfield " hideError disabled />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                                  <div className="font-weight-bold">No. of Weeek</div>
                                </div>
                                <div className="col col-lg-5">
                                  <label className="custom-radio paddingBottom5 mr-2">
                                    <ValidationField type="radio" id="week52" name="week" value={52} hideError />
                                    <label className="form-label" htmlFor="week52">
                                      52
                                    </label>
                                  </label>
                                  <label className="custom-radio paddingBottom5">
                                    <ValidationField type="radio" id="week53" name="week" value={53} hideError />
                                    <label className="form-label" htmlFor="week53">
                                      53
                                    </label>
                                  </label>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                                  <div className="font-weight-bold">Choose the month with 5 eweeks</div>
                                </div>
                                <div className="col col-lg-5">
                                  <FieldArray
                                    name="monthList"
                                    render={(arrayHelpers) => (
                                      <>
                                        {months.map((item) => (
                                          <div className="nea-chkbx form-group" key={`eweek_month_${item}`}>
                                            <label className="custom-chckbbox text-blue">
                                              {item}
                                              <input
                                                className={`form-control ${monthList.includes(item) && 'checked'}`}
                                                name="month"
                                                type="checkbox"
                                                value={item}
                                                checked={monthList.includes(item)}
                                                onChange={(e) => {
                                                  if (e.target.checked) arrayHelpers.push(item);
                                                  else {
                                                    const idx = monthList.indexOf(item);
                                                    arrayHelpers.remove(idx);
                                                  }
                                                }}
                                              />
                                              <span className="checkmark" />
                                            </label>
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <SubmitErrorMessage />
                          <div className="text-center mb-4">
                            <button type="submit" className="btn btn-pri m-2" disabled={!previousYear}>
                              Generate
                            </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </>
                );
              }}
            </Formik>
          )}
          {isGenerated && (
            <div className="paddingBottom50 tabsContainer">
              <div className="text-right mb-4">
                <button
                  type="button"
                  className="btn btn-pri m-2"
                  onClick={() =>
                    confirmAction(params, () => {
                      toast.success('eWeek generated.');
                      history.goBack();
                    })
                  }>
                  Confirm
                </button>
              </div>
              <DataTable data={eweekVoList} columns={columns} showListHidden pageSize={eweekVoList.length} />
            </div>
          )}
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { eWeekMaintenance } }, ownProps) => ({
  ...ownProps,
  ...eWeekMaintenance,
});

const mapDispatchToProps = {
  generateAction,
  confirmAction,
  previousYearAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EWeekGeneration));
