import React from 'react';

const ResetButton = ({ onReset = () => {} }) => (
  <div className="text-center pb-2">
    <button type="button" className="btn btn-pri mt-2 mr-2 " style={{ minWidth: 'auto' }} onClick={onReset}>
      Reset
    </button>
  </div>
);

export default ResetButton;
