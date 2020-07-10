import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';
import GoBackButton from 'components/ui/go-back-button';
import InPageLoading from 'components/common/inPageLoading';
import { FUNCTION_NAMES, WEB_ROUTES } from 'constants/index';
import { dateStringFromDate } from 'utils';

import { getExistingOperationsAction, linkExistingOperationsAction } from './action';

const LinkExistingOperation = (props) => {
  const {
    getExistingOperationsAction,
    linkExistingOperationsAction,
    history,
    location: { state },
    ui: { isLoading },
    data: { activeOps },
    functionNameList,
  } = props;

  const [selectedOpsID, setSelectedOpsID] = useState(null);

  const [modalState, setModalState] = useState({ open: false });

  const linkAllowed = functionNameList.includes(FUNCTION_NAMES.linktoOps);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS.name}`;
    if (state?.id && linkAllowed) {
      getExistingOperationsAction({
        status: 'true',
        id: state?.id,
        saveMode: 'linktoOpsdisplay',
      });
    } else {
      history.replace(WEB_ROUTES.OPS_AREA.LANDING_PAGE.url);
      // history.goBack();
    }
  }, [getExistingOperationsAction, history, state, linkAllowed]);

  const linkOperation = () => {
    linkExistingOperationsAction(
      {
        closeDate: dateStringFromDate(moment()),
        id: state?.id,
        operationsInfoVOList: [
          {
            opsId: selectedOpsID,
          },
        ],
        // opsId: selectedOpsID,
      },
      () => {
        toast.success('Linked to existing operation.');
        history.replace(WEB_ROUTES.OPS_AREA.LANDING_PAGE.url);
      },
    );
  };

  const checkLinkOperation = () => {
    if (selectedOpsID) {
      setModalState({ open: true });
    } else {
      toast.error('No operation selected.');
    }
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.LANDING_PAGE, WEB_ROUTES.OPS_AREA.OPERATION_DETAIL, WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS]} />
          <GoBackButton onClick={() => history.goBack()} title={WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS.name}>
            <button type="button" className="btn btn-pri ml-auto" onClick={checkLinkOperation}>
              Apply
            </button>
          </GoBackButton>
          <div className="tabsContainer mb-5">
            {activeOps
              .filter((ops) => ops.id !== state?.id)
              .map((ops, index) => (
                <>
                  <div className="row mb-3 cursor-pointer" key={`link_ops_${index + 1}`} onClick={() => setSelectedOpsID(ops.id)}>
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <div className="custom-radio">
                        <input className="form-input" type="radio" id={`link_radio_${index + 1}`} name="radio-group" checked={selectedOpsID === ops.id} onChange={() => setSelectedOpsID(ops.id)} />
                        <label className="form-label mb-3" htmlFor={`link_radio_${index + 1}`} />
                      </div>
                    </div>
                    <div className="col">
                      <div className="row mb-2">
                        <div className="col-md-3 col-lg-2">
                          <div className="font-weight-bold">Operation ID</div>
                        </div>
                        <div className="col">
                          <div className="">{ops.id}</div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-3 col-lg-2">
                          <div className="font-weight-bold">Type</div>
                        </div>
                        <div className="col">
                          <div className="">{ops.opsType}</div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-3 col-lg-2">
                          <div className="font-weight-bold">Sector ID</div>
                        </div>
                        <div className="col">
                          <div className="">{ops.sectorId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < activeOps.length - 1 && <hr />}
                </>
              ))}
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open}
            type="system-modal"
            headerTitle="No de-linking of operations is allowed after saving. Confirm to link?"
            cancelTitle="Cancel"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Confirm"
            onConfirm={() => {
              linkOperation();
              setModalState({ open: false });
            }}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, opsAreaReducers: { linkToExistingOps } }, ownProps) => ({
  ...ownProps,
  ...linkToExistingOps,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getExistingOperationsAction,
  linkExistingOperationsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LinkExistingOperation));
