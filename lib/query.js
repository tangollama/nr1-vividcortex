export const metricToQuery = metric => {
  const matches = metric.match(/[a-z0-9]{16}/)

  return matches.length ? matches[0] : metric
}
