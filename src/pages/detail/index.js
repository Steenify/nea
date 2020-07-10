import React from 'react';
import { withRouter } from 'react-router-dom';

import InspectionDetail from 'modules/details/inspection';
import OfficerSof from 'modules/details/sof';
import LetterOfIntent from 'modules/details/letter-of-Intent';

import PageNotFound from 'pages/404';

const DetailPage = (props) => {
  const {
    match: { params },
  } = props;

  const { type } = params;
  switch (type) {
    case 'sample':
    case 'inspection':
      return <InspectionDetail />;
    case 'sof':
      return <OfficerSof />;
    case 'loi':
      return <LetterOfIntent />;
    default:
      return <PageNotFound />;
  }
};
export default withRouter(DetailPage);
