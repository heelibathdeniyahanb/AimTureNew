import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { UserContext } from "../UserContext";
import { updateUser } from "../Apis/UserApi";
import {
  getContributorByUserId,
  createContributor,
  updateContributor,
} from "../Apis/ContributorApi";

export default function CProfileComponent() {
  const { user, setUser } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingContributor, setIsEditingContributor] = useState(false);

  const [basicDetails, setBasicDetails] = useState({});
  const [contributorDetails, setContributorDetails] = useState({});
  const [loading, setLoading] = useState(true);

  console.log(user);
  // Fetch user + contributor data
  useEffect(() => {
    if (!user) return;

    setBasicDetails({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNo: user.mobileNo ,
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
    });
   

    (async () => {
      try {
        const contributor = await getContributorByUserId(user.id);
        if (contributor) {
          setContributorDetails({
            id: contributor.id,
            expertiseArea: contributor.expertiseArea || "",
            bio: contributor.bio || "",
            qualifications: contributor.qualifications || "",
            portfolioUrl: contributor.portfolioUrl || "",
            linkedInUrl: contributor.linkedInUrl || "",
          });
          
        } else {
          setContributorDetails({
            expertiseArea: "",
            bio: "",
            qualifications: "",
            portfolioUrl: "",
            linkedInUrl: "",
          });
        }
      } catch {
        setContributorDetails({
          expertiseArea: "",
          bio: "",
          qualifications: "",
          portfolioUrl: "",
          linkedInUrl: "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  console.log(contributorDetails)
  

  // Completion checks
  const isBasicComplete =
    basicDetails.firstName &&
    basicDetails.lastName &&
    basicDetails.email &&
    basicDetails.mobileNo &&
    basicDetails.dateOfBirth &&
    basicDetails.gender;

  const isContributorComplete =
    contributorDetails.expertiseArea &&
    contributorDetails.bio &&
    contributorDetails.qualifications &&
    contributorDetails.portfolioUrl &&
    contributorDetails.linkedInUrl;

  // Save Basic
  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUser(user.id, basicDetails);
      setUser(updated);
      setStep(2);
      setIsEditingBasic(false);
    } catch (error) {
      alert("Failed to update basic details");
    }
  };

  // Save Contributor
  const handleContributorSubmit = async (e) => {
  e.preventDefault();
  try {
    const existing = await getContributorByUserId(user.id);
    if (existing) {
      await updateContributor(existing.id, contributorDetails); // ✅ pass contributor.id
    } else {
      await createContributor({ userId: user.id, ...contributorDetails });
    }
    alert("Contributor details saved!");
    setIsEditingContributor(false);
  } catch (error) {
    alert("Failed to save contributor details");
  }
};


  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      {/* Main Form */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-[#1E293B] rounded-2xl shadow-lg p-6">
          {/* Step 1: Basic Details */}
          {step === 1 &&
            (isEditingBasic ? (
              <form onSubmit={handleBasicSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-[#56B2BB] mb-4 flex items-center gap-2">
                  <FaUser /> Basic Details
                </h2>
                {["firstName", "lastName", "email", "mobileNo", "dateOfBirth", "gender"].map(
                  (field, idx) => (
                    <div key={idx}>
                      <label className="block mb-1 capitalize text-[#56B2BB]">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={basicDetails[field]}
                        onChange={(e) =>
                          setBasicDetails({
                            ...basicDetails,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                        required
                      />
                    </div>
                  )
                )}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsEditingBasic(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#56B2BB] text-[#0F172A] rounded-lg font-semibold"
                  >
                    Save & Next
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#56B2BB] mb-4 flex items-center gap-2">
                  <FaUser /> Basic Details
                </h2>
                <p>
                  <span className="text-[#56B2BB]">Name:</span> {user.firstName}{" "}
                  {user.lastName}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Email:</span> {user.email}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Mobile:</span> {user.mobileNo}
                </p>
                <p>
                  <span className="text-[#56B2BB]">DOB:</span> {user.dateOfBirth}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Gender:</span> {user.gender}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditingBasic(true)}
                    className="px-6 py-3 bg-[#56B2BB] text-[#0F172A] rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            ))}

          {/* Step 2: Contributor Details */}
          {step === 2 &&
            (isEditingContributor ? (
              <form onSubmit={handleContributorSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-[#56B2BB] mb-4 flex items-center gap-2">
                  <MdOutlineWork /> Contributor Details
                </h2>

                <div>
                  <label className="block mb-1 text-[#56B2BB]">
                    Expertise Area
                  </label>
                  <input
                    type="text"
                    value={contributorDetails.expertiseArea}
                    onChange={(e) =>
                      setContributorDetails({
                        ...contributorDetails,
                        expertiseArea: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#56B2BB]">Bio</label>
                  <textarea
                    value={contributorDetails.bio}
                    onChange={(e) =>
                      setContributorDetails({
                        ...contributorDetails,
                        bio: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#56B2BB]">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={contributorDetails.qualifications}
                    onChange={(e) =>
                      setContributorDetails({
                        ...contributorDetails,
                        qualifications: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#56B2BB]">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={contributorDetails.portfolioUrl}
                    onChange={(e) =>
                      setContributorDetails({
                        ...contributorDetails,
                        portfolioUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#56B2BB]">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={contributorDetails.linkedInUrl}
                    onChange={(e) =>
                      setContributorDetails({
                        ...contributorDetails,
                        linkedInUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#0F172A] border border-gray-600 focus:border-[#56B2BB] outline-none"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsEditingContributor(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#56B2BB] text-[#0F172A] rounded-lg font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#56B2BB] mb-4 flex items-center gap-2">
                  <MdOutlineWork /> Contributor Details
                </h2>
                <p>
                  <span className="text-[#56B2BB]">Expertise:</span>{" "}
                  {contributorDetails.expertiseArea || "N/A"}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Bio:</span>{" "}
                  {contributorDetails.bio || "N/A"}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Qualifications:</span>{" "}
                  {contributorDetails.qualifications || "N/A"}
                </p>
                <p>
                  <span className="text-[#56B2BB]">Portfolio:</span>{" "}
                  {contributorDetails.portfolioUrl || "N/A"}
                </p>
                <p>
                  <span className="text-[#56B2BB]">LinkedIn:</span>{" "}
                  {contributorDetails.linkedInUrl || "N/A"}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditingContributor(true)}
                    className="px-6 py-3 bg-[#56B2BB] text-[#0F172A] rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                  >
                    Back
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Sidebar Progress Tracker */}
      <div className="w-64 bg-[#1E293B] p-6 border-l border-gray-700">
        <h3 className="text-lg font-bold mb-6">Profile Progress</h3>
        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
              step === 1 ? "bg-[#56B2BB] text-black" : "bg-gray-700"
            }`}
            onClick={() => setStep(1)}
          >
            <span>Basic Details</span>
            {isBasicComplete ? "✅" : "❌"}
          </div>
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
              step === 2 ? "bg-[#56B2BB] text-black" : "bg-gray-700"
            }`}
            onClick={() => setStep(2)}
          >
            <span>Contributor Details</span>
            {isContributorComplete ? "✅" : "❌"}
          </div>
        </div>
      </div>
    </div>
  );
}
