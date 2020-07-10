import React from 'react';

const FloatingNumber = (props) => {
  const { title, number } = props;
  return (
    <div className="receive__number receive__accepted">
      <span className="receive__label">{title}</span>
      <span>{number}</span>
    </div>
  );
};

export default FloatingNumber;
