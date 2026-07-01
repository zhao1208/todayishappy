import React, { useEffect, useMemo } from 'react';
import { createHashRouter, RouterProvider, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { UserProvider } from './store/UserContext';
import { CardProvider } from './store/CardContext';
import { CommunityProvider } from './store/CommunityContext';
import { routes } from './router';
import './styles/global.css';
import './styles/animations.css';

/** 路由守卫组件 -- 必须在 RouterProvider 内部使用，因此嵌入 routes layout */
function RouteGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('tnw_user_profile');
    if (!stored && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
    if (stored && location.pathname === '/onboarding') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
}

const App: React.FC = () => {
  const guardedRoutes = useMemo(
    () => [
      {
        element: <RouteGuard />,
        children: routes,
      },
    ],
    [],
  );

  const router = createHashRouter(guardedRoutes);

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
