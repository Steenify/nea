import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import SearchableCheckList from 'components/common/searchable-check-list';
import { WEB_ROUTES } from 'constants/index';
import { actionTryCatchCreator } from 'utils';
import { getTableListingService } from 'services/report/adhoc-report';

const AdhocReportHeader = (props) => {
  const {
    location: { state },
    history,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [form3Headers, setForm3Headers] = useState([]);
  const [inspectionHeaders, setInspectionHeaders] = useState([]);

  const [form3Columns, setForm3Columns] = useState([]);
  const [inspectionColumns, setInspectionColumns] = useState([]);

  const getTableListingAction = async (_callback) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      const listing = data.listing || [];
      listing.forEach((list) => {
        const columns = (list.columnsInfo || []).map((item) => ({ ...item, label: item.displayName, value: item.columnName }));
        if (list.moduleName === 'Form3') setForm3Columns(columns);
        if (list.moduleName === 'Inspection') setInspectionColumns(columns);
      });
    };
    const onError = () => setIsLoading(false);

    await actionTryCatchCreator(getTableListingService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.REPORT.ADHOC_REPORT_SELECT_HEADER.name}`;
    getTableListingAction();
  }, [state]);

  const onNext = () => {
    if (form3Headers.length === 0 && inspectionHeaders.length === 0) {
      toast.error('Please select at leaset one header.');
      return;
    }
    history.push(WEB_ROUTES.REPORT.ADHOC_REPORT_QUERY.url, { form3Headers, inspectionHeaders });
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.REPORT.ADHOC_REPORT_SELECT_HEADER.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.REPORT, WEB_ROUTES.REPORT.ADHOC_REPORT_SELECT_HEADER]} />

          <div className="main-title">
            <h1>Select Report Headers</h1>
          </div>
          <div className="tabsContainer">
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-5 mb-3">
                    <SearchableCheckList large title="Inspection and Breeding" options={inspectionColumns} placeholder="Search" onChange={(list) => setInspectionHeaders(list)} />
                  </div>
                  <div className="col-lg-2" />
                  <div className="col-lg-5">
                    <SearchableCheckList large title="Form 3" options={form3Columns} placeholder="Search" onChange={(list) => setForm3Headers(list)} />
                  </div>
                </div>
                <div className="text-center mb-5">
                  <button type="button" className="btn btn-pri m-1" onClick={onNext}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdhocReportHeader));
