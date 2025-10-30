// import React from "react";
// import "./CandidateCards.css";
// import { useNavigate } from "react-router-dom";

// const CandidateCard = ({
//   candidate,
//   onDelete,
//   onEdit,
//   editId,
//   setEditId,
//   setForm,
// }) => {
//   const navigate = useNavigate();
//   const handleCard = (candidate) => {
//     console.log("candidate id : ", candidate.id);
//     navigate(`/candidateDetails/${candidate.id}`);
//   };

//   console.log("partySymbol:", candidate.partySymbol);
//   return (
//     <div className="candidate-cards" onClick={() => handleCard(candidate)}>
//       <div className="card-contents">
//         {candidate.partySymbol && (
//           <img
//             src={`https://voteverse-backend.onrender.com/${candidate.partySymbol.replace(
//               /\\/g,
//               "/"
//             )}`}
//             alt={`${candidate.party} Symbol`}
//             className="party-symbols"
//           />
//         )}

//         <div className="detailss">
//           <h3>{candidate.name}</h3>
//           <p>
//             <b>Party:</b> {candidate.party}
//           </p>
//           <p>
//             <b>Age:</b> {candidate.age}
//           </p>
//         </div>
//       </div>

//       {onDelete && (
//         <div className="card-actionss">
//           {editId ? (
//             <button
//               type="button"
//               className="cancel-btns"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setEditId(null);
//                 setForm({
//                   name: "",
//                   party: "",
//                   age: "",
//                   aadhar: "",
//                   partySymbol: "",
//                   password: "",
//                 });
//               }}
//             >
//               Cancel
//             </button>
//           ) : (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit(candidate);
//               }}
//             >
//               Edit
//             </button>
//           )}
//           <button
//             className="delete"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(candidate.id);
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CandidateCard;


import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../UI/Cards";
import { Button } from "../UI/Button";

const CandidateCard = ({ candidate }) => {
  const navigate = useNavigate();

  const handleMoreInfo = () => {
    navigate(`/candidateDetails/${candidate.rollNumber}`); // Navigate to detailed page
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col items-center p-4">
        {/* Profile Photo */}
        <img
          src={candidate.profilePhoto}
          alt={`${candidate.name}'s profile`}
          className="w-28 h-28 object-cover rounded-full border-2 border-gray-300 mb-3"
        />

        {/* Candidate Basic Info */}
        <h2 className="text-xl font-semibold text-gray-800">{candidate.name}</h2>
        <p className="text-gray-500 text-sm mb-2">{candidate.class}</p>

        <div className="flex flex-col gap-1 items-center text-sm text-gray-600">
          <p><strong>Gender:</strong> {candidate.gender}</p>
          <p><strong>Position:</strong> {candidate.position}</p>
        </div>

        {/* Party Symbol */}
        {candidate.partysymbol && (
          <div className="mt-3 flex items-center justify-center">
            <img
              src={candidate.partysymbol}
              alt="Party Symbol"
              className="w-16 h-16 object-contain"
            />
          </div>
        )}

        {/* More Info Button */}
        <Button
          onClick={handleMoreInfo}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          More Info
        </Button>
      </div>
    </Card>
  );
};

export default CandidateCard;
