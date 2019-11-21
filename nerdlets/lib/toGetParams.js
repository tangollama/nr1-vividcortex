export default (object = {}) => {
  let params = []

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      params.push(`${key}=${object[key]}`)
    }
  }

  return params.join('&')
}
