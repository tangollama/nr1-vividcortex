import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Spinner } from 'nr1';
import { fetchQueries } from '../lib/api';
import ColorManager from '../lib/color-manager';

export default class VCChart extends React.Component {
  static propTypes = {
    metric: PropTypes.array.isRequired,
    vcHosts: PropTypes.array,
    userToken: PropTypes.string.isRequired,
    from: PropTypes.number.isRequired,
    until: PropTypes.number.isRequired,
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      chartData: null
    };
    this.refresher = null;
    this.colorManager = new ColorManager();
  }

  async componentDidMount() {
    this.refreshData();
  }

  shouldComponentUpdate(nextProps) {
    const { entity, from, until } = this.props;
    if (
      (entity && entity.id !== nextProps.entity.id) ||
      from !== nextProps.from ||
      until !== nextProps.until
    ) {
      if (this.refresher) {
        clearTimeout(this.refresher);
      }
      this.refreshData();
    }
    return true;
  }

  componentWillUnmount() {
    if (this.refresher) {
      clearTimeout(this.refresher);
    }
  }

  async refreshData() {
    const params = {
      from: this.props.from,
      until: this.props.until,
      separateHosts: 0
    };

    const response = await fetchQueries(
      params,
      this.props.vcHosts.map(host => host.id),
      this.props.metric,
      this.props.userToken
    );
    const chartData = [];
    // console.log(response);
    // debugger;
    response.forEach((data, i) => {
      const timeseries = data.series.map((value, ind) => ({
        x: params.from + ind * params.samplesize,
        y: value
      }));
      const color =
        i === 0 ? 'rgb(204, 0, 187)' : this.colorManager.getColor(data.series);
      chartData.push({
        metadata: {
          id: data.metric,
          label: data.metric,
          color,
          viz: 'main',
          unitsData: {
            y: 'count',
            x: 'timestamp'
          }
        },
        data: timeseries
      });
    });

    this.setState({ chartData }, () => {
      this.refresher = setTimeout(() => {
        this.refreshData();
      }, 60000);
    });
  }

  render() {
    const { chartData } = this.state;
    if (!chartData) {
      return <Spinner fillContainer style={{ height: '250px' }} />;
    }
    return (
      <LineChart data={chartData} style={{ height: '250px', width: '100%' }} />
    );
  }
}
