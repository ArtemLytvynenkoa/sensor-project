import {
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Dropdown,
  Space,
} from 'antd';
import { auth } from 'myFirebase';
import { signOut } from 'firebase/auth';
import links from 'links';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';

export const RightHeader = () => {
  const [user] = useAuthState(auth);

  const style = { 
    fontSize: '24px',
    color: '#ff6b01',
    padding: '10px 0'
  };

  return (
    <div
      style={ {
        display: 'flex',
        justifyContent: 'flex-end'
      } }
    >
      { user &&
        <Space size={ 10 }>
          <Dropdown
            trigger={ ['hover'] }
            menu={{
              theme: "dark",
              style: {
                padding: '0.7rem',
                marginTop: '0.5rem',
              },
              items: [{
                key: 'profile',
                label: (
                  <Link to={ links.userProfilePage }>
                    Profile
                  </Link>
                )
              }]
            }}
          >
            <UserOutlined 
              style={ style }
            />
          </Dropdown>
          <LogoutOutlined 
            onClick={ () => {
              signOut(auth)
            } }
            style={ style }
          />
        </Space>
      }
      { !user && 
        <Space>
          <Link to={ links.signInPage }>
            <LoginOutlined
              style={ style }
            />
          </Link>
          <Link to={ links.signUpPage }>
            <UserAddOutlined 
              style={ style }
            />
          </Link>
        </Space>
      }
    </div>
  );
};

export default RightHeader;
