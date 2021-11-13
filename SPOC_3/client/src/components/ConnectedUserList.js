import React from "react";

function ConnectedUserList(props) {

  return (
    <div>
      <div id="connected_users">
        {props.usersList.map((val, key) => {
          return (
            <div key={key} className="connected_user_container" onClick={ }>
              <img
                src="https://img.utdstc.com/icon/9a8/867/9a8867eb77f8a20e62b5ea69f900de7c650546db544a00ce042d66945fd987bb:200"
                alt="messenger butterfly icon" />
              <div>
                <p>{val.username}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConnectedUserList;