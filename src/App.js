// App.js
import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import TeamPicks from './TeamPicks';
import PlayerPicks from './PlayerPicks';
import './App.css';

// Your player data
const players = [
  { name: "Donovan Mitchell", team: "CLE", stat: "POINTS", value: 23.5 },
  { name: "James Harden", team: "LAC", stat: "ASSISTS", value: 9.5 }
];

function App() {
  const [games, setGames] = useState([]); // Start as an empty array
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
        
        // Make the request with the API key in the headers
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

    const selectedTeams = Object.keys(picks)
      .filter((team) => picks[team])
      .join('\n');

    const formattedPlayerPicks = players
      .map((player) => {
        const choice = overUnder[player.name];
        if (choice) {
          return `${player.name} (${player.team}) ${player.stat} ${player.value}: <b>${choice}</b>`;
        }
        return null;
      })
      .filter((entry) => entry)
      .join('\n');

    const templateParams = {
      name,
      tiebreaker,
      teamPicks: selectedTeams,
      playerPicks: formattedPlayerPicks,
    };

    emailjs.send('service_b3v5xwo', 'template_cu6i14j', templateParams, 'ozqj7nITvnSU_Bw-u')
      .then(() => {
        alert('Submission sent successfully!');
      })
      .catch((error) => {
        alert('Failed to send submission.');
        console.error('EmailJS Error:', error);
      });
  };

  return (
    <div className="App">
      <h1>Triller Pick'em</h1>

      <section className="card">
        <h2>Game Picks</h2>
        <TeamPicks games={games} picks={picks} onPickChange={handlePickChange} />
      </section>

      <section className="card">
        <h2>Player Picks</h2>
        <PlayerPicks players={players} overUnder={overUnder} onOverUnderChange={handleOverUnderChange} />
      </section>

      <section className="card input-section">
        <h2>Tiebreaker</h2>
        <input
          type="text"
          placeholder="Total score for Spurs vs Clippers"
          value={tiebreaker}
          className="input-field"
          onChange={(e) => setTiebreaker(e.target.value)}
        />
      </section>

      <section className="card input-section">
        <h2>Your Name</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <section className="button-container">
          <button type="button" onClick={handleSubmit} className="button">Submit</button>
        </section>
      </section>
    </div>
  );
}

export default App;
