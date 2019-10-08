import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Container, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// import { setFolderHeader, setFolderTabs, getParentFolderData } from '~/actions';
import { setFolderHeader, setFolderTabs } from '~/actions';
const mapDispatchToProps = {
  setFolderHeader,
  setFolderTabs,
};
class TopicsView extends Component {
  constructor(props) {
    super(props);
    this.renderTabs = this.renderTabs.bind(this);
    this.state = {
      tabs: null,
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
  };

  componentDidMount() {
    console.log('mounted');
    // this.getFolderHeader();
    this.renderTabs();
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
    const content = this.props.content;
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
      </Container>
    );
  }
}

// export default connect(
//   state => ({
//     tabs: state.folder_tabs.items,
//     //   parent: state.parent_folder_data.items,
//   }),
//   mapDispatchToProps,
// )(TopicsView);

export default connect(
  null,
  mapDispatchToProps,
)(TopicsView);
