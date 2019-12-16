import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownItem } from 'nr1';

export default class HostDropdown extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    hosts: PropTypes.array,
    setHost: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: null
    };
  }

  render() {
    let { title, hosts, setHost } = this.props;
    const { filter } = this.state;

    if (filter && filter.length > 0) {
      const re = new RegExp(filter, 'i');
      hosts = hosts.filter(h => {
        return h.name.match(re);
      });
    }
    return (
      <Dropdown
        title={title}
        search={filter || ''}
        onSearch={event => this.setState({ filter: event.target.value })}
        className="hostPicker"
      >
        {hosts.map(h => {
          return (
            <DropdownItem key={h.id} onClick={() => setHost(h)}>
              {h.name}
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
}
