"use client";
import React, { useState, useEffect } from "react";

//Components
import { Input, Button, DateValue, user } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";


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
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);
  
  const handleStepTwoRegistration = async () => {
    const accessToken = pathName.split("/").pop();
  
    const { data: tokenData, error: tokenError } = await supabase
      .from("accessToken")
      .select("*")
      .eq("id", accessToken)
      .eq("is_used", false)
      .single();

  
    if (tokenError || !tokenData) {
      router.push(`/register`);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData) {
      setMessage("PLease first enter your credentials");
      router.push(`/register/${accessToken}`);
      return;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    console.log("profileData", profileData);

    if (profileError || !profileData) {
      console.log("profileError", profileError);
      if (tokenData.first_name) {
        setFirstName(tokenData.first_name);
      }

      if (tokenData.Last_name) {
        setLastName(tokenData.Last_name);
      }
    }
    else{
    var first_name = profileData?.full_name ? profileData.full_name.split(" ")[0] : "";
    var last_name = profileData?.full_name ? profileData.full_name.split(" ")[1] : "";

    if (first_name) {
      setFirstName(first_name);
    }

    if (last_name) {
      setLastName(last_name);
    }

    if (profileData.username)
      setUsername(profileData.username);

    if (profileData.birth_date)
      // fuck next js with their dateValue

    if (profileData.location)
      setLocation(profileData.location);
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

    if (username.length < 1) {
      setError("Username is required");
      return;
    }

    if (firstName.length < 1) {
      setError("First Name is required");
      return;
    }

    if (lastName.length < 1) {
      setError("Last Name is required");
      return;
    }

    if (location.length < 1) {
      setError("Location is required");
      return;
    }

    if (!birthDate) {
      setError("Birth Date is required");
      return;
    }

    var birthDay = `${birthDate.year}-${birthDate.month}-${birthDate.day}`;

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userData.user) {
      setError("User data is not available");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userData.user.id,
        full_name: `${firstName} ${lastName}`,
        username: username,
        birthday: birthDay,
        location: location,
        role: "user",
      });

    if (error) {
      setError("Error saving data");
      console.error(error);
      return;
    } else {
      setMessage("Information saved successfully");
      console.log(data);
    }
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
          onChange={(e) => setUsername(e.target.value)}
          value={username}
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
          onChange={(date) => setBirthDate(date)}
          value={birthDate}
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
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <Button className="w-full mt-8" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
