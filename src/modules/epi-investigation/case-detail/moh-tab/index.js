import React from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';
import ValidationField from 'components/common/formik/validationField';

import { MASTER_CODE } from 'store/actions';
// import { initialAttemptValue } from '../helper';

const MOH = (props) => {
  const {
    masterCodes,
    formik: {
      values,
      // setFieldValue
    },
  } = props;
  const recommendationLOV = masterCodes[MASTER_CODE.RECOMMENDATION_ON_CASE_STATUS];
  // const attemptList = values?.attemptList || [];
  // const contactBy = values?.name || '';
  const neaRecommendStatus = values?.neaRecommendStatus || '';
  const showRemark = neaRecommendStatus.includes('R');

  return (
    <>
      <div className="tab-pane__group bg-white">
        {/* <p className="tab-pane__title text-white">Task Status</p> */}
        <div className="card">
          <div className="card-body">
            <div className="row paddingBottom20">
              <div className="col-12 font-weight-bold paddingBottom10">NEA's Recommendation on Case Status</div>
              <div className="col-12">
                <ValidationField name="neaRecommendStatus" inputComponent="react-select" selectClassName="d-inline-block wf-400" placeholder="Status" options={recommendationLOV} hideError />
              </div>
            </div>
            {showRemark && (
              <div className="row paddingBottom20">
                <div className="col-12 font-weight-bold">Rationale for Recommendation</div>
                <div className="col-md-9 col-lg-6">
                  <ValidationField name="neaRecommendRemarks" inputComponent="textarea" rows={5} />
                </div>
              </div>
            )}
            <div className="row paddingBottom20">
              <div className="col-12 font-weight-bold">Query from NEA</div>
              <div className="col-md-9 col-lg-6">
                <ValidationField name="neaQuery" inputComponent="textarea" rows={5} />
              </div>
            </div>
            <div className="row paddingBottom20">
              <div className="col-md-3 col-lg-2 font-weight-bold">MOH Officer Name</div>
              <div className="col-md-9 col-lg-6">
                <p className="col-form-label">{values.mohOfficer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(MOH));
