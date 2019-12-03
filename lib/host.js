export const getHostsByBindings = (hosts, ip, port) => {
  const target = `${ip}:${port}`

  let matches = hosts.filter(host => {
    return host.bindings.filter(binding => binding === target)
  })

  if (matches.length) {
    return hosts
  }

  const altTargets = [target, ip.replace(/\./g, "-")]

  return hosts.filter(host => {
    return altTargets.filter(target => host.description.includes(target))
  })
}

export const getHostsByTags = (hosts, tags) => {
  return hosts.filter(host => host.tags.indexOf(tags))
}

export const matchHosts = (hosts, { ip, port, tags }) => {
  let matchedHosts = []

  if (ip || port) {
    matchedHosts = getHostsByBindings(hosts, ip, port)
  }

  if (tags) {
    matchedHosts = getHostsByTags(matchedHosts.length ? matchedHosts : hosts)
  }

  return matchedHosts
}
