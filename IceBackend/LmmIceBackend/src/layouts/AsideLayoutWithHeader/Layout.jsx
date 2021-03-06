/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { Component } from 'react';
import cx from 'classnames';
import Layout from '@icedesign/layout';
import Menu, { SubMenu, Item as MenuItem } from '@icedesign/menu';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import FoundationSymbol from 'foundation-symbol';
import Header from './../../components/HeaderWithLogo';
import Footer from './../../components/Footer';
import Logo from './../../components/Logo';
import { getAsideMenuConfig } from './../../menuConfig';
import './scss/light.scss';

@withRouter
export default class HeaderAsideFooterResponsiveLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    const openKeys = this.getOpenKeys();
    this.state = {
      openKeys,
      name:'',
    };
    this.openKeysCache = openKeys;
  }

  componentDidMount() {
     let name =   sessionStorage.getItem('name');
     this.setState({name})
  }

  /**
   * 当前展开的菜单项
   */
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
    this.openKeysCache = openKeys;
  };

  /**
   * 获取当前展开的菜单项
   */
  getOpenKeys = () => {
    const { match } = this.props;
    const matched = match.url;
    let openKeys = [];

    let asideMenuConfig = getAsideMenuConfig();

    Array.isArray(asideMenuConfig) &&
      asideMenuConfig.forEach((item, index) => {
        if (matched.startsWith(item.path)) {
          openKeys = [`${index}`];
        }
      });

    return openKeys;
  };

  render() {
    const { location } = this.props;
    const { pathname } = location;
    
    let asideMenuConfig = getAsideMenuConfig();
    
    return (
      <Layout
        fixable
        style={{ minHeight: '100vh' }}
        className={cx(
          'ice-design-header-aside-footer-responsive-layout-light',
          {
            'ice-design-layout': true,
          }
        )}
      >
        <Layout.Header  style={{ minHeight: '10vh' }}>
          <Header theme="light" name={this.state.name} />
        </Layout.Header>
        <Layout.Section scrollable={true}>
        <Layout.Aside
          width="auto"
          theme="light"
          style={{ minHeight: '90vh' }}
          className={cx('ice-design-layout-aside')}
        >
          <Menu
            style={{ width: 240 }}
            mode="inline"
            selectedKeys={[pathname]}
            openKeys={this.state.openKeys}
            defaultSelectedKeys={[pathname]}
            onOpenChange={this.onOpenChange}
          >
            {Array.isArray(asideMenuConfig) &&
              asideMenuConfig.length > 0 &&
              asideMenuConfig.map((nav, index) => {
                if (nav.children && nav.children.length > 0) {
                  return (
                    <SubMenu
                      key={index}
                      title={
                        <span>
                          {nav.icon ? (
                            <FoundationSymbol size="small" type={nav.icon} />
                          ) : null}
                          <span className="ice-menu-collapse-hide">
                            {nav.name}
                          </span>
                        </span>
                      }
                    >
                      {nav.children.map((item) => {
                        const linkProps = {};
                        if (item.newWindow) {
                          linkProps.href = item.path;
                          linkProps.target = '_blank';
                        } else if (item.external) {
                          linkProps.href = item.path;
                        } else {
                          linkProps.to = item.path;
                        }
                        return (
                          <MenuItem key={item.path}>
                            <Link {...linkProps}>{item.name}</Link>
                          </MenuItem>
                        );
                      })}
                    </SubMenu>
                  );
                }
                const linkProps = {};
                if (nav.newWindow) {
                  linkProps.href = nav.path;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.path;
                } else {
                  linkProps.to = nav.path;
                }
                return (
                  <MenuItem key={nav.path}>
                    <Link {...linkProps}>
                      <span>
                        {nav.icon ? (
                          <FoundationSymbol size="small" type={nav.icon} />
                        ) : null}
                        <span className="ice-menu-collapse-hide">
                          {nav.name}
                        </span>
                      </span>
                    </Link>
                  </MenuItem>
                );
              })}
          </Menu>
          {/* 侧边菜单项 end */}
        </Layout.Aside>
          {/* 主体内容 */}
          <Layout.Main scrollable style={{ paddingRight: 20, paddingTop: 20 }}>
            {this.props.children}

            <Footer />
          </Layout.Main>
        </Layout.Section>
      </Layout>
    );
  }
}

const styles = {
  logo: {
    padding: '10px 15px',
    background: '#002140',
  },
  logoText: {
    textAlign: 'center',
  },
  copyrightLink: {
    marginLeft: 5,
  },
};
