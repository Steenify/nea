import React from 'react';
import uuid from 'uuid/v4';
import './style.scss';

const Checkbox = (props) => {
  const { onChange, checked, label = '', className, labelClassName } = props;
  const id = uuid();
  return (
    <div className={`custom-control custom-checkbox ${className}`}>
      <input {...props} id={id} type="checkbox" className="custom-control-input" checked={checked} onChange={onChange} />
      <label className={`custom-control-label ${labelClassName}`} htmlFor={id} style={{ paddingLeft: '5px' }}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
