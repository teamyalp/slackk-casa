import React from 'react';
import MemberEntry from './MemberEntry.jsx';

// container for all current users
const MemberList = (props) => {
  const getMemberEntry = () => {
    const { users, username, changeCurrentWorkSpace, directMessage } = props;
    if (users.length) {
      return users.map(user => <MemberEntry key={user.id} user={user} username={username} changeCurrentWorkSpace={changeCurrentWorkSpace} directMessage={directMessage}/>);
    }
    return '';
  };

  return (
    <div>
      <h3 className="memberList-header">Member List</h3>
      {getMemberEntry()}
    </div>
  );
};

export default MemberList;
