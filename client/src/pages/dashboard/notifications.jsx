import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    gray: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    gray: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["gray", "green", "orange", "red"];

  const getAlertStyles = (color) => {
    const styles = {
      gray: "bg-gray-600 text-white border-gray-600",
      green: "bg-green-500 text-white border-green-500",
      orange: "bg-orange-500 text-white border-orange-500",
      red: "bg-red-500 text-white border-red-500",
    };
    return styles[color] || styles.gray;
  };

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Alerts
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map((color) => (
            showAlerts[color] && (
              <div
                key={color}
                className={`flex items-center justify-between p-4 rounded-lg border ${getAlertStyles(color)}`}
              >
                <div className="flex items-center gap-3">
                  <Typography className="text-sm font-medium">
                    A simple {color} alert with an <a href="#" className="underline">example link</a>. Give
                    it a click if you like.
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  size="sm"
                  className="text-inherit"
                  onClick={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
                >
                  <XMarkIcon className="h-4 w-4" />
                </IconButton>
              </div>
            )
          ))}
        </CardBody>
      </Card>
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Alerts with Icon
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map((color) => (
            showAlertsWithIcon[color] && (
              <div
                key={color}
                className={`flex items-center justify-between p-4 rounded-lg border ${getAlertStyles(color)}`}
              >
                <div className="flex items-center gap-3">
                  <InformationCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <Typography className="text-sm font-medium">
                    A simple {color} alert with an <a href="#" className="underline">example link</a>. Give
                    it a click if you like.
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  size="sm"
                  className="text-inherit"
                  onClick={() => setShowAlertsWithIcon((current) => ({
                    ...current,
                    [color]: false,
                  }))}
                >
                  <XMarkIcon className="h-4 w-4" />
                </IconButton>
              </div>
            )
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
