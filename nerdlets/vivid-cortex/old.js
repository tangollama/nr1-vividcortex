/** core */
import React from 'react'
import PropTypes from 'prop-types'
/** nr1 */
import {
    ChartGroup,
    Spinner
} from 'nr1';
//ORIG import { ChartGroupComponent } from '@datanerd/vizco'
//ORIG import { LoadingSpinner } from '@datanerd/nr-ui-legacy'
/** local */
import QueryProfiler from '../components/query/profiler'
import VCChart from '../components/vcChart'
import { getTimeInterval } from '../lib/time.js'
import OsHostSelector from '../components/host/osHostSelector'
import VcJumbotron from '../components/Jumbotron/vcJumbotron'
import { buildProfilerURL } from "../lib/drilldown"
/** 3rd party */
import { Card } from 'reactstrap'
/**
 *
 */
export default class VividCortexHostNerdlet extends React.Component {
    
    
    // ORIGINAL
    // static propTypes = {
    //     entity: PropTypes.object,
    //     nr1: PropTypes.object,
    // }

    //GIL
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        nerdlet_timerange: PropTypes.any
    };

    constructor(props) {
        super(props)

        const [from, until] = getTimeInterval(this.props.nerdlet_timeRange);

        //GIL added vc_config
        this.state = {
            vc_config: null,
            hosts: null,
            configLoaded: false,
            profilerKey: 1,
            from,
            until,
        }
        this._onConfigUpdate = this._onConfigUpdate.bind(this)
    }

    _onConfigUpdate() {
        this.refreshData()
    }

    _getHook() {
        return this.props.nr1.catalog.getHookAndExecute('vcpoc.vcmsg-bus');
    }

    getCollection(inEntity) {
        // ORIGINAL
        // const entity = inEntity ? inEntity : this.props.entity
        // return this.props.nr1.services.nerdStore.entityCollection("vividcortex-config-v0", entity.id)

        //GIL
        const __entityGuid = this.props.nerdletUrlState.entityGuid;
        const _query = {
            actionType: EntityStorageQuery.FETCH_POLICY_TYPE.NO_CACHE,
            entityGuid: __entityGuid,
            collection: "vividcortex-config-v1"
        }; //_query

        return EntityStorageQuery.query(_query);

        //GIL END
    }

    async refreshData(entity) {
        this.getCollection(entity).get("config").then(hosts => {
            this.setState({
                hosts: (hosts && hosts.length > 0) ? hosts : null,
                configLoaded: true
            }, () => {
                const vcName = (this.state.hosts && this.state.hosts.length > 0) ? this.state.hosts[0].name : null
                this.props.nr1.services.tessen.trackUserAction('loadHost', 'VividCortexHostNerdlet', {
                    entity: this.props.entity,
                    entityName: this.props.entity.name,
                    hosts: this.state.hosts,
                    vcName
                })
            })
        })
    }

    componentDidMount() {
        this.refreshData()
        this._getHook().then(messageBus => {
            messageBus.listen(this._onConfigUpdate);
        });
    }

    componentWillUnmount() {

        //ORIGINAL
        this._getHook().then(messageBus => {
            messageBus.unlisten(this._onConfigUpdate);
        });
        //END ORIGINAL
    }

    shouldComponentUpdate(nextProps) {
        const { entity } = this.props
        if (entity && entity.id != nextProps.entity.id) {
            this.refreshData(nextProps.entity)
        }
        return true;
    }

    render() {

        //ORIGINAL const { entity, nr1 } = this.props
        //GIL - not sure - no such thing as nr1 anymore ...
        const entity = this.props.nerdletUrlState.entityGuid;
        //GIL END 

        const { hosts, configLoaded, from, until, profilerKey } = this.state

        if (!configLoaded) {
            return <Spinner size="small" className="centered" />
        } else if (hosts) {
            return <div>
                <VcJumbotron {...this.props} showButton={true} />
                <ChartGroup>
                <div className="row vc-cardrow">
                    <Card body>
                        <VCChart
                            metric="host.totals.queries.tput"
                            title="Total Query Throughput"
                            from={from}
                            until={until}
                            hosts={hosts}
                            entity={entity}
                        />
                    </Card>
                    <Card body>
                        <VCChart
                            metric="host.totals.queries.p99_latency_us"
                            title="Query Latency p99"
                            from={from}
                            until={until}
                            hosts={hosts}
                            entity={entity}
                        />
                    </Card>
                    <Card body>
                        <VCChart
                            metric="host.totals.queries.time_us"
                            title="Total Query Time"
                            from={from}
                            until={until}
                            hosts={hosts}
                            entity={entity}
                        />
                    </Card>
                    <Card body>
                        <VCChart
                            metric={[
                                "mysql.status.threads_running",
                                "mysql.status.threads_connected",
                                "pgsql.processlist.state.idle.count",
                                "pgsql.processlist.state.active.count",
                                "pgsql.status.numbackends"
                            ]}
                            title="Current Active and Idle Connections"
                            from={from}
                            until={until}
                            hosts={hosts}
                            entity={entity}
                        />
                    </Card>
                    <Card body>
                        <VCChart
                        metric={["mysql.status.queries", "mysql.status.com_*", "host.verbs.*.tput", "pgsql.status.questions", "host.verbs.*.tput"]}
                        title="Operations Per Second"
                        from={from}
                        until={until}
                        hosts={hosts}
                        entity={entity}
                        />
                    </Card>
                </div>
                <div className="profiler">
                    <h4>
                        <a href={buildProfilerURL({ from, until, hosts })} target="_blank" rel="nooopener noreferrer">
                            Most time consuming queries
                        </a>
                    </h4>
                    <QueryProfiler from={from} until={until} hosts={hosts} key={profilerKey} {...this.props} />
                </div>
                </ChartGroup>
            </div>
        } else {
    //GIL 
    //  return <div>
    //            <OsHostSelector
    //                nr1={nr1}
    //                entity={entity}
    //            />
     //       </div>
     

            return (<div><p>OSHOSTSELECTOR GOES HERE</p></div>);
    //END GIL
       }
    }

    /*
     * Workaround for updating the profiler when the timepicker changes. Receiving a new time interval will
     * change the key in the component, causing the component to be destroyed and mounted again.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {

        //ORIGINAL const [from, until] = getTimeInterval(this.props.nr1.launcher.state.timeRange)

        //GIL
        const [from, until] = getTimeInterval(this.props.nerdlet_timeRange);
        //GIL END

        if (this.state.from !== from || this.state.until !== until) {
            this.setState({
                from,
                until,
                profilerKey: this.state.profilerKey + 1,
            })
        }
    }
}
