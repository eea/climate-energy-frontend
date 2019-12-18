/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, List, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import eeaLogo from './ec.svg.png';
import ecLogo from './eea.png';
import { connect } from 'react-redux';

import { Anontools } from '@plone/volto/components';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright',
  },
});

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = (props) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    textAlign="center"
    className="footer"
  >
    {/* <Container fluid> */}
    <Grid tablet={0}
      computer={3}
      largeScreen={3}>
      <Grid.Column width={3}></Grid.Column>
      <Grid.Column tablet={12}
        computer={6}
        largeScreen={6}>
        <Grid columns={2}>
          <Grid.Column
            // style={{
            //   display: 'flex',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            //   textAlign: 'left',
            //   flexDirection: 'column',
            // }}
            style={{ textAlign: 'left', padding: '2rem'}}
            tablet={12}
            computer={6}
            largeScreen={6}
          >
            <p>
              Find information on the EU and its Member States' progress in
              their 2030 targets on climate and energy.
            </p>
            <ul className="unlist">
              {!props.token && (
                <li className="tools">
                  <Anontools />
                </li>
              )}
              <li>
                <Link className="item" to="/contact">
                  <FormattedMessage
                    id="contact"
                    defaultMessage="Contact"
                  />
                </Link>
              </li>
            </ul>
          </Grid.Column>
          <Grid.Column tablet={12} computer={6} largeScreen={6}>
            <div className="footerLogoWrapper">
              <img
                style={{ width: '120px', marginRight: '2rem' }}
                className="footerLogo"
                src={eeaLogo}
                alt=""
              />
              <img
                style={{ width: '160px' }}
                className="footerLogo"
                src={ecLogo}
                alt=""
              />
            </div>
          </Grid.Column>
        </Grid>
      </Grid.Column>
      <Grid.Column 
        tablet={0}
        computer={3}
        largeScreen={3}
      ></Grid.Column>

    </Grid>
    {/* </Container> */}
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default connect(state => ({
  token: state.userSession.token,
}))(injectIntl(Footer));
