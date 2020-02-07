import navTreeSVG from '@plone/volto/icons/nav.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SidebarPortal } from '@plone/volto/components';
import { TextWidget } from '@plone/volto/components';
import { connect } from 'react-redux';
import { getBaseUrl } from '@plone/volto/helpers';
import { getContent, getVocabulary } from '@plone/volto/actions';
import SelectListingType from './SelectListingType';
import { SelectWidget } from '@plone/volto/components';
import BlockView from './BlockView';

const vocabulary = 'plone.app.contenttypes.metadatafields';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      // index_name: this.props.data.index_name || '',
    };

    this.updateContent = this.updateContent.bind(this);
    this.getRequestKey = this.getRequestKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id, value) {
    const data = this.props.data;

    this.props.onChangeBlock(this.props.block, {
      ...data,
      [id]: value,
    });
  }

  getRequestKey() {
    return `col-content:${this.props.block}`;
  }

  updateContent() {
    const path = this.props.data.collection_url;
    if (!path) return;

    const url = `${getBaseUrl(path)}`;
    this.props.getContent(url, null, this.getRequestKey());
  }

  componentDidUpdate(prevProps) {
    // console.log('metadata', this.props.metadataFields);
    if (prevProps.data.collection_url !== this.props.data.collection_url) {
      return this.updateContent();
    }
    const key = this.getRequestKey();
    if (!prevProps.contentSubrequests[key]) {
      return;
    }

    const prev = prevProps.contentSubrequests[key];
    const now = this.props.contentSubrequests[key];

    if (prev.loading && now.loaded) {
      this.setState({ items: now.data.items });
    }
  }

  componentDidMount() {
    this.props.getVocabulary(vocabulary);
    this.updateContent();
  }

  render() {
    const data = {
      ...this.props.data,
      collection_url: this.props.data.collection_url || '',
    };

    return (
      <div>
        {data.collection_url ? <BlockView {...this.props} /> : ''}

        <SidebarPortal selected={this.props.selected}>
          <Segment.Group raised>
            <header className="header pulled">
              <h2>Collection</h2>
            </header>
            <Segment>
              <TextWidget
                id="collection_url"
                title="Query"
                required={false}
                value={data.collection_url.split('/').slice(-1)[0]}
                icon={data.collection_url ? clearSVG : navTreeSVG}
                iconAction={
                  data.collection_url
                    ? () => {
                        this.props.onChangeBlock(this.props.block, {
                          ...data,
                          collection_url: data.href,
                        });
                      }
                    : () =>
                        this.props.openObjectBrowser({
                          dataName: 'collection_url',
                          mode: 'link',
                        })
                }
                onChange={this.handleChange}
              />

              <SelectListingType />

              <SelectWidget
                required={false}
                error={[]}
                fieldSet="collection"
                id="index_name"
                title="Use filter"
                choices={this.props.metadataFields}
                value={this.props.data.index_name || []}
                onChange={this.handleChange}
              />
            </Segment>
          </Segment.Group>
        </SidebarPortal>
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Edit.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(
  (state, props) => {
    // console.log('vocabs', state.vocabularies);
    return {
      contentSubrequests: state.content.subrequests,
      metadataFields:
        state.vocabularies[vocabulary] && state.vocabularies[vocabulary].items
          ? state.vocabularies[vocabulary].items.map(o => [o.value, o.label])
          : [],
    };
  },
  {
    getVocabulary,
    getContent,
  },
)(Edit);
