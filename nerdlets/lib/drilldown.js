const domain = "https://new-relic.app.vividcortex.com/Default"

export const buildQueryURL = ({ from, until, hosts, queryId }) => {
    return `${domain}/queries/${queryId}?from=${from}&until=${until}&hosts=${flattenHosts(hosts)}`
}

export const buildProfilerURL = ({ from, until, hosts }) => {
    const hostsParam = hosts.map(host => `id=${host.id}`).join(' ')

    return `${domain}/profiler?from=${from}&until=${until}&hosts=${flattenHosts(hosts)}&rank=queries&by=time`
}

export const flattenHosts = (hosts) => hosts.map(host => `id=${host.id}`).join(' ');