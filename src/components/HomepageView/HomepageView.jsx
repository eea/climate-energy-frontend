import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import Helmet from 'react-helmet';
import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { setFolderHeader, setFolderTabs, getParentFolderData } from '~/actions';

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
  12: 'twelve',
};

const mapDispatchToProps = {
  setFolderHeader,
  setFolderTabs,
  getParentFolderData,
};

const data = [
  { name: '00', Decidous: 4000, Conifers: 2400 },
  { name: '04', Decidous: 3000, Conifers: 1398 },
  { name: '08', Decidous: 2000, Conifers: 9800 },
  { name: '12', Decidous: 2780, Conifers: 3908 },
  { name: '16', Decidous: 1890, Conifers: 4800 },
];

class StackedBarChart extends Component {
  render() {
    return (
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Decidous" stackId="a" fill="#225511" />
          <Bar dataKey="Conifers" stackId="a" fill="#769e2e" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

class HomepageView extends Component {
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

  componentDidMount() {
    this.props.setFolderHeader({ inCountryFolder: true });
  }

  componentWillUnmount() {
    this.props.setFolderHeader({ inCountryFolder: false });
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.parent) !== JSON.stringify(this.props.parent)
    ) {
      const title = nextProps.parent.title;
      const description = nextProps.parent.description;
      const image =
        nextProps.parent.items &&
        nextProps.parent.items.find(c => c['@type'] === 'Image');
      const url = image && image.image.download;
      const inCountryFolder = true;
      this.props.setFolderHeader({ title, description, url, inCountryFolder });
      const tabsItems = nextProps.parent.items
        .map(i => ({
          // this is ugly
          url: i['@id'].split('/Plone/')[1],
          title: i.title,
          '@type': i['@type'],
        }))
        .filter(i => i.title !== 'folder_info');
      this.props.setFolderTabs(tabsItems);
    }
  }

  render() {
    const content = this.props.content;
    const tilesFieldname = getTilesFieldname(content);
    const tilesLayoutFieldname = getTilesLayoutFieldname(content);

    this.tabs = [
      { title: 'Coverage & Growth', url: '', type: 'Section' },
      { title: 'Economy', url: '', type: 'Section' },
      { title: 'Other Benefits', url: '', type: 'Section' },
    ];

    return (
      <div id="page-document" className="ui wrapper">
        <div>
          <h1>A bird's-eye view on Europe’s forests</h1>
          <p>
            Europe is one of the few regions of the world where forest cover has
            increased over the last century. The EU currently contains 5 % of
            the world's forests. Let’s take a look at factors which led to this
            net growth as well as their economical and ecological implication.
          </p>
        </div>

        {this.tabs && this.tabs.length ? (
          <div
            className={
              'ui item stackable tabs menu ' + numberToWord[this.tabs.length]
            }
          >
            {this.tabs.map(item => (
              <Link
                key={item.url}
                className="item"
                to={item.url}
                title={item['@type']}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ) : (
          ''
        )}

        <div className="ui stackable two column grid">
          <div className="column">
            <div className="ui stackable grid">
              <div className="eight wide column">Forest coverage</div>
              <div className="eight wide column">Forest coverage</div>
            </div>

            <div className="ui stackable grid">
              <div className="column">
                Growing stock
                <div className="chart-container">
                  <StackedBarChart />
                </div>
              </div>
            </div>
          </div>

          <div className="column">
            <iframe
              src="https://maps.eea.europa.eu/CopernicusViewer/?webmap=f9a8ae48d60a49f1bd9b16dba0f2c5fe&extent=-20.0,30.0,44.0,66.0&zoom=true"
              width="100%"
            />
          </div>
        </div>

        <div className="country-page-content-wrapper" />
      </div>
    );
  }
}

export default connect(
  state => ({
    tabs: state.folder_tabs.items,
    parent: state.parent_folder_data.items,
  }),
  mapDispatchToProps,
)(HomepageView);
