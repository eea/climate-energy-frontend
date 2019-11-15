/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { defineMessages, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// import { compose } from 'redux';

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

const mapDispatchToProps = {
  //   setFolderHeader,
  setFolderTabs,
  getParentFolderData,
};

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
    };
    console.log('defaultView');
  }

  // static  defaultProps = {
  //   parent: null
  // }
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
    getLocalnavigation: PropTypes.func.isRequired,
  };

  componentDidMount() {
    console.log('mounted here', this.props);
    this.props.getLocalnavigation(flattenToAppURL(this.props.content['@id']));
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pathname !== this.props.pathname) {
      this.props.getLocalnavigation(flattenToAppURL(this.props.pathname));
    }
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

  componentWillReceiveProps(nextProps) {
    console.log('herere', nextProps.parent, this.props.parent);
    if (nextProps.parent && nextProps.parent.id !== this.props.parent.id) {
      console.log('props parent', nextProps.parent);

      // const title = nextProps.parent.title;
      // const description = nextProps.parent.description;
      // const image =
      //   nextProps.parent.items &&
      //   nextProps.parent.items.find(c => c['@type'] === 'Image');
      // const url = image && image.image.download;
      // const inCountryFolder = true;
      // this.props.setFolderHeader({ title, description, url, inCountryFolder });
      const pathArr = nextProps.location.pathname.split('/');
      pathArr.length = 4;
      const path = pathArr.join('/');
      const tabsItems = nextProps.parent.items.map(i => {
        return {
          url: `${path}/${i.id}`,
          title: i.title,
          '@type': i['@type'],
        };
      });
      this.props.setFolderTabs(tabsItems);
    }
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
    if (!this.props.tabs && this.props.location.pathname != '/') {
      const pathArr = this.props.location.pathname.split('/');
      pathArr.length = 4;
      const path = pathArr.join('/');
      this.props.getParentFolderData(path);
    }
    return hasBlocksData(content) ? (
      <div id="page-document" className="ui wrapper">
        {this.props.tabs && this.props.tabs.length ? (
          <nav className="tabs">
            {this.props.tabs.map((tab, index) => (
              <Link
                key={tab.url}
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
              <li>
                <Link to={flattenToAppURL(item['@id'])} key={item['@id']}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Portal>

        <Helmet title={content.title} />
        {map(content[blocksLayoutFieldname].items, tile => {
          const Block =
            blocks.blocksConfig[
              (content[blocksFieldname]?.[tile]?.['@type'])
            ]?.['view'] || null;
          return Block !== null ? (
            <Block
              key={tile}
              blockID={tile}
              properties={content}
              data={content[blocksFieldname][tile]}
            />
          ) : (
            <div key={tile}>
              {intl.formatMessage(messages.unknownBlock, {
                block: content[blocksFieldname]?.[tile]?.['@type'],
              })}
            </div>
          );
        })}
      </div>
    ) : (
      <Container id="page-document">
        <Helmet title={content.title} />
        <h1 className="documentFirstHeading">{content.title}</h1>
        {content.description && (
          <p className="documentDescription">{content.description}</p>
        )}
        {content.image && (
          <Image
            className="document-image"
            src={content.image.scales.thumb.download}
            floated="right"
          />
        )}
        {content.remoteUrl && (
          <span>
            The link address is:
            <a href={content.remoteUrl}>{content.remoteUrl}</a>
          </span>
        )}
        {content.text && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.text.data.replace(
                /a href="([^"]*\.[^"]*)"/g,
                `a href="${settings.apiPath}$1/download/file"`,
              ),
            }}
          />
        )}
      </Container>
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
    tabs: state.folder_tabs.items,
    parent: state.parent_folder_data.items,
    localNavigation: state.localnavigation.items,
  }),
  { setFolderTabs, getParentFolderData, getLocalnavigation },
)(DefaultView);

// export default compose(
//   connect(
//     state => ({
//       parent: state.parent_folder_data.items,
//     }),
//     mapDispatchToProps,
//   ),
// )(DefaultView);
