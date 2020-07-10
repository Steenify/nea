import React from 'react';

const AddButton = (props) => {
  const { title, onClick, className } = props;
  return (
    <div className={`add-line-item ${className}`}>
      <button type="button" className="add-line--a btn" onClick={onClick}>
        <span className="add-line-plus">+</span>
        <span className="add-line-text">{title}</span>
      </button>
    </div>
  );
};

export default AddButton;
