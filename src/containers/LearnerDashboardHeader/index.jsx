import React, { useState, useContext, useEffect } from 'react';
import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';
import ConfirmEmailBanner from './ConfirmEmailBanner';
import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';
import { getConfig } from '@edx/frontend-platform';
import './index.scss';

// optional: create utils/iconUtils.js if you want to use Lucide icons
// import { initLucideIcons } from '../../utils/iconUtils';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = useContext(AppContext);
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });

  return (
    <>
      <ConfirmEmailBanner />

      <div className={`ld-custom-header ${darkMode ? 'dark' : 'light'}`}>
        {/* Left hamburger */}
        <button
          className="ld-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i data-lucide="menu" />
        </button>

        {/* The default Open edX Header stays in center */}
        <Header
          mainMenuItems={learnerHomeHeaderMenu.mainMenu}
          secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
          userMenuItems={learnerHomeHeaderMenu.userMenu}
        />

        {/* Dark mode toggle on right */}
        <button
          className="ld-darkmode-btn"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          <i data-lucide={darkMode ? 'sun' : 'moon'} />
        </button>
      </div>

      {/* Slide-out sidebar */}
      <aside className={`ld-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="ld-sidebar-header">
          <img
            src={getConfig().LOGO_URL}
            alt={getConfig().SITE_NAME}
            className="ld-logo"
          />
          <button onClick={toggleSidebar} aria-label="Close sidebar">
            ✕
          </button>
        </div>
        <nav>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href={`${getConfig().LMS_BASE_URL}/courses`}>Courses</a></li>
            <li><a href={getConfig().ACCOUNT_PROFILE_URL}>Profile</a></li>
            <li><a href={getConfig().LOGOUT_URL}>Logout</a></li>
          </ul>
        </nav>
      </aside>

      <MasqueradeBar />
    </>
  );
};

export default LearnerDashboardHeader;
