import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import fetch from "isomorphic-fetch";
import { Alert, Button } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead';
import VcJumbotron from '../Jumbotron/vcJumbotron';

export default class OsHostSelector extends React.Component {

    static propTypes = {
        entity: PropTypes.object,
        nr1: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            allHosts: [],
            from: moment().subtract("1", "hour").unix(),
            databaseHosts: [],
            osHosts: [],
            savedDatabaseHosts: [],
            selectedDatabaseHost: "",
            selectedOsHost: "",
            until: moment().unix(),
            config: null,
            message: null,
        }

        this.handleOsHostChange = this.handleOsHostChange.bind(this);
        this.handleDatabaseHostChange = this.handleDatabaseHostChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.selectSuggestedBind = this.selectSuggested.bind(this);
    }

    selectSuggested(host) {
        alert(JSON.stringify(host))
    }

    handleOsHostChange(osHost) {
        if (osHost.length > 0) {
            const targetHostId = osHost[0].id
            this.setState({selectedOsHost: targetHostId})
            let databaseHosts = this.state.allHosts.filter(host => host.parent === targetHostId)
            this.setState({ databaseHosts })
            return;
        }

        this.setState({selectedOsHost: ""})
    }

    handleDatabaseHostChange(e) {
        const targetHostId = parseInt(e.target.value)
        this.setState({selectedDatabaseHost: isNaN(targetHostId) ? '' : targetHostId})
    }

    _getHook() {
        return this.props.nr1.catalog.getHookAndExecute('vcpoc.vcmsg-bus');
    }

    async onSubmit() {
        let response = this.state.selectedDatabaseHost !== "" ? this.state.allHosts.filter(host => host.id === this.state.selectedDatabaseHost) : this.state.databaseHosts;
        this.getCollection().write("config", response).then(result => {
            this.setState({
                message: 'Hosts Updated. Please close this window and refresh the browser if not done automatically.'
            })
            this._getHook().then(messageBus => {
                messageBus.send("configChanged")
            })
        })
    }

    async onReset() {
        this.getCollection().delete("config").then(() => {
            this.setState({
                selectedOsHost: '',
                databaseHosts: '',
                selectedDatabaseHost: '',
                savedDatabaseHosts: null,
                message: 'Success. Please select a new host or close this window.'
            })
            this._getHook().then(messageBus => {
                messageBus.send("configChanged")
            })
        })
    }

    getCollection() {
        const { nr1, entity } = this.props;
        return nr1.services.nerdStore.entityCollection("vividcortex-config-v0", entity.id);
    }

    fetchOsHosts() {
        return fetch(`https://app.vividcortex.com/api/v2/hosts?from=${this.state.from}&until=${this.state.until}`, {
            headers: {
              Authorization: `Bearer vJYcE8KmovCO9t9AHckrB4OijbG7uPxZ`
            }
          })
            .then(response => response.json())
            .then(response => response.data)
            .then((hosts) => {
                this.setState({allHosts: hosts})
                let osHosts = hosts.filter(host => host.type === "os");
                this.setState({ osHosts })
            });
    }

    componentDidMount() {
        this.fetchOsHosts();
        this.getCollection().get("config").then(config => {
            if (config) {
                this.setState({
                    config,
                    savedDatabaseHosts: config
                })
            }
        })
    }

    render() {
        const { databaseHosts, osHosts, config, selectedOsHost, message, savedDatabaseHosts } = this.state;
        const { entity } = this.props;
        return (
            <React.Fragment>
                {config &&
                    <VcJumbotron subtitle={`Configure the VividCortex analysis of the databases running on ${entity.name}.`}/>}
                {savedDatabaseHosts && savedDatabaseHosts.length > 0 && <div style={{margin:'10px'}}>
                    You are currently utilizing the following hosts:
                    <ul style={{listStyleType:'disc'}}>
                        {savedDatabaseHosts.map(host => (
                            <li key={host.id}><strong>{host.name}</strong> (id: {host.id})</li>
                        ))}
                    </ul>
                    <p>
                        To utilize a different set of hosts, select an OS host below.
                    </p>
                </div>}
                <div style={{margin:'10px', width:'50%'}}>
                    <Typeahead
                        labelKey="name"
                        onChange={this.handleOsHostChange}
                        options={osHosts}
                        placeholder="Start typing a hostname"
                    />
                </div>
                {selectedOsHost && <div style={{margin:'10px'}}>
                    <select value={this.state.selectedDatabaseHost} onChange={this.handleDatabaseHostChange}>
                        <option>All Databases for this host</option>
                        {databaseHosts.map(host => (
                            <option value={host.id} key={host.id}>
                                {host.type} {host.name}
                            </option>
                        ))}
                    </select>
                </div>}
                <div style={{margin:'10px'}}>
                    <Button onClick={this.onSubmit} color="secondary" disabled={!selectedOsHost}>Apply</Button>
                    <Button onClick={this.onReset} color="danger" disabled={!savedDatabaseHosts || !savedDatabaseHosts.length} style={{marginLeft:'10px'}}>Reset Configuration</Button>
                    {message && <Alert color="success" style={{marginTop:'10px'}}>{message}</Alert>}
                </div>
            </React.Fragment>
        )
    }
}