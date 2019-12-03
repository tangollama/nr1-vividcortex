import React from 'react'
import { Table } from 'reactstrap'
import ProfilerRow from "./row"

export default ({ queries, from, until, hosts, nr1, entity }) => (
  <Table striped hover>
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
          hosts={hosts}
          nr1={nr1}
          entity={entity}
        />
      ))}
    </tbody>
  </Table>
)
