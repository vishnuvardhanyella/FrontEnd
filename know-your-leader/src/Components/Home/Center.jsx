import React, { useState, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import { useLocation } from "react-router-dom";
import "./Center.css";

const Center = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash]);

  useEffect(() => {
    // Fetch candidates data from the public folder
    const fetchData = async () => {
      try {
        const response = await fetch("/candidatesData.json"); // Adjust the path based on your setup
        const data = await response.json();
        // Update state with the fetched data
        setCandidatesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [candidatesData, setCandidatesData] = useState(null);

  const getSuggestions = (value) => {
    const formattedValue = value.trim().toLowerCase();
    // Check if the length is at least 3 characters to trigger suggestions
    if (formattedValue.length < 3) {
      return [];
    }

    const placeSuggestions = candidatesData?.states.flatMap((state) =>
      state.districts.flatMap((district) =>
        district.constituencies.filter((constituency) =>
          constituency.constituencyName.toLowerCase().includes(formattedValue)
        )
      )
    );

    const candidateSuggestions = candidatesData?.states.flatMap((state) =>
      state.districts.flatMap((district) =>
        district.constituencies.flatMap((constituency) =>
          constituency.candidates.filter((candidate) =>
            candidate.name.toLowerCase().includes(formattedValue)
          )
        )
      )
    );

    const suggestions = [
      ...placeSuggestions?.map((place) => ({
        name: place.constituencyName,
        type: "Place",
      })),
      ...candidateSuggestions?.map((candidate) => ({
        name: candidate.name,
        type: "Candidate",
      })),
    ];

    return suggestions;
  };
  const handleInputChange = (_, { newValue }) => {
    setSearchQuery(newValue);
  };
  const renderSuggestion = (suggestion) => (
    <div>{`${suggestion.name} (${suggestion.type})`}</div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setSearchResults(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSearchResults([]);
  };

  const onSuggestionSelected = (_, { suggestion }) => {
    if (suggestion.type === "Place") {
      console.log("Place selected:", suggestion.name, suggestion.data);
      setSearchResults([suggestion.data]);
      setSelectedCandidate(null);
    } else if (suggestion.type === "Candidate") {
      console.log("Candidate selected:", suggestion.name, suggestion.data);
      setSelectedCandidate(suggestion.data);
      setSearchResults([]);
    }
  };

  const inputProps = {
    placeholder: "Search by place or candidate...",
    value: searchQuery,
    onChange: (_, { newValue }) => setSearchQuery(newValue),
  };
  // Handle search logic
  const handleSearch = () => {
    const formattedQuery = searchQuery.toLowerCase().trim();

    if (candidatesData) {
      const candidateResults = candidatesData.states.flatMap((state) =>
        state.districts.flatMap((district) =>
          district.constituencies.flatMap((constituency) =>
            constituency.candidates.filter((candidate) =>
              candidate.name.toLowerCase().includes(formattedQuery)
            )
          )
        )
      );

      if (candidateResults.length > 0) {
        setSearchResults([]);
        setNotFound(false);

        if (candidateResults.length === 1) {
          setSelectedCandidate(candidateResults[0]);
        } else {
          setSearchResults(
            candidateResults.map((candidate) => ({
              constituencyName: "",
              candidates: [candidate],
            }))
          );
          setSelectedCandidate(null);
        }

        setSearchQuery("");
      } else {
        const placeResults = candidatesData.states.flatMap((state) =>
          state.districts.flatMap((district) =>
            district.constituencies.flatMap((constituency) => {
              const formattedConstituencyName =
                constituency.constituencyName.toLowerCase();
              return formattedConstituencyName.includes(formattedQuery)
                ? { ...constituency, candidates: constituency.candidates }
                : [];
            })
          )
        );

        if (placeResults.length > 0) {
          setSearchResults(placeResults);
          setSelectedCandidate(null);
          setNotFound(false);
        } else {
          setSearchResults([]);
          setSelectedCandidate(null);
          setNotFound(true);
        }

        setSearchQuery("");
      }
    }

    setShowSearchResults(true);
  };

  const handleCandidateClick = (candidateId) => {
    const flattenedCandidates = searchResults.flatMap(
      (result) => result.candidates
    );
    const candidate = flattenedCandidates.find(
      (candidate) => candidate.id === candidateId
    );
    setSelectedCandidate(candidate);
  };

  return (
    <center>
      <div className="sentence">
        
        <p>
          Explore your constituency and get details about contesting candidates.
          Choose your leader wisely.
        </p>
      </div>
      <div className="search-section">
        <Autosuggest
          suggestions={searchResults}
          onSuggestionsFetchRequested={({ value }) => {
            setSearchResults(getSuggestions(value));
          }}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: "Search by place or candidate...",
            value: searchQuery,
            onChange: handleInputChange,
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {notFound && (
        <p id="not-found" className="not-found">
          Sorry, not found/unavailable
        </p>
      )}
      {showSearchResults && !selectedCandidate && !notFound && (
        <div className="place-details">
          {searchResults.map(
            ({
              constituencyName,
              seatCategory,
              TotalVoters,
              MaleVoters,
              FemaleVoters,
              others,
              candidates,
            }) => (
              <div
                key={constituencyName}
                id={constituencyName}
                className="place-details-container"
              >
                <div className="place-header">
                  <h3>
                    {constituencyName}({seatCategory})
                  </h3>
                  <div className="seat-category"></div>
                  <div className="category-box">
                    <div className="category">
                      <p>Total Voters:{TotalVoters}</p>
                    </div>
                    <div className="category">
                      <p>Male Voters:{MaleVoters}</p>
                    </div>
                    <div className="category">
                      <p>Female Voters:{FemaleVoters}</p>
                    </div>
                    <div className="category">
                      <p>Others:{others}</p>
                    </div>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Party</th>
                      <th>View Full Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates &&
                      candidates.map(({ id, name, party, partySymbol }) => (
                        <tr key={id}>
                          <td>{name}</td>
                          <td>
                            <div className="party-info">
                              <img
                                src={partySymbol}
                                alt={party}
                                className="party-symbol"
                              />
                              <p>{party}</p>
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleCandidateClick(id)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}
      {showSearchResults && selectedCandidate && (
        <div className="candidate-details">
          <img
            src={selectedCandidate.photo}
            alt={selectedCandidate.name}
            className="candidate-image"
          />
          <div className="details">
            <h2>{selectedCandidate.name}</h2>
            <div className="party-info">
              <img
                src={selectedCandidate.partySymbol}
                alt={selectedCandidate.party}
                className="party-symbol"
              />
              <p>{selectedCandidate.party}</p>
            </div>
            <p>Age: {selectedCandidate.age}</p>
            <p>Education: {selectedCandidate.education}</p>
            <p>Profession: {selectedCandidate.profession}</p>
            <p>Criminal Cases: {selectedCandidate.criminalCases}</p>
            <p>Assets: {selectedCandidate.assets}</p>
            <p>Liabilities: {selectedCandidate.liabilities}</p>
            {/* ... (existing code) */}
          </div>
        </div>
      )}
      {/* Disclaimer */}
      {showSearchResults && (searchResults.length > 0 || selectedCandidate) && (
        <div className="disclaimer">
          <p>Data collected from online sources. Nothing personal.</p>
        </div>
      )}
    </center>
  );
};

export default Center;
