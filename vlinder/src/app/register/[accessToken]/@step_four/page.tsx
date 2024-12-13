"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input, Button, Checkbox, Textarea } from "@nextui-org/react";
import EnviromentStrings from "@/src/enums/envStrings";

const supabase = createClient();

export default function PersonalInfoPage() {
  const [smoker, setSmoker] = useState<boolean>();
  const [disabilities, setDisabilities] = useState<string[]>([""]);
  const [displayDisability, setDisplayDisability] = useState<boolean>();
  const [needAssistance, setNeedAssistance] = useState<boolean>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState(true);

  const handleStepFourRegistration = async () => {
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
      setError("Please first enter your credentials");
      router.push(`/register/${accessToken}`);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (!profileError && profileData) {
      setSmoker(profileData.smoker);
      setDisabilities(profileData.disability || [""]);
      setDisplayDisability(profileData.display_disability);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleStepFourRegistration();
  }, []);

  const handleSave = async () => {
    setError("");
    setMessage("");

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userData.user) {
      setError("User data is not available");
      return;
    }

    if (smoker === null || displayDisability === null || needAssistance === null) {
      setError("Please fill in all fields.");
      return;
    }

    const { data, error } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      smoker: smoker,
      disability: disabilities.filter((d) => d.trim() !== ""),
      display_disability: displayDisability,
      need_assistance: needAssistance,
    });

    if (error) {
      setError("Error saving data");
      if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
        console.log(error);
      }
      return;
    } else {
      setMessage("Information saved successfully");
    }
  };

  const handleDisabilityChange = (index: number, value: string) => {
    const newDisabilities = [...disabilities];
    newDisabilities[index] = value;
    setDisabilities(newDisabilities);
  };

  const addDisabilityField = () => {
    setDisabilities([...disabilities, ""]);
  };

  const removeDisabilityField = (index: number) => {
    const newDisabilities = disabilities.filter((_, i) => i !== index);
    setDisabilities(newDisabilities);
  };

  return (
    <section className="w-full flex flex-col justify-start items-center p-4">
      <h2>Now, some personal questions</h2>
      <div className="w-full max-w-md p-8 h-fit">
        <div className="w-full mb-4 text-black">
          <p>Are you a smoker?</p>
          <div className="flex gap-4">
            <Checkbox isSelected={smoker === true} onChange={() => setSmoker(true)} color="primary">
              Yes
            </Checkbox>
            <Checkbox isSelected={smoker === false} onChange={() => setSmoker(false)} color="primary">
              No
            </Checkbox>
          </div>
        </div>
        <div className="w-full mb-4 text-black">
          <p>Disabilities</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            disabilities.map((disability: string, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Enter your disability"
                  className="w-full"
                  value={disability}
                  onChange={(e) => handleDisabilityChange(index, e.target.value)}
                />
                {index > 0 && (
                  <Button color="warning" onClick={() => removeDisabilityField(index)}>
                    -
                  </Button>
                )}
              </div>
            ))
          )}
          <Button color="primary" onClick={addDisabilityField}>
            +
          </Button>
        </div>
        <div className="w-full mb-4 text-black">
          <p>Would you like to display your disability?</p>
          <div className="flex gap-4">
            <Checkbox
              isSelected={displayDisability === true}
              onChange={() => setDisplayDisability(true)}
              color="primary"
            >
              Yes
            </Checkbox>
            <Checkbox
              isSelected={displayDisability === false}
              onChange={() => setDisplayDisability(false)}
              color="primary"
            >
              No
            </Checkbox>
          </div>
        </div>
        <div className="w-full mb-4 text-black">
          <p>Do you require full-time assistance for daily activities?</p>
          <div className="flex gap-4">
            <Checkbox isSelected={needAssistance === true} onChange={() => setNeedAssistance(true)} color="primary">
              Yes
            </Checkbox>
            <Checkbox isSelected={needAssistance === false} onChange={() => setNeedAssistance(false)} color="primary">
              No
            </Checkbox>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <Button className="w-full mb-4 text-black btn-primary font-semibold" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
}
