import { VIVIDCORTEX_URL } from '../CONFIGURE_ME';

export const buildQueryURL = ({ from, until, hosts, queryId }) => {
  return `${VIVIDCORTEX_URL}/Default/queries/${queryId}?from=${from}&until=${until}&hosts=${flattenHosts(
    hosts
  )}`;
};

export const buildProfilerURL = ({ from, until, vcHosts }) => {
  return `${VIVIDCORTEX_URL}/Default/profiler?from=${from}&until=${until}&hosts=${flattenHosts(
    vcHosts
  )}&rank=queries&by=time`;
};

export const flattenHosts = hosts =>
  hosts.map(host => `id=${host.id}`).join(' ');
