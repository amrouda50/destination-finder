// http://localhost:1337/api/users/me?populate[groups][populate][0]=regions
import {useToken} from "../components/AuthProvider/AuthProvider";
import useAxios from "axios-hooks";
import authenticationHeader from "./authenticationHeader";

const useLoadMeWithGroups = (
  initialPage = 1,
) => {
  const visitsUrl = `${process.env.REACT_APP_BACKEND_URL}/users/me`;
  const token = useToken.getState().token;

  const getParams = () => {
    const params = new URLSearchParams();
    params.append('populate[groups][populate][0]', 'regions');
    return params;
  }

  const [{ data, loading, error }] = useAxios({
    url: visitsUrl,
    params: getParams(),
    method: 'GET',
    ...authenticationHeader(token)
  });


  return { data, loading, error };
};


export default useLoadMeWithGroups;