import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
  return (
    <section className="m-8 flex gap-4" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="w-2/5 h-full hidden lg:block" style={{ flex: "0 0 40%" }}>
        <div 
          className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl"
          style={{ 
            backgroundImage: 'url(/img/pattern.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '1.5rem'
          }}
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center" style={{ flex: "0 0 60%" }}>
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              variant="outlined"
              color="blue-gray"
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              variant="outlined"
              color="blue-gray"
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button 
            className="mt-6" 
            fullWidth 
            variant="filled"
            color="black"
          >
            Register Now
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1 hover:text-gray-700">Sign In</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
