export default class SaasProxy {
    constructor(pathRoot, headers) {
      this.urlPrefix = `${window.__nr.services['public-saas-proxy']}/${pathRoot}`;
      this.headers = headers
    }

    call(httpMethod, path, payload) {
      const url = `${this.urlPrefix}/${path}`
      const options = {
        method: httpMethod,
        headers: this.headers,
        credentials: 'include'
      }
      if (payload) {
        options.body = JSON.stringify(payload)
      }
      return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.error(error)) // eslint-disable-line
    }

    get(path) {
      return this.call('get', path)
    }

    post(path, payload) {
      return this.call('post', path, payload)
    }

    static SLACK = new SaasProxy("slack/api", { 'content-type': 'application/json' })
    static GITHUB = new SaasProxy("github/api/v3", { 'content-type': 'application/json' })
    static VIVIDCORTEX = new SaasProxy("vividcortex/api/v2", {'content-type': 'application/json' })
}
