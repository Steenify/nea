import React from 'react';
import { BaseTypes, OptionalTypes, FeedbackTypes } from '../helper';

import BaseTypeContractorFindings from './base-types';
import OptionalTypeContractorFindings from './optional-types';
import FeedbackTypeContractorFindings from './feedback-types';

const ContractorFindings = (props) => {
  const { type } = props;

  if (BaseTypes.includes(type)) return <BaseTypeContractorFindings {...props} />;
  if (OptionalTypes.includes(type)) return <OptionalTypeContractorFindings {...props} />;
  if (FeedbackTypes.includes(type)) return <FeedbackTypeContractorFindings {...props} />;
  return <></>;
};

export default ContractorFindings;
