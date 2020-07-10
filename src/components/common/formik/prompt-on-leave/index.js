import React from 'react';
import { Prompt } from 'react-router-dom';

const PromptOnLeave = (props) => {
  const { dirty } = props;
  if (dirty) {
    onbeforeunload = (e) => 'There are unsaved changes, do you want to proceed?';
  } else {
    onbeforeunload = null;
  }
  return <Prompt when={dirty} message="There are unsaved changes, do you want to proceed?" />;
};

export default PromptOnLeave;
