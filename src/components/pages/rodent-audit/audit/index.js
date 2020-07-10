import React from 'react';
import { BaseTypes, OptionalTypes, FeedbackTypes } from '../helper';

import BaseTypeAudit from './base-types';
import OptionalTypeAudit from './optional-types';
import FeedbackTypeAudit from './feedback-types';

const Audit = (props) => {
  const { type } = props;

  if (BaseTypes.includes(type)) return <BaseTypeAudit {...props} />;
  if (OptionalTypes.includes(type)) return <OptionalTypeAudit {...props} />;
  if (FeedbackTypes.includes(type)) return <FeedbackTypeAudit {...props} />;
  return <></>;
};

export default Audit;
