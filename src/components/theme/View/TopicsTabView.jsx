/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { Helmet } from '@plone/volto/helpers';
import { defineMessages } from 'react-intl';
import { Portal } from 'react-portal';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { settings, blocks } from '~/config';
import {
  // setFolderTabs,
  getParentFolderData,
  getLocalnavigation,
} from '~/actions';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';
import { flattenToAppURL } from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

// import { compose } from 'redux';
// const mapDispatchToProps = {
//   //   setFolderHeader,
//   setFolderTabs,
//   getParentFolderData,
// };

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
class DefaultView extends Component {
  constructor(props) {
    super(props);
    // this.renderTabs = this.renderTabs.bind(this);
    this.state = {
      tabs: null,
      parent: null,
    };
    console.log('defaultView');
  }

  // static  defaultProps = {
  //   parent: null
  // }
  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      text: PropTypes.shape({
        data: PropTypes.string,
      }),
    }).isRequired,
    getParentFolderData: PropTypes.func.isRequired,
    // setFolderTabs: PropTypes.func.isRequired,
    localNavigation: PropTypes.any,
    getLocalnavigation: PropTypes.func.isRequired,
  };

  componentDidMount() {
    console.log('mounted here ------------>', this.props);
    this.props.getLocalnavigation(flattenToAppURL(this.props.content['@id']));
    const pathArr = this.props.location.pathname.split('/');
    pathArr.length = 4;
    const path = pathArr.join('/');
    this.props.getParentFolderData(path).then(r => {
      const pathArr = this.props.location.pathname.split('/');
      pathArr.length = 4;
      const path = pathArr.join('/');
      const tabsItems = r.items.map(i => {
        return {
          url: `${path}/${i.id}`,
          title: i.title,
          '@type': i['@type'],
        };
      });
      // this.props.setFolderTabs(tabsItems);
      this.setState({
        tabs: tabsItems,
      });
      // this.setState({ parent: r });
    });
  }

  //   componentDidUpdate(prevProps, prevState, snapshot) {
  //     console.log('current', this.state, this.props);
  //     console.log('previous', prevProps, prevState);

  //     if (!this.props.parent.length && this.props.location.pathname != '/') {
  //       const pathArr = this.props.location.pathname.split('/');
  //       pathArr.length = 4;
  //       const path = pathArr.join('/');
  //       this.props.getParentFolderData(path);
  //     }

  //     if (
  //       !this.state.isTopic &&
  //       this.props.parent.layout === 'topics_view' &&
  //       this.props.location.pathname !== '/'
  //     ) {
  //       this.setState({ isTopic: true });
  //     }
  //     if (this.state.isTopic && this.props.location.pathname === '/') {
  //       this.setState({ isTopic: false });
  //     }
  //   }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pathname !== this.props.pathname) {
      this.props.getLocalnavigation(flattenToAppURL(this.props.pathname));
    }
    // if (
    //   (!prevState.parent && this.state.parent) ||
    //   (!this.state.tabs && this.state.parent)
    // ) {

    // }
  }
  render() {
    const content = this.props.content;
    const intl = this.props.intl;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
    const localNavigation =
      (this.props.localNavigation.items &&
        this.props.localNavigation.items.filter(
          item => item.title !== 'Home',
        )) ||
      [];
    // if (!this.props.tabs && this.props.location.pathname != '/') {

    // }
    return (
      hasBlocksData(content) && (
        <div id="page-document" className="ui wrapper">
          {this.state.tabs && this.state.tabs.length ? (
            <nav className="tabs">
              {this.state.tabs.map((tab, index) => (
                <Link
                  key={`localtab-${tab.url}`}
                  className={`tabs__item${(tab.url ===
                    this.props.location.pathname &&
                    ' tabs__item_active') ||
                    ''}`}
                  to={tab.url}
                  title={tab['@type']}
                >
                  {tab.title}
                </Link>
              ))}
            </nav>
          ) : (
            ''
          )}

          <Portal node={__CLIENT__ && document.getElementById('menuExpanded')}>
            <ul className="localNavigation">
              {localNavigation.map(item => (
                <li
                  className={
                    flattenToAppURL(this.props.content['@id']).includes(
                      flattenToAppURL(item['@id']),
                    ) && 'active'
                  }
                  key={`li-${item['@id']}`}
                >
                  {flattenToAppURL(this.props.content['@id']).includes(
                    flattenToAppURL(item['@id']),
                  ) && <span className="menuExpandedIndicator">▶</span>}
                  <Link to={flattenToAppURL(item['@id'])} key={item['@id']}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Portal>

          <Helmet title={content.title} />
          {map(content[blocksLayoutFieldname].items, block => {
            const Block =
              blocks.blocksConfig[
                (content[blocksFieldname]?.[block]?.['@type'])
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={`block-${block}`}
                blockID={block}
                properties={content}
                data={content[blocksFieldname][block]}
              />
            ) : (
              <div key={`blocktype-${block}`}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: content[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </div>
      )
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */

// export default injectIntl(DefaultView);

export default connect(
  state => ({
    // tabs: state.folder_tabs.items,
    parent: state.parent_folder_data.items,
    localNavigation: state.localnavigation.items,
  }),
  { getParentFolderData, getLocalnavigation },
)(DefaultView);

// export default compose(
//   connect(
//     state => ({
//       parent: state.parent_folder_data.items,
//     }),
//     mapDispatchToProps,
//   ),
// )(DefaultView);
