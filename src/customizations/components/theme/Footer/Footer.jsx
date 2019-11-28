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
const Footer = ({ intl }) => (
  <Segment
    role="contentinfo"
    vertical
    padded
    textAlign="center"
    className="footer"
  >
    <Container fluid>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>
              Find information on the EU and its Member States' progress in
              their 2030 targets on climate and energy.
            </p>
          </Grid.Column>
          <Grid.Column>
            <ul className="unlist">
              <li>
                <Link className="item" to="/legal_notice">
                  <FormattedMessage
                    id="legal_notice"
                    defaultMessage="Legal notice"
                  />
                </Link>
              </li>
              <li>
                <Link className="item" to="/privacy_policy">
                  <FormattedMessage
                    id="privacy_policy"
                    defaultMessage="Privacy policy"
                  />
                </Link>
              </li>
              <li>
                <Link className="item" to="/credits">
                  <FormattedMessage id="Credits" defaultMessage="Credis" />
                </Link>
              </li>
            </ul>
          </Grid.Column>
          <Grid.Column>
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
        </Grid.Row>
      </Grid>
    </Container>
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

export default injectIntl(Footer);
