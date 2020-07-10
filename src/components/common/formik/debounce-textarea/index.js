import React, { useState } from 'react';

const DebounceTextarea = props => {
  const { value, onBlur } = props;

  const [internalValue, setInternalValue] = useState({ current: value, old: value });

  if (value !== internalValue.current && value !== internalValue.old) {
    setInternalValue({ current: value, old: value });
  }

  return (
    <textarea
      {...props}
      value={internalValue.current}
      onChange={event => setInternalValue({ current: event.target.value, old: internalValue.old })}
      onBlur={() => {
        onBlur(internalValue.current);
        setInternalValue({ current: internalValue.current, old: internalValue.current });
      }}
    />
  );
};

export default DebounceTextarea;
