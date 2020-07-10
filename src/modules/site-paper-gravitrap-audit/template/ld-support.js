import React, { useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { supportLDService } from 'services/site-paper-gravitrap-audit';
import InPageLoading from 'components/common/inPageLoading';
import { actionTryCatchCreator } from 'utils';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { WEB_ROUTES } from 'constants/index';
import { TabContent } from 'reactstrap';
import CustomModal from 'components/common/modal';
import GoBackButton from 'components/ui/go-back-button';
import { toast } from 'react-toastify';

const FormRow = ({ label = '', text = '', isPaddingBottom = false, isPaddingTop = false, isPaddingLeft = false, children }) => (
  <div className={`row ${isPaddingBottom ? 'pb-3' : ''} ${isPaddingLeft ? 'pl-3' : ''} ${isPaddingTop ? 'pt-3' : ''}`}>
    {label && <div className={`${isPaddingLeft ? 'col-4' : 'col-md-8 col-lg-6'} font-weight-bold`}>{label}</div>}
    <div className={`${isPaddingLeft ? 'col-8' : 'col-md-4 col-lg-6'}`}>{text ? text.split('-').map((item) => <div>{item}</div>) : children}</div>
  </div>
);

const SupportTemplate = ({ history: { goBack }, location: { state = {} } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectRemark, toggleShowRejectRemark] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');
  const { mappedMonth = '', taskInfoList = [], template = {} } = state;

  const { EHI_GRAVITRAP_AUDIT } = WEB_ROUTES;

  const supportLDAction = (isSupport = true) => {
    const mes = isSupport ? 'LD supported' : 'LD rejected';
    const param = isSupport ? { taskInfoList, rejectionRemarks: '', action: 'SUPPORT' } : { taskInfoList, rejectionRemarks: rejectionRemark, action: 'REJECTSUPPORT' };
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = () => {
      setIsLoading(false);
      toggleShowRejectRemark(false);
      setRejectionRemark('');
      toast.success(mes);
      goBack();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(supportLDService(param), onPending, onSuccess, onError);
  };

  const { collatedLdList = [], breakDownLdList = [], ldConfigList = [], finalLdRate = '' } = template;

  if (!state?.template) {
    return <Redirect to={WEB_ROUTES.MY_WORKSPACE.url} />;
  }

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={EHI_GRAVITRAP_AUDIT.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[EHI_GRAVITRAP_AUDIT, EHI_GRAVITRAP_AUDIT.TASK_DETAIL]} />
          <div className="paddingBottom50">
            <GoBackButton onClick={() => goBack()} title={`Total Liquidated Damages amount for ${mappedMonth}`}>
              <div className="ml-auto">
                <button type="submit" className="btn btn-pri float-right" onClick={() => supportLDAction(true)}>
                  Support LD
                </button>
                <button type="submit" className="btn btn-sec float-right mr-3" onClick={() => toggleShowRejectRemark(true)}>
                  Reject
                </button>
              </div>
            </GoBackButton>
            <div className="tabsContainer">
              <TabContent>
                {collatedLdList.length > 0 && (
                  <div className="tab-pane__group bg-white">
                    <p className="tab-pane__title text-white">{`The final liquidated damages amount is $${finalLdRate || 0} and is broken down as follows:`}</p>
                    <div className="card">
                      <div className="card-body">
                        {collatedLdList.map(({ lapseDesc = '', totalOccurance = '' }, index) => (
                          <FormRow key={`collatedLdList_${index + 1}`} label={`${index + 1}. ${lapseDesc}`} text={`$${totalOccurance || 0}`} isPaddingBottom={index !== collatedLdList.length - 1} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {breakDownLdList.length > 0 && (
                  <div className="tab-pane__group bg-white">
                    <p className="tab-pane__title text-white">The lapses are broken down as follows:</p>
                    <div className="card">
                      <div className="card-body">
                        {breakDownLdList.map(({ lapseDesc = '', totalOccurance = '', lapseCategory = '', breakDownList = [] }, index) => (
                          <>
                            <FormRow key={`breakDownLdList_${index + 1}`} label={`${index + 1}. ${lapseDesc}`} text={`${totalOccurance} ${lapseCategory}`} isPaddingTop={index !== 0} />
                            {breakDownList?.map(({ lapseDesc = '', totalOccurance = '', lapseCategory = '' }, index1) => (
                              <FormRow key={`breakDownLdList_${index + 1}_${index1}`} label={`${index1 + 1}. ${lapseDesc}`} text={`${totalOccurance} ${lapseCategory}`} isPaddingLeft />
                            ))}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {ldConfigList.length > 0 && (
                  <div className="tab-pane__group bg-white">
                    <p className="tab-pane__title text-white">The LD rates are as follows:</p>
                    <div className="card">
                      <div className="card-body">
                        {ldConfigList.map(({ lapseDesc = '', totalOccurance = '', lapseCategory = '' }, index) => (
                          <>
                            <FormRow
                              key={`ldConfigList_${index + 1}`}
                              label={`${index + 1}. ${lapseDesc}`}
                              text={`$${totalOccurance || 0} ${lapseCategory}`}
                              isPaddingBottom={index !== ldConfigList.length - 1}
                            />
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabContent>
            </div>
          </div>
          <CustomModal
            headerTitle="Remarks for Rejection"
            confirmTitle="Reject"
            cancelTitle="Cancel"
            isOpen={showRejectRemark}
            onConfirm={() => {
              if (!rejectionRemark) {
                toast.error('Please enter Remarks for Rejection');
                return;
              }
              supportLDAction(false);
            }}
            onCancel={() => {
              toggleShowRejectRemark(false);
              setRejectionRemark('');
            }}
            type="action-modal"
            content={
              <form className="form-group">
                <div className="row paddingBottom20">
                  <div className="col-lg-12">
                    <textarea className="form-control" rows={3} onChange={(e) => setRejectionRemark(e.target.value)} />
                  </div>
                </div>
              </form>
            }
          />
          <Footer />
        </div>
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(SupportTemplate);
