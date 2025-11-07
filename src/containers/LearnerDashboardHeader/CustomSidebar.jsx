import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './CustomSidebar.css';
import { getConfig } from '@edx/frontend-platform';
// optional: use platform auth helper if you want redirectToLogout()
// import { redirectToLogout } from '@edx/frontend-platform/auth';

/**
 * CustomSidebar
 * Props:
 *  - open: boolean
 *  - onClose: function
 *  - mainMenuItems, secondaryMenuItems, userMenuItems (arrays)
 *  - onNavigate(name) -> optional callback when selecting internal page
 */
const CustomSidebar = ({
  open,
  onClose,
  mainMenuItems = [],
  secondaryMenuItems = [],
  userMenuItems = [],
  onNavigate = () => {},
}) => {
  // prevent body scroll when open (optional)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleItemClick = (item) => (e) => {
    // If item has onClick (function), call it (some menu items use analytics callbacks)
    if (typeof item.onClick === 'function') {
      try {
        item.onClick(e);
      } catch (err) {
        // swallow or log
        // eslint-disable-next-line no-console
        console.error('menu onClick error', err);
      }
      // if onClick wants to navigate manually, do not auto navigate
      // if the item also has href, let it continue (below)
    }

    // If the item has href and it's a link, navigate to it.
    if (item.href) {
      // If it's an absolute/external URL, use location directly
      window.location.href = item.href;
      return;
    }

    // Otherwise treat it as internal navigation id
    if (item.id) {
      onNavigate(item.id);
      onClose();
    }
  };

  // render user menu sections: userMenuItems is array of sections { heading, items: [...] }
  return (
    <>
      <div className={`cd-sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`cd-sidebar ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="cd-sidebar-header">
          <div className="cd-logo">Platform</div>
          <button className="cd-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <nav className="cd-nav">
          <ul className="cd-menu">
            {mainMenuItems.map((item, idx) => (
              <li className={`cd-item ${item.isActive ? 'active' : ''}`} key={item.href || item.content || idx}>
                <button type="button" onClick={handleItemClick(item)} className="cd-link">
                  <span className="cd-link-text">{item.content}</span>
                </button>
              </li>
            ))}
          </ul>

          {secondaryMenuItems && secondaryMenuItems.length > 0 && (
            <>
              <hr />
              <ul className="cd-menu">
                {secondaryMenuItems.map((item, idx) => (
                  <li key={item.href || idx} className="cd-item">
                    <button type="button" onClick={handleItemClick(item)} className="cd-link">
                      <span className="cd-link-text">{item.content}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        <div className="cd-user-section">
          {userMenuItems.map((section, sidx) => (
            <div className="cd-user-section-block" key={`sec-${sidx}`}>
              {section.heading ? <div className="cd-user-heading">{section.heading}</div> : null}
              <ul className="cd-user-menu">
                {section.items.map((item, idx) => (
                  <li key={item.href || item.content || idx} className="cd-item">
                    <button type="button" onClick={handleItemClick(item)} className="cd-link">
                      <span className="cd-link-text">{item.content}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

CustomSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mainMenuItems: PropTypes.array,
  secondaryMenuItems: PropTypes.array,
  userMenuItems: PropTypes.array,
  onNavigate: PropTypes.func,
};

export default CustomSidebar;
