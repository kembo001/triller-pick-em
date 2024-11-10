// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import emailjs from 'emailjs-com';
import MainPage from './MainPage';
import Admin from './Admin';
import { db, ref, push } from './firebase';
import './App.css';

// Your player data
const players = [
  { name: "Donovan Mitchell", team: "CLE", stat: "POINTS", value: 23.5 },
  { name: "James Harden", team: "LAC", stat: "ASSISTS", value: 9.5 }
];

function App() {
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState({});
  const [overUnder, setOverUnder] = useState({});
  const [tiebreaker, setTiebreaker] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const apiUrl = `https://api.balldontlie.io/v1/games?start_date=${formattedDate}&end_date=${formattedDate}`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `7a839f49-89fc-405d-b6f3-bbc69abe42ad`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const formattedGames = data.data.map((game) => ({
          team1: { name: game.home_team.abbreviation, fullName: game.home_team.full_name },
          team2: { name: game.visitor_team.abbreviation, fullName: game.visitor_team.full_name }
        }));

        setGames(formattedGames);
      } catch (error) {
        console.error("Error fetching NBA schedule:", error);
      }
    };

    fetchGames();
  }, []);

  const handlePickChange = (team) => {
    setPicks((prevPicks) => ({
      ...prevPicks,
      [team]: !prevPicks[team],
    }));
  };

  const handleOverUnderChange = (player, choice) => {
    setOverUnder((prev) => ({
      ...prev,
      [player]: choice,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedTeams = Object.keys(picks).filter((team) => picks[team]);
    const formattedPlayerPicks = players.map((player) => {
      const choice = overUnder[player.name];
      if (choice) {
        return {
          playerName: player.name,
          team: player.team,
          stat: player.stat,
          value: player.value,
          choice
        };
      }
      return null;
    }).filter((entry) => entry);

    const pickData = {
      name,
      tiebreaker,
      teamPicks: selectedTeams,
      playerPicks: formattedPlayerPicks,
      timestamp: new Date().toISOString()
    };

    push(ref(db, 'picks/'), pickData)
      .then(() => {
        alert('Picks saved to database successfully!');
      })
      .catch((error) => {
        alert('Failed to save picks to database.');
        console.error('Firebase Error:', error);
      });
  };

  return (
    <Router basename="/triller-pick-em">
      <Routes>
        <Route 
          path="/" 
          element={
            <MainPage 
              games={games}
              picks={picks}
              handlePickChange={handlePickChange}
              players={players}
              overUnder={overUnder}
              handleOverUnderChange={handleOverUnderChange}
              tiebreaker={tiebreaker}
              setTiebreaker={setTiebreaker}
              name={name}
              setName={setName}
              handleSubmit={handleSubmit}
            />
          } 
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
