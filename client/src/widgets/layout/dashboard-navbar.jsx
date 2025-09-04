import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { getCurrentUser, logout } from "@/services/auth";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        if (result.ok) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-4">
          {!loading && user && (
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100"
                >
                  <Avatar
                    size="sm"
                    variant="circular"
                    alt={user.name}
                    className="border border-gray-900 p-0.5"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <Typography variant="small" className="font-medium">
                      {user.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      {user.role}
                    </Typography>
                  </div>
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  <Typography variant="small">Profile</Typography>
                </MenuItem>
                <MenuItem className="flex items-center gap-2">
                  <Cog6ToothIcon className="h-4 w-4" />
                  <Typography variant="small">Settings</Typography>
                </MenuItem>
                <hr className="my-2" />
                <MenuItem 
                  className="flex items-center gap-2 text-red-500 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <Typography variant="small">Logout</Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
