import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { openNewTab } from 'utils';

const NavbarItem = (props) => {
  const { item, active, userRole, onClick, functionNameList } = props;
  const hasSubMenu = item.subMenus?.length > 0;
  const openActive = active === item.name || item.subMenus?.find((subMenu) => subMenu.name === active) != null;

  const [isOpen, toggle] = useState(openActive);

  return (
    <li className={`${item.className} ${active === item.name ? 'active' : ''}`}>
      {hasSubMenu && (
        <>
          <span className={`${isOpen ? 'upArrow' : 'downArrow'}`} onClick={() => toggle((oldValue) => !oldValue)}>
            {item.name}
          </span>

          <Collapse isOpen={isOpen}>
            <ul className="subNav subNavCont">
              {item.subMenus &&
                item.subMenus
                  .filter((subMenu) => {
                    if (subMenu.roles) return subMenu.roles.length === 0 || subMenu.roles.map((role) => role.name).includes(userRole.name);
                    if (subMenu.functionNames) return subMenu.functionNames.length === 0 || functionNameList.filter((item) => subMenu.functionNames.includes(item)).length > 0;
                    return false;
                  })
                  .map((subMenu, sIndex) => (
                    <li key={`navbar_menu_${item.name}_submenu_${sIndex + 1}`} className={`${active === subMenu.name ? 'active' : ''}`}>
                      <Link to={subMenu.href || subMenu.url} onClick={onClick}>
                        {subMenu.name}
                      </Link>
                    </li>
                  ))}
            </ul>
          </Collapse>
        </>
      )}
      {!hasSubMenu && (
        <Link
          to={item.href || item.url}
          onClick={
            item.newTab
              ? (e) => {
                  e.preventDefault();
                  openNewTab(item.url);
                }
              : onClick
          }>
          {item.name}
        </Link>
      )}
    </li>
  );
};

export default NavbarItem;
