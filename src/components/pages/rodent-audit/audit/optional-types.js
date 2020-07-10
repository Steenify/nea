import React from 'react';
import { isNil } from 'lodash';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const AuditExtended = (props) => {
  const { audit } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Audit</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Date of Audit</div>
                <div className="col-6">{audit?.auditDate}</div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 col-md-12">
              <div className="row ">
                <div className="col-6 font-weight-bold">Name of Auditing Officer</div>
                <div className="col-6">{audit?.auditorName}</div>
              </div>
            </div>
          </div>
          {/* ----- SIGNS OF RODENT INFESTATION ----- */}
          {audit?.signsOfRodentInfestation && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Signs of Rodent Infestation</p>

              {!isNil(audit.signsOfRodentInfestation.noOfDroppingsFound) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of locations with Dropping found</div>
                  <div className="col-md-9 col-lg-4">{audit.signsOfRodentInfestation.noOfDroppingsFound}</div>
                </div>
              )}

              {!isNil(audit.signsOfRodentInfestation.noOfGnawMarks) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of areas with Gnaw Marks</div>
                  <div className="col-md-9 col-lg-4">{audit.signsOfRodentInfestation.noOfGnawMarks}</div>
                </div>
              )}

              {!isNil(audit.signsOfRodentInfestation.noOfRubMarks) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of areas with Rub Marks</div>
                  <div className="col-md-9 col-lg-4">{audit.signsOfRodentInfestation.noOfRubMarks}</div>
                </div>
              )}

              {!isNil(audit.signsOfRodentInfestation.noOfLiveRats) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of Live Rats Spotted</div>
                  <div className="col-md-9 col-lg-4">{audit.signsOfRodentInfestation.noOfLiveRats}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- SIGNS OF RODENT INFESTATION ----- */}

          {/* ----- COLLECTION BIN ----- */}
          {audit?.collectionBin && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Collection Bin</p>

              {!isNil(audit.collectionBin.undersizedBin) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Undersized bin placed in bin chute</div>
                  <div className="col-md-9 col-lg-4">{audit.collectionBin.undersizedBin}</div>
                </div>
              )}

              {!isNil(audit.collectionBin.damagedBin) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Damaged bin</div>
                  <div className="col-md-9 col-lg-4">{audit.collectionBin.damagedBin}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- COLLECTION BIN ----- */}

          {/* ----- BIN CENTRE DEFECTS ----- */}
          {audit?.binCentreDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Bin Centre Defects</p>

              {!isNil(audit.binCentreDefects.presenceOfEntryPoints) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of Entry Points due to defects or design of building</div>
                  <div className="col-md-9 col-lg-4">{audit.binCentreDefects.presenceOfEntryPoints}</div>
                </div>
              )}

              {!isNil(audit.binCentreDefects.sideDoorDoesNotFullyClose) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Side door that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{audit.binCentreDefects.sideDoorDoesNotFullyClose}</div>
                </div>
              )}

              {!isNil(audit.binCentreDefects.rollerShutterDoesNotFullyClose) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Roller shutter that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{audit.binCentreDefects.rollerShutterDoesNotFullyClose}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- BIN CENTRE DEFECTS ----- */}

          {/* ----- INFRASTRUCTURE DEFECTS ----- */}
          {audit?.infrastructureDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Infrastructure Defects</p>

              {!isNil(audit.infrastructureDefects.brokenDamagedDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Broken/ Damaged BC door</div>
                  <div className="col-md-9 col-lg-4">{audit.infrastructureDefects.brokenDamagedDoor}</div>
                </div>
              )}

              {!isNil(audit.infrastructureDefects.doorUnableToCloseFully) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Door unable to close fully</div>
                  <div className="col-md-9 col-lg-4">{audit.infrastructureDefects.doorUnableToCloseFully}</div>
                </div>
              )}

              {!isNil(audit.infrastructureDefects.missingDefectiveGullyTrapCovers) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Missing/Defective Gully trap Covers</div>
                  <div className="col-md-9 col-lg-4">{audit.infrastructureDefects.missingDefectiveGullyTrapCovers}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- INFRASTRUCTURE DEFECTS ----- */}

          {/* ----- CRC DEFECTS ----- */}
          {audit?.crcDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">CRC Defects</p>

              {!isNil(audit.crcDefects.gapsShutterDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Gaps below/at side of roller shutter door</div>
                  <div className="col-md-9 col-lg-4">{audit.crcDefects.gapsShutterDoor}</div>
                </div>
              )}

              {!isNil(audit.crcDefects.gapsSideDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Gaps at side door that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{audit.crcDefects.gapsSideDoor}</div>
                </div>
              )}

              {!isNil(audit.crcDefects.entryPoints) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Entry Points due to defects/design of building</div>
                  <div className="col-md-9 col-lg-4">{audit.crcDefects.entryPoints}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- CRC DEFECTS ----- */}

          {/* ----- POOR PRACTICES ----- */}
          {audit?.poorPractices && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Poor Practices</p>

              {!isNil(audit.poorPractices.uncoveredBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of damaged/ uncovered bins</div>
                  <div className="col-md-9 col-lg-4">{audit.poorPractices.uncoveredBinsCompactor}</div>
                </div>
              )}

              {!isNil(audit.poorPractices.storageOfBulkyItems) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of stored bulky items</div>
                  <div className="col-md-9 col-lg-4">{audit.poorPractices.storageOfBulkyItems}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- POOR PRACTICES ----- */}

          {/* ----- SANITATION ----- */}
          {audit?.sanitation && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Sanitation</p>

              {!isNil(audit.sanitation.chokedGullyTraps) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Choked Gully Traps</div>
                  <div className="col-md-9 col-lg-4">{audit.sanitation.chokedGullyTraps}</div>
                </div>
              )}

              {!isNil(audit.sanitation.chokedScrupperDrains) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of choked scupper drains</div>
                  <div className="col-md-9 col-lg-4">{audit.sanitation.chokedScrupperDrains}</div>
                </div>
              )}

              {!isNil(audit.sanitation.refuseSpillage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Refuse Spillage</div>
                  <div className="col-md-9 col-lg-4">{audit.sanitation.refuseSpillage}</div>
                </div>
              )}

              {/* {!isNil(audit.sanitation.chokedDrainage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Choked drainage manhole cover</div>
                  <div className="col-md-9 col-lg-4">{audit.sanitation.chokedDrainage}</div>
                </div>
              )} */}
            </div>
          )}
          {/* ----- SANITATION ----- */}

          {/* ----- COMPACTOR MANAGEMENT ----- */}
          {audit?.compactorManagement && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Compactor Management</p>

              {!isNil(audit.compactorManagement.noCompactorOutletHoseAttached) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No Compactor outlet hose attached</div>
                  <div className="col-md-9 col-lg-4">{audit.compactorManagement.noCompactorOutletHoseAttached}</div>
                </div>
              )}

              {!isNil(audit.compactorManagement.damagedCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Compactor Damaged or Not closed</div>
                  <div className="col-md-9 col-lg-4">{audit.compactorManagement.damagedCompactor}</div>
                </div>
              )}

              {!isNil(audit.compactorManagement.outletHoseNotDraining) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Outlet hose NOT draining to mainhole</div>
                  <div className="col-md-9 col-lg-4">{audit.compactorManagement.outletHoseNotDraining}</div>
                </div>
              )}

              {!isNil(audit.compactorManagement.overflowingBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Overflowing Bins/ Compactor</div>
                  <div className="col-md-9 col-lg-4">{audit.compactorManagement.overflowingBinsCompactor}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- COMPACTOR MANAGEMENT ----- */}

          {/* ----- POOR REFUSE MANAGEMENT ----- */}
          {audit?.poorRefuseManagement && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Poor Refuse Management</p>

              {!isNil(audit.poorRefuseManagement.refuseSpillage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Refuse Spillage</div>
                  <div className="col-md-9 col-lg-4">{audit.poorRefuseManagement.refuseSpillage}</div>
                </div>
              )}

              {!isNil(audit.poorRefuseManagement.overflowingBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Overflowing Bins/ Compactor</div>
                  <div className="col-md-9 col-lg-4">{audit.poorRefuseManagement.overflowingBinsCompactor}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- POOR REFUSE MANAGEMENT ----- */}

          {/* ----- REMARKS ----- */}
          {audit?.remarks && (
            <div className="mb-5">
              <div className="row mb-2">
                <div className="col-md-3 col-lg-3 font-weight-bold">Remarks</div>
                <div className="col-md-9 col-lg-4">{audit.remarks}</div>
              </div>
            </div>
          )}
          {/* ----- REMARKS ----- */}

          {/* <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Active Burrows</div>
            <div className="col-md-9 col-lg-4">{audit?.numberOfBorrows || audit?.noOfBurrows}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Defects</div>
            <div className="col-md-9 col-lg-4">{audit?.numberOfDefects || audit?.noOfDefects}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Habitat</div>
            <div className="col-md-9 col-lg-4">{audit?.habitat}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Probable Cause</div>
            <div className="col-md-9 col-lg-4">{audit?.probableCause}</div>
          </div> */}

          {/* ----- ACTION TAKEN ----- */}
          {audit?.actionTaken && (
            <div className="mb-5">
              <div className="row mb-2">
                <div className="col-md-3 col-lg-3 font-weight-bold">Action Taken</div>
                <div className="col-md-9 col-lg-4">{audit?.actionTaken}</div>
              </div>
            </div>
          )}
          {/* ----- ACTION TAKEN ----- */}

          {/* ----- PHOTOS ----- */}

          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Photos</div>
            <div className="col-12">
              {audit?.photos && audit?.photos.length > 0 && <BinaryFileGallery fileIdList={audit?.photos?.map((photo) => photo.fileId)} />}
              {audit?.fileList && audit?.fileList.length > 0 && <BinaryFileGallery fileIdList={audit?.fileList} />}
            </div>
          </div>
          {/* ----- PHOTOS ----- */}
        </div>
      </div>
    </div>
  );
};

export default AuditExtended;
