/**
  * Full view component.
  * @module components/theme/View/FullView
  */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Container, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { setFolderHeader, setFolderTabs } from '~/actions'

/**
  * Full view component class.
  * @function FullView
  * @param {Object} content Content object.
  * @returns {string} Markup of the component.
  */

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
  setFolderHeader, setFolderTabs
};

class FullView extends Component {
  static propTypes = {
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
        * Child items of the object
        */
      items: PropTypes.arrayOf(
        PropTypes.shape({
          /**
            * Title of the item
            */
          title: PropTypes.string,
          /**
            * Description of the item
            */
          description: PropTypes.string,
          /**
            * Url of the item
            */
          url: PropTypes.string,
          /**
            * Image of the item
            */
          image: PropTypes.object,
          /**
            * Image caption of the item
            */
          image_caption: PropTypes.string,
          /**
            * Type of the item
            */
          '@type': PropTypes.string,
        }),
      ),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      tabs: null
    };
  }

  componentDidMount(){
    const title = this.props.content.title
    const description = this.props.content.description
    const image = this.props.content.items && this.props.content.items.find(c => c['@type'] === 'Image')
    const url = image && image.image.download
    const inCountryFolder = true
    this.props.setFolderHeader({title, description, url, inCountryFolder})
    this.renderTabs()
  }

  componentWillUnmount() {
    this.props.setFolderHeader({inCountryFolder: false})
  }

  renderTabs(){
    const content = this.props.content
    const tabs = <div className={'ui item stackable tabs menu ' + numberToWord[content.items.length]}>
      {content.items.map(item => (
        <Link key={item.url} className="item" to={item.url} title={item['@type']}>
          {item.title}
        </Link>
      ))}
    </div>
    this.setState({
      tabs: tabs
    })
    this.props.setFolderTabs(content.items)
  }

  render() {
    const content = this.props.content
    return (
      <Container className="view-wrapper">
        <Helmet title={content.title} />
        <article id="content">
          <section id="content-core">
            {this.state.tabs}
          </section>
        </article>
      </Container>
    );
  }

}

export default connect(null, mapDispatchToProps)(FullView);
