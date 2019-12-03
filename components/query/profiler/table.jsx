import React from 'react'
import ProfilerRow from "./row"

export default ({ queries, from, until, vcHosts, entity }) => (
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Query</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {queries.map(query => (
        <ProfilerRow
          key={query.metric}
          query={query}
          from={from}
          until={until}
          hosts={vcHosts}
          entity={entity}
        />
      ))}
    </tbody>
  </table>
)
