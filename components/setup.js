import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, TextField, Button } from 'nr1';
import VCHeader from './vcHeader';
import { VIVIDCORTEX_URL } from '../CONFIGURE_ME';

export default class SetupUserToken extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    userToken: PropTypes.string,
    hideButton: PropTypes.bool,
    callbacks: PropTypes.object.isRequired
  };

  renderUserTokenInput() {
    const { userToken } = this.state;
    const { setUserToken } = this.props.callbacks;
    return (
      <div style={{ minWidth: '500px', padding: '20px' }}>
        <h3>Set your VividCortex Access Token</h3>
        <p>
          Retrieve your API access token from your{' '}
          <a href={VIVIDCORTEX_URL} target="_blank" rel="noopener noreferrer">
            VividCortex account
          </a>
          .
        </p>
        <TextField
          autofocus
          label="VividCortex Access Token"
          placeholder="Paste your access token here"
          onChange={({ target }) => this.setState({ userToken: target.value })}
        />
        <Button onClick={() => setUserToken(userToken)} type="primary">
          Set Your VividCortex Access Token
        </Button>
      </div>
    );
  }

  renderDeleteUserToken() {
    const { setUserToken } = this.props.callbacks;
    return (
      <div>
        <h3>Clear your VividCortex Access Token</h3>
        <p>
          You have provided a VividCortex access token, which you can delete
          from New Relic's secure storage.
        </p>
        <Button
          onClick={() => setUserToken(null)}
          iconType="interface_operations_trash"
          sizeType={Button.SIZE_TYPE.SMALL}
          type={Button.TYPE.DESTRUCTIVE}
        >
          Delete my VividCortex User Token
        </Button>
      </div>
    );
  }

  render() {
    const { userToken, hideButton } = this.props;
    return (
      <Grid>
        <GridItem columnSpan={12}>
          <VCHeader hideButton={hideButton || !userToken} />
        </GridItem>
        <GridItem>
          {!userToken && this.renderUserTokenInput()}
          {userToken && this.renderDeleteUserToken()}
        </GridItem>
      </Grid>
    );
  }
}
