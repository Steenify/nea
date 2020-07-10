import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as _ from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';
import Select from 'components/common/select';
import InPageLoading from 'components/common/inPageLoading';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import ArcgisMap from 'components/common/arcgis-map';

import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import './style.scss';

import { dateStringFromDate, actionTryCatchCreator } from 'utils';
import { findOfficerOpsService } from 'services/ops-area';

import OpsDataTable from './ops-data-table';

import { closeOperationAction, reassignOperationAction, searchOperationAction } from './action';

const OperationDetail = (props) => {
  const {
    closeOperationAction,
    reassignOperationAction,
    searchOperationAction,
    history,
    location: { state },
    ui: { isLoading },
    data: { detail },
    //
    functionNameList,
  } = props;

  const [modalState, setModalState] = useState({ open: false, type: '', data: {} });
  const selectRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.OPERATION_DETAIL.name}`;
    if (!state?.id) {
      history.goBack();
    } else {
      searchOperationAction({ id: state?.id });
    }
  }, [searchOperationAction, history, state]);

  const closeOperation = () => {
    closeOperationAction(
      {
        id: state?.id,
        closeDate: dateStringFromDate(modalState.data?.date),
      },
      () => {
        toast.success('Operation closed');
        setModalState({ open: false });
        history.goBack();
      },
    );
  };

  const reassignOperation = () => {
    if (!modalState?.data?.officer) {
      toast.error('No officer selected');
      return;
    }
    reassignOperationAction(
      {
        id: state?.id,
        opsPlanningOfficer: modalState?.data?.officer.value,
        manager: modalState?.data?.officer.manager,
      },
      () => {
        toast.success('Operation Reassigned');
        setModalState({ open: false });
        history.goBack();
      },
    );
  };

  const onSearchOfficer = (inputValue, callback) => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const list = data.userVoList || [];
      callback(list.map((item) => ({ ...item, label: item.fullName, value: item.soeId, manager: item.supervisor })));
    };
    const onError = () => {
      callback([]);
    };
    actionTryCatchCreator(findOfficerOpsService({ opsPlanningOfficer: inputValue }), onPending, onSuccess, onError, true);
  };

  const isEditable = state?.isEditable || detail?.isEditable;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.LANDING_PAGE, WEB_ROUTES.OPS_AREA.OPERATION_DETAIL]} />
          <div className="go-back">
            <span onClick={() => history.goBack()}>
              Operation ID: {state?.id} / {state?.opsPlanningOfficer} / {state?.opsType}{' '}
            </span>
          </div>
          <div className="mainPadding">
            <ArcgisMap
              isHeaderHidden={false}
              rightHeaderContent={
                isEditable &&
                detail && (
                  <>
                    {functionNameList.includes(FUNCTION_NAMES.linktoOps) && !detail?.islinked && (
                      <div className="operBtns">
                        <span className="btn btn-sec linkedIcon cursor-pointer hf-40" onClick={() => history.push(WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS.url, state)}>
                          My Existing Operation
                        </span>
                      </div>
                    )}
                    {functionNameList.includes(FUNCTION_NAMES.reassignOps) && (
                      <div className="operBtns">
                        <span className="btn btn-sec reassignIcon cursor-pointer hf-40" onClick={() => setModalState({ open: true, type: 'reassign', data: {} })}>
                          Reassign Operation
                        </span>
                      </div>
                    )}
                    {functionNameList.includes(FUNCTION_NAMES.closeOperations) && (
                      <div className="operBtns">
                        <span className="btn btn-sec closeIcon cursor-pointer hf-40" onClick={() => setModalState({ open: true, type: 'close', data: { step: 1, date: moment() } })}>
                          Close Operation
                        </span>
                      </div>
                    )}
                  </>
                )
              }
              rightContent={
                detail && (
                  <div className="clusterPadding">
                    <div className="row cluserWrapper">
                      <div className="col-xl-12 col-md-6">
                        <div className="clusterCont">
                          <div className="clusterDetails">
                            <span>Operation ID:</span> {detail?.id}
                          </div>
                          <div className="clusterDetails">
                            <span>Type:</span> {detail?.opsType}
                          </div>
                          <div className="clusterDetails">
                            <span>Operation Creation Date:</span> {detail?.openDate}
                          </div>
                          <div className="clusterDetails">
                            <span>Operation Locality:</span> {detail?.opsLocality}
                          </div>
                          <div className="clusterDetails">
                            <span>Operation Planning Officer:</span> {detail?.opsPlanningOfficer}
                          </div>
                          <div className="clusterDetails">
                            <span>Officer&apos;s Contact Number:</span> {detail?.officerContactno}
                          </div>
                          <div className="clusterDetails">
                            <span>Manager:</span> {detail?.manager}
                          </div>
                        </div>
                      </div>
                      {detail?.opsType?.toLowerCase()?.includes('cluster') && (
                        <div className="col-xl-12 col-md-6">
                          <div className="clusterCont nb">
                            <div className="clusterDetails">
                              <span>Cluster ID:</span> {detail?.clusterId}
                            </div>
                            <div className="clusterDetails">
                              <span>Earliest Onset Date:</span> {detail?.onsetDate}
                            </div>
                            <div className="clusterDetails">
                              <span>Cluster Notified Date:</span> {detail?.notofiedDate}
                            </div>
                            <div className="clusterDetails">
                              <span>Cluster Locality:</span> {detail?.clusterLocality}
                            </div>
                            <div className="clusterDetails">
                              <span>Case Size:</span> {detail?.caseSize}
                            </div>
                          </div>
                        </div>
                      )}
                      {detail?.opsType === 'Gravitrap' && (
                        <div className="col-xl-12 col-md-6">
                          <div className="clusterCont nb">
                            <div className="clusterDetails">
                              <span>Sector ID:</span> {detail?.sectorId}
                            </div>
                            <div className="clusterDetails">
                              <span>Trigger:</span> {detail?.trigger}
                            </div>
                            <div className="clusterDetails">
                              <span>Number of Female Aedes aegypti Mosquitoes Caught Over the Past 5 eWeeks:</span>
                              {detail?.operationsSectorVOList?.map((sector, sIndex) => (
                                <div key={`sector_count_${sIndex + 1}`}>
                                  {`${sector.block || ''}:`}
                                  <ul style={{ listStyle: 'inside number' }}>
                                    {sector.eweeksWithFeAegytiCount.map((count, index) => (
                                      <li key={`mosquito_count_${index + 1}`}>{count}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row paddingTop30 paddingBottom50">
                      {detail?.islinked && <div className="col-xl-12 mb-3">This operation is a merged operation.</div>}
                      {functionNameList.includes(FUNCTION_NAMES.getAdditionalInfo) && (
                        <div className="col-md-6 col-xl-12 mb-3">
                          <button type="button" className="btn btn-sec" onClick={() => history.push(WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO.url, { ...state, ...detail, isEditable })}>
                            Additional Information
                          </button>
                        </div>
                      )}
                      {functionNameList.includes(FUNCTION_NAMES.getAddressList) && (
                        <div className="col-md-6 col-xl-12">
                          <button type="button" className="btn btn-sec" onClick={() => history.push(WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS.url, { ...state, ...detail, isEditable })}>
                            Addresses in Operation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
            />
            <div className="paddingTop50 paddingBottom60">
              {functionNameList.includes(FUNCTION_NAMES.getSummary) && (
                <>
                  <OpsDataTable opsId={state?.id} />
                </>
              )}
            </div>
          </div>
          <Footer />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'close'}
            type="action-modal"
            headerTitle="Close Operation"
            confirmTitle={modalState.data?.step === 1 ? 'Submit' : 'Confirm'}
            onConfirm={() => {
              if (modalState.data?.step === 1) {
                setModalState({ ...modalState, data: { ...modalState.data, step: 2 } });
              } else {
                closeOperation();
              }
            }}
            cancelTitle={modalState.data?.step === 1 ? 'Cancel' : 'Back'}
            onCancel={() => {
              if (modalState.data?.step === 1) {
                setModalState({ open: false });
              } else {
                setModalState({ ...modalState, data: { ...modalState.data, step: 1 } });
              }
            }}
            content={
              modalState.data?.step === 1 ? (
                <div>
                  <label className="font-weight-bold">Select Date</label>
                  <SingleDatePickerV2 date={modalState.data?.date} onChangeDate={(date) => setModalState({ ...modalState, data: { ...modalState.data, date } })} maxDate={moment()} />
                </div>
              ) : (
                <label className="font-weight-bold">Operation closure date is {dateStringFromDate(modalState.data?.date)}</label>
              )
            }
          />
          <CustomModal
            size="sm"
            isOpen={modalState.open && modalState.type === 'reassign'}
            type="action-modal"
            headerTitle="Reassign Operation"
            confirmTitle="Confirm"
            onConfirm={reassignOperation}
            cancelTitle="Cancel"
            onCancel={() => setModalState({ open: false })}
            content={
              <div>
                <Select
                  isAppendToBody={false}
                  placeholder="Find Officer..."
                  isAsync
                  value={modalState.data?.officer}
                  loadOptions={_.debounce(onSearchOfficer, 500)}
                  isClearable
                  className="m-2"
                  small
                  onChange={(item) => setModalState({ ...modalState, data: { ...modalState.data, officer: item } })}
                  defaultOptions={false}
                  cacheOptions
                  selectRef={selectRef}
                />
              </div>
            }
          />
        </div>
        <InPageLoading isLoading={isLoading} />
      </div>
    </>
  );
};

const mapStateToProps = ({ global, opsAreaReducers: { operationDetail } }, ownProps) => ({
  ...ownProps,
  ...operationDetail,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  closeOperationAction,
  reassignOperationAction,
  searchOperationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OperationDetail));
