import React, { useEffect } from 'react';
import { getObject } from 'utils';
import { UserRole } from 'constants/index';

import Admin from 'modules/dashboard/admin';
import User from 'modules/dashboard/user';

const Dashboard = () => {
  const userRole = getObject('userRole');

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  switch (userRole.name) {
    case UserRole.System_Admin.name: {
      return <Admin />;
    }
    default:
      return <User />;
  }
};

export default Dashboard;
