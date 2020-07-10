import React from 'react';
import { isNil } from 'lodash';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const ContractorFindings = (props) => {
  const { type, contractorsFindings } = props;

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Contractor's Findings</p>
      <div className="card">
        <div className="card-body">
          {/* ----- SIGNS OF RODENT INFESTATION ----- */}
          {contractorsFindings?.signsOfRodentInfestation && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Signs of Rodent Infestation</p>

              {!isNil(contractorsFindings.signsOfRodentInfestation.noOfDroppingsFound) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of locations with Dropping found</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.signsOfRodentInfestation.noOfDroppingsFound}</div>
                </div>
              )}

              {!isNil(contractorsFindings.signsOfRodentInfestation.noOfGnawMarks) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of areas with Gnaw Marks</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.signsOfRodentInfestation.noOfGnawMarks}</div>
                </div>
              )}

              {!isNil(contractorsFindings.signsOfRodentInfestation.noOfRubMarks) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of areas with Rub Marks</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.signsOfRodentInfestation.noOfRubMarks}</div>
                </div>
              )}

              {!isNil(contractorsFindings.signsOfRodentInfestation.noOfLiveRats) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No. of Live Rats Spotted</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.signsOfRodentInfestation.noOfLiveRats}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- SIGNS OF RODENT INFESTATION ----- */}

          {/* ----- COLLECTION BIN ----- */}
          {contractorsFindings?.collectionBin && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Collection Bin</p>

              {!isNil(contractorsFindings.collectionBin.undersizedBin) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Undersized bin placed in bin chute</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.collectionBin.undersizedBin}</div>
                </div>
              )}

              {!isNil(contractorsFindings.collectionBin.damagedBin) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Damaged bin</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.collectionBin.damagedBin}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- COLLECTION BIN ----- */}

          {/* ----- BIN CENTRE DEFECTS ----- */}
          {contractorsFindings?.binCentreDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Bin Centre Defects</p>

              {!isNil(contractorsFindings.binCentreDefects.presenceOfEntryPoints) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of Entry Points due to defects or design of building</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.binCentreDefects.presenceOfEntryPoints}</div>
                </div>
              )}

              {!isNil(contractorsFindings.binCentreDefects.sideDoorDoesNotFullyClose) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Side door that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.binCentreDefects.sideDoorDoesNotFullyClose}</div>
                </div>
              )}

              {!isNil(contractorsFindings.binCentreDefects.rollerShutterDoesNotFullyClose) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Roller shutter that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.binCentreDefects.rollerShutterDoesNotFullyClose}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- BIN CENTRE DEFECTS ----- */}

          {/* ----- INFRASTRUCTURE DEFECTS ----- */}
          {contractorsFindings?.infrastructureDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Infrastructure Defects</p>

              {!isNil(contractorsFindings.infrastructureDefects.brokenDamagedDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Broken/ Damaged BC door</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.infrastructureDefects.brokenDamagedDoor}</div>
                </div>
              )}

              {!isNil(contractorsFindings.infrastructureDefects.doorUnableToCloseFully) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Door unable to close fully</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.infrastructureDefects.doorUnableToCloseFully}</div>
                </div>
              )}

              {!isNil(contractorsFindings.infrastructureDefects.missingDefectiveGullyTrapCovers) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Missing/Defective Gully trap Covers</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.infrastructureDefects.missingDefectiveGullyTrapCovers}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- INFRASTRUCTURE DEFECTS ----- */}

          {/* ----- CRC DEFECTS ----- */}
          {contractorsFindings?.crcDefects && (
            <div className="mb-5">
              <p className="mb-2 text-underline">CRC Defects</p>

              {!isNil(contractorsFindings.crcDefects.gapsShutterDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Gaps below/at side of roller shutter door</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.crcDefects.gapsShutterDoor}</div>
                </div>
              )}

              {!isNil(contractorsFindings.crcDefects.gapsSideDoor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Gaps at side door that does not close fully</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.crcDefects.gapsSideDoor}</div>
                </div>
              )}

              {!isNil(contractorsFindings.crcDefects.entryPoints) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Entry Points due to defects/design of building</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.crcDefects.entryPoints}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- CRC DEFECTS ----- */}

          {/* ----- POOR PRACTICES ----- */}
          {contractorsFindings?.poorPractices && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Poor Practices</p>

              {!isNil(contractorsFindings.poorPractices.uncoveredBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of damaged/ uncovered bins</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.poorPractices.uncoveredBinsCompactor}</div>
                </div>
              )}

              {!isNil(contractorsFindings.poorPractices.storageOfBulkyItems) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of stored bulky items</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.poorPractices.storageOfBulkyItems}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- POOR PRACTICES ----- */}

          {/* ----- SANITATION ----- */}
          {contractorsFindings?.sanitation && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Sanitation</p>

              {type === 'Bin Chute' && !isNil(contractorsFindings.sanitation.chokedGullyTraps) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Chocked gully traps</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.sanitation.chokedGullyTraps}</div>
                </div>
              )}

              {type === 'Bin Centre' && !isNil(contractorsFindings.sanitation.chokedScrupperDrains) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Presence of choked scupper drains</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.sanitation.chokedScrupperDrains}</div>
                </div>
              )}

              {!isNil(contractorsFindings.sanitation.refuseSpillage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Refuse Spillage</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.sanitation.refuseSpillage}</div>
                </div>
              )}

              {type === 'Bin Centre' && !isNil(contractorsFindings.sanitation.chokedDrainage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Chocked drainage manhole cover</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.sanitation.chokedDrainage}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- SANITATION ----- */}

          {/* ----- COMPACTOR MANAGEMENT ----- */}
          {contractorsFindings?.compactorManagement && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Compactor Management</p>

              {!isNil(contractorsFindings.compactorManagement.noCompactorOutletHoseAttached) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">No Compactor outlet hose attached</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.compactorManagement.noCompactorOutletHoseAttached}</div>
                </div>
              )}

              {!isNil(contractorsFindings.compactorManagement.damagedCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Compactor Damaged or Not closed</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.compactorManagement.damagedCompactor}</div>
                </div>
              )}

              {!isNil(contractorsFindings.compactorManagement.outletHoseNotDraining) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Outlet hose NOT draining to mainhole</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.compactorManagement.outletHoseNotDraining}</div>
                </div>
              )}

              {!isNil(contractorsFindings.compactorManagement.overflowingBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Overflowing Bins/ Compactor</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.compactorManagement.overflowingBinsCompactor}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- COMPACTOR MANAGEMENT ----- */}

          {/* ----- POOR REFUSE MANAGEMENT ----- */}
          {contractorsFindings?.poorRefuseManagement && (
            <div className="mb-5">
              <p className="mb-2 text-underline">Poor Refuse Management</p>

              {!isNil(contractorsFindings.poorRefuseManagement.refuseSpillage) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Refuse Spillage</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.poorRefuseManagement.refuseSpillage}</div>
                </div>
              )}

              {!isNil(contractorsFindings.poorRefuseManagement.overflowingBinsCompactor) && (
                <div className="row mb-2">
                  <div className="col-md-3 col-lg-3 font-weight-bold">Overflowing Bins/ Compactor</div>
                  <div className="col-md-9 col-lg-4">{contractorsFindings.poorRefuseManagement.overflowingBinsCompactor}</div>
                </div>
              )}
            </div>
          )}
          {/* ----- POOR REFUSE MANAGEMENT ----- */}

          {/* ----- REMARKS ----- */}
          {contractorsFindings?.remarks && (
            <div className="mb-5">
              <div className="row mb-2">
                <div className="col-md-3 col-lg-3 font-weight-bold">Remarks</div>
                <div className="col-md-9 col-lg-4">{contractorsFindings.remarks}</div>
              </div>
            </div>
          )}
          {/* ----- REMARKS ----- */}

          {/* <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Active Burrows</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.numberOfBorrows || contractorsFindings?.noOfBurrows}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">No. of Defects</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.numberOfDefects || contractorsFindings?.noOfDefects}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Habitat</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.habitat}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Probable Cause</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.probableCause}</div>
          </div> */}

          {/* ----- ACTION TAKEN ----- */}
          {contractorsFindings?.actionTaken && (
            <div className="mb-5">
              <div className="row mb-2">
                <div className="col-md-3 col-lg-3 font-weight-bold">Action Taken</div>
                <div className="col-md-9 col-lg-4">{contractorsFindings?.actionTaken}</div>
              </div>
            </div>
          )}
          {/* ----- ACTION TAKEN ----- */}

          {/* ----- PHOTOS ----- */}

          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Photos</div>
            <div className="col-12">
              {contractorsFindings?.photos && contractorsFindings?.photos.length > 0 && <BinaryFileGallery fileIdList={contractorsFindings?.photos?.map((photo) => photo.fileId)} />}
              {contractorsFindings?.fileList && contractorsFindings?.fileList.length > 0 && <BinaryFileGallery fileIdList={contractorsFindings?.fileList} />}
            </div>
          </div>
          {/* ----- PHOTOS ----- */}
        </div>
      </div>
    </div>
  );
};

export default ContractorFindings;
