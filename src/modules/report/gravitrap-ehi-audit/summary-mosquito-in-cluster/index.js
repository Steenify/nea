import React, { useState, useEffect, useRef } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { byteArrayToBase64, autoGenerateDownloadLink, actionTryCatchCreator } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import Select from 'components/common/select';
import CheckForEncryption from 'modules/checkForEncryption';

import { generateMosquitoSpeciesService } from 'services/report/gravitrap-ehi-audit';
import { WEB_ROUTES, weekNumberLOVs, yearNumberLOVs, FUNCTION_NAMES } from 'constants/index';

const SummaryMosquitoInCluster = () => {
  const thisYear = yearNumberLOVs[yearNumberLOVs.length - 1];

  const [eweekFrom, setEweekFrom] = useState(weekNumberLOVs[0]);
  const [eyearFrom, setEyearFrom] = useState(thisYear);
  const [eweekTo, setEweekTo] = useState(weekNumberLOVs[weekNumberLOVs.length - 1]);
  const [eyearTo, setEyearTo] = useState(thisYear);

  const [isLoading, setLocalLoading] = useState(false);
  const passwordModalRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER.name}`;
  }, []);

  const onSearch = (password) => {
    const reportParameters = [
      { name: 'eYearFrom', value: eyearFrom.value },
      { name: 'eYearTo', value: eyearTo.value },
      { name: 'eWeekFrom', value: eweekFrom.value },
      { name: 'eWeekTo', value: eweekTo.value },
    ];

    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const { extension, mimeType, reportData } = data;
      autoGenerateDownloadLink(`${WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER.name}.${extension}`, mimeType, byteArrayToBase64(reportData));
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    return actionTryCatchCreator(generateMosquitoSpeciesService({ reportParameters, password }), onPending, onSuccess, onError);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.REPORT, WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear From</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekFrom} onChange={setEweekFrom} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearFrom} onChange={setEyearFrom} />
                </div>
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear To</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekTo} onChange={setEweekTo} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearTo} onChange={setEyearTo} />
                </div>
              </div>
            </div>

            <div className="d-flex">
              <button type="submit" className="btn btn-pri" onClick={passwordModalRef?.current?.showPasswordModal}>
                Generate
              </button>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CheckForEncryption functionName={FUNCTION_NAMES.generateMosquitoSpecies} ref={passwordModalRef} onGenerate={onSearch} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SummaryMosquitoInCluster));
