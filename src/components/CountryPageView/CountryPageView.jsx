
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  setFolderHeader,
  setFolderTabs,
  getParentFolderData
} from '~/actions'

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
  setFolderHeader, setFolderTabs, getParentFolderData
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

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.parent) !== JSON.stringify(this.props.parent)) {
      const title = nextProps.parent.title
      const description = nextProps.parent.description
      const image = nextProps.parent.items && nextProps.parent.items.find(c => c['@type'] === 'Image')
      const url = image && image.image.download
      const inCountryFolder = true
      this.props.setFolderHeader({title, description, url, inCountryFolder})
      const tabsItems = nextProps.parent.items.map(i => ({
        // this is ugly
        url: i['@id'].split('/Plone/')[1],
        title: i.title,
        '@type': i['@type']
      })).filter(i =>  i.title !== 'folder_info')
      this.props.setFolderTabs(tabsItems)
    }
  }

  render() {
    const content = this.props.content
    const tilesFieldname = getTilesFieldname(content);
    const tilesLayoutFieldname = getTilesLayoutFieldname(content);
    if(!this.props.tabs) {
      this.props.getParentFolderData(this.props.content.parent['@id'].split('/Plone/')[1])
    }

    return hasTilesData(content) ? (
      <div id="page-document" className="ui wrapper">

      {
        this.props.tabs && this.props.tabs.length ?
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

        {/* <Helmet title={content.title} /> */}
        <div className="country-page-content-wrapper">

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
          <div className="country-report-section">
            <div className="ui stackable two column grid">

              <div className="column">
                <h2>Country Report No 1/2019</h2>
                <p>Forests are rich in biodiversity and valuable for recreation, water regulation and soil protection. As well as for providing timber and other non-wood forest products, forests are important for mitigating climate change and for the renewable energy sector.</p>
                <button className="ui primary button">Open report</button>
              </div>

              <div className="column">
                <h2>Other reports and publications</h2>
                <div className="ui list">
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      State of Europe’s Forests 2018 Report
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      Romania: National Forest Data 2017
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      State of Europe’s Forests 2017 Report
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      Romania: Lorem ipsum documentarium 2014
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      Romania: National Forest Data 2017
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      State of Europe’s Forests 2017 Report
                    </div>
                  </div>
                  <div className="item">
                    <i className="file outline icon"></i>
                    <div className="content">
                      Romania: Lorem ipsum documentarium 2014
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )
  }

};

export default connect(
  state => ({
    tabs: state.folder_tabs.items,
    parent: state.parent_folder_data.items
  }),
  mapDispatchToProps
)(CountryPageView);
