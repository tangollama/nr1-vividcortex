import React from "react"
import { fetchHosts } from "../lib/api"
import { matchHosts } from "../lib/host"

const initialSearchState = { ip: "", port: "", tags: "" }

export default class HostSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      host: "",
      hosts: [],
      search: initialSearchState,
      matchedHosts: [],
    }

    this.handleIpChange = this.handleIpChange.bind(this)
    this.handlePortChange = this.handlePortChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleTagsChange = this.handleTagsChange.bind(this)

  }

  handleSelectChange(e) {
    const id = parseInt(e.target.value)
    const { onChange } = this.props
    const { hosts } = this.state

    if (!id) {
      return onChange([])
    }

    this.setState({ host: id, matchedHosts: [], search: initialSearchState })
    
    onChange(hosts.filter(host => host.id === id))
  }

  handleIpChange(e) {
    this.setState({ search: { ...this.state.search, ip: e.target.value } })
  }

  handlePortChange(e) {
    this.setState({ search: { ...this.state.search, port: e.target.value } })
  }

  handleTagsChange(e) {
    this.setState({ search: { ...this.state.search, tags: e.target.value } })
  }

  searchHost() {
    const { ip, port, tags } = this.state.search

    const match = matchHosts(hosts, { ip, port, tags })

    this.setState({ host: "", matchedHosts: match })

    this.props.onChange(match)
  }

  componentDidMount() {
    const { from, until } = this.props

    fetchHosts({ from, until }).then(hosts => this.setState({ hosts }))
  }

  render() {
    const { matchedHosts, search: { ip, port, tags }, hosts, host } = this.state

    return (
      <React.Fragment>
        <div className="field has-addons">
          <label className="label">Match hosts</label>
        </div>
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Host name or IP"
              value={ip}
              onChange={this.handleIpChange}
            />
          </div>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Port number"
              value={port}
              onChange={this.handlePortChange}
            />
          </div>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Tag"
              value={tags}
              onChange={this.handleTagsChange}
            />
          </div>
          <div className="control">
            <button type="button" onClick={this.searchHost} className="button is-info">
              Search
            </button>
          </div>
        </div>

        {(ip || port || tags) && matchedHosts.length > 0 && (
          <div className="box">
            {matchedHosts.map(host => (
              <span key={host.id}>{host.name}. </span>
            ))}
          </div>
        )}

        <div className="field">
          <label className="label">Or</label>
          <div className="control">
            <div className="select">
              <select value={host} onChange={this.handleSelectChange}>
                <option>Select host</option>
                {hosts.map(host => (
                  <option value={host.id} key={host.id}>
                    {host.type} {host.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
