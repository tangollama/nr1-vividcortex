import React from "react"
import { SparklineChart } from 'nr1';

export default ({ metric, series, from, until }) => {
  const sampleSize = (until - from) / series.length
  /*const x = []
  const y = []*/
  const data = [];

  /*series.forEach((value, index) => {
    x.push((from + index * sampleSize) * 1e3)
    y.push(value)
  })*/

  const timeseries = series.map((value, ind) => ({
      x: from + ind * sampleSize,
      y: value,
  }));

  data.push({
    metadata: {
      id: metric,
      label: metric,
      color: 'rgb(204, 0, 187)',
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
