import React from 'react';

export default class Search extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="search">
        <input ref="searchTerm" type="text" placeholder="Search" size="30" />
        <button onClick={e => this.props.searchClick(e, this.refs.searchTerm.value)}>Search!</button>
      </div>
    )
  }
}