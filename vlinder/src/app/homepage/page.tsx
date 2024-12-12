"use client";

import EnviromentStrings from "@/src/enums/envStrings";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  Spacer,
  useDisclosure,
  Slider,
  CheckboxGroup,
  Checkbox,
  Chip,
} from "@nextui-org/react";

import ProfileSuggestionCard from "@/src/components/Home/ProfileSuggestionCard";
import ProfileSuggestionCardSuspense from "@/src/components/Home/ProfileSuggestionCardSuspense";

interface Hobby {
  id: number;
  name: string;
  emoji: string;
}

interface ProfileHobby {
  hobbies: Hobby;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  sexual_orientation: string;
  sex_positive: boolean;
  gender: string;
  smoker: boolean | undefined;
  display_disability: boolean;
  need_assistance: boolean | undefined;
  disability: string[];
  description: string;
  profile_hobbies: ProfileHobby[];
}

export default function HomePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loverFilter, setLoverFilter] = useState<boolean>();
  const [smokerFilter, setSmokerFilter] = useState(false);
  const [assistanceFilter, setAssistanceFilter] = useState(false);
  const [ageFilterValue, setAgeFilterValue] = useState<[number, number]>([18, 100]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [genderFilter, setGenderFilter] = useState<string[]>(["Male", "Female", "Other"]);
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === EnviromentStrings.TEST) {
      setUserId("637465ac-0729-442c-8dc8-441d2303f560"); // unicorn test user ID for testing
    } else {
      const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          router.push("/login");
        } else {
          setUserId(data.user.id);
          if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
            console.log("data.user.id", data.user.id);
          }
        }
      };
      fetchUser();
    }
  }, []);

  function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate()) ? age - 1 : age;
  }

  const fetchProfile = async () => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
      console.log("profile data", data);
    }

    if (data) {
      setProfile(data);
    }
  };

  async function fetchProfiles() {
    setLoading(true); // I Probably do somthing wrong with getting info that should not be visible for every user? (disability etc.)
    let query = supabase.from("profiles").select(`id, 
                username, 
                avatar_url, 
                birthday,
                gender,
                smoker,
                sexual_orientation,
                sex_positive,
                display_disability,  
                disability,
                description,
                need_assistance,
                profile_hobbies (
                hobbies (id, name, emoji)
            )`);

    //query = query.neq('id', userId); // fkn doesn't work for some reason

    if (smokerFilter == true) {
      query = query.eq("smoker", false);
    }
    if (assistanceFilter == true) {
      query = query.eq("need_assistance", false);
    }

    if (loverFilter) {
      query = query.eq("sex_positive", true);

      if (profile?.sexual_orientation === "heterosexual") {
        query = query.neq("gender", profile.gender);
        query = query.neq("sexual_orientation", "asexual");
      } else if (profile?.sexual_orientation === "asexual") {
        query = query.eq("gender", profile.gender);
        query = query.eq("sexual_orientation", "asexual");
      }
    } else {
      if (!genderFilter.includes("Male")) {
        query = query.neq("gender", "Male");
      }
      if (!genderFilter.includes("Female")) {
        query = query.neq("gender", "Female");
      }
      if (!genderFilter.includes("Other")) {
        query = query.neq("gender", "Other");
      }
    }

    const { data: profiles } = await query;
    const filteredProfilesAge = profiles?.filter((profile) => {
      const age = calculateAge(profile.birthday);
      return age >= ageFilterValue[0] && age <= ageFilterValue[1];
    });

    const filteredProfilesAgeAndHobbies = filteredProfilesAge?.filter((profile) => {
      if (!selectedHobbies || selectedHobbies.length === 0) return true;

      const hobbyIds = profile.profile_hobbies.flatMap((ph) => {
        const hobbies = ph.hobbies as Hobby | Hobby[];
        return Array.isArray(hobbies) ? hobbies.map((hobby) => hobby.id) : [hobbies.id];
      });

      return hobbyIds.some((hobbyId) => selectedHobbies.includes(hobbyId));
    });

    // @ts-expect-error intellisense is wrong, this works
    setProfiles(filteredProfilesAgeAndHobbies || []);
    setLoading(false);
  }

  // Fetch profiles when the page is rendered
  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      fetchProfiles();
    };
    fetchData();
    if (process.env.NODE_ENV === EnviromentStrings.DEVELOPMENT) {
      console.log("profile", profile);
    }
  }, [userId]);

  //Apply filters when user is looking for a lover
  useEffect(() => {
    fetchProfiles();
  }, [loverFilter]);

  useEffect(() => {
    const fetchHobbies = async () => {
      const { data, error } = await supabase.from("hobbies").select("*");
      if (data) {
        setAllHobbies(data);
      } else {
        console.error("Error fetching hobbies:", error);
      }
    };
    fetchHobbies();
  }, []);

  const toggleHobby = (id: number) => {
    setSelectedHobbies((prevSelectedHobbies) =>
      prevSelectedHobbies.includes(id)
        ? prevSelectedHobbies.filter((hobbyId) => hobbyId !== id)
        : [...prevSelectedHobbies, id]
    );
  };

  return (
    <main className="pt-4">
      <div className="w-full px-4 mt-2">
        <Button className="w-full" data-testid="open-filters-button" color="primary" onPress={onOpen}>
          Open Filters
        </Button>
      </div>

      <>
        {profile?.sex_positive && (
          <div className="w-full px-4 mt-2 flex justify-center">
            <h4>Looking for a lover?</h4>
            <Switch
              className="ml-4"
              data-testid="lover-switch"
              isSelected={loverFilter}
              onValueChange={setLoverFilter}
            />
          </div>
        )}
      </>

      <Modal data-testid isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Filters</h3>
              </ModalHeader>
              <ModalBody>
                <Spacer y={1} />
                <div>
                  <h4>Not A Smoker</h4>
                  <Switch data-testid="smoker-switch" isSelected={smokerFilter} onValueChange={setSmokerFilter} />
                </div>
                <Spacer y={1} />
                <div>
                  <h4>Does Not Need Assistance</h4>
                  <Switch
                    data-testid="assistance-switch"
                    isSelected={assistanceFilter}
                    onValueChange={setAssistanceFilter}
                  />
                </div>
                <Spacer y={1} />
                <div>
                  <CheckboxGroup
                    label="Gender"
                    orientation="horizontal"
                    value={genderFilter}
                    onValueChange={setGenderFilter}
                    isDisabled={loverFilter}
                  >
                    {!loverFilter ? (
                      <>
                        <Checkbox value="Male">Male</Checkbox>
                        <Checkbox value="Female">Female</Checkbox>
                        <Checkbox value="Other">Other</Checkbox>
                      </>
                    ) : (
                      <text>Gender filter is applied based on your sexual orientation</text>
                    )}
                  </CheckboxGroup>
                </div>
                <Spacer y={1} />
                <div>
                  <Slider
                    data-testid="age-slider"
                    label="Age"
                    value={[ageFilterValue[0], ageFilterValue[1]]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setAgeFilterValue([value[0], value[1]]);
                      }
                    }}
                    minValue={18}
                    maxValue={100}
                    step={1}
                  />
                </div>
                <Spacer y={1} />
                <h2>Hobbies</h2>
                <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {allHobbies.map((hobby) => (
                    <Chip
                      key={hobby.id}
                      onClick={() => toggleHobby(hobby.id)}
                      className={`m-1 ${
                        selectedHobbies.includes(hobby.id) ? "bg-secondary text-black" : "bg-gray-200"
                      }`}
                    >
                      {hobby.name} {hobby.emoji}
                    </Chip>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    fetchProfiles();
                    onClose();
                  }}
                >
                  Apply Filters
                </Button>
                {/* TODO: Need help understanding filters button to have it in a more question like format */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProfileSuggestionCardSuspense key={index} />
            ))}
          </>
        ) : (
          <>
            {profiles.map((profile, index) => (
              <ProfileSuggestionCard key={index} profile={profile} />
            ))}
          </>
        )}
      </div>
    </main>
  );

  return (
    <div style={{ padding: "2rem", overflowY: "auto", maxHeight: "100vh" }}>
      <h1>User Profiles</h1>

      <Button data-testid="open-filters-button" color="primary" onPress={onOpen}>
        Open Filters
      </Button>

      <Modal data-testid isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Filters</h3>
              </ModalHeader>
              <ModalBody>
                <Spacer y={1} />
                <div>
                  <h4>Not A Smoker</h4>
                  <Switch data-testid="smoker-switch" isSelected={smokerFilter} onValueChange={setSmokerFilter} />
                </div>
                <Spacer y={1} />
                <div>
                  <h4>Does Not Need Assistance</h4>
                  <Switch
                    data-testid="assistance-switch"
                    isSelected={assistanceFilter}
                    onValueChange={setAssistanceFilter}
                  />
                </div>
                <Spacer y={1} />
                <div>
                  <CheckboxGroup
                    label="Gender"
                    orientation="horizontal"
                    value={genderFilter}
                    onValueChange={setGenderFilter}
                    isDisabled={loverFilter}
                  >
                    {!loverFilter ? (
                      <>
                        <Checkbox value="Male">Male</Checkbox>
                        <Checkbox value="Female">Female</Checkbox>
                        <Checkbox value="Other">Other</Checkbox>
                      </>
                    ) : (
                      <text>Gender filter is applied based on your sexual orientation</text>
                    )}
                  </CheckboxGroup>
                </div>
                <Spacer y={1} />
                <div>
                  <Slider
                    data-testid="age-slider"
                    label="Age"
                    value={[ageFilterValue[0], ageFilterValue[1]]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setAgeFilterValue([value[0], value[1]]);
                      }
                    }}
                    minValue={18}
                    maxValue={100}
                    step={1}
                  />
                </div>
                <Spacer y={1} />
                <h2>Hobbies</h2>
                <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {allHobbies.map((hobby) => (
                    <Chip
                      key={hobby.id}
                      onClick={() => toggleHobby(hobby.id)}
                      className={`m-1 ${
                        selectedHobbies.includes(hobby.id) ? "bg-secondary text-black" : "bg-gray-200"
                      }`}
                    >
                      {hobby.name} {hobby.emoji}
                    </Chip>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    fetchProfiles();
                    onClose();
                  }}
                >
                  Apply Filters
                </Button>
                {/* TODO: Need help understanding filters button to have it in a more question like format */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {profile?.sex_positive && (
        <div>
          <h4>Looking for a lover?</h4>
          <Switch data-testid="lover-switch" isSelected={loverFilter} onValueChange={setLoverFilter} />
        </div>
      )}

      <div>
        <h3>Results</h3>
        {loading ? (
          <p>Loading...</p> // Display loading state while fetching profiles
        ) : (
          <>
            <ul>
              {profiles.map((profile) => (
                <div key={profile.id}>
                  <h2>
                    <a href={`/profile/${profile.id}`}>{profile.username}</a>
                  </h2>
                  <img src={profile.avatar_url} alt={`${profile.username}'s avatar`} />
                  {/* Display hobbies if they exist */}
                  {/* Note naar fronted: dit is gwn een voorbeeld voor als we dat zouden willen gebruiken, mag verwijderd worden */}
                  {profile.profile_hobbies?.length > 0 ? (
                    <ul>
                      {profile.profile_hobbies.map((ph, index) => (
                        <li key={index}>
                          {ph.hobbies.name} {ph.hobbies.emoji}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hobbies listed.</p>
                  )}
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
