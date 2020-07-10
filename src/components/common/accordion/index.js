import React from 'react';
import { Collapse } from 'reactstrap';
import { ReactComponent as ArrowDownIcon } from 'assets/svg/dropdown-arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/svg/dropdown-arrow-up.svg';

import './style.scss';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    const { isOpen } = props;
    this.state = {
      isOpen: isOpen || false,
      // isUpdatedProp: false,
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (!state.isUpdatedProp && props.isOpen !== state.isOpen) {
  //     return {
  //       isOpen: props.isOpen,
  //       isUpdatedProp: true,
  //     };
  //   }
  //   return null;
  // }

  toggle = (isOpen) => {
    if (typeof isOpen === 'boolean') {
      this.setState({
        isOpen,
      });
    } else {
      this.setState((prevState) => ({
        isOpen: !prevState.isOpen,
      }));
    }
  };

  render() {
    const { id, headerColor, headerChildren, isEdit, children } = this.props;
    const { isOpen } = this.state;
    return (
      <div className={`accordion ${headerColor}`} key={id}>
        <div>
          <div className={`accordion-header d-flex align-items-center ${headerColor}`}>
            {headerChildren}

            {isOpen ? (
              <ArrowUpIcon className="ml-auto cursor-pointer" width={24} height={24} onClick={this.toggle} />
            ) : (
              <ArrowDownIcon className="ml-auto cursor-pointer" width={24} height={24} onClick={this.toggle} />
            )}
          </div>
        </div>
        <Collapse isOpen={isOpen} className={isEdit ? 'is-edit' : ''}>
          <div>{children}</div>
        </Collapse>
      </div>
    );
  }
}

export default Accordion;
