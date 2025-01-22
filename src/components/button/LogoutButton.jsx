import React from "react";
import { useLogoutMutation } from "../../features/user/userSlice";
import { useNavigate } from "react-router";

const LogoutButton = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout().unwrap();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    navigate("/login"); 
  };

  return (
    <div>
      <button onClick={()=> handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutButton;
