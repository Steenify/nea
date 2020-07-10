import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
// import queryString from 'query-string';
import { Formik, Form, getIn } from 'formik';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import CustomModal from 'components/common/modal';
import GoBackButton from 'components/ui/go-back-button';
import { retrieveAddressService } from 'services/administration-configuration/address';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { WEB_ROUTES } from 'constants/index';

import { getCaseDetailAction, retrieveAddressAction, caseSubmitAction, resetReducerAction } from './action';

import CaseOverview from './overview-tab';
import PersonalInfo from './personal-info-tab';
import MovementHistory from './movement-history-tab';
import MOHTab from './moh-tab';

import { validate } from './helper';

const CaseDetail = (props) => {
  const {
    getCaseDetailAction,
    getMastercodeAction,
    resetReducerAction,
    location: { search, state },
    history: { goBack },
    ui: { isLoading },
    data: { caseInfo },
    //
    masterCodes,
    retrieveAddressAction,
    caseSubmitAction,
  } = props;

  // const { editing } = queryString.parse(search, { parseBooleans: true });

  const [activeTab, setActiveTab] = useState('0');
  const [isDetailLoaded, setIsDetailLoaded] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [modal, setModal] = useState({ isShow: false, action: '', onConfirm: () => {} });
  const showMoh = state?.showMoh || false;
  const caseId = state?.caseId || '';
  const caseType = state?.caseType || '';
  // const clusterId = state?.clusterId || '';
  const menu = showMoh ? ['Overview', 'Personal Info', 'Movement History', 'MOH'] : ['Overview', 'Personal Info', 'Movement History'];

  useEffect(() => {
    getMastercodeAction(
      [
        MASTER_CODE.RELATION,
        MASTER_CODE.ID_TYPE,
        MASTER_CODE.CONTACT_MODE_DURING_ATTEMPS,
        MASTER_CODE.CONTACT_OUTCOME_DURING_ATTEMPS,
        MASTER_CODE.ETHNIC_TYPE,
        MASTER_CODE.COUNTRY,
        MASTER_CODE.GENDER,
        MASTER_CODE.OCCUPATION_TYPE,
        MASTER_CODE.RESIDENTIAL_TYPE,
        MASTER_CODE.PREMISES_TYPE,
        MASTER_CODE.RECOMMENDATION_ON_CASE_STATUS,
        MASTER_CODE.TRANSPORT_MODE,
        MASTER_CODE.DIVISION_CODE,
        MASTER_CODE.SYMPTOMS,
        MASTER_CODE.EPI_STATUS,
        MASTER_CODE.BUS_STOP,
        MASTER_CODE.MRT_STOP,
        MASTER_CODE.PERSONAL_CONTACT,
      ],
      [
        MASTER_CODE.RELATION,
        MASTER_CODE.ID_TYPE,
        MASTER_CODE.CONTACT_MODE_DURING_ATTEMPS,
        MASTER_CODE.CONTACT_OUTCOME_DURING_ATTEMPS,
        MASTER_CODE.ETHNIC_TYPE,
        MASTER_CODE.COUNTRY,
        MASTER_CODE.GENDER,
        MASTER_CODE.OCCUPATION_TYPE,
        MASTER_CODE.RESIDENTIAL_TYPE,
        MASTER_CODE.PREMISES_TYPE,
        MASTER_CODE.RECOMMENDATION_ON_CASE_STATUS,
        MASTER_CODE.TRANSPORT_MODE,
        MASTER_CODE.DIVISION_CODE,
        MASTER_CODE.SYMPTOMS,
        MASTER_CODE.EPI_STATUS,
        MASTER_CODE.BUS_STOP,
        MASTER_CODE.MRT_STOP,
        MASTER_CODE.PERSONAL_CONTACT,
      ],
    );
    if (caseId) {
      getCaseDetailAction({ caseId, caseType }).then(() => {
        setIsDetailLoaded(true);
      });
    }
    return resetReducerAction;
  }, [getCaseDetailAction, search, caseId, getMastercodeAction, caseType, resetReducerAction]);

  const mapResetId = (item) => {
    if (item.isNew === true) return { ...item, id: undefined, addressId: undefined };
    return item;
  };
  const onSubmit = (values, { resetForm, setSubmitting }) => {
    const params = {
      ...values,
      disease: caseType,
      attemptList: values.attemptList.map(mapResetId),
      resInfoList: values.resInfoList.map(mapResetId),
      localTravInfoList: values.localTravInfoList.map(mapResetId),
      overseaTravInfoList: values.overseaTravInfoList.map(mapResetId),
      clinicInfoList: values.clinicInfoList.map(mapResetId),
      symptomsList: values.symptomsTempList.map((symptomsCode) => values.symptomsList.find((s) => s.symptomsCode === symptomsCode) || { id: undefined, symptomsCode }),
      offInfoList: values.offInfoList.map((item) => {
        if (item.isNew === true) {
          return {
            ...item,
            id: undefined,
            addressId: undefined,
            officeWorkInfoList: item.officeWorkInfoList.map(mapResetId),
            officeTransportInfoList: item.officeTransportInfoList.map(mapResetId),
          };
        }
        return {
          ...item,
          officeWorkInfoList: item.officeWorkInfoList.map(mapResetId),
          officeTransportInfoList: item.officeTransportInfoList.map(mapResetId),
        };
      }),
    };
    caseSubmitAction(params, () => {
      const action = values.isSubmitButton ? 'Task submitted.' : 'Task saved.';
      toast.success(action);
      resetForm();
      goBack();
    });
    setSubmitting(false);
  };
  const tempList = caseInfo?.symptomsList || [];
  const symptomsTempList = tempList.map((item) => item?.symptomsCode || '');
  const statusLov = masterCodes[MASTER_CODE.EPI_STATUS] || [];
  const newStatus = statusLov.map(({ value }) => value).includes(caseInfo?.status || '') ? caseInfo?.status : '';

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="task" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EPI_INVESTIGATION, WEB_ROUTES.EPI_INVESTIGATION.CASE_DETAIL]} />
          {isDetailLoaded && (
            <Formik enableReinitialize initialValues={{ ...caseInfo, symptomsTempList, status: newStatus }} validate={validate} onSubmit={onSubmit}>
              {({ values, isSubmitting, setFieldValue, dirty }) => {
                const onRetrieveAddress = (fieldName = '') => {
                  const fieldPostalCodeName = `${fieldName}.postalCode`;
                  const fieldPremiseNoName = `${fieldName}.premiseNo`;
                  const fieldBuildingNameName = `${fieldName}.buildingName`;
                  const fieldRoadNameName = `${fieldName}.roadName`;
                  const fieldLevelNoName = `${fieldName}.levelNo`;
                  const fieldUnitNoName = `${fieldName}.unitNo`;
                  const postalCode = getIn(values, fieldPostalCodeName);
                  retrieveAddressAction(postalCode, (addresses) => {
                    const data = addresses[0] || {};
                    const { buildingName = '', buildingNo = '', streetName = '' } = data;
                    setFieldValue(fieldPremiseNoName, buildingNo, false);
                    setFieldValue(fieldBuildingNameName, buildingName, false);
                    setFieldValue(fieldRoadNameName, streetName, false);
                    setFieldValue(fieldLevelNoName, '', false);
                    setFieldValue(fieldUnitNoName, '', false);
                  });
                };

                const onPostalCodeChange = async (postalCode = '', fieldName = '') => {
                  const fieldPostalIsValidName = `${fieldName}.isValid`;
                  const { data } = await retrieveAddressService({ postalCode });
                  const listAddress = data?.sgAddressVOList || [];

                  setFieldValue(fieldPostalIsValidName, listAddress.length > 0, true);
                };

                return (
                  <Form>
                    <PromptOnLeave dirty={dirty} />
                    <GoBackButton onClick={() => goBack()} title={`Disease: ${caseType}`}>
                      {isEditing && (
                        <>
                          <button
                            type="submit"
                            className="btn btn-pri ml-auto m-1"
                            disabled={isSubmitting}
                            onClick={() => {
                              setFieldValue('isSubmitButton', true, false);
                              // submitForm();
                            }}>
                            Submit
                          </button>
                          <button
                            type="submit"
                            className="btn btn-sec m-1"
                            disabled={isSubmitting}
                            onClick={() => {
                              setFieldValue('isSubmitButton', false, false);
                              // submitForm();
                            }}>
                            Save as draft
                          </button>
                        </>
                      )}
                      {!isEditing && (
                        <>
                          <button type="button" className="btn btn-sec mr-3 float-right" onClick={() => setIsEditing(true)}>
                            Amend
                          </button>
                        </>
                      )}
                    </GoBackButton>
                    <div className="main-title">
                      <h1>Cluster ID: {caseInfo?.clusterId}</h1>
                      <h1 className="ml-5">Case ID: {caseInfo?.caseId}</h1>
                      {caseInfo?.lastUpdatedDate && <label className="ml-auto"> Last updated as at {caseInfo?.lastUpdatedDate}</label>}
                    </div>
                    <div className="tabsContainer">
                      <SubmitErrorMessage />
                      <TabNav onToggleTab={setActiveTab} activeTab={activeTab} menu={menu} />
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="0">
                          <CaseOverview />
                        </TabPane>
                        <TabPane tabId="1">
                          <PersonalInfo onRetrieveAddress={onRetrieveAddress} onPostalCodeChange={onPostalCodeChange} />
                        </TabPane>
                        <TabPane tabId="2">
                          <MovementHistory onRetrieveAddress={onRetrieveAddress} />
                        </TabPane>
                        <TabPane tabId="3">
                          <MOHTab />
                        </TabPane>
                      </TabContent>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modal.isShow}
            type="system-modal"
            headerTitle={`${modal.action}`}
            // onCancel={() => setModal({ isShow: false, action: '' })}
            confirmTitle="OK"
            onConfirm={modal.onConfirm}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, epiInvestigationReducers: { caseDetail } }, ownProps) => ({
  ...ownProps,
  ...caseDetail,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getCaseDetailAction,
  getMastercodeAction,
  retrieveAddressAction,
  caseSubmitAction,
  resetReducerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CaseDetail));
