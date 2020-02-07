import React, { Component } from 'react';
import { FormattedDate } from 'react-intl';
import { Item } from 'semantic-ui-react';
import { Breadcrumb, Placeholder } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { settings } from '~/config';

class TilesListing extends Component {
  getPath(url) {
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }

  render() {
    // const { items } = this.props;
    const searchItems = this.props.items?.sort(
      (a, b) => new Date(b.ModificationDate) - new Date(a.ModificationDate),
    );
    console.log('lalalalalalala tiles listing');
    return searchItems.length ? (
      searchItems.map(item => (
        <Item className="search-item" key={item['@id']}>
          <Item.Content>
            {/* <Item.Header>
         
            </Item.Header> */}

            <Item.Description>
              <div className="descriptionBody">
                <Link style={{ color: '#444' }} to={item.url}>
                  <h4 className="item-title">
                    {item.description || (item.title || item.Title)}
                  </h4>
                </Link>
              </div>
              <div className="searchMetadata">
                {item.topics && (
                  <div>
                    <span className="searchLabel black">Topic:</span>{' '}
                    {item.topics?.join(', ')}
                  </div>
                )}
                <div>
                  <span className="searchLabel black">Updated:</span>{' '}
                  <FormattedDate
                    value={item.ModificationDate}
                    day="2-digit"
                    month="long"
                    year="numeric"
                  />
                </div>
                <div>
                  <span className="searchLabel black">Location:</span>{' '}
                  {item['@components'] && item['@components'].breadcrumbs && (
                    <Breadcrumb style={{ display: 'inline' }}>
                      {item['@components'].breadcrumbs.items
                        .slice(0, -1)
                        .map((item, index, items) => [
                          index < items.length - 1 ? (
                            <Breadcrumb.Section>
                              <Link
                                key={item.url}
                                to={this.getPath(item['@id'])}
                              >
                                {item.title}
                              </Link>
                              <Breadcrumb.Divider key={`divider-${item.url}`} />
                            </Breadcrumb.Section>
                          ) : (
                            <Breadcrumb.Section>
                              <Link
                                key={item.url}
                                to={this.getPath(item['@id'])}
                              >
                                {item.title}
                              </Link>
                            </Breadcrumb.Section>
                          ),
                        ])}
                    </Breadcrumb>
                  )}
                </div>
              </div>
            </Item.Description>
          </Item.Content>
        </Item>
      ))
    ) : (
      <div>
        <p>No results.</p>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </div>
    );
  }
}

export default TilesListing;
