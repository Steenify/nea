import React from 'react';
import { BaseTypes, OptionalTypes, FeedbackTypes } from '../helper';

import BaseType from './base-types';
import OptionalType from './optional-types';
import FeedbackType from './feedback-types';

const ShowCauseRecommendation = (props) => {
  const { type } = props;

  if (BaseTypes.includes(type)) return <BaseType {...props} />;
  if (OptionalTypes.includes(type)) return <OptionalType {...props} />;
  if (FeedbackTypes.includes(type)) return <FeedbackType {...props} />;
  return <></>;
};

export default ShowCauseRecommendation;
