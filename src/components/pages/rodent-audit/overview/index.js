import React from 'react';
import { BaseTypes, OptionalTypes, FeedbackTypes } from '../helper';

import BaseTypeOverview from './base-types';
import OptionalTypeOverview from './optional-types';
import FeedbackTypeOverview from './feedback-types';

const Overview = (props) => {
  const { type } = props;

  if (BaseTypes.includes(type)) return <BaseTypeOverview {...props} />;
  if (OptionalTypes.includes(type)) return <OptionalTypeOverview {...props} />;
  if (FeedbackTypes.includes(type)) return <FeedbackTypeOverview {...props} />;
  return <></>;
};

export default Overview;
