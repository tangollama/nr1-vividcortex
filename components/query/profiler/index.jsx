import React from "react"
import PropTypes from 'prop-types'
import ProfilerTable from "./table"
import { fetchQueries } from "../../../lib/api"

export default class QueryProfiler extends React.Component {

  static propTypes = {
    from: PropTypes.number,
    until: PropTypes.number,
    vcHosts: PropTypes.array,
    userToken: PropTypes.string.isRequired,
    nr1: PropTypes.object,
    entity: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      hosts: props.hosts,
      queries: null
    }
    this.timeout = null
  }

  // Adds the avg latency summary for each query
  _computeLatency(queries) {
    queries.forEach(query => {
      if (query.time && query.throughput) {
        query.latency = { summary: query.time.summary / query.throughput.summary }
      }
    });
  }

  refreshData() {
    const { from, until, vcHosts } = this.props
    const allHostsIDs = vcHosts.map(host => host.id);

    // Fetch the top queries by time
    fetchQueries(
      { from, until, limit: 20, rank: 1, separateHosts: 0 },
      allHostsIDs,
      "host.queries.*.*.time_us",
      this.props.userToken
    ).then(queries => {
      const allQueryIds = queries.map(query => query.id)

      // Index all the query objects by ID and action so they are easier to get
      const indexedQueries = {}
      queries.forEach(query => {
        indexedQueries[query.action + '.' + query.id] = query
      });

      // Summarize the total query time
      queries.forEach(query => {
        query.time = {summary: d3.sum(query.series)};
      });

      // Fetch notifications (errors only for now, TODO: fetch warnings and failed rules ?)
      const metrics = `host.queries.q|p|e|c|f.${allQueryIds.join('|')}.errors.tput`
      fetchQueries(
        {from, until},
        allHostsIDs,
        metrics
      ).then((result) => {
        // set the query Ids to every item of the result
        result.forEach(item => item.id = item.metric.split('.')[3])

        // summarize notifications indexed by the query Ids
        const notifications = {}

        result.forEach(item => {
          notifications[item.id] = {errors: 0, warnings: 0};
          notifications[item.id].errors += d3.sum(item.series)
        });

        queries.forEach(query => {
          query.notifications = notifications[query.id]
        });

        this.setState({ queries })
      });

      // Fetch query throughput as well
      const tputMetrics = queries.map(query => `host.queries.${query.action}.${query.id}.tput`)
      fetchQueries(
        {from, until},
        allHostsIDs,
        tputMetrics
      ).then((result) => {
        result.forEach(item => {
          const query = indexedQueries[item.action + '.' + item.id]
          query.throughput = {summary: d3.sum(item.series)}
        });
        this._computeLatency(queries);
      });

      this.timeout = setTimeout(() => { this.refreshData }, 60000)
    })
  }

  componentDidMount() {
    this.refreshData();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  render() {
    const { queries } = this.state

    return (
      <div>
        {queries !== null && (
          <ProfilerTable queries={queries} {...this.props} />
        )}
      </div>
    )
  }
}
