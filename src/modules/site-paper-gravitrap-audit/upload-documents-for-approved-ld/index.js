import React from 'react';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { WEB_ROUTES } from 'constants/index';
import LDApprovedTable from 'components/tables/site-paper-workspace/ld-approved';

const UploadDocumentsForApprovedLD = () => {
  const title = WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOADED_DOCUMENT_FOR_LD.name;
  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={title} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOADED_DOCUMENT_FOR_LD]} />
          <div className="main-title">
            <h1>{title}</h1>
          </div>
          <LDApprovedTable />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocumentsForApprovedLD);
