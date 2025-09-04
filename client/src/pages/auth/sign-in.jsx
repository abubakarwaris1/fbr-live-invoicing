import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { login } from "@/services/auth";
import { BRAND_CONFIG } from "@/constants/brand";

export function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || "/dashboard/invoices";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      
      if (result.ok) {
        // Redirect to the page user was trying to access, or default to invoices
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="w-full lg:w-3/5" style={{ flex: "0 0 60%" }}>
        <div className="flex flex-col items-center">
          {/* Brand Logo - Aligned with form left edge and positioned at top */}
          <div className="w-80 max-w-screen-lg lg:w-1/2 flex justify-start mb-8">
            <img
              src={BRAND_CONFIG.logo.src}
              alt={BRAND_CONFIG.logo.alt}
              className={`${BRAND_CONFIG.logo.height} w-auto`}
              style={{ maxHeight: BRAND_CONFIG.logo.maxHeight }}
            />
          </div>
          
          <div className="text-center w-80 max-w-screen-lg lg:w-1/2 mt-24">
            <Typography variant="h1" className="font-black mb-4 text-5xl">Sign In</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
              Enter your email and password to Sign In.
            </Typography>
          </div>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                variant="outlined"
                color="blue-gray"
                className="p-4 !border !border-gray-300 focus:!border-black transition-colors duration-200 !border-t-gray-300 focus:!border-t-black rounded-lg"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                variant="outlined"
                color="blue-gray"
                className="p-4 !border !border-gray-300 focus:!border-black transition-colors duration-200 !border-t-gray-300 focus:!border-t-black rounded-lg"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button 
            className="mt-6 bg-black text-white hover:bg-gray-800" 
            fullWidth 
            variant="filled"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        </div>
      </div>
      <div className="w-full lg:w-2/5" style={{ flex: "0 0 40%" }}>
        <div 
          className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl"
          style={{ 
            backgroundImage: 'url(/img/pattern.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
    </section>
  );
}
