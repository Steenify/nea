import React from 'react';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { ReactComponent as MeatballMenu } from 'assets/svg/meatball-menu.svg';

const MeatBallDropdown = (props) => {
  const { actions, className } = props;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <UncontrolledDropdown className={className}>
        <DropdownToggle tag="span">
          <MeatballMenu height={32} />
        </DropdownToggle>
        <DropdownMenu>
          {actions &&
            actions.map((action, index) => (
              <div key={`meatball_menu_${action.title}_${index + 1}`}>
                <DropdownItem onClick={action.onClick}>{action.title}</DropdownItem>
                {index !== actions.length - 1 && <DropdownItem divider />}
              </div>
            ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default MeatBallDropdown;
