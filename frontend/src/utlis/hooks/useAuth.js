import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTeamInfo, getUserInfo } from "../../apicalls/users";
import { SetUser } from "../../redux/usersSlice";

const useAuth = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const authenticateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const decodedToken = jwtDecode(token);
      const userType = decodedToken.type;
      let res;
      if (userType === "user" || !userType) {
        res = await getUserInfo();
      } else if (userType === "team") {
        res = await getTeamInfo();
      }
      setData(res.data);
      dispatch(SetUser(res.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStorageChange = (event) => {
    if (event.key === "token") {
      authenticateUser();
    }
  };

  useEffect(() => {
    authenticateUser();

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { data, error, loading, authenticateUser };
};

export default useAuth;
