import React from 'react';
import PropTypes from 'prop-types';
import { Item, Grid, Divider } from 'semantic-ui-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

const GridTemplate = ({ items }) => {
  return (
    <div className="catalogue-listing">
      {items.map((item, index) => (
        <Item className="catalogue-listItem" key={item['@id']}>
          <Item.Content>
            <Item.Header
              className={cx({
                'catalogue-right-header': index % 2 !== 0,
              })}
            >
              <Link style={{ color: '#666' }} to={item.url}>
                <h2 className="item-title">{item.title || item.Title}</h2>
              </Link>
            </Item.Header>
            <Item.Description>
              <div className="descriptionBody">
                <Link style={{ color: '#444' }} to={item.url}>
                  <p className="item-description">
                    {item.description || item.title || item.Title}
                  </p>
                </Link>
              </div>
              <div className="searchMetadata">
                {item.topics && (
                  <div>
                    <span className="searchLabel black">Topic:</span>{' '}
                    {item.topics?.join(', ')}
                  </div>
                )}
                {/* <div>
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
                  {item['@components'] && item['@components']?.breadcrumbs && (
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
                </div> */}
              </div>
            </Item.Description>
          </Item.Content>
        </Item>
      ))}
    </div>
  );
};

GridTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default GridTemplate;
