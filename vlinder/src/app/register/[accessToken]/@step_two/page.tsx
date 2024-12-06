"use client";
import React, { useState, useEffect } from "react";

//Components
import { Input, Button, DateValue } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { useUser } from "@/utils/store/user";

//Icons
import { LocationPinIcon } from "Components/Icons/LocationPinIcon";

///backend
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

//
//  USE `https://nominatim.openstreetmap.org/search?city=${location}&format=json` API TO SEARCH FOR STORING COORDINATES IN DATABASE (ALSO SAVE CITYNAME FOR THERE PROFILE)
//  DONT FORGET TO CHECK IF ITS VALID (optional add "&country=Belgium")
//  We can also request for location every time they log on
//

export default function Page() {
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernames, setUsernames] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const handleStepTwoRegistration = async () => {
    const accessToken = pathName.split("/").pop();
  
    const { data: tokenData, error: tokenError } = await supabase
      .from("accessToken")
      .select("*")
      .eq("id", accessToken)
      .eq("is_used", false)
      .single();

  
    if (error || !tokenData) {
      router.push(`/register`);
      return;
    }
    console.log(tokenData);
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      setError("Something went wrong!");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (profileError) {
      setError("Something went wrong!");
      return;
    }

    if (profileData.username) setUsernames(profileData.username);
    if (profileData.birth_date) setBirthDate(new Date(profileData.birth_date));
    

    if (profileData.full_name) {
      const [first_name, last_name] = profileData.full_name.split(" ");
      setFirstName(first_name);
      setLastName(last_name);
    }
    else{
      if (tokenData.first_name) setFirstName(tokenData.first_name);
      if (tokenData.Last_name) setLastName(tokenData.Last_name);
    }
  };

  useEffect(() => {
    handleStepTwoRegistration();
  }, []);

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    const { data, error } = await supabase.auth.getUser();
    console.log(data);
    console.log(birthDate);
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
          label="Username"
          placeholder="Enter Username"
          onChange={(e) => setUsernames(e.target.value)}
        />
        <Input
          className="w-full mb-4"
          color="default"
          type="text"
          label="First Name"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          className="w-full mb-4"
          color="default"
          type="text"
          label="Last Name"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <DatePicker
          label="Birth Date"
          className="w-full mb-4"
          onChange={(date) => setBirthDate(date ? new Date(date.toString()) : null)}
        />
        <text className="text-sm text-default-400">Tip: press the location icon to get your location!</text>
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
        <Button className="w-full mt-8" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
