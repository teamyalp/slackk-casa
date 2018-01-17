import React from 'react';

export default class Search extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>
        <input ref="searchTerm" type="text" placeholder="Search" />
        <button onClick={e => this.props.searchClick(e, this.refs.searchTerm.value)}>Search!</button>
      </div>
    )
  }
}