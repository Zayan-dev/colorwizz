import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const loginOnlyFeature = () => {
  const token = Cookies.get("token");
  if (!token) {
    toast.info("Please Login");
    return true;
  }
  return false;
};

export const isLoggedIn = () => {
    const token = Cookies.get("token");
    if (token) {
      return true;
    }
    return false;
}
