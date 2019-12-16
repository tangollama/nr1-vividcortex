import React from 'react';
import PropTypes from 'prop-types';

import ProfilerRow from './row';

const Table = ({ queries, from, until, vcHosts, entity }) => (
  <table style={{ width: '95%' }}>
    <thead>
      <tr>
        <th>#</th>
        <th>Query</th>
        <th />
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
);

Table.propTypes = {
  queries: PropTypes.array,
  from: PropTypes.number,
  until: PropTypes.number,
  vcHosts: PropTypes.array,
  entity: PropTypes.object
};

export default Table;
