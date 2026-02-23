import React, { useEffect, useState } from "react";
import "../CssPages/CandidateProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import AlertModal from "../../components/AlertModal";

const CandidateProfilePage = ({}) => {
  const [candidateData, setCandidateData] = useState();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [candidateStatus, setCandidateStatus] = useState();
  const [formData, setFormData] = useState({
    achievements: [""],
    initiatives: [""],
    declarationSigned: false,
  });
  const [files, setFiles] = useState({
    manifesto: null,
    profilePhoto: null,
    parentalConsent: null,
    campaignVideo: null,
    partysymbol: null,
  });

  const navigate = useNavigate();
  const { rollNumber } = useParams();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);

    const getCandidate = async () => {
      try {
        const getData = await fetch(
          `https://voteverse-backend-new.onrender.com/candidate/${rollNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Cache-Control": "no-cache",
            },
          },
        )
        const data = await getData.json();
        setCandidateData(data.candidate);
      } catch (err) {
        console.log("error in fetching candidate data");
       setErrorMsg("Error fetching candidate data. Please try again later.");
      }
    };

    const getStatus = async () => {
      try {
        const response = await fetch(
          `https://voteverse-backend-new.onrender.com/candidate/checkprofilestatus/${rollNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Cache-Control": "no-cache",
            },
          },
        );
        const data = await response.json();
        setCandidateStatus(data);
      } catch (err) {
        setErrorMsg("error in fetching candidate status:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await getCandidate();
      await getStatus();
      setLoading(false);
    };

    fetchAll();
  }, [rollNumber]);

  const handleChange = (e, field, index) => {
    const updated = [...formData[field]];
    updated[index] = e.target.value;
    
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleFileChange = (e) => {
   
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("manifesto", files.manifesto);
      data.append("campaignVideo", files.campaignVideo);
      data.append("profilePhoto", files.profilePhoto);
      data.append("parentalConsent", files.parentalConsent);
      data.append("partysymbol", files.partysymbol);
      data.append("achievements", JSON.stringify(formData.achievements));
      data.append("initiatives", JSON.stringify(formData.initiatives));
      data.append("declarationSigned", formData.declarationSigned);
      setLoading(true);
      const res = await fetch(
        `https://voteverse-backend-new.onrender.com/candidate/complete-profile/${rollNumber}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          body: data,
        },
      );
      const result = await res.json();
      setLoading(false);
      setCandidateData(data.updatedCandidate);
     setErrorMsg(result.message || "Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      setErrorMsg("Error in uploading documents: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://voteverse-backend-new.onrender.com/candidate/delete/${candidateData.rollNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        },
      );
      const data = await res.json();
        setErrorMsg(data.message || "Candidate profile deleted successfully.");
      if (data.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Error deleting candidate:", err);
      setErrorMsg("Error deleting candidate. Please try again later.");
    }
  };

  if (loading) {
    return <Loader content="Loading ...." />;
  }

  return (
    <div className="candidate-profile-container">
      <div className="heading-container">
        <div className="header">
          <div className="heading">
            <h1>Hi, {candidateData?.name || "Candidate"} 👋</h1>
            <p className="subtext">
              Here’s your current profile and approval status
            </p>
          </div>
            <AlertModal message={errorMsg} onClose={() => setErrorMsg("")} duration={3000} />
          <div className="header-actions">
            <button className="del-btnss" onClick={handleDelete}>
              Delete Profile
            </button>
          </div>
        </div>

        <div className="status-section">
       
          <div className="status-box admin-status">
            <p className="status-label">🧾 Candidate Status</p>
            <span
              className={
                candidateData?.profilecompleted
                  ? "status success"
                  : "status warning"
              }
            >
              {candidateData?.profilecompleted
                ? "Profile Completed ✅"
                : "Profile Incomplete ⚠️"}
            </span>
          </div>

        
          <div className="status-box admin-status">
            <p className="status-label">🏛️ Admin Approval</p>
            <span
              className={`status ${
                candidateData?.status === "Approved"
                  ? "success"
                  : candidateData?.status === "Rejected"
                    ? "danger"
                    : "pending"
              }`}
            >
              {candidateData?.status === "Approved"
                ? "Approved ✅"
                : candidateData?.status === "Rejected"
                  ? "Rejected ❌"
                  : "Pending 🕓"}
            </span>
          </div>
        </div>
      </div>

      {candidateData?.profilecompleted ? (
        <div className="profile-complete-container">
          <div className="profile-complete-card">
            <h2>🎉 Profile Completed!</h2>
            <p>You’ve successfully filled out your candidate profile.</p>
            <button
              onClick={() =>
                navigate(`/candidateDetails/${candidateData.rollNumber}`)
              }
              className="view-profile-btn"
            >
              View Complete Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="card-grid">
              <label>Upload Manifesto (PDF)</label>
              <input type="file" name="manifesto" onChange={handleFileChange} />
              <span className="file-name">
                {files.manifesto ? files.manifesto.name : "No file chosen"}
              </span>
              <label>Upload Campaign Video</label>
              <input
                type="file"
                name="campaignVideo"
                onChange={handleFileChange}
              />
              <span className="file-name">
                {files.campaignVideo
                  ? files.campaignVideo.name
                  : "No file chosen"}
              </span>

              <label>Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleFileChange}
              />
              <span className="file-name">
                {files.profilePhoto
                  ? files.profilePhoto.name
                  : "No file chosen"}
              </span>

              <label>Parental Consent Form</label>
              <input
                type="file"
                name="parentalConsent"
                onChange={handleFileChange}
              />
              <span className="file-name">
                {files.parentalConsent
                  ? files.parentalConsent.name
                  : "No file chosen"}
              </span>
              <label>Upload Party Symbol</label>
              <input
                type="file"
                name="partysymbol"
                onChange={handleFileChange}
              />
              <span className="file-name">
                {files.partysymbol ? files.partysymbol.name : "No file chosen"}
              </span>
            </div>

            <div className="card-grid">
              <h3>Achievements</h3>

              {formData.achievements.map((value, i) => (
                <div className="cp-input-row" key={i}>
                  <input
                    type="text"
                    placeholder={`Achievement ${i + 1}`}
                    value={value}
                    onChange={(e) => handleChange(e, "achievements", i)}
                  />

                  {formData.achievements.length > 1 && (
                    <button
                      type="button"
                      className="cp-delete-btn"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          achievements: prev.achievements.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="cp-add-btn"
                onClick={() => addField("achievements")}
              >
                + Add More
              </button>

              <h3>Initiatives</h3>

              {formData.initiatives.map((value, i) => (
                <div className="cp-input-row" key={i}>
                  <input
                    type="text"
                    placeholder={`Initiative ${i + 1}`}
                    value={value}
                    onChange={(e) => handleChange(e, "initiatives", i)}
                  />

                  {formData.initiatives.length > 1 && (
                    <button
                      type="button"
                      className="cp-delete-btn"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          initiatives: prev.initiatives.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="cp-add-btn"
                onClick={() => addField("initiatives")}
              >
                + Add More
              </button>

              <div className="declaration">
                <input
                  type="checkbox"
                  checked={formData.declarationSigned}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      declarationSigned: e.target.checked,
                    })
                  }
                  required
                />
                <label>
                  I hereby declare all the details are true to the best of my
                  knowledge.
                </label>
              </div>

              <button type="submit" className="submit-btn_">
                Save Profile
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CandidateProfilePage;
