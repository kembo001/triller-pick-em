// MainPage.js
import React from 'react';
import TeamPicks from './TeamPicks';
import PlayerPicks from './PlayerPicks';
import UserPicks from './UserPicks'; // Import UserPicks to display scores

function MainPage({
  games,
  picks,
  handlePickChange,
  players,
  overUnder,
  handleOverUnderChange,
  tiebreaker,
  setTiebreaker,
  name,
  setName,
  handleSubmit
}) {
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

      <UserPicks /> {/* Display user scores here */}
    </div>
  );
}

export default MainPage;
