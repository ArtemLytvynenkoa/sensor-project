import React from 'react';
import {
  RightHeader,
  LeftHeader,
} from 'components';
import { 
  Col, 
  Row, 
  Space
} from 'antd';
import './layout.scss'

const Header = () => {
  return (
    <header className='header'>
      <Space 
        direction="vertical"
        className='header-space'
      >
        <Row>
          <Col flex="1" >
            <LeftHeader />
          </Col>
          <Col flex="1">
            <RightHeader />
          </Col>
        </Row>
      </Space>
    </header> 
)};

export default Header;
