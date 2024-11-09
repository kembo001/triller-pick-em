// App.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import TeamPicks from './TeamPicks';
import PlayerPicks from './PlayerPicks';
import './App.css';
import logo from './assests/triller.gif'

// Define the list of players with additional details here as well
const players = [
  { name: "Donovan Mitchell", team: "CLE", stat: "POINTS", value: 23.5 },
  { name: "James Harden", team: "LAC", stat: "ASSISTS", value: 9.5 }
];

function App() {
  const [picks, setPicks] = useState({});
  const [overUnder, setOverUnder] = useState({});
  const [tiebreaker, setTiebreaker] = useState('');
  const [name, setName] = useState('');

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

    // Format team picks with each team on a new line
    const selectedTeams = Object.keys(picks)
      .filter((team) => picks[team])
      .join('\n');

    // Format player picks with additional details
    const formattedPlayerPicks = players
      .map((player) => {
        const choice = overUnder[player.name];
        if (choice) {
          return `${player.name} (${player.team}) ${player.stat} ${player.value}: <b>${choice}</b>`;
        }
        return null;
      })
      .filter((entry) => entry) // Remove any null entries
      .join('\n');

    const templateParams = {
      name,
      tiebreaker,
      teamPicks: selectedTeams,
      playerPicks: formattedPlayerPicks, // Detailed player picks
    };

    emailjs.send('service_b3v5xwo', 'template_cu6i14j', templateParams, 'ozqj7nITvnSU_Bw-u')
      .then((response) => {
        alert('Submission sent successfully!');
      })
      .catch((error) => {
        alert('Failed to send submission.');
        console.error('EmailJS Error:', error);
      });
  };

  return (
    <div className="App">
       <img src={logo} alt="loading..." className='triller-gif'/>
     <h1>Triller Pickem </h1>
      
      <section className="card">
        <h2>Game Picks</h2>
        <TeamPicks picks={picks} onPickChange={handlePickChange} />
      </section>

      <section className="card">
        <h2>Player Picks</h2>
        <PlayerPicks players={players} overUnder={overUnder} onOverUnderChange={handleOverUnderChange} />
      </section>

      <section className='card input-section'>
        <h2>Tiebreaker</h2>
        <input
          type="text"
          placeholder="Total score for Spurs vs Clippers"
          value={tiebreaker}
          className="input-field"
          onChange={(e) => setTiebreaker(e.target.value)}
        />
      </section>

      <section className='card input-section'>
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
