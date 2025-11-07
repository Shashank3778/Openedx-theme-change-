import React from 'react';
import PropTypes from 'prop-types';
import './CustomHeader.css';

/**
 * CustomHeader
 * Props:
 *  - mainMenuItems, secondaryMenuItems, userMenuItems (from learnerHomeHeaderMenu)
 *  - onToggleSidebar() -> toggle sidebar open/close
 */
const CustomHeader = ({ title, onToggleSidebar }) => {
  return (
    <header className="cd-header">
      <div className="cd-left">
        <button
          className="cd-hamburger"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <i className="hamburger-icon">☰</i>
        </button>
        <div className="cd-title">{title}</div>
      </div>

      <div className="cd-right">
        {/* Add any right-side controls here (search, notifications, etc.) */}
      </div>
    </header>
  );
};

CustomHeader.propTypes = {
  title: PropTypes.string,
  onToggleSidebar: PropTypes.func.isRequired,
};

CustomHeader.defaultProps = {
  title: 'Dashboard',
};

export default CustomHeader;
