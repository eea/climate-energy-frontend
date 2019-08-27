
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';

import { setFolderHeader } from '~/actions'

import { settings, tiles } from '~/config';

import {
  getTilesFieldname,
  getTilesLayoutFieldname,
  hasTilesData,
} from '@plone/volto/helpers';


const mapDispatchToProps = {
  setFolderHeader,
};

class CountryPageView extends Component {

  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          description: PropTypes.string,
          url: PropTypes.string,
          image: PropTypes.object,
          image_caption: PropTypes.string,
          '@type': PropTypes.string,
        }),
      ),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  
  componentDidMount(){
    this.props.setFolderHeader({inCountryFolder: true})    
  }

  componentWillUnmount() {
    this.props.setFolderHeader({inCountryFolder: false})
  }

  render() {
    const content = this.props.content
    const tilesFieldname = getTilesFieldname(content);
    const tilesLayoutFieldname = getTilesLayoutFieldname(content);

    return hasTilesData(content) ? (
      <div id="page-document" className="ui wrapper">
        <Helmet title={content.title} />
        {map(content[tilesLayoutFieldname].items, tile => {
          let Tile = null;
          Tile =
            tiles.defaultTilesViewMap[content[tilesFieldname][tile]['@type']];
          return Tile !== null ? (
            <Tile
              key={tile}
              properties={content}
              data={content[tilesFieldname][tile]}
            />
          ) : (
              <div>{JSON.stringify(content[tilesFieldname][tile]['@type'])}</div>
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
      )
  }

};

export default connect(null, mapDispatchToProps)(CountryPageView);
