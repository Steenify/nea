import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';

const SearchableCheckList = (props) => {
  const {
    title,
    options = [],
    onChange,
    data = [],
    placeholder = 'Optional',
    singleChoice,
    isError,
    // className,
    hideOptionAll,
    large,
  } = props;

  const [selectedList, setSelectedList] = useState(data);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const availableOptions = options.map((option) => option.value);
    const result = selectedList.filter((item) => availableOptions.includes(item.value));
    setSelectedList(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetList = (list) => {
    const availableOptions = options.map((option) => option.value);
    const result = list.filter((item) => availableOptions.includes(item.value));
    setSelectedList(result);
    if (onChange) onChange(result);
  };

  const onCheck = (option) => {
    if (selectedList.findIndex((item) => item?.value === option?.value) > -1) {
      onSetList(selectedList.filter((item) => item?.value !== option?.value));
    } else if (singleChoice) {
      onSetList([option]);
    } else {
      onSetList([...selectedList, option]);
    }
  };

  const onCheckAll = () => {
    if (selectedList.length === options.length) {
      onSetList([]);
    } else {
      onSetList(options);
    }
  };

  const uniqueId = uuid();

  return (
    <div className="searchToken show">
      <div className="searchWrapper">
        <div className="paddingBottom5">
          <b className="text-body">{title}</b>
        </div>
        <input type="text" className={`searchTextfield ${isError && 'form-error'}`} placeholder={placeholder} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </div>
      <div className={`chkboxCont shadow-sm ${isError && 'form-error'} ${large && 'large'} `}>
        {options.length > 0 && !searchText && !singleChoice && !hideOptionAll && (
          // {options.length > 1 && !searchText && !singleChoice && (
          <div className="custom-control custom-checkbox marginBottom15">
            <input type="checkbox" className="custom-control-input" id={`${uniqueId}-${title}-customCheckAll`} checked={selectedList.length === options.length} onChange={onCheckAll} />
            <label className="custom-control-label text-blue" htmlFor={`${uniqueId}-${title}-customCheckAll`}>
              <p className="mb-0">All</p>
            </label>
          </div>
        )}
        {options
          .filter((item) => item?.label?.toLowerCase().includes(searchText?.toLowerCase()))
          .map((opt, index) => (
            <div key={`${title}-custom-${index + 1}-${opt?.value}`}>
              {singleChoice ? (
                <div className="custom-radio marginBottom15">
                  <input
                    type="radio"
                    className="form-input"
                    id={`${uniqueId}-${title}-customCheck-${index + 1}-${opt?.value}`}
                    name={`${title}-customRadio`}
                    checked={selectedList.findIndex((item) => item?.value === opt?.value) > -1}
                    onChange={() => onCheck(opt)}
                  />
                  <label className="form-label" htmlFor={`${uniqueId}-${title}-customCheck-${index + 1}-${opt?.value}`}>
                    <p className="mb-0">{opt?.label}</p>
                  </label>
                </div>
              ) : (
                <div className="custom-control custom-checkbox marginBottom15">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`${uniqueId}-${title}-customCheck-${index + 1}-${opt?.value}`}
                    checked={selectedList.findIndex((item) => item?.value === opt?.value) > -1}
                    onChange={() => onCheck(opt)}
                  />
                  <label className="custom-control-label" htmlFor={`${uniqueId}-${title}-customCheck-${index + 1}-${opt?.value}`}>
                    <p className="mb-0 text-blue">{opt?.label}</p>
                  </label>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchableCheckList;
