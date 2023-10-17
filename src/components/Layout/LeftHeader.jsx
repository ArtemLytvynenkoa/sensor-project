import React from 'react';
import { Link } from 'react-router-dom';
import links from 'links';
import { Typography } from 'antd';
import { useResize } from 'hooks';

const { Title } = Typography

export const LeftHeader = () => {
  const windowWidth = useResize();

  return (
    <div
      style={ {
        display: 'flex',
        textAlign: 'center'
      } }
    >
      <Link to={ links.mainPage }>
        <Title 
          className='logo-title'
          level={ (windowWidth > 768) ? 1 : 3 }
        >
          Tests
        </Title>
      </Link>
    </div>
  )
};

export default LeftHeader;
