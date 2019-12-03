import React from "react"
import Graph from "./graph"
import { fetchQuery } from "../../../lib/api"
import { metricToQuery } from "../../../lib/query"
import { buildQueryURL } from "../../../lib/drilldown"

export default class ProfilerRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      digest: props.query.metric,
      queryId: metricToQuery(props.query.metric)
    }
  }

  componentDidMount() {
    fetchQuery(this.state.queryId).then(query => this.setState({ digest: query.digest }))
  }

  render () {
    const query = this.props.query;
    const { query: { metric, series, id, rank }, from, until, hosts } = this.props
    const { digest } = this.state
    const errors = query.notifications.errors;
    const action = query.action ? {q: 'Query', e: 'Execute', f: 'Fetch', p: 'Prepare', c: 'Close'}[query.action] : undefined;
    const href = buildQueryURL({ queryId: id, from, until, hosts })
    return (
      <tr className="vc-row">
        <td>
          {rank}
        </td>
        <td>
          <a
            href={href}
            className="vc-profiler__digest"
            target="_blank"
            rel="noreferrer noopener"
            title={digest}
          >
            {digest}
          </a>
          { errors ? <div className="vc-error">Errors: {errors}</div> : null }
          { action ? <div>Action: { action }</div> : null }
          { query.throughput ? <div>Throughput: { query.throughput.summary.toFixed(4) }</div> : null }
          { query.time ? <div>Total Time: {query.time.summary.toFixed(4)} </div> : null }
          { query.latency ? <div>Avg Latency: {query.latency.summary.toFixed(4)} </div> : null }
        </td>
        <td className="profiler-row__graph" >
          <Graph metric={metric} series={series} from={from} until={until} />
        </td>
      </tr>
    )
  }
}