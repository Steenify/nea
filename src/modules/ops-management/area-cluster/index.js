import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Accordion from 'components/common/accordion';
import DataTable from 'components/common/data-table';
import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import './style.scss';

import InPageLoading from 'components/common/inPageLoading';
import Select from 'components/common/select';
import { toast } from 'react-toastify';

import ArcgisMap from 'components/common/arcgis-map';

import { getAllActiveOperationsAction, getActiveOperationsForUserAction, searchActiveOperationsAction, getActiveOpsSGAction, resetAreaCluster } from './action';

const OpsAreaManagementDashboard = (props) => {
  const {
    resetAreaCluster,
    getAllActiveOperationsAction,
    getActiveOperationsForUserAction,
    searchActiveOperationsAction,
    getActiveOpsSGAction,
    history,
    ui: { isLoading },
    data: { activeOpsForUser, allActiveOps, searchActiveOps, activeOpsSG },
    //
    functionNameList,
  } = props;

  const [searchType, setSearchType] = useState({ value: 'id', label: 'Operation ID' });
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.LANDING_PAGE.name}`;
    resetAreaCluster();
    if (functionNameList.includes(FUNCTION_NAMES.getAllActiveOpsRO)) {
      getAllActiveOperationsAction();
    }
    if (functionNameList.includes(FUNCTION_NAMES.getActiveOpsUser)) {
      getActiveOperationsForUserAction({ status: true });
    }
    if (functionNameList.includes(FUNCTION_NAMES.getActiveOpsSG)) {
      getActiveOpsSGAction();
    }
  }, [functionNameList, resetAreaCluster, getAllActiveOperationsAction, getActiveOperationsForUserAction, getActiveOpsSGAction]);

  const goToDetail = (data) => {
    history.push(WEB_ROUTES.OPS_AREA.OPERATION_DETAIL.url, data);
  };

  const searchOps = () => {
    if (functionNameList.includes(FUNCTION_NAMES.getActiveOps)) {
      searchActiveOperationsAction({ [searchType.value]: searchText }, (list) => {
        if (list.length === 0) {
          toast.error('No Record found');
        }
      });
    }
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.OPS_AREA.LANDING_PAGE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.LANDING_PAGE]} />
          <div className="mainPadding">
            <div className="mapWrapper paddingBottom30">
              <Accordion isOpen headerChildren={<div className="bold-font mb-3 mt-3">Operation Maps</div>}>
                <ArcgisMap isHeaderHidden={false} />
              </Accordion>
            </div>

            <div className="activeOperSearch">
              <div className="row align-items-center">
                {functionNameList.includes(FUNCTION_NAMES.getActiveOps) && (
                  <div className="col-md-12 col-lg-9 borderRight paddingTop20 paddingBottom20">
                    <div className="row align-items-center">
                      <div className="col-md-12 col-lg-3 bold-font">Search for Active Operations</div>
                      <div className="col-md-11 col-lg-9 d-flex">
                        <Select
                          className="wf-200 m-1"
                          options={[
                            { value: 'id', label: 'Operation ID' },
                            { value: 'clusterId', label: 'Cluster ID' },
                            { value: 'sectorId', label: 'Sector ID' },
                          ]}
                          value={searchType}
                          onChange={setSearchType}
                        />
                        <input
                          type="text"
                          className="hf-40 m-1 w-50 textfield"
                          placeholder="Search by Operation ID / Cluster ID / Section ID"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button type="button" className="btn btn-sec m-1" onClick={searchOps}>
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {functionNameList.includes(FUNCTION_NAMES.createAdhocOps) && (
                  <div className="col-lg-2 col-md-12 marginTop20 paddingBottom20 ml-5 mr-5">
                    <button type="button" className="btn btn-sec" onClick={() => history.push(WEB_ROUTES.OPS_AREA.CREATE_OPERATION.url)}>
                      Create New Operations
                    </button>
                  </div>
                )}
              </div>
              <div className="row activeOperations">
                {searchActiveOps
                  .filter((ops) => !ops.islinked)
                  .map((ops) => (
                    <div className="col-md-6 mb-4 cursor-pointer" key={`active_ops_for_user_${ops.id}`} onClick={() => goToDetail(ops)}>
                      <div clsssName="row">
                        <div className="col-md-12 col-lg-11 paddingLeft0">
                          <div className="operationCard">
                            <div className="operationsHeader">
                              <div>Operation ID: {ops.id}</div>
                              <div>Type: {ops.opsType}</div>
                            </div>
                            <div className="opertionDesc">
                              <div className="operDetails">
                                <div className="fLeft">
                                  <span>Cluster ID: </span>
                                </div>
                                <div className="fLeft">{ops.clusterId}</div>
                                <div className="clearfix" />
                              </div>
                              <div className="operDetails">
                                <div className="fLeft">
                                  <span>Cluster Locality: </span>
                                </div>
                                <div className="fLeft">{ops.clusterLocality}</div>
                                <div className="clearfix" />
                              </div>
                              <div className="operDetails">
                                <div className="fLeft">
                                  <span>Case Size: </span>
                                </div>
                                <div className="fLeft">{ops.caseSize}</div>
                                <div className="clearfix" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {functionNameList.includes(FUNCTION_NAMES.getActiveOpsUser) && (
              <div className="activeOperations paddingTop30 paddingBottom40">
                <div className="bold-font paddingBottom20">My Active Operations</div>
                <div className="row">
                  {activeOpsForUser
                    .filter((ops) => !ops.islinked)
                    .map((ops) => (
                      <div className="col-md-6 mb-4 cursor-pointer" key={`active_ops_for_user_${ops.id}`} onClick={() => goToDetail(ops)}>
                        <div className="row">
                          <div className="col-md-12 col-lg-11 paddingLeft0">
                            <div className="operationCard">
                              <div className="operationsHeader">
                                <div>Operation ID: {ops.id}</div>
                                <div>Type: {ops.opsType}</div>
                              </div>
                              <div className="opertionDesc">
                                <div className="operDetails">
                                  <div className="fLeft">
                                    <span>Cluster ID: </span>
                                  </div>
                                  <div className="fLeft">{ops.clusterId}</div>
                                  <div className="clearfix" />
                                </div>
                                <div className="operDetails">
                                  <div className="fLeft">
                                    <span>Cluster Locality: </span>
                                  </div>
                                  <div className="fLeft">{ops.clusterLocality}</div>
                                  <div className="clearfix" />
                                </div>
                                <div className="operDetails">
                                  <div className="fLeft">
                                    <span>Case Size: </span>
                                  </div>
                                  <div className="fLeft">{ops.caseSize}</div>
                                  <div className="clearfix" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {functionNameList.includes(FUNCTION_NAMES.getAllActiveOpsRO) && (
              <div className="paddingTop40 paddingBottom40">
                <div className="bold-font paddingBottom20">Active Operations in My RO</div>
                <DataTable
                  data={[...activeOpsForUser, ...allActiveOps].filter((ops) => !ops.islinked)}
                  columns={[
                    { Header: 'Operations ID', accessor: 'id', minWidth: tableColumnWidth.lg },
                    {
                      Header: 'Cluster/Sector ID',
                      accessor: 'clusterId',
                      minWidth: tableColumnWidth.xl,
                      Cell: (cellInfo) => `${cellInfo?.original?.clusterId} ${cellInfo?.original?.sectorId && cellInfo?.original?.clusterId && '/'} ${cellInfo?.original?.sectorId}`,
                    },
                    { Header: 'Cluster Locality', accessor: 'clusterLocality', minWidth: tableColumnWidth.xl },
                    { Header: 'Case Size', accessor: 'caseSize', minWidth: tableColumnWidth.md },
                    { Header: 'Operation Planning Officer', accessor: 'opsPlanningOfficer', minWidth: tableColumnWidth.xl },
                  ]}
                  getTrProps={(_state, rowInfo) => ({ onClick: () => goToDetail(rowInfo?.original), className: 'cursor-pointer' })}
                />
              </div>
            )}
            {functionNameList.includes(FUNCTION_NAMES.getActiveOpsSG) && (
              <div className="paddingTop40 paddingBottom40">
                <div className="bold-font paddingBottom20">Active Operations in Singapore</div>
                <DataTable
                  data={activeOpsSG.filter((ops) => !ops.islinked)}
                  columns={[
                    { Header: 'Operations ID', accessor: 'id', minWidth: tableColumnWidth.lg },
                    {
                      Header: 'Cluster/Sector ID',
                      accessor: 'clusterId',
                      minWidth: tableColumnWidth.xl,
                      Cell: (cellInfo) => `${cellInfo?.original?.clusterId} ${cellInfo?.original?.sectorId && cellInfo?.original?.clusterId && '/'} ${cellInfo?.original?.sectorId}`,
                    },
                    { Header: 'Cluster Locality', accessor: 'clusterLocality', minWidth: tableColumnWidth.xl },
                    { Header: 'Case Size', accessor: 'caseSize', minWidth: tableColumnWidth.md },
                    { Header: 'Operation Planning Officer', accessor: 'opsPlanningOfficer', minWidth: tableColumnWidth.xl },
                  ]}
                  getTrProps={(_state, rowInfo) => ({ onClick: () => goToDetail(rowInfo?.original), className: 'cursor-pointer' })}
                />
              </div>
            )}
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, opsAreaReducers: { areaCluster } }, ownProps) => ({
  ...ownProps,
  ...areaCluster,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getAllActiveOperationsAction,
  getActiveOperationsForUserAction,
  searchActiveOperationsAction,
  getActiveOpsSGAction,
  resetAreaCluster,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OpsAreaManagementDashboard));
