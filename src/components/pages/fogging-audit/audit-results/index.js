import React from 'react';
import BinaryFileGallery from 'components/common/binaryImageGallery';

import './style.scss';

const AuditResults = (props) => {
  const { auditResult } = props;
  return (
    <>
      <div className="tab-content">
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Auditor Information</p>
          <div className="card">
            <div className="card-body">
              <div className="row paddingBottom10">
                <div className="col-md-3 col-lg-2 font-weight-bold">Name of Auditing Officer</div>
                <div className="col-md-9 col-lg-4">{auditResult?.auditedBy}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-3 col-lg-2 font-weight-bold">RO</div>
                <div className="col-md-9 col-lg-4">{auditResult?.regionOffice}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-3 col-lg-2 font-weight-bold">Audited as at</div>
                <div className="col-md-9 col-lg-4">{auditResult?.auditedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Audit Results</p>
          <div className="card">
            <div className="card-body">
              <div className="specimen__content">
                <h1 className="font-weight-bold">1. Individual(s) Conducting Fogging Treatment Onsite Possess Valid Licences</h1>
                {auditResult?.licenseAuditResults && auditResult?.licenseAuditResults.length > 0 ? (
                  <>
                    {auditResult?.licenseAuditResults.map((result, index) => (
                      <div key={`license_audit_result_${index + 1}`}>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Name:</b>
                              </div>
                              <div className="col col-md-6">{result.name}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Valid Licence:</b>
                              </div>
                              <div className="col col-md-6">
                                <div className={`text-center audit__results__license__badge__${result.validLicense.toLowerCase()}`}>{result.validLicense}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-7" />
                        </div>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>NEA Licence/ Certificate No.:</b>
                              </div>
                              <div className="col col-md-6">{result.licenseNo}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Licence Type:</b>
                              </div>
                              <div className="col col-md-6">{result.licenseType}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Valid Start Date:</b>
                              </div>
                              <div className="col col-md-6">{result.validStartDate}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Expiry Date:</b>
                              </div>
                              <div className="col col-md-6">{result.expiryDate}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-7">
                            <BinaryFileGallery fileIdList={result.photos.map((photo) => photo.fileId)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <label className="m-3">No Data</label>
                )}
                <hr />
              </div>

              <div className="specimen__content">
                <h1 className="font-weight-bold">2. Pesticides / Products Used</h1>
                {auditResult?.productAuditResults && auditResult?.productAuditResults.length > 0 ? (
                  <>
                    {auditResult?.productAuditResults.map((result, index) => (
                      <div key={`product_audit_result_${index + 1}`}>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6" />
                              <div className="col col-md-6">
                                <h3>
                                  <b>Declared</b>
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-7">
                            <h3>
                              <b>Actual</b>
                            </h3>
                          </div>
                        </div>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Brand of Chemical:</b>
                              </div>
                              <div className="col col-md-6">{result.declaredProductBrand}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>NEA Registration No.:</b>
                              </div>
                              <div className="col col-md-6">{result.declaredNeaRegistrationNo}</div>
                            </div>
                          </div>
                          <div className="col-12 col-md-7">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <div>{result.actualProductBrand}</div>
                              </div>
                              <div className="col col-md-6" />
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <div>{result.actualNeaRegistrationNo}</div>
                              </div>
                              <div className="col col-md-6" />
                            </div>
                          </div>
                        </div>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Valid Product:</b>
                              </div>
                              <div className="col col-md-6">
                                <div className={`text-center audit__results__license__badge__${result.isCompliant ? 'yes' : 'no'}`}>{result.isCompliant ? 'Yes' : 'No'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5" />
                          <div className="col-12 col-md-7">
                            <BinaryFileGallery fileIdList={result.photos.map((photo) => photo.fileId)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <label className="m-3">No Data</label>
                )}
                <hr />
              </div>

              <div className="specimen__content">
                <h1 className="font-weight-bold">3. Individuals Conducting Fogging are Dressed in Appropriate Personal Protective Equipment</h1>
                {auditResult?.dressingAuditResults && auditResult?.dressingAuditResults.length > 0 ? (
                  <>
                    {auditResult?.dressingAuditResults.map((result, index) => (
                      <div key={`dressing_audit_result_${index + 1}`}>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Name:</b>
                              </div>
                              <div className="col col-md-6">{result.name}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="col col-md-6">
                                <b>Appropriate PPE:</b>
                              </div>
                              <div className="col col-md-6">
                                <div className={`text-center audit__results__license__badge__${result.appropriatePPE.toLowerCase()}`}>{result.appropriatePPE}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-7" />
                        </div>
                        <div className="row audit__results__section">
                          <div className="col-12 col-md-5">
                            {result.appropriatePPE === 'No' && (
                              <>
                                <div className="row mb-2">
                                  <div className="col">
                                    <b>Reason for Inappropriate Dressing:</b>
                                  </div>
                                </div>
                                <div className="row mb-2">
                                  <div className="col">{result.reason}</div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="col-12 col-md-7">
                            <BinaryFileGallery fileIdList={result.photos.map((photo) => photo.fileId)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <label className="m-3">No Data</label>
                )}
                <hr />
              </div>

              <div className="specimen__content">
                <h1 className="font-weight-bold">4. Notification of Fogging Operations</h1>
                {auditResult?.notificationAuditResult ? (
                  <div>
                    <div className="row audit__results__section">
                      <div className="col-12 col-md-5">
                        <div className="row mb-2">
                          <div className="col col-md-6">
                            <h3>
                              <b>Declared</b>
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-7">
                        <h3>
                          <b>Actual</b>
                        </h3>
                      </div>
                    </div>
                    <div className="row audit__results__section">
                      <div className="col-12 col-md-5">
                        <div className="row mb-2">
                          <div className="col col-md-6">{auditResult?.notificationAuditResult?.declaredNotified}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-7">
                        <div className="row mb-2">
                          <div className="col col-md-6">
                            {auditResult?.notificationAuditResult?.actualNotified !== 'Notified' ? (
                              <div className="text-center audit__results__license__badge__no">{auditResult?.notificationAuditResult?.actualNotified}</div>
                            ) : (
                              <>{auditResult?.notificationAuditResult?.actualNotified}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row audit__results__section">
                      <div className="col-12 col-md-5">
                        {auditResult?.notificationAuditResult?.actualNotified !== 'Notified' && (
                          <>
                            <div className="row mb-2">
                              <div className="col">
                                <b>Reason:</b>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col">{auditResult?.notificationAuditResult?.reason}</div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="col-12 col-md-7">
                        <BinaryFileGallery fileIdList={auditResult?.notificationAuditResult?.photos.map((photo) => photo.fileId)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="m-3">No Data</label>
                )}
                <hr />
              </div>

              <div className="specimen__content">
                <h1 className="font-weight-bold">5. Other Lapses</h1>
                {auditResult?.otherLapsesAuditResult ? (
                  <div className="row audit__results__section">
                    <div className="col-12 col-md-5">
                      <div className="row mb-2">
                        <div className="col col-md-6">
                          <b>Other Lapses:</b>
                        </div>
                        <div className="col col-md-6">
                          {auditResult?.otherLapsesAuditResult?.otherLapses === 'Yes' ? (
                            <div className="text-center audit__results__license__badge__no">{auditResult?.otherLapsesAuditResult?.otherLapses}</div>
                          ) : (
                            <>{auditResult?.otherLapsesAuditResult?.otherLapses}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-7">
                      <BinaryFileGallery fileIdList={auditResult?.otherLapsesAuditResult.photos.map((photo) => photo.fileId)} />
                    </div>
                  </div>
                ) : (
                  <label className="m-3">No Data</label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditResults;
