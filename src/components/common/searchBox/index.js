import React, { Component } from 'react';
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg';
import Select from 'components/common/select';
import './style.scss';

class SearchBox extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const { autoFocus } = this.props;
    if (autoFocus) {
      this.inputRef.focus();
    }
  }

  render() {
    const { className, onSubmit, onChangeText, placeholder, name, searchTypes, onChangeSearchType, value, disabled } = this.props;
    const searchInput = (
      <div className="searchWrapper mainSearch">
        <input
          type="text"
          name={name}
          className="searchTextfield"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          ref={(input) => {
            this.inputRef = input;
          }}
          disabled={disabled}
        />
        <SearchIcon className="searchIcon" style={{ pointerEvents: 'none' }} />
      </div>
    );

    const hasSelect = searchTypes && searchTypes.length > 0;

    return (
      <ul className={`navbar-nav searchFilter ${className}`}>
        <li>
          <div className={`searchForm ${hasSelect ? 'hasSelect' : ''}`}>
            {hasSelect && (
              <Select
                className="wf-250"
                options={searchTypes}
                onChange={(type) => {
                  if (onChangeSearchType) onChangeSearchType(type.value);
                }}
                noRightCorner
              />
              // <div className="form-group searchTypeList showList">
              //   <select
              //     className="form-control"
              //     id="sel1"
              //     onChange={e => onChangeSearchType && onChangeSearchType(e.target.value)}
              //   >
              //     {searchTypes.map((item, index) => (
              //       <option key={`search_type_list__${index.toString()}`} value={item.value}>
              //         {item.label}
              //       </option>
              //     ))}
              //   </select>
              // </div>
            )}
            {onSubmit ? (
              <form style={{ display: 'flex', flex: 1 }} onSubmit={onSubmit}>
                {searchInput}
              </form>
            ) : (
              searchInput
            )}
          </div>
        </li>
      </ul>
    );
  }
}

export default SearchBox;
