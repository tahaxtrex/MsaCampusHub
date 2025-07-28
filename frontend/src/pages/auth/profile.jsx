
import React from 'react'
import { useFirebaseStore } from '../../store/useFirebaseStore'


function Profile() {

  const {authUser, logout} = useFirebaseStore();

  const handleClick = () => {
    logout();
  }

  return (
    <div>
      {authUser && <button onClick={handleClick}>logout</button>}
    </div>
  )
}

export default Profile
