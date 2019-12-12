/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { defineMessages } from 'react-intl';
import { Portal } from 'react-portal';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { settings, blocks } from '~/config';
import {
  setFolderTabs,
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

class DefaultView extends Component {
  constructor(props) {
    super(props);
    // this.renderTabs = this.renderTabs.bind(this);
    this.state = {
      tabs: null,
    };
  }

  static defaultProps = {
    parent: null,
  };
  static propTypes = {
    tabs: PropTypes.array,
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      text: PropTypes.shape({
        data: PropTypes.string,
      }),
    }).isRequired,
    getParentFolderData: PropTypes.func.isRequired,
    setFolderTabs: PropTypes.func.isRequired,
    localNavigation: PropTypes.any,
  };

  componentDidMount() {
    const pathArr = this.props.pathname.split('/');
    pathArr.length = 4;
    const path = pathArr.join('/');
    this.props.getParentFolderData(path);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('herere', nextProps.parent, this.props.parent);
  //   if (nextProps.parent && nextProps.parent.id !== this.props.parent?.id) {

  //     const pathArr = nextProps.location.pathname.split('/');
  //     pathArr.length = 4;
  //     const path = pathArr.join('/');
  //     const tabsItems = nextProps.parent.items.map(i => {
  //       return {
  //         url: `${path}/${i.id}`,
  //         title: i.title,
  //         '@type': i['@type'],
  //       };
  //     });
  //     this.props.setFolderTabs(tabsItems);
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.parent && this.props.parent && this.props.parent.id) {
      this.computeFolderTabs();
    }

    if (!prevState.tabs && this.props.parent && this.props.parent.id) {
      this.computeFolderTabs();
    }

    if (prevProps.parent && prevProps.parent.id !== this.props.parent.id) {
      this.computeFolderTabs();
    }
  }

  computeFolderTabs = () => {
    const pathArr = this.props.location.pathname.split('/');
    pathArr.length = 4;
    const path = pathArr.join('/');
    console.log('computing folder tabs', this.props.parent);
    const tabsItems = this.props.parent.items.map(i => {
      return {
        url: flattenToAppURL(i['@id']),
        title: i.title,
        '@type': i['@type'],
      };
    });
    this.props.setFolderTabs(tabsItems);
    this.setState({ tabs: tabsItems });
  };

  render() {
    const content = this.props.content;
    const intl = this.props.intl;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
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

export default connect(
  (state, props) => ({
    pathname: props.location.pathname,
    tabs: state.folder_tabs.items,
    parent: state.parent_folder_data.items,
  }),
  { setFolderTabs, getParentFolderData },
)(DefaultView);
