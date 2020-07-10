import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { tableColumnWidth } from 'constants/index';

import Select from 'components/common/select';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { getServiceStatusService, getPerformanceMetricsService, getServiceNodesService } from 'services/dashboard';
import { actionTryCatchCreator, openNewTab } from 'utils';

import PerformanceMetrics from './performance-metrics';
import DiskSummary from './disk-summary';

const ServiceStatus = () => {
  const [nodes, setNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState();
  const [serviceStatuses, setServiceStatuses] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [diskSummary, setDiskSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getServiceNodesAction = () => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      const list = data.results || [];
      setNodes(list.map((item) => ({ label: item.Caption || item.caption, value: item.NodeID })));
      if (list.length > 0) {
        setCurrentNode(list[0]);
      }
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    const params = { parameters: {}, query: 'SELECT  NodeID,IPAddress,  Caption, NodeDescription FROM Orion.Nodes' };

    actionTryCatchCreator(getServiceNodesService(params), onPending, onSuccess, onError);
  };

  const getPerformanceMetricsAction = (nodeId) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setPerformanceMetrics(data.results || []);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    const params = {
      parameters: {},
      query: `select top 1  n.nodeid, n.IPAddress,n.Status,n.StatusDescription,n.MemoryAvailable,n.MemoryUsed,n.TotalMemory, n.caption,n.cpuCount,n.cpuload, n.percentmemoryused, v.VolumePercentUsed, v.VolumeSize, v.VolumeSpaceUsed,  v.VolumeSpaceAvailable from Orion.Nodes n  , Orion.Volumes v where v.nodeid = n.Nodeid and n.nodeid=${nodeId}`,
    };

    actionTryCatchCreator(getPerformanceMetricsService(params), onPending, onSuccess, onError);
  };

  const getServiceStatusAction = (nodeId) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setServiceStatuses(data.results || []);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    const params = { parameters: {}, query: `SELECT ApplicationID, Name, DisplayName, NodeID, Status, StatusDescription FROM Orion.APM.Application where NodeID=${nodeId}` };

    actionTryCatchCreator(getServiceStatusService(params), onPending, onSuccess, onError);
  };

  const getDiskSummaryAction = (nodeId) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDiskSummary(data.results || []);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);

    const params = {
      parameters: {},
      query: `SELECT  NodeID, VolumeID,  Caption, Size, VolumePercentUsed, VolumeDescription, VolumeSize, VolumeSpaceUsed,  VolumeSpaceAvailable, DisplayName,  VolumePercentAvailable,VolumeSpaceAvailableExp, DeviceId FROM Orion.Volumes where VolumeType='Fixed Disk' and nodeID=${nodeId}`,
    };

    actionTryCatchCreator(getServiceStatusService(params), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getServiceNodesAction();
  }, []);

  useEffect(() => {
    if (currentNode) {
      getPerformanceMetricsAction(currentNode.value);
      getServiceStatusAction(currentNode.value);
      getDiskSummaryAction(currentNode.value);
    }
  }, [currentNode]);

  const openSummaryView = () => {
    openNewTab(process.env.REACT_APP_SOLAR_WINDS_SUMMARY_VIEW_URL);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="tab-pane__group bg-white">
            <p className="tab-pane__title text-bold">
              <span className="cursor-pointer" onClick={openSummaryView}>
                Service Status
              </span>
            </p>
            <div className="card p-0">
              <div className="card-body">
                <DataTable
                  data={serviceStatuses}
                  tableClassName="header-white"
                  columns={[
                    {
                      Header: 'Service',
                      accessor: 'DisplayName',
                      minWidth: tableColumnWidth.xxl,
                    },
                    {
                      Header: 'Status',
                      accessor: 'StatusDescription',
                      minWidth: tableColumnWidth.md,
                    },
                  ]}
                  rightHeaderContent={
                    <div className="d-flex align-items-center">
                      <Select className="wf-300 d-inline-block" options={nodes} value={currentNode} onChange={(item) => setCurrentNode(item)} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <PerformanceMetrics data={performanceMetrics} />
        <DiskSummary data={diskSummary} caption={currentNode?.label} />
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ServiceStatus));
