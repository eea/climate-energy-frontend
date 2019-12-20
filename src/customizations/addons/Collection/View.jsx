/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import { Container, Image, Item} from 'semantic-ui-react';
import BlockView from 'volto-addons/Collection/BlockView';
import { getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

const CollectionView = ({ content }) => {
  let url = content['@id']
    .replace(settings.internalApiPath, '')
    .replace(settings.apiPath, '');
  url = getBaseUrl(url);
  console.log('content url', url);
  return (
  <Container  
    id="page-search"
    className="catalogue-body full-width-catalogue"
    >
      <Helmet title={content.title} />
      <section id="content-core">
        <div className="search-listing item-listing">
            <Item.Group>
                <h1 style={{marginTop: '0', marginLeft: '2rem', marginRight: '2rem'}} className="documentFirstHeading">
                {content.title}
                {content.subtitle && ` - ${content.subtitle}`}
                </h1>
                {content.description && (
                <p style={{ marginLeft: '2rem', marginRight: '2rem'}} className="documentDescription">{content.description}</p>
                )}
                <BlockView
                data={{
                    collection_url: url,
                    facetFilter: content.filter,
                }}
                />
            </Item.Group>
        </div>
      </section>
    </Container>
  );
};
export default CollectionView;
