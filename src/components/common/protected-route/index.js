import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Blocked from 'pages/blocked';

const ProtectedRoute = React.memo((props) => {
  const { component: Component, userRole, path, route, functionNameList, workspaceList, commonPoolList, roles } = props;
  const availableFunctions = [...workspaceList, ...functionNameList, ...commonPoolList];
  const url = route?.path || route?.url || path;

  const functionNames = route?.functionNames || [];

  const loginRoles = roles || route?.roles;
  const isRoleAllowed = loginRoles && (loginRoles.length === 0 || loginRoles.map((role) => role.name).includes(userRole.name));
  const isFunctionNameAllowed = availableFunctions.filter((item) => functionNames.includes(item)).length > 0 || functionNames.length === 0;

  const isAllowed = isRoleAllowed || isFunctionNameAllowed;

  return (
    <Switch>
      <Route exact path={url} render={(props) => (isAllowed ? <Component {...props} /> : <Blocked />)} />
    </Switch>
  );
});

ProtectedRoute.defaultProps = {
  userRole: {},
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  userRole: global.ui.userRole,
  functionNameList: global.data.functionNameList,
  workspaceList: global.data.workspaceList,
  commonPoolList: global.data.commonPoolList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
