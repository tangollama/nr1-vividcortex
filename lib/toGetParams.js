export default (object = {}) => {
  const params = [];

  const keys = Object.keys(object);

  keys.forEach(key => {
    params.push(`${key}=${object[key]}`);
  });

  return params.join('&');
};
