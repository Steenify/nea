import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import CertificationTab from 'components/pages/inspectionForm/certificationTab';
import InfoTab from 'components/pages/inspectionForm/infoTab';
import AnalysisTab from 'components/pages/inspectionForm/analysisTab';

import { WEB_ROUTES } from 'constants/index';

import { IdentificationStatus } from 'constants/local-lov';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { resetReducerAction } from 'components/pages/inspectionForm/action';
import { getFormDetailAction, certifyFindingWithEmails, resetFormDetailReducer } from './action';
import './style.scss';
// import { openNewTab } from 'utils';

class InspectionDetail extends Component {
  constructor(props) {
    super(props);
    const {
      location: { state },
    } = this.props;
    const isFromMyWorkspace = state?.isEditing;
    this.state = {
      activeTab: '0',
      isDetailLoaded: false,
      scannedBarcodeId: '',
      isFromMyWorkspace,
    };
  }

  componentDidMount() {
    const {
      resetFormDetailReducerAction,
      resetReducerAction,
      getMastercodeAction,
      location: { state },
      history,
    } = this.props;
    document.title = 'NEA | Inspection Form Detail';
    resetReducerAction();
    resetFormDetailReducerAction();
    getMastercodeAction([MASTER_CODE.SAMPLE_STATUS_CODE]);

    if (state?.id) {
      this.getSampleInfo();
    } else {
      history.goBack();
    }
  }

  getSampleInfo = () => {
    const {
      getFormDetailAction,
      match: {
        params: { type },
      },
      location: { state },
    } = this.props;
    if (type === 'sample') {
      getFormDetailAction({ barcodeId: state?.id }).then(() => {
        this.setState({
          isDetailLoaded: true,
          scannedBarcodeId: state?.id,
        });
      });
    } else if (type === 'inspection') {
      getFormDetailAction({ inspectionId: state?.id }).then(() => {
        this.setState({
          isDetailLoaded: true,
        });
      });
    }
  };

  toggle = (tab) => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  goToSOF = () => {
    const {
      history,
      data: { formDetail },
    } = this.props;
    history.push(`${WEB_ROUTES.DETAILS.url}/sof`, { id: formDetail?.info?.inspectionId });
  };

  isCertificationShown = (formDetail) => {
    let samples = [];
    const habitatGroups = formDetail?.analysis?.habitatGroups || [];
    habitatGroups.forEach((habitat) => {
      samples = samples.concat(habitat.samples);
    });
    // * Still has some un-received samples
    const allowedSampleStatuses = ['PC', 'RJO', 'RJAM', 'RJAN'];
    // if (samples.filter((sample) => sample.sampleStatusCode !== 'PC').length > 0) {
    //   console.log('Still has some un-received samples');
    //   return false;
    // }
    if (samples.filter((sample) => !allowedSampleStatuses.includes(sample.sampleStatusCode)).length > 0) {
      console.log('Still has some un-received samples');
      return false;
    }
    // * Still has some pending
    if (samples.filter((sample) => (!sample.identificationStatusCode && sample.sampleStatusCode === 'PC') || sample.identificationStatusCode === IdentificationStatus.pending.code).length > 0) {
      console.log('Still has some pending');
      return false;
    }

    const identifiedCount = samples.filter((sample) => sample.identificationStatusCode === IdentificationStatus.identified.code).length;
    if (identifiedCount > 0) {
      console.log('// * At least one is Identified');
      return true;
    }
    // * Not all identification status is rejected
    const rejectedCount = samples.filter((sample) => sample.identificationStatusCode === IdentificationStatus.rejected.code).length;
    if ((rejectedCount < samples.length && rejectedCount > 0) || rejectedCount === samples.length) {
      console.log('Not all identification status is rejected');
      return false;
    }
    // * Not all sample status is rejected
    // if (
    //   samples.filter(sample =>
    //     ['RJO', 'Rejected by Admin', 'Rejected by Analyst'].includes(sample.sampleStatusCode),
    //   ).length < samples.length
    // ) {
    //   console.log('Not all sample status is rejected');
    //   return false;
    // }
    // * At least one is Identified
    return true;
  };

  isSubmitButtonShown = (formDetail) => {
    let samples = [];
    const habitatGroups = formDetail?.analysis?.habitatGroups || [];
    habitatGroups.forEach((habitat) => {
      samples = samples.concat(habitat.samples);
    });
    // * Still has some un-received samples
    const allowedSampleStatuses = ['PC', 'RJO', 'RJAM', 'RJAN'];
    if (samples.filter((sample) => !allowedSampleStatuses.includes(sample.sampleStatusCode)).length > 0) {
      console.log('Still has some un-received samples');
      return false;
    }
    // if (samples.filter((sample) =>  sample.sampleStatusCode !== 'PC').length > 0) {
    //   console.log('Still has some un-received samples');
    //   return false;
    // }
    // * Still has some pending
    if (samples.filter((sample) => (!sample.identificationStatusCode && sample.sampleStatusCode === 'PC') || sample.identificationStatusCode === IdentificationStatus.pending.code).length > 0) {
      console.log('Still has some pending');
      return false;
    }
    const identifiedCount = samples.filter((sample) => sample.identificationStatusCode === IdentificationStatus.identified.code).length;
    if (identifiedCount > 0) {
      console.log('// * At least one is Identified');
      return true;
    }
    // * Not all identification status is rejected
    const rejectedCount = samples.filter((sample) => sample.identificationStatusCode === IdentificationStatus.rejected.code || sample.sampleStatusCode === 'RJO' || sample.sampleStatusCode === 'RJAM')
      .length;
    if (rejectedCount < samples.length && rejectedCount > 0) {
      console.log('Not all identification status is rejected');
      return false;
    }
    return true;
  };

  onCeritfyFindings = () => {
    const {
      certifyFindingWithEmailsAction,
      data: { formDetail },
      history,
    } = this.props;
    const inspectionId = formDetail?.info?.inspectionId;
    const certificationData = this.certificationTabRef?.getCertifyFindingsInfo();
    if (certificationData) {
      const { isEmailChecked, selectedEmailGroup } = this.certificationTabRef.getCertifyFindingsInfo();

      if (isEmailChecked) {
        if (selectedEmailGroup.length === 0) {
          toast.error('Please select at least one email group');
        } else {
          certifyFindingWithEmailsAction({ inspectionId, emailList: selectedEmailGroup }, () => {
            toast.success('Samples certified');
            history.replace(WEB_ROUTES.MY_WORKSPACE.url);
          });
        }
      } else {
        certifyFindingWithEmailsAction({ inspectionId }, () => {
          toast.success('Samples certified');
          history.replace(WEB_ROUTES.MY_WORKSPACE.url);
        });
      }
    } else {
      certifyFindingWithEmailsAction({ inspectionId }, () => {
        toast.success('Findings submitted');
        history.replace(WEB_ROUTES.MY_WORKSPACE.url);
      });
    }
  };

  render() {
    const {
      history,
      location: { state },
      ui: { isLoading },
      data: { formDetail },
    } = this.props;
    const { activeTab, isDetailLoaded, scannedBarcodeId, isFromMyWorkspace } = this.state;
    // console.log(isFromMyWorkspace, 'isFromMyWorkspace', state?.isEditing);

    const isCertified = formDetail?.certification;
    const isCertificationEnabled = (this.isCertificationShown(formDetail) && isFromMyWorkspace) || isCertified;
    const isSubmitButtonEnabled = this.isSubmitButtonShown(formDetail);
    const tabMenus = isCertificationEnabled ? ['Info', 'Analysis', 'Certification'] : ['Info', 'Analysis'];
    if (!state?.id) return <></>;
    return (
      <>
        <Header />
        <div className="main-content workspace__main">
          <NavBar active="Inspection Form Detail" />
          <div className="contentWrapper">
            <NewBreadCrumb />
            {isDetailLoaded && (
              <div className="paddingBottom50">
                <div className="go-back">
                  <span onClick={() => history.goBack()}>Inspection ID: {formDetail?.info?.inspectionId}</span>
                  {isFromMyWorkspace && isSubmitButtonEnabled && !isCertified && (
                    <button type="button" className="btn btn-pri float-right xs-marginTop20" onClick={this.onCeritfyFindings}>
                      Submit
                    </button>
                  )}
                  <div className="clearfix" />
                </div>
                <div className="tabsContainer">
                  <TabNav onToggleTab={this.toggle} activeTab={activeTab} menu={tabMenus} />
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="0">
                      <InfoTab
                        detail={formDetail?.info}
                        showSOFButton={formDetail?.info?.isStatementOfOfficerEnabled}
                        // showSOFButton
                        onClickSOF={this.goToSOF}
                      />
                    </TabPane>
                    <TabPane tabId="1">
                      <AnalysisTab
                        detail={formDetail?.analysis}
                        scannedBarcodeId={scannedBarcodeId}
                        viewOnly={!isFromMyWorkspace}
                        isAllExpanded={state?.isAllExpanded}
                        onSaveSuccess={this.getSampleInfo}
                      />
                    </TabPane>
                    {isCertificationEnabled && (
                      <TabPane tabId="2">
                        <CertificationTab
                          ref={(ref) => {
                            this.certificationTabRef = ref;
                            return true;
                          }}
                          isSubmitted={isCertified}
                          detail={formDetail}
                          onSubmit={this.onCeritfyFindings}
                        />
                      </TabPane>
                    )}
                  </TabContent>
                </div>
              </div>
            )}
            <InPageLoading isLoading={isLoading} />
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ detailReducers: { inspectionReducer } }, ownProps) => ({
  ...ownProps,
  ...inspectionReducer,
});

const mapDispatchToProps = {
  getFormDetailAction,
  certifyFindingWithEmailsAction: certifyFindingWithEmails,
  resetFormDetailReducerAction: resetFormDetailReducer,
  resetReducerAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InspectionDetail));
