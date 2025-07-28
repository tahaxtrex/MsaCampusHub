
import React from 'react'
import { useFirebaseStore } from '../../store/useFirebaseStore'
import { Navigate, useNavigate } from 'react-router';


function Profile() {

  const {authUser, logout} = useFirebaseStore();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    <Navigate to="/home" replace={true} />
    navigate("/home")
  }


  return (
    <div>
      <br /><br /><br />
      {authUser && <button onClick={handleClick}>logout</button>}
      <br /><br /><br /><br /><br />
    </div>
  )
}

export default Profile
