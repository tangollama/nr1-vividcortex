import {VIVIDCORTEX_API_URL} from '../CONFIGURE_ME';

export default class SaasProxy {
  constructor(pathRoot, headers) {
    this.urlPrefix = `${VIVIDCORTEX_API_URL}/${pathRoot}`;
    this.headers = headers
  }

  async call(httpMethod, path, payload) {
    const url = `${this.urlPrefix}/${path}`
    const options = {
    method: httpMethod,
    headers: this.headers,
    mode: 'cors'
    }
    if (payload) {
      options.body = JSON.stringify(payload)
    }
    return await (await fetch(url, options)).json(); // eslint-disable-line
  }

  async get(path) {
    return this.call('get', path)
  }

  async post(path, payload) {
    return this.call('post', path, payload)
  }

  static VIVIDCORTEX = (userToken) => {
    return new SaasProxy("api/v2", { 'content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${userToken}` });
  }
}
