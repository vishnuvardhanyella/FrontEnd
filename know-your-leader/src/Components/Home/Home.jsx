import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  useEffect(() => {
    // Fetch candidates data from the public folder
    const fetchData = async () => {
      try {
        const response = await fetch('/candidatesData.json'); // Adjust the path based on your setup
        const data = await response.json();
        // Update state with the fetched data
        setCandidatesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [candidatesData, setCandidatesData] = useState(null);

  const handleSearch = () => {
    const formattedQuery = searchQuery.toLowerCase().trim();

    // Search logic
    if (candidatesData) {
      const candidateResults = candidatesData.states.flatMap(state =>
        state.districts.flatMap(district =>
          district.constituencies.flatMap(constituency =>
            constituency.candidates.filter(candidate =>
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
            candidateResults.map(candidate => ({
              constituencyName: '',
              numberOfVoters: '',
              seatCategory: '',
              candidates: [candidate],
            }))
          );
          setSelectedCandidate(null);
        }

        setSearchQuery('');
      } else {
        const placeResults = candidatesData.states.flatMap(state =>
          state.districts.flatMap(district =>
            district.constituencies.flatMap(constituency => {
              const formattedConstituencyName = constituency.constituencyName.toLowerCase();
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

        setSearchQuery('');
      }
    }

    // After updating state, scroll to the first result or the not-found message
    const targetId = searchResults.length > 0 ? searchResults[0].constituencyName : 'not-found';
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCandidateClick = (candidateId) => {
    const flattenedCandidates = searchResults.flatMap(result => result.candidates);
    const candidate = flattenedCandidates.find(candidate => candidate.id === candidateId);
    setSelectedCandidate(candidate);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : candidatesData.states
          .flatMap((state) => state.districts)
          .flatMap((district) => district.constituencies)
          .flatMap((constituency) => constituency.candidates)
          .filter((candidate) => candidate.name.toLowerCase().includes(inputValue))
          .map((candidate) => candidate.name);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSearchQuery(suggestion);
  };

  const inputProps = {
    placeholder: 'Search by place or candidate...',
    value: searchQuery,
    onChange: (event, { newValue }) => setSearchQuery(newValue),
  };

  return (
    <div className="home-content">
      <header>
        <h1>Your Website Name</h1>
        <p>Engaging tagline or description goes here.</p>
      </header>
      <div className="search-section">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => <div>{suggestion}</div>}
          inputProps={{
            ...inputProps,
            type: 'search',
            autoComplete: 'off',
          }}
        />
        {/* Removed the Search button */}
      </div>
      {notFound && (
        <p id="not-found" className="not-found">
          Sorry, not found/unavailable
        </p>
      )}
      {!selectedCandidate && !notFound && (
        <div className="place-summary">
          {searchResults.map(
            ({ constituencyName, TotalVoters, MaleVoters, FemaleVoters, others, seatCategory, candidates }) => (
              <div key={constituencyName} id={constituencyName} className="place-details">
                <div className="place-header">
                  <h3>{constituencyName}</h3>
                  <p>Total Voters: {TotalVoters}</p>
                  <p>Male Voters: {MaleVoters}</p>
                  <p>Female Voters: {FemaleVoters}</p>
                  <p>Others: {others}</p>
                  <p>Seat Category: {seatCategory}</p>
                </div>
                <h4>Contesting Candidates</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Party</th>
                      <th>View Full Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates &&
                      candidates.map(({ id, photo, name, party, partySymbol }) => (
                        <tr key={`${id}-${name}`}>
                          <td>
                            <img src={photo} alt={name} className="candidate-image" />
                          </td>
                          <td>{name}</td>
                          <td>
                            <div className="party-info">
                              <img src={partySymbol} alt={party} className="party-symbol" />
                              <p>{party}</p>
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleCandidateClick(id)}>View</button>
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
      {selectedCandidate && (
        <div className="candidate-details">
          <img src={selectedCandidate.photo} alt={selectedCandidate.name} className="candidate-image" />
          <div className="details">
            <h2>{selectedCandidate.name}</h2>
            <div className="party-info">
              <img src={selectedCandidate.partySymbol} alt={selectedCandidate.party} className="party-symbol" />
              <p>{selectedCandidate.party}</p>
            </div>
            <p>Age: {selectedCandidate.age}</p>
            <p>Education: {selectedCandidate.education}</p>
            <p>Profession: {selectedCandidate.profession}</p>
            <p className="criminal-cases">Criminal Cases: {selectedCandidate.criminalCases}</p>
            <p className="assets">Assets: {selectedCandidate.assets}</p>
            <p className="liabilities">Liabilities: {selectedCandidate.liabilities}</p>
            {/* ... (existing code) */}
          </div>
        </div>
      )}
      {/* Disclaimer */}
      {(searchResults.length > 0 || selectedCandidate) && (
        <div className="disclaimer">
          <p>Data collected from online sources. Nothing personal.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
