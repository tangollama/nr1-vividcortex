import React from "react"
import { SparklineChart } from 'nr1';

export default ({ metric, series, from, until }) => {
  /*const sampleSize = (until - from) / series.length
  const x = []
  const y = []*/
  const data = [];

  series.forEach((value, index) => {
    x.push((from + index * sampleSize) * 1e3)
    y.push(value)
  })

  const timeseries = series.map((value, ind) => ({
      x: params.from + ind * params.samplesize,
      y: value,
  }));

  data.push({
    metadata: {
      id: metric,
      label: metric,
      color: red,
      viz: 'main',
      unitsData: {
        y: 'count',
        x: 'timestamp'
      }
    },
    data: timeseries
  });
  return (
    <SparklineChart data={data}
      style={{ height: '50px'}}
    />
  )
}
