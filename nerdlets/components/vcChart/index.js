/** core */
import React from 'react'
import PropTypes from 'prop-types'
/** nr1 */
import {
    LineChart
} from 'nr1'
//import { DefaultWidget, GenericComponent, ColorManager } from '@datanerd/vizco'
/** local */
import {fetchQueries} from '../../lib/api'
/** 3rd party */

export default class VCChart extends React.Component {
    static propTypes = {
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        hosts: PropTypes.array.isRequired,
        metric: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        entity: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            chartData: []
        }
        this.refresher = null
    }

    async refreshData() {
        const params = {
            from: this.props.from,
            until: this.props.until,
            separateHosts: 0
        };

        fetchQueries(params, this.props.hosts.map(host => host.id), this.props.metric).then(response => {
            const chartData = []

            // ORIG  const colorManager = new ColorManager({
            //     persist: true,
            //     persistKey: 'vizco-color-consistency-foo-overview',
            //     consistentBy: {
            //         facetName: true,
            //         facetValue: true,
            //         eventName: false
            //     }
            // })
            //REMOVING COLOR MANAGER AND REPLACING IT WITH RED PEOPLE LOVE RED

            response.forEach(data => {
                const timeseries = data.series.map((value, ind) => ({
                    x: params.from + ind * params.samplesize,
                    y: value,
                }));


                // ORIG chartData.push({
                //     metadata: {
                //         id: data.metric,
                //         label: data.metric,
                //         color: colorManager.getColor(),
                //         viz: 'main',
                //         unitsData: {
                //             y: 'count',
                //             x: 'timestamp'
                //         }
                //     },
                //     data: timeseries
                // })
                chartData.push({
                    metadata: {
                        id: data.metric,
                        label: data.metric,
                        color: red,
                        viz: 'main',
                        unitsData: {
                            y: 'count',
                            x: 'timestamp'
                        }
                    },
                    data: timeseries
                })
            })
            this.setState({chartData}, () => {
                this.refresher = setTimeout(() => {
                    this.refreshData()
                }, 60000)
            })
        })
    }

    async componentDidMount() {
        this.refreshData()
    }

    componentWillUnmount() {
        if (this.refresher) {
            clearTimeout(this.refresher)
        }
    }

    shouldComponentUpdate(nextProps) {
        const { entity, from, until } = this.props
        if ((entity && entity.id != nextProps.entity.id)
            || (from != nextProps.from)
            || (until != nextProps.until)) {
            if  (this.refresher) {
                clearTimeout(this.refresher)
            }
            this.refreshData()
        }
        return true;
    }

    render() {
        const actions = {
            'expand-item': true,
            'get-image': true,
            'pin-to-insights': false,
            'view-cds-query': false,
            'view-in-insights': false,
            'view-nrql-query': false
        };

        //GIL
        return (
            <LineChart
                data={this.state.chartData}
            />
        );
        //END GIL

        // ORIG return (
        //     <DefaultWidget
        //         title={this.props.title}
        //         className='widget'
        //         type={GenericComponent.CHART_LINE}
        //         data={this.state.chartData}
        //         fetchable={false}
        //         cdsToVizco={false}
        //         actions={actions}
        //      />
        // );
    }
}
