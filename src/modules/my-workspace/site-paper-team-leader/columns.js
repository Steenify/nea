import React from 'react';
import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES, GRAVITRAP_TASK_TYPE, SITE_PAPER_STATUS } from 'constants/index';
import MeatBallDropdown from 'components/common/meatball-dropdown';

export const PendingResubmissionColumn = (push = () => {}) => [
  {
    Header: 'Task ID',
    accessor: 'id',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => (
      <span
        className="text-blue cursor-pointer"
        onClick={() => {
          if (cellInfo && cellInfo.row) {
            push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
              caseInfo: cellInfo?.row?._original,
              fromFunction: FUNCTION_NAMES.geRejectedSiteAudit,
            });
          }
        }}>
        {cellInfo.row.id}
      </span>
    ),
  },
  {
    Header: 'Division',
    accessor: 'divCode',
  },

  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Trap Code',
    accessor: 'trapCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Eweek',
    accessor: 'mappedWeek',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Date',
    accessor: 'auditdate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Time',
    accessor: 'auditTime',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Rejection Date',
    accessor: 'rejectionDate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Rejection Time',
    accessor: 'rejectionTime',
    minWidth: tableColumnWidth.md,
  },
];

export const PendingApprovalShowCauseColumn = (push = () => {}, showTeamLeadCol = false) => [
  {
    Header: 'Task ID',
    accessor: 'id',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => {
      const auditRepotType = cellInfo?.row?._original?.auditRepotType || '';
      if (auditRepotType.toUpperCase() !== GRAVITRAP_TASK_TYPE.PAPER && auditRepotType.toUpperCase() !== GRAVITRAP_TASK_TYPE.SITE) {
        return cellInfo.row.id;
      }
      return (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            if (cellInfo && cellInfo.row) {
              // const reportType = cellInfo?.row?._original?.auditRepotType || '';
              push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
                caseInfo: cellInfo?.row?._original,
                fromFunction: FUNCTION_NAMES.getPendingapprovalShowcause,
              });
            }
          }}>
          {cellInfo.row.id}
        </span>
      );
    },
  },
  {
    Header: 'Type',
    accessor: 'auditRepotType',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Division',
    accessor: 'divCode',
  },

  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Trap Code',
    accessor: 'trapCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Eweek',
    accessor: 'mappedWeek',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Date',
    accessor: 'auditdate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Time',
    accessor: 'auditTime',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Auditor',
    accessor: 'auditor',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Team Lead',
    accessor: 'teamLead',
    maxWidth: showTeamLeadCol ? undefined : 0,
    show: showTeamLeadCol,
    minWidth: tableColumnWidth.md,
  },
];

export const LiaisingColumn = (push = () => {}, showTeamLeadCol = true) => [
  {
    Header: 'Task ID',
    accessor: 'id',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => (
      <span
        className="text-blue cursor-pointer"
        onClick={() => {
          if (cellInfo && cellInfo.row) {
            push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
              caseInfo: cellInfo?.row?._original,
              fromFunction: FUNCTION_NAMES.getLocSitePaperAudit,
            });
          }
        }}>
        {cellInfo.row.id}
      </span>
    ),
  },
  {
    Header: 'Type',
    accessor: 'auditRepotType',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Division',
    accessor: 'divCode',
  },

  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Trap Code',
    accessor: 'trapCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Eweek',
    accessor: 'mappedWeek',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Date',
    accessor: 'auditdate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Time',
    accessor: 'auditTime',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Auditor',
    accessor: 'auditor',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Team Lead',
    accessor: 'teamLead',
    maxWidth: showTeamLeadCol ? undefined : 0,
    show: showTeamLeadCol,
    minWidth: tableColumnWidth.md,
  },
];

export const RejectedLdColumn = (push = () => {}, showTeamLeadCol = true) => [
  {
    Header: 'Task ID',
    accessor: 'id',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => {
      const auditRepotType = cellInfo?.row?._original?.auditRepotType || '';
      if (auditRepotType !== GRAVITRAP_TASK_TYPE.PAPER && auditRepotType !== GRAVITRAP_TASK_TYPE.SITE) {
        return cellInfo.row.id;
      }
      return (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            if (cellInfo && cellInfo.row) {
              push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
                caseInfo: cellInfo?.row?._original,
                fromFunction: FUNCTION_NAMES.geRejectedSiteAuditDyhead,
              });
            }
          }}>
          {cellInfo.row.id}
        </span>
      );
    },
  },
  {
    Header: 'Type',
    accessor: 'auditRepotType',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Division',
    accessor: 'divCode',
  },

  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Trap Code',
    accessor: 'trapCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Eweek',
    accessor: 'mappedWeek',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Date',
    accessor: 'auditdate',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Audit Time',
    accessor: 'auditTime',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Auditor',
    accessor: 'auditor',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Team Lead',
    accessor: 'teamLead',
    maxWidth: showTeamLeadCol ? undefined : 0,
    show: showTeamLeadCol,
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Lapses',
    accessor: 'lapseDescription',
    minWidth: tableColumnWidth.lg,
  },
];

export const LDPendingApproveColumn = (push = () => {}, isApproved = false) => [
  {
    Header: 'Month / Year',
    accessor: 'monthyear',
    minWidth: tableColumnWidth.lg,
    maxWidth: 300,
  },
  {
    Header: 'Total Liquidated Damage Amount',
    accessor: 'totalLDAmount',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => {
      const status = isApproved ? SITE_PAPER_STATUS.LD_APPROVED : SITE_PAPER_STATUS.LD_SUPPORTED;
      const caseInfo = cellInfo?.row?._original || {};
      return (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            if (cellInfo && cellInfo.row) {
              push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.LD_APPROVAL.url, {
                caseInfo: { ...caseInfo, status },
              });
            }
          }}>
          {cellInfo.row.totalLDAmount}
        </span>
      );
    },
  },
];

export const LDPendingSupportColumn = (push = () => {}, handleSupport = (_id = '', _status = '') => {}) => [
  {
    Header: 'Task ID',
    accessor: 'id',
    minWidth: tableColumnWidth.lg,
    Cell: (cellInfo) => {
      const auditRepotType = cellInfo?.row?._original?.auditRepotType || '';
      if (auditRepotType !== GRAVITRAP_TASK_TYPE.PAPER && auditRepotType !== GRAVITRAP_TASK_TYPE.SITE) {
        return cellInfo?.row?.id || '';
      }
      return (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            if (cellInfo && cellInfo.row) {
              push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL.url, {
                caseInfo: cellInfo?.row?._original,
                fromFunction: FUNCTION_NAMES.getPendingSupportWorkspaceListing,
              });
            }
          }}>
          {cellInfo?.row?.id || ''}
        </span>
      );
    },
  },
  {
    Header: 'Type',
    accessor: 'auditRepotType',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Division',
    accessor: 'divCode',
  },

  {
    Header: 'Address',
    accessor: 'address',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Trap Code',
    accessor: 'trapCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Month',
    accessor: 'mappedMonth',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Lapses',
    accessor: 'lapseDescription',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Action',
    accessor: 'action',
    className: 'rt-overflow-visible',
    minWidth: tableColumnWidth.sm,
    Cell: (cellInfo) => {
      const id = cellInfo?.row?._original?.id;
      if (id) {
        return (
          <MeatBallDropdown
            actions={[
              {
                title: 'Support',
                onClick: () => handleSupport(id, SITE_PAPER_STATUS.LD_SUPPORTED),
              },
              {
                title: 'Reject',
                onClick: () => handleSupport(id, SITE_PAPER_STATUS.LD_REJECTED),
              },
            ]}
          />
        );
      }
      return <div />;
    },
  },
];
