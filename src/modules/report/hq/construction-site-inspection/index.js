import React, { useState, useEffect, useRef } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import { dateStringFromDate, byteArrayToBase64, autoGenerateDownloadLink, actionTryCatchCreator } from 'utils';
import moment from 'moment';
import InPageLoading from 'components/common/inPageLoading';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import SearchableCheckList from 'components/common/searchable-check-list';
import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';
import CheckForEncryption from 'modules/checkForEncryption';

import { generateConstructionSiteInspectionReportService } from 'services/report/hq';

const ConstructionSiteInspection = (props) => {
  const { getMastercodeAction, masterCodes } = props;
  const [startDate, setStartDate] = useState(moment().add(-1, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [roList, setROList] = useState([]);
  const [cdcList, setCDCList] = useState([]);
  const [grcList, setGRCList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [streetName, setStreetName] = useState('');

  const [isLoading, setLocalLoading] = useState(false);
  const passwordModalRef = useRef(null);

  useEffect(() => {
    document.title = 'NEA | HQ - Construction Site Inspection';
    getMastercodeAction([MASTER_CODE.RO_CODE, MASTER_CODE.CDC_CODE, MASTER_CODE.GRC_CODE, MASTER_CODE.DIVISION_CODE], undefined, true);
  }, [getMastercodeAction]);

  const onSearch = (password) => {
    const reportParameters = [
      { name: 'inspectionDateFrom', value: dateStringFromDate(startDate) },
      { name: 'inspectionDateTo', value: dateStringFromDate(endDate) },
      { name: 'RO', values: roList.map((item) => item?.value || '') },
      { name: 'CDC', values: cdcList.map((item) => item?.value || '') },
      { name: 'GRC', values: grcList.map((item) => item?.value || '') },
      { name: 'Division', values: divisionList.map((item) => item?.value || '') },
      { name: 'StreetName', value: streetName },
    ];

    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const { extension, mimeType, reportData } = data;
      autoGenerateDownloadLink(`HQ_Report_Construction_Site_Inspection.${extension}`, mimeType, byteArrayToBase64(reportData));
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    return actionTryCatchCreator(generateConstructionSiteInspectionReportService({ reportParameters, password }), onPending, onSuccess, onError);
  };

  const canGenerate = startDate && endDate;

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active="Construction Site Inspection" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.REPORT, WEB_ROUTES.REPORT.CONSTRUCTION_SITE_INSPECTION]} />
          <div className="main-title">
            <h1>HQ - Construction Site Inspection</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline mb-4">
                  <div>
                    <b className="text-body mr-2">Inspection Date From (*)</b>
                    <SingleDatePickerV2
                      className="mt-2 mr-2 xs-paddingBottom15"
                      date={startDate}
                      onChangeDate={setStartDate}
                      minDate={moment().add(-process.env.REACT_APP_REPORT_PAST_YEAR, 'years')}
                      maxDate={endDate}
                    />
                  </div>
                  <div>
                    <b className="text-body mr-2">Inspection Date To (*)</b>
                    <SingleDatePickerV2
                      className="mt-2 mr-2 xs-paddingBottom15"
                      date={endDate}
                      onChangeDate={setEndDate}
                      minDate={startDate || moment().add(-process.env.REACT_APP_REPORT_PAST_YEAR, 'years')}
                    />
                  </div>
                </div>
                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked flex-column">
                    <b className="text-body">Street name</b>
                    <input
                      className="textfield"
                      onChange={(event) => {
                        setStreetName(event.target.value);
                      }}
                    />
                  </div>
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
                </div>
              </div>
            </div>

            <div className="d-flex">
              <button type="submit" className="btn btn-pri" onClick={passwordModalRef?.current?.showPasswordModal} disabled={!canGenerate}>
                Generate
              </button>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CheckForEncryption functionName={FUNCTION_NAMES.generateConstructionSiteInspection} ref={passwordModalRef} onGenerate={onSearch} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConstructionSiteInspection));
