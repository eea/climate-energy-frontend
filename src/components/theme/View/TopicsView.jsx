import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link, Redirect } from 'react-router-dom';
import { Container, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getBaseUrl } from '@plone/volto/helpers';

// import { setFolderHeader, setFolderTabs, getParentFolderData } from '~/actions';
import { setFolderHeader, setFolderTabs, getLocalnavigation } from '~/actions';
const mapDispatchToProps = {
  setFolderHeader,
  setFolderTabs,
  getLocalnavigation,
};
class TopicsView extends Component {
  constructor(props) {
    super(props);
    this.renderTabs = this.renderTabs.bind(this);
    this.state = {
      tabs: null,
      redirect: false,
    };
    console.log('topicsView');
  }
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
    localNavigation: PropTypes.any,
    getLocalnavigation: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getLocalnavigation(flattenToAppURL(this.props.content['@id']));
    this.renderTabs();
    const mainItem = this.props.content.items[0];
    const mainUrl = mainItem && mainItem.url;
    console.log('mainitem,mainurl', mainItem, mainUrl);
    if (__CLIENT__ && mainUrl && window) {
      this.setState({ redirect: mainUrl });
    } else {
      this.setState({ redirect: false });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pathname !== this.props.pathname) {
      this.props.getLocalnavigation(flattenToAppURL(this.props.pathname));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)
    ) {
      //   this.getFolderHeader(nextProps.content);
      this.renderTabs(nextProps.content);
    }
  }

  renderTabs(nextContent) {
    const items = nextContent ? nextContent.items : this.props.content.items;
    const content = items;
    const tabs = (
      <nav className="tabs">
        {content.map(item => (
          <Link
            key={item.url}
            className="tabs__item"
            to={item.url}
            title={item['@type']}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    );
    this.setState({
      tabs: tabs,
    });
    this.props.setFolderTabs(content);
  }

  render() {
    console.log('redirect state', this.state.redirect);
    if (this.state.redirect) {
      return <Redirect to={{ pathname: this.state.redirect }} />;
    }
    const content = this.props.content;
    const localNavigation =
      (this.props.localNavigation.items &&
        this.props.localNavigation.items.filter(
          item => item.title !== 'Home',
        )) ||
      [];
    console.log('pathname', this.props.content['@id'] + '/manage_interfaces');
    return (
      <Container className="view-wrapper">
        {this.state.tabs}
        <Helmet title={content.title} />
        <article id="content">
          <header>
            <h1 className="documentFirstHeading">{content.title}</h1>
            {content.description && (
              <p className="documentDescription">{content.description}</p>
            )}
          </header>
          <section id="content-core">
            {/* {content.items.map(item => (
              <article key={item.url}>
                <h2>
                  <Link to={item.url} title={item['@type']}>
                    {item.title}
                  </Link>
                </h2>
                {item.image && (
                  <Image
                    clearing
                    floated="right"
                    alt={item.image_caption ? item.image_caption : item.title}
                    src={item.image.scales.thumb.download}
                  />
                )}
                {item.description && <p>{item.description}</p>}
                <p>
                  <Link to={item.url}>
                    <FormattedMessage
                      id="Read More…"
                      defaultMessage="Read More…"
                    />
                  </Link>
                </p>
              </article>
            ))} */}
          </section>
        </article>

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
        {/* <Portal node={__CLIENT__ && document.querySelector('.toolbar-actions')}>
          <a
            href={this.props.content['@id'] + '/manage_interfaces'}
            key={this.props.content['@id']}
            target="_blank"
            rel="noreferrer noopener"
          >
            Manage
          </a>
        </Portal> */}
      </Container>
    );
  }
}

export default connect(
  state => ({
    localNavigation: state.localnavigation.items,
  }),
  { setFolderHeader, setFolderTabs, getLocalnavigation },
)(TopicsView);
