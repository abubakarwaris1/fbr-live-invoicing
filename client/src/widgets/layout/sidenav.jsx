import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { logout } from "@/services/auth";
import { BRAND_CONFIG } from "@/constants/brand";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const navigate = useNavigate();
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout by clearing token and redirecting
      localStorage.removeItem('authToken');
      navigate('/auth/sign-in');
    }
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 flex flex-col`}
    >
      <div className="relative flex items-center justify-between py-6 px-8">
        <Link to="/" className="flex-1 text-center">
          <img
            src={BRAND_CONFIG.logo.src}
            alt={BRAND_CONFIG.logo.alt}
            className={`${BRAND_CONFIG.logo.height} w-auto mx-auto`}
            style={{ maxHeight: BRAND_CONFIG.logo.maxHeight }}
          />
        </Link>
        <IconButton
          variant="text"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          size="sm"
          ripple={false}
          className="xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="m-4 flex-1 overflow-y-auto">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  // color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                  style={{ color: sidenavType === "dark" ? "red" : "blue-gray" }}
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`} end>
                  {({ isActive }) => (
                    <Button
                      variant="text"
                      // color={
                      //   sidenavType === "dark"
                      //     ? "white"
                      //     : "blue-gray"
                      // }
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive 
                          ? "bg-black text-white shadow-lg" 
                          : "hover:bg-gray-100"
                      }`}
                      fullWidth
                      style={{ backgroundColor: isActive ? "black" : "white" }}
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      
      {/* Logout Button - Fixed at bottom */}
      <div className="m-4 mt-auto">
        <Button
          variant="text"
          className="flex items-center gap-4 px-4 capitalize text-red-500 hover:bg-red-50 hover:text-red-700 w-full"
          onClick={handleLogout}
          fullWidth
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <Typography
            color="inherit"
            className="font-medium capitalize"
          >
            Logout
          </Typography>
        </Button>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: BRAND_CONFIG.logo.src,
  brandName: BRAND_CONFIG.name,
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
