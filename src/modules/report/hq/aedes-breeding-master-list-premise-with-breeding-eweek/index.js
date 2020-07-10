import React, { useState, useEffect, useRef } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { byteArrayToBase64, autoGenerateDownloadLink, actionTryCatchCreator } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import SearchableCheckList from 'components/common/searchable-check-list';
import Select from 'components/common/select';
import CheckForEncryption from 'modules/checkForEncryption';

import { generatePremisesWithBreedingEweekReportService } from 'services/report/hq';
import { weekNumberLOVs, yearNumberLOVs, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

const HQBreedingMasterListPremiseBreedingEweek = (props) => {
  const { getMastercodeAction, masterCodes } = props;
  const thisYear = yearNumberLOVs[yearNumberLOVs.length - 1];

  const [eweekFrom, setEweekFrom] = useState(weekNumberLOVs[0]);
  const [eyearFrom, setEyearFrom] = useState(thisYear);
  const [eweekTo, setEweekTo] = useState(weekNumberLOVs[weekNumberLOVs.length - 1]);
  const [eyearTo, setEyearTo] = useState(thisYear);
  const [roList, setROList] = useState([]);
  const [cdcList, setCDCList] = useState([]);
  const [grcList, setGRCList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);
  const passwordModalRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK.name}`;
    getMastercodeAction([MASTER_CODE.RO_CODE, MASTER_CODE.CDC_CODE, MASTER_CODE.GRC_CODE, MASTER_CODE.DIVISION_CODE, MASTER_CODE.HQ_REPORT_LOV_SPE], undefined, true);
  }, [getMastercodeAction]);

  const onSearch = (password) => {
    const reportParameters = [
      { name: 'eYear_eWeekFrom', value: `${eyearFrom.value}_${eweekFrom.value}` },
      { name: 'eYear_eWeekTo', value: `${eyearTo.value}_${eweekTo.value}` },
      { name: 'RO', values: roList.map((item) => item?.value || '') },
      { name: 'CDC', values: cdcList.map((item) => item?.value || '') },
      { name: 'GRC', values: grcList.map((item) => item?.value || '') },
      { name: 'Division', values: divisionList.map((item) => item?.value || '') },
      { name: 'Species', value: speciesList[0]?.value },
    ];

    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const { extension, mimeType, reportData } = data;
      autoGenerateDownloadLink(`${WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK.name}.${extension}`, mimeType, byteArrayToBase64(reportData));
      setLocalLoading(false);
    };
    const onError = () => {
      setLocalLoading(false);
    };
    return actionTryCatchCreator(generatePremisesWithBreedingEweekReportService({ reportParameters, password }), onPending, onSuccess, onError);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.REPORT, WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear From (*)</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekFrom} onChange={setEweekFrom} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearFrom} onChange={setEyearFrom} />
                </div>
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear To (*)</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekTo} onChange={setEweekTo} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearTo} onChange={setEyearTo} />
                </div>
                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="RO" options={masterCodes[MASTER_CODE.RO_CODE]} onChange={(list) => setROList(list)} />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="CDC" options={masterCodes[MASTER_CODE.CDC_CODE]} onChange={(list) => setCDCList(list)} />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="GRC" options={masterCodes[MASTER_CODE.GRC_CODE]} onChange={(list) => setGRCList(list)} />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="Division" options={masterCodes[MASTER_CODE.DIVISION_CODE]} onChange={(list) => setDivisionList(list)} />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="Species" options={masterCodes[MASTER_CODE.HQ_REPORT_LOV_SPE]} onChange={(list) => setSpeciesList(list)} singleChoice />
                  </div>
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
          <CheckForEncryption functionName={FUNCTION_NAMES.generateABMLeweekPremiseWithBreeding} ref={passwordModalRef} onGenerate={onSearch} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = { getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HQBreedingMasterListPremiseBreedingEweek));
