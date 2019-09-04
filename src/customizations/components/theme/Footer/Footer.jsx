/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, List, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import footerImage from './footer.png';
import LogoImage from '@plone/volto/components/theme/Logo/Logo.svg';
import eeaLogo from './ec.svg.png';
import ecLogo from './eea.png';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright',
  },
});
import 'semantic-ui-css/semantic.min.css'

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
    className="footerWrapper"
  >
    <img className="footerImage" src={footerImage} alt="" />
    <Container>
     

      <Grid divided='vertically'>
        <Grid.Row columns={4}>
          <Grid.Column>
            <b>ABOUT</b>
            <p>Fise - Forest Information System for Europe is a forest knowledge base in support of the EU Forest Strategy <a href="#">See more</a></p>
            <img src={LogoImage} alt="Forest"/>
          </Grid.Column>
            <div style={{display: 'none'}}>fasasf</div>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>
          <b>LINKS</b>
          <List vertical>
            {/* wrap in div for a11y reasons: listitem role cannot be on the <a> element directly */}
            <div role="listitem" className="item">
              <Link className="item" to="/legal_notice">
                <FormattedMessage id="legal_notice" defaultMessage="Legal notice" />
              </Link>
            </div>
            <div role="listitem" className="item">
              <Link className="item" to="/private_policy">
                <FormattedMessage
                  id="private_policy"
                  defaultMessage="Private policy"
                />
              </Link>
            </div>
            <div role="listitem" className="item">
              <Link className="item" to="/credits">
                <FormattedMessage id="Credits" defaultMessage="Credis" />
              </Link>
            </div>
            </List>
          </Grid.Column>
          <Grid.Column>
            <b>PARTNERS</b>
            <Grid divide="vertically">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <img className="footerLogo" src={eeaLogo} alt=""/>
                </Grid.Column>
                <Grid.Column>              
                  <img className="footerLogo" src={ecLogo} alt=""/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
