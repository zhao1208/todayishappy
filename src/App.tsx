import React, { useEffect } from 'react';
import { createHashRouter, RouterProvider, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserProvider, useUserStore } from './store/UserContext';
import { CardProvider } from './store/CardContext';
import { CommunityProvider } from './store/CommunityContext';
import './styles/global.css';
import './styles/animations.css';

/* RouteGuard must be INSIDE RouterProvider — render nothing, just redirect */
function RouteGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isAdmin, hasSelectedMode, isLoading } = useUserStore();

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/login', '/register', '/friend-verify'];
    const isPublic = publicPaths.includes(location.pathname);

    // Not logged in → login page
    if (!isLoggedIn && !isPublic) {
      navigate('/login', { replace: true });
      return;
    }

    // Logged in but on login/register → home (or onboarding if no mode)
    if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(hasSelectedMode ? '/' : '/onboarding', { replace: true });
      return;
    }

    // Logged in but no mode selected → onboarding
    if (isLoggedIn && !hasSelectedMode && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
      return;
    }

    // Non-admin accessing admin → home
    if (isLoggedIn && location.pathname.startsWith('/admin') && !isAdmin) {
      navigate('/', { replace: true });
      return;
    }
  }, [isLoggedIn, isAdmin, hasSelectedMode, isLoading, location.pathname, navigate]);

  return <Outlet />;
}

import { routes } from './router';

const router = createHashRouter([
  {
    element: <RouteGuard />,
    children: routes,
  },
]);

const App: React.FC = () => {
  return (
    <UserProvider>
      <CardProvider>
        <CommunityProvider>
          <RouterProvider router={router} />
        </CommunityProvider>
      </CardProvider>
    </UserProvider>
  );
};

export default App;
