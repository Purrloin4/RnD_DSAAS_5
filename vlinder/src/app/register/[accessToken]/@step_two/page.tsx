"use client";
import React, { useState } from "react";

//Components
import { Input } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";

//Icons
import { LocationPinIcon } from "Components/Icons/LocationPinIcon";

//
//  USE `https://nominatim.openstreetmap.org/search?city=${location}&format=json` API TO SEARCH FOR STORING COORDINATES IN DATABASE (ALSO SAVE CITYNAME FOR THERE PROFILE)
//  DONT FORGET TO CHECK IF ITS VALID (optional add "&country=Belgium")
//  We can also request for location every time they log on
//

export default function page() {
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string | undefined>(
    undefined
  );

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const get_location = () => {
    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        )
          .then((response) => {
            if (!response.ok) {
              setLocationError("Something went wrong!");
              throw new Error(`HTTP error! Status: ${response.status}`);
              //Handel error here
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            setLocation(data.address.town || data.address.city || "");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setLocationError("Something went wrong!");
            //Handel error here
          });
      },
      (error) => {
        //Handel errors here
        setLocationError("Something went wrong!");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
        }
      },
      options
    );
  };

  return (
    <section className="w-full h-96 flex flex-col justify-start items-center p-4">
      <h2>Enter Your Personal Information</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <Input
          className="w-full mb-4"
          color="default"
          type="text"
          label="First Name"
          placeholder="Enter First Name"
        />
        <Input
          className="w-full mb-4"
          color="default"
          type="text"
          label="Last Name"
          placeholder="Enter Last Name"
        />
        <DatePicker label="Birth Date" className="w-full mb-4" />
        <Input
          className="w-full"
          color="default"
          type="text"
          label="City"
          placeholder="Enter City"
          value={location}
          onChange={handleLocationChange}
          isInvalid={locationError !== undefined}
          errorMessage={locationError || ""}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={get_location}
              aria-label="toggle password visibility"
            >
              <LocationPinIcon className="text-2xl text-default-400 pointer-events-none" />
            </button>
          }
        />
      </div>
    </section>
  );
}
