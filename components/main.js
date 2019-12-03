import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, HeadingText, ChartGroup } from 'nr1';
import VCHeader from './VCHeader';
import VCChart from './vcChart';
import VCHostSelector from './vcHostSelector';
import ConfigModal from './configModal';
import QueryProfiler from './query/profiler';
import { buildProfilerURL } from '../lib/drilldown';

export default class VCMain extends React.PureComponent {
  static propTypes = {
    vcHosts: PropTypes.any,
    osHost: PropTypes.object,
    userToken: PropTypes.string.isRequired,
    from: PropTypes.number.isRequired,
    until: PropTypes.number.isRequired,
    entityGuid: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    openConfig: PropTypes.bool
  }

  render() {
    const { vcHosts, callbacks, from, until } = this.props;
    return (<React.Fragment>
      <ChartGroup>
        <Grid>
          <GridItem columnSpan={12}><VCHeader hideButton={!vcHosts} callbacks={callbacks} /></GridItem>
          {vcHosts && <React.Fragment><GridItem columnSpan={4}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H2}>Total query throughput</HeadingText>
            <VCChart
              metric="host.totals.queries.tput"
              {...this.props}
            />
          </GridItem>
          <GridItem columnSpan={4}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H2}>Query latency p99</HeadingText>
            <VCChart
              metric="host.totals.queries.p99_latency_us"
              {...this.props}
            />
          </GridItem>
          <GridItem columnSpan={4}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H2}>Total query time</HeadingText>
            <VCChart
              metric="host.totals.queries.time_us"
              {...this.props}
            />
          </GridItem>
          <GridItem columnSpan={6}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H2}>Current active and idle connections</HeadingText>
            <VCChart
              metric={[
                "mysql.status.threads_running",
                "mysql.status.threads_connected",
                "pgsql.processlist.state.idle.count",
                "pgsql.processlist.state.active.count",
                "pgsql.status.numbackends"
              ]}
              {...this.props}
            />
          </GridItem>
          <GridItem columnSpan={6}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H2}>Operations per second</HeadingText>
            <VCChart
              metric={[
                "mysql.status.queries",
                "mysql.status.com_*",
                "host.verbs.*.tput",
                "pgsql.status.questions",
                "host.verbs.*.tput"
              ]}
              {...this.props}
            />
          </GridItem>
          <GridItem columnSpan={12}>
            <HeadingText tagType={HeadingText.TAG_TYPE.H1}><a href={buildProfilerURL({ from, until, vcHosts })} target="_blank" rel="nooopener noreferrer">Most time consuming queries</a></HeadingText>
            <QueryProfiler {...this.props} />
          </GridItem></React.Fragment>}
          {!vcHosts && <GridItem columnSpan={12}><VCHostSelector {...this.props} /></GridItem>}
        </Grid>
      </ChartGroup>
      <ConfigModal {...this.props} />
    </React.Fragment>)
  }
}
