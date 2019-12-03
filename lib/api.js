import toGetParams from "./toGetParams.js"
import SaasProxy from "./saas-proxy.js"

const chartPixelWidth = 200   // Assumed pixel width of chart


export const fetchHosts = (params, userToken) => {
  //let restOfPath = 'hosts?' + toGetParams(params) + '&nest=tags';
  return SaasProxy.VIVIDCORTEX(userToken).get(`/hosts?${toGetParams(params)}&nest=tags`)
    .then(response => response.json())
    .then(response => response.data)
    .then(hosts => hosts.filter(host => host.type !== "os"))
}

export const augmentQuery = (query) => {
  const matches = query.metric.match(/([qpecf])\.([a-z0-9]{16})/);
  if (matches && matches.length) {
    query.id = matches[2];
    query.action = matches[1];
    query.notifications = {
      errors: 0,
      warnings: 0,
    };
  }
}

/**
 * Adds information to the query elements of an api response, to avoid doing that on every place where we fetch queries
 */
export const augmentQueries = (queries) => {

  // The response could be just an array, or an array of arrays
  queries.forEach(query => {
    if (query.length) {
      augmentQueries(query);
    }
    else { augmentQuery(query); }
  });
  return queries;
}

export const fetchQueries = (params, hosts, metrics, userToken) => {
  // Calculate sample size based on time interval. Assume 200 pixels
  params.samplesize = (params.until - params.from) / chartPixelWidth

  let payload = {
    host: hosts,
    metrics: typeof metrics === 'string' ? metrics : metrics.join(',')
  };
  return SaasProxy.VIVIDCORTEX(userToken).post(`metrics/query-series?${toGetParams(params)}`, payload)
    .then(response => response.data && response.data.length ? normalizeQueriesResponse(response.data) : [])
    .then(response => augmentQueries(response));
}

export const fetchQuery = (query, userToken) => {
  return SaasProxy.VIVIDCORTEX(userToken).get(`queries/${query}`)
    .then(response => (response.data && response.data.length ? response.data[0] : null))
}

function normalizeQueriesResponse(data) {
  const normalizedData = []

  data.forEach(data => {
    const elements = data.elements.filter(query => query.metric !== "")

    elements.forEach(element => normalizedData.push(element))
  })

  return normalizedData
}