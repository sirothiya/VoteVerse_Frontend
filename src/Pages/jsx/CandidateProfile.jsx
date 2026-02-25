import React, { useEffect, useState, useRef } from "react";
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

  const [recordingMode, setRecordingMode] = useState(false); // true = record, false = upload
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [showRecordingConfirm, setShowRecordingConfirm] = useState(false);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [maxDuration] = useState(180); // seconds (3 minutes)
  const elapsedRef = useRef(0);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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
        );
        const data = await getData.json();
        setCandidateData(data.candidate);
      } catch (err) {
        console.log("error in fetching candidate data", err);
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
        console.error("error in fetching candidate status:", err);
        setErrorMsg("Error fetching candidate status. Please try again later.");
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

  // cleanup preview on unmount
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  useEffect(() => {
    // when toggling recording mode off, ensure preview is stopped
    if (!recordingMode) stopPreview();
    // when enabling recording mode try to start preview (may prompt for permission)
    if (recordingMode) startPreview();
  }, [recordingMode]);

  const startPreview = async () => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // attempt to play; may be blocked until user interacts
        try {
          await videoRef.current.play();
        } catch (e) {}
      }
    } catch (err) {
      console.error("Preview error:", err);
      setErrorMsg("Unable to access camera for preview.");
    }
  };

  const stopPreview = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startRecording = async () => {
    setErrorMsg("");
    try {
      if (!streamRef.current) {
        await startPreview();
      }
      const stream = streamRef.current;
      if (!stream) {
        setErrorMsg("Unable to access camera.");
        return;
      }

      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: chunks[0]?.type || "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: blob.type || "video/webm" });
        setFiles((prev) => ({ ...prev, campaignVideo: file }));
        // stop preview tracks
        try { stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
        streamRef.current = null;
        setIsRecording(false);
        setRecordedChunks(chunks);
        // stop and clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        elapsedRef.current = 0;
        setElapsed(0);
        setIsPaused(false);
      };
      mr.start();
      setMediaRecorder(mr);
      setIsRecording(true);

      // start elapsed timer
      elapsedRef.current = 0;
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
        if (elapsedRef.current >= maxDuration) {
          // auto-stop
          try { if (mr && mr.state !== "inactive") mr.stop(); } catch (e) {}
        }
      }, 1000);
    } catch (err) {
      console.error("Camera error:", err);
      setErrorMsg("Unable to access camera/microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  };

  const cancelRecording = () => {
    stopPreview();
    setIsRecording(false);
    setRecordingUrl(null);
    setRecordedChunks([]);
    setFiles((prev) => ({ ...prev, campaignVideo: null }));
    setMediaRecorder(null);
  };

  const pauseRecording = () => {
    if (!mediaRecorder) return;
    try {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
        setIsPaused(true);
        // pause timer
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } catch (e) {
      console.warn("Pause not supported", e);
    }
  };

  const resumeRecording = () => {
    if (!mediaRecorder) return;
    try {
      if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
        setIsPaused(false);
        // resume timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          elapsedRef.current += 1;
          setElapsed(elapsedRef.current);
          if (elapsedRef.current >= maxDuration) {
            try { if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop(); } catch (e) {}
          }
        }, 1000);
      }
    } catch (e) {
      console.warn("Resume not supported", e);
    }
  };

  const handleChange = (e, field, index) => {
    const updated = [...formData[field]];
    updated[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // file size limit
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("File is too large. Maximum allowed size is 50 MB.");
      return;
    }

    // Validate image extensions for profilePhoto and partysymbol
    if (e.target.name === "profilePhoto" || e.target.name === "partysymbol") {
      const allowed = ["image/png", "image/jpeg"];
      if (!allowed.includes(file.type)) {
        setErrorMsg("Only PNG and JPG/JPEG images are allowed for photos.");
        return;
      }

      // check image dimensions (min 200x200)
      const checkImageDimensions = (f) =>
        new Promise((resolve) => {
          const url = URL.createObjectURL(f);
          const img = new Image();
          img.onload = () => {
            const ok = img.width >= 200 && img.height >= 200;
            URL.revokeObjectURL(url);
            resolve(ok);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(false);
          };
          img.src = url;
        });

      checkImageDimensions(file).then((ok) => {
        if (!ok) {
          setErrorMsg("Image is too small. Minimum dimensions: 200x200px.");
          return;
        }
        setErrorMsg("");
        setFiles((prev) => ({ ...prev, [e.target.name]: file }));
      });
      return;
    }

    // For other files (manifesto, campaign video, parental consent)
    setErrorMsg("");
    setFiles((prev) => ({ ...prev, [e.target.name]: file }));
  };

  const handleUseRecordingClick = () => {
    setShowRecordingConfirm(true);
  };

  const confirmUseRecording = () => {
    // recording already attached on stopRecording; just switch to upload mode
    setRecordingMode(false);
    setShowRecordingConfirm(false);
  };

  const cancelUseRecording = () => setShowRecordingConfirm(false);

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (files.manifesto) data.append("manifesto", files.manifesto);
      if (files.campaignVideo) data.append("campaignVideo", files.campaignVideo);
      if (files.profilePhoto) data.append("profilePhoto", files.profilePhoto);
      if (files.parentalConsent) data.append("parentalConsent", files.parentalConsent);
      if (files.partysymbol) data.append("partysymbol", files.partysymbol);
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
      setCandidateData(result.updatedCandidate || candidateData);
      setErrorMsg(result.message || "Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      setErrorMsg("Error in uploading documents: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidateData || !candidateData.rollNumber) {
      setErrorMsg("Candidate data not loaded yet.");
      return;
    }

    try {
      const res = await fetch(
        `https://voteverse-backend-new.onrender.com/candidate/delete/${candidateData.rollNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setErrorMsg(data.message || "Candidate profile deleted successfully.");

      if (data.success) navigate("/");
    } catch (err) {
      console.error("Error deleting candidate:", err);
      setErrorMsg("Error deleting candidate. Please try again later.");
    }
  };

  if (loading) return <Loader content="Loading ...." />;

  return (
    <div className="candidate-profile-container">
      <div className="heading-container">
        <div className="header">
          <div className="heading">
            <h1>Hi, {candidateData?.name || "Candidate"} 👋</h1>
            <p className="subtext">Here’s your current profile and approval status</p>
          </div>
          <AlertModal message={errorMsg} onClose={() => setErrorMsg("")} duration={3000} />
          <div className="header-actions">
            <button className="del-btnss" onClick={handleDelete}>Delete Profile</button>
          </div>
        </div>

        <div className="status-section">
          <div className="status-box admin-status">
            <p className="status-label">🧾 Candidate Status</p>
            <span className={candidateData?.profilecompleted ? "status success" : "status warning"}>
              {candidateData?.profilecompleted ? "Profile Completed ✅" : "Profile Incomplete ⚠️"}
            </span>
          </div>

          <div className="status-box admin-status">
            <p className="status-label">🏛️ Admin Approval</p>
            <span className={`status ${candidateData?.status === "Approved" ? "success" : candidateData?.status === "Rejected" ? "danger" : "pending"}`}>
              {candidateData?.status === "Approved" ? "Approved ✅" : candidateData?.status === "Rejected" ? "Rejected ❌" : "Pending 🕓"}
            </span>
          </div>
        </div>
      </div>

      {candidateData?.profilecompleted ? (
        <div className="profile-complete-container">
          <div className="profile-complete-card">
            <h2>🎉 Profile Completed!</h2>
            <p>You’ve successfully filled out your candidate profile.</p>
            <button onClick={() => navigate(`/candidateDetails/${candidateData.rollNumber}`)} className="view-profile-btn">View Complete Profile</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="card-grid">
              <label>Upload Manifesto (PDF)</label>
              <input type="file" name="manifesto" onChange={handleFileChange} />
              <span className="file-name">{files.manifesto ? files.manifesto.name : "No file chosen"}</span>

              <label>Campaign Video</label>
              <div className="video-mode-toggle">
                <label>
                  <input type="radio" name="videoMode" checked={!recordingMode} onChange={() => setRecordingMode(false)} />
                  Upload from device
                </label>
                <label>
                  <input type="radio" name="videoMode" checked={recordingMode} onChange={() => setRecordingMode(true)} />
                  Record using camera
                </label>
              </div>

              {recordingMode ? (
                <div className="recorder-block">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="recorder-preview"
                    style={{ width: "100%", maxHeight: 300, display: recordingUrl ? "none" : "block" }}
                  />

                  <div className="recorder-controls">
                    <div className="recorder-status">
                      <span className="timer">{Math.floor(elapsed/60).toString().padStart(2,'0')}:{(elapsed%60).toString().padStart(2,'0')}</span>
                      <span className="hint">{isPaused ? 'Paused' : isRecording ? 'Recording...' : 'Preview'}</span>
                    </div>

                    {!isRecording && !recordingUrl && (
                      <>
                        <button type="button" className="rec-btn" onClick={startPreview}>Enable Camera</button>
                        <button type="button" className="rec-btn" onClick={startRecording}>Start Recording</button>
                      </>
                    )}

                    {isRecording && (
                      <div className="recording-actions">
                        {!isPaused ? (
                          <button type="button" className="rec-btn" onClick={pauseRecording}>Pause</button>
                        ) : (
                          <button type="button" className="rec-btn" onClick={resumeRecording}>Resume</button>
                        )}
                        <button type="button" className="rec-btn danger" onClick={stopRecording}>Stop</button>
                      </div>
                    )}

                    {recordingUrl && (
                      <div className="recording-preview">
                        <video src={recordingUrl} controls style={{ width: "100%", marginTop: 8 }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button type="button" className="rec-btn" onClick={handleUseRecordingClick}>Use Recording (Attach)</button>
                          <button type="button" className="rec-btn danger" onClick={cancelRecording}>Remove Recording</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <input type="file" name="campaignVideo" accept="video/*" onChange={handleFileChange} />
                  <span className="file-name">{files.campaignVideo ? files.campaignVideo.name : "No file chosen"}</span>
                </>
              )}

              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={handleFileChange} />
              <span className="file-name">{files.profilePhoto ? files.profilePhoto.name : "No file chosen"}</span>

              <label>Parental Consent Form</label>
              <input type="file" name="parentalConsent" onChange={handleFileChange} />
              <span className="file-name">{files.parentalConsent ? files.parentalConsent.name : "No file chosen"}</span>

              <label>Upload Party Symbol</label>
              <input type="file" name="partysymbol" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={handleFileChange} />
              <span className="file-name">{files.partysymbol ? files.partysymbol.name : "No file chosen"}</span>
            </div>

            <div className="card-grid">
              <h3>Achievements</h3>

              {formData.achievements.map((value, i) => (
                <div className="cp-input-row" key={i}>
                  <input type="text" placeholder={`Achievement ${i + 1}`} value={value} onChange={(e) => handleChange(e, "achievements", i)} />

                  {formData.achievements.length > 1 && (
                    <button type="button" className="cp-delete-btn" onClick={() => setFormData((prev) => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }))}>✕</button>
                  )}
                </div>
              ))}

              <button type="button" className="cp-add-btn" onClick={() => addField("achievements")}>+ Add More</button>

              <h3>Initiatives</h3>

              {formData.initiatives.map((value, i) => (
                <div className="cp-input-row" key={i}>
                  <input type="text" placeholder={`Initiative ${i + 1}`} value={value} onChange={(e) => handleChange(e, "initiatives", i)} />

                  {formData.initiatives.length > 1 && (
                    <button type="button" className="cp-delete-btn" onClick={() => setFormData((prev) => ({ ...prev, initiatives: prev.initiatives.filter((_, idx) => idx !== i) }))}>✕</button>
                  )}
                </div>
              ))}

              <button type="button" className="cp-add-btn" onClick={() => addField("initiatives")}>+ Add More</button>

              <div className="declaration">
                <input type="checkbox" checked={formData.declarationSigned} onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })} required />
                <label>I hereby declare all the details are true to the best of my knowledge.</label>
              </div>

              <button type="submit" className="submit-btn_">Save Profile</button>
            </div>
          </div>
        </form>
      )}
      {showRecordingConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-content">
            <h3>Use this recording?</h3>
            <video src={recordingUrl} controls style={{ width: "100%", maxHeight: 360 }} />
            <div className="confirm-actions">
              <button type="button" className="rec-btn" onClick={confirmUseRecording}>Confirm</button>
              <button type="button" className="rec-btn danger" onClick={cancelUseRecording}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfilePage;
