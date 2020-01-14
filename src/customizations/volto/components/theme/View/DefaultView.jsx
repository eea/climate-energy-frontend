/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { defineMessages, injectIntl } from 'react-intl';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';

import { settings, blocks } from '~/config';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

function getLocation(href) {
  var match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

function samePath(url, path) {
  // returns true if the router path is equal to the given url path
  const parsed = getLocation(url);
  const clean = url
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '')
    .replace(parsed.hash, '')
    .replace(parsed.search, '');

  // console.log('cleaned path from url', clean, path, url, getLocation(url));
  // console.log(clean, url, path, clean === path);

  return clean === path;
}

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
class DefaultView extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps.loading);
  //   if (nextProps.loading?.get?.loading) {
  //     console.log('not yet');
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    // console.log('im default view');
    const { content, intl } = this.props;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

    const currentUrl = this.props.content?.['@id'];
    const shouldRenderRoutes =
      typeof currentUrl !== 'undefined' &&
      samePath(currentUrl, this.props.pathname)
        ? true
        : false;

    // console.log(
    //   'should',
    //   shouldRenderRoutes,
    //   this.props.pathname,
    //   this.props.contentId,
    // );

    if (shouldRenderRoutes === false) return '';

    // {this.props.contentId} - {this.props.pathname}
    return hasBlocksData(content) ? (
      <div id="page-document" className="ui container">
        <Helmet title={content.title} />
        {map(content[blocksLayoutFieldname].items, block => {
          const Block =
            blocks.blocksConfig[
              (content[blocksFieldname]?.[block]?.['@type'])
            ]?.['view'] || null;
          return Block !== null ? (
            <Block
              key={block}
              id={block}
              properties={content}
              data={content[blocksFieldname][block]}
            />
          ) : (
            <div key={block}>
              {intl.formatMessage(messages.unknownBlock, {
                block: content[blocksFieldname]?.[block]?.['@type'],
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
DefaultView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default connect((state, props) => ({
  pathname: state.router.location.pathname, //props.location.pathname,
  contentId: state.content.data?.['@id'] || 'no-id',
  loading: state.content,
}))(injectIntl(DefaultView));
