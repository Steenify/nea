import React from 'react';

const GoBackButton = (props) => {
  const { children, onClick, title } = props;
  return (
    <div className="go-back d-flex align-items-center">
      <span onClick={onClick}>
        <h1>{title}</h1>
      </span>
      {children}
    </div>
  );
};

export default GoBackButton;
