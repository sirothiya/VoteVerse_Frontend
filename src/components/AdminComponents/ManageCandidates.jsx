import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import "./ManageCandidates.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ManageCandidates({ candidates, setCandidates }) {
  const [form, setForm] = useState({
    name: "",
    party: "",
    age: "",
    partySymbol: "",
    aadhar: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editId, setEditId] = useState(null);
  const storedToken = localStorage.getItem("token");

  // 🔹 Generate Image from Gemini API with retry handling
  const imageGeneration = async (prompt, retries = 3) => {
    try {
      const res = await fetch(
        "https://voteverse-backend.onrender.com/gemini/generate-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Gemini API error:", errorData);

        // If API tells us to retry
        if (errorData?.error?.includes("RetryInfo") && retries > 0) {
          const retryMatch = errorData.error.match(/"retryDelay":"(\d+)s"/);
          const delay = retryMatch ? parseInt(retryMatch[1], 10) * 1000 : 5000;
          console.warn(`Retrying after ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return imageGeneration(prompt, retries - 1);
        }

        return null;
      }

      const blob = await res.blob();
      return new File([blob], "symbol.png", { type: blob.type });
    } catch (err) {
      console.error("Image generation failed:", err);
      return null;
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("party", form.party);
      formData.append("age", form.age);
      formData.append("aadhar", form.aadhar);
      formData.append("password", form.password);

      if (form.partySymbol instanceof File) {
        formData.append("partySymbol", form.partySymbol);
      }
      console.log(form.partySymbol);
      console.log("manage Candidate token", storedToken);
      const response = await fetch(
        `https://voteverse-backend.onrender.com/admin/addcandidate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Failed to add candidate");
        return;
      }
      console.log("Added Candidate:", result.savedCandidate);
      alert("Candidate Added Successfully");
      setCandidates((prev) => [...prev, result.savedCandidate]);
      setForm({
        name: "",
        party: "",
        age: "",
        partySymbol: "",
        aadhar: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

const handleEditSubmit=async(e)=>{
    e.preventDefault();
    try{
       const formData = new FormData();
      formData.append("name", form.name);
      formData.append("party", form.party);
      formData.append("age", form.age);
      formData.append("aadhar", form.aadhar);
      formData.append("password", form.password);

      if (form.partySymbol instanceof File) {
        formData.append("partySymbol", form.partySymbol);
      }
      const response=await fetch(`https://voteverse-backend.onrender.com/admin/${editId}`,{
        method:"PUT",
        headers:{
          Authorization: `Bearer ${storedToken}`,
        },
        body:formData
      });
      const result=await response.json();
      if(!response.ok){
        alert(result.message || "Failed to update candidate");
        return;
      }
      console.log("Updated Candidate:",result.candidate);
      alert("Candidate Updated Successfully");
      setCandidates((prev)=>prev.map((c)=>c.id===editId?result.candidate:c));
      setForm({
        name: "",
        party: "",
        age: "",
        partySymbol: "",
        aadhar: "",
        password: "",
      });
      setEditId(null);
    }catch(err){
        console.error(err);
        alert("Failed to update candidate");
    }
}

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://voteverse-backend.onrender.com/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (!response.ok) {
        return alert("Some error in deleting the data");
      }
      alert("Data Deleted Successfully");
      setCandidates(candidates.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (c) => {
    setForm({
      name: c.name || "",
      party: c.party || "",
      age: c.age || "",
      partySymbol: c.partySymbol || "",
      aadhar: c.aadhar || "",
      password: c.password || "",
    });
    setEditId(c.id);
  };

  return (
    <div>
      <h2 className="page-title">Manage Candidates</h2>
      <form
        className="candidate-form"
        onSubmit={editId ? handleEditSubmit :  handleAddSubmit}
        encType="multipart/form-data"
        action="/uploads"
        method="POST"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Party"
          value={form.party}
          onChange={(e) => setForm({ ...form, party: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Aadhar Number"
          value={form.aadhar}
          onChange={(e) => setForm({ ...form, aadhar: e.target.value })}
          required
        />
        <input
          type="file"
          placeholder="Choose Party Symbol"
          onChange={(e) => setForm({ ...form, partySymbol: e.target.files[0] })}
        />

        {!editId && (
          <div className="passwordcontainer">
            <input
              type={showPassword ? "text" : "password"} // toggles type
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="input"
            />
            <span
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        <button type="submit" className="add-btn">
          {editId ? "Update" : "Add"} Candidate
        </button>
      </form>
      <div className="card-grid">
        {candidates?.map((c) => (
          <CandidateCard
            key={c._id}
            candidate={c}
            onDelete={handleDelete}
            onEdit={handleEdit}
            editId={editId}
            setEditId={setEditId}
            setForm={setForm}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageCandidates;
