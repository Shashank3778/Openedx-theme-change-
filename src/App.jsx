import React, { useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';
import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import { FooterSlot } from '@edx/frontend-component-footer';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import { selectors, actions } from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';
import track from 'tracking';
import fakeData from 'data/services/lms/fakeData/courses';
import AppWrapper from 'containers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './App.scss';

export const App = () => {
  const { authenticatedUser } = useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }

    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }

    // Watch for sidebar toggle from header (via class)
    const observer = new MutationObserver(() => {
      const hasSidebar = document.body.classList.contains('sidebar-open');
      const main = document.getElementById('main');
      if (main) {
        main.style.transform = hasSidebar ? 'translateX(250px)' : 'translateX(0)';
        main.style.transition = 'transform 0.3s ease';
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();

  }, [authenticatedUser, loadData]);

  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>

      <div className="learner-dashboard-container">
        <AppWrapper>
          <LearnerDashboardHeader />
          <main id="main">
            {hasNetworkFailure ? (
              <Alert variant="danger">
                <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
              </Alert>
            ) : (
              <Dashboard />
            )}
          </main>
        </AppWrapper>
        <FooterSlot />
      </div>
    </>
  );
};

export default App;
