import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { retrieveAddressService } from 'services/administration-configuration/address';
import ValidationField from 'components/common/formik/validationField';
import { actionTryCatchCreator } from 'utils';

const PremisesAddressBlock = (props) => {
  const { masterCodes, getMastercodeAction, fieldNamePrefix, viewOnly, formik, labelColWidth = 4, hidePremise, showBlock } = props;

  useEffect(() => {
    if (!masterCodes[MASTER_CODE.PREMISES_TYPE]) {
      getMastercodeAction([MASTER_CODE.PREMISES_TYPE]);
    }
  }, [getMastercodeAction, masterCodes]);

  const prefix = fieldNamePrefix ? `${fieldNamePrefix}.` : '';
  const premisesTypeLOV = masterCodes[MASTER_CODE.PREMISES_TYPE] || [];

  const onRetrieveAddress = () => {
    const postalCode = Formik.getIn(formik.values, 'postalCode');
    if (postalCode) {
      const onSuccess = (res) => {
        const addresses = res?.sgAddressVOList || [];
        const data = addresses[0] || {};
        const { buildingName = '', buildingNo = '', streetName = '' } = data;
        formik.setFieldValue('blockHouseNo', buildingNo, true);
        formik.setFieldValue('buildingName', buildingName, true);
        formik.setFieldValue('streetName', streetName, true);
        formik.setFieldValue('floorNo', '', true);
        formik.setFieldValue('unitNo', '', true);
      };
      actionTryCatchCreator(retrieveAddressService({ postalCode }), undefined, onSuccess);
    }
  };

  return (
    <>
      {!hidePremise && (
        <div className="row">
          <div className="col-lg-6">
            <div className="row mb-3">
              <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Premises Type</div>
              <div className="col">
                {viewOnly ? (
                  <div className="">{premisesTypeLOV.find((lov) => lov.value === Formik.getIn(formik.values, 'premiseType'))?.label}</div>
                ) : (
                  <ValidationField name={`${prefix}premiseType`} inputComponent="react-select" placeholder="Premises Type" options={premisesTypeLOV} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Postal Code</div>
            <div className="col d-flex">
              {viewOnly ? (
                <div className="">{Formik.getIn(formik.values, 'postalCode')}</div>
              ) : (
                <>
                  <div>
                    <ValidationField name={`${prefix}postalCode`} inputClassName="textfield wf-200" />
                  </div>
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sec small ml-3" onClick={onRetrieveAddress}>
                      Retrieve Address
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Road Name</div>
            <div className="col">{viewOnly ? <div className="">{Formik.getIn(formik.values, 'streetName')}</div> : <ValidationField name={`${prefix}streetName`} inputClassName="textfield" />}</div>
          </div>
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Building Name</div>
            <div className="col">
              {viewOnly ? <div className="">{Formik.getIn(formik.values, 'buildingName')}</div> : <ValidationField name={`${prefix}buildingName`} inputClassName="textfield" />}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>{showBlock ? 'Block No.' : 'Premise No.'}</div>
            <div className="col">
              {viewOnly ? <div className="">{Formik.getIn(formik.values, 'blockHouseNo')}</div> : <ValidationField name={`${prefix}blockHouseNo`} inputClassName="textfield wf-200" />}
            </div>
          </div>
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Level</div>
            <div className="col">{viewOnly ? <div className="">{Formik.getIn(formik.values, 'floorNo')}</div> : <ValidationField name={`${prefix}floorNo`} inputClassName="textfield wf-200" />}</div>
          </div>
          <div className="row mb-3">
            <div className={`col-${labelColWidth} d-flex align-items-center font-weight-bold`}>Unit No.</div>
            <div className="col">{viewOnly ? <div className="">{Formik.getIn(formik.values, 'unitNo')}</div> : <ValidationField name={`${prefix}unitNo`} inputClassName="textfield wf-200" />}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(PremisesAddressBlock));
