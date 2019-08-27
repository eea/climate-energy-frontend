
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { setFolderHeader } from '~/actions'

import { settings, tiles } from '~/config';

import {
  getTilesFieldname,
  getTilesLayoutFieldname,
  hasTilesData,
} from '@plone/volto/helpers';


const numberToWord = {
  1: 'one', 
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve'
}

const mapDispatchToProps = {
  setFolderHeader,
};

class CountryPageView extends Component {

  static propTypes = {
    tabs: PropTypes.array,
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

  // renderTabs(){
  //   const content = this.props.content
  //   const tabs = <div className={'ui item stackable tabs menu ' + numberToWord[content.items.length]}>
  //     {content.items.map(item => (
  //       <Link key={item.url} className="item" to={item.url} title={item['@type']}>
  //         {item.title}
  //       </Link>
  //     ))}
  //   </div>
  //   this.setState({
  //     tabs: tabs
  //   })
  //   this.props.setFolderTabs(content.items)
  // }

  render() {
    const content = this.props.content
    const tilesFieldname = getTilesFieldname(content);
    const tilesLayoutFieldname = getTilesLayoutFieldname(content);
    console.log('--------------', this.props.tabs)

    return hasTilesData(content) ? (
      <div id="page-document" className="ui wrapper">

      {
        this.props.tabs.length ? 
          <div className={'ui item stackable tabs menu ' + numberToWord[this.props.tabs.length]}>
            {this.props.tabs.map(item => (
              <Link key={item.url} className="item" to={item.url} title={item['@type']}>
                {item.title}
              </Link>
            ))}
          </div>
        : 
          ''
      }

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

export default connect(
  state => ({
    tabs: state.folder_tabs.items,
  }),
  mapDispatchToProps
)(CountryPageView);
