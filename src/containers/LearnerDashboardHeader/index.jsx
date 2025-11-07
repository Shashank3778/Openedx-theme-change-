import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
//import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';
import CustomHeader from './Customheader';
import CustomSidebar from './CustomSidebar';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';

//import './index.scss';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });

  // local state for sidebar open & user menu state (sidebar contains user menu)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (pageId) => {
    // you can map internal ids to local actions
    // Example: set page state or route using history.push
    console.log('navigate to', pageId);
  };

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <>
      <ConfirmEmailBanner />
      <CustomHeader
        title="Learner Dashboard"
        onToggleSidebar={toggleSidebar}
      />

      <CustomSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        mainMenuItems={learnerHomeHeaderMenu.mainMenu}
        secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
        userMenuItems={learnerHomeHeaderMenu.userMenu}
        onNavigate={handleNavigate}
      />

      <MasqueradeBar />
    </>
  );
};

export default LearnerDashboardHeader;