import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Spinner, Stack, StackItem } from 'nr1';
import HostDropdown from './hostDropdown';
import { VIVIDCORTEX_API_URL } from '../CONFIGURE_ME';

export default class VCHostSelector extends React.Component {

  static propTypes = {
    entityGuid: PropTypes.string.isRequired,
    osHost: PropTypes.object,
    userToken: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      allHosts: null,
      osHosts: null,
      selectedOsHost: props.osHost ? props.osHost : null
    }

    this.handleOsHostChange = this.handleOsHostChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  componentDidMount() {
    return fetch(`${VIVIDCORTEX_API_URL}/api/v2/hosts?from=${moment().subtract("1", "hour").unix()}&until=${moment().unix()}`, {
      headers: {
        Authorization: `Bearer ${this.props.userToken}`
      }
    })
    .then(response => response.json())
    .then(response => response.data)
    .then((hosts) => {
      console.debug('vc returned', hosts);
      const osHosts = hosts.filter(host => host.type === "os");
      this.setState({ allHosts: hosts, osHosts })
    });
  }

  handleOsHostChange(selectedOsHost) {
    if (selectedOsHost) {
      this.setState({ selectedOsHost })
    } else {
      this.setState({selectedOsHost: null})
    }
  }

  async onSubmit() {
    const { allHosts, selectedOsHost } = this.state;
    if (!selectedOsHost) {
      this.props.callbacks.setVCHosts(null, this.props.entityGuid);
    } else {
      const vcHosts = allHosts.filter(h => h.parent == selectedOsHost.id || h.id == selectedOsHost.id);
      console.debug(vcHosts);
      this.props.callbacks.setVCHosts(vcHosts, this.props.entityGuid);
    }
  }

  async onReset() {
    this.setState({ selectedOsHost: null });
  }

  render() {
    const { selectedOsHost, osHosts } = this.state;
    const { entity, osHost } = this.props;
    if (!osHosts) {
      return <Spinner fillContainer />
    }
    return (<Stack fullWidth directionType={Stack.DIRECTION_TYPE.VERTICAL}>
      {osHost && <StackItem style={{margin:'10px'}}>
        <p>{entity.name} is currently connected to {osHost.name} ({osHost.id}). To utilize a different host, select one from the drop down below and click 'Apply'.</p>
      </StackItem>}
      {!osHost && <StackItem style={{margin:'10px'}}>
        <p>{entity.name} is not currently connected a host. Select one from the drop down below and click 'Apply'.</p>
      </StackItem>}
      {selectedOsHost && (!osHost || osHost.id  != selectedOsHost.id) && <StackItem style={{margin:'10px'}}>
        <p>You currently have unsaved changes. Click 'Apply' to continue.</p>
      </StackItem>}
      <StackItem style={{margin:'10px', width:'50%'}}>
        <HostDropdown title="Hosts" hosts={osHosts} setHost={this.handleOsHostChange}  />
      </StackItem>
      <StackItem style={{margin:'10px'}}>
        <Button onClick={this.onSubmit} type={Button.TYPE.PRIMARY}>Apply</Button>
        <Button onClick={this.onReset} type={Button.TYPE.DESTRUCTIVE} disabled={!selectedOsHost} style={{marginLeft:'10px'}}>Reset Configuration</Button>
      </StackItem>
    </Stack>)
  }
}