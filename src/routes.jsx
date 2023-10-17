import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store }  from 'redux/store';
import links from 'links';
import {
  MainPage, 
  SignIn, 
  SignUp,
  UserProfile 
} from 'containers';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'myFirebase';
import { CoreLayout } from 'components';

export const routes = {
  public: {
    signInPage: {
      path: links.signInPage,
      component: SignIn,
    },
    signUpPage: {
      path: links.signUpPage,
      component: SignUp,
    },
    mainPage: {
      path: links.mainPage,
      component: MainPage,
    },
  },
  private: {
    user: {
      path: links.userProfilePage,
      component: UserProfile,
    },
  },
};

const PrivateRoute = ({ component: Component }) => {
  const [user, loading] = useAuthState(auth);

  if (user && !loading) {
    return <Component />;
  }

  if (!user && !loading) {
    return <Navigate to={ links.mainPage } />;
  }
};

const getPublicRoutes = (routes, parentPath = '') => (
  Object
    .values(routes)
    .reduce((acc, { path, component: Component, children }) => {
      if (Component) {
        acc.push(
          <Route
            key={ parentPath ? `${parentPath}${path}` : path }
            path={ parentPath ? `${parentPath}${path}` : path }
            element={ <Component /> } 
          />,
        );
      }

      if (children) {
        return acc.concat(getPublicRoutes(children, `${parentPath}${path}`));
      }

      return acc;
    }, [])
);

const getPrivateRoutes = (routes, parentPath = '') => (
  Object
    .values(routes)
    .reduce((acc, { path, component, children }) => {
      if (component) {
        acc.push(
          <Route
            key={ parentPath ? `${parentPath}${path}` : path }
            path={ parentPath ? `${parentPath}${path}` : path }
            element={ <PrivateRoute component={ component } /> }
          />,
        );
      }

      if (children) {
        return acc.concat(getPrivateRoutes(children, `${parentPath}${path}`));
      }

      return acc;
    }, [])
);

const AppRoutes = () => (
  <BrowserRouter>
    <Provider store={ store }>
      <CoreLayout>
        <Routes>
          { getPublicRoutes(routes.public) }
          { getPrivateRoutes(routes.private) }
          <Route path="*" element={ <MainPage /> } />
        </Routes>
      </CoreLayout>
    </Provider>
  </BrowserRouter>
);

export default AppRoutes;
