import React from "react"
import Plot from "react-plotly.js"

export default ({ metric, series, from, until }) => {
  const sampleSize = (until - from) / series.length
  const x = []
  const y = []

  series.forEach((value, index) => {
    x.push((from + index * sampleSize) * 1e3)
    y.push(value)
  })

  return (
    <Plot
      data={[
        {
          x,
          y,
          type: "scatter",
          fill: "tozeroy",
          mode: "lines",
          marker: { color: "#2cafb8" }
        }
      ]}
      config={{ static: true, displayModeBar: false }}
      layout={{
        margin: { t: 0, r: 0, b: 0, l: 0 },
        height: 70,
        width: 300,
        showlegend: false,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
      }}
    />
  )
}
