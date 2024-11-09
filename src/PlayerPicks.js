// PlayerPicks.js
import React from 'react';
import * as NBAIcons from 'react-nba-logos';

function TeamLogo({ teamAbbr }) {
  const TeamIcon = NBAIcons[teamAbbr];
  return TeamIcon ? <TeamIcon size={30} /> : null; // Smaller size for player logos
}

function PlayerPicks({ players, overUnder, onOverUnderChange }) {
  return (
    <section>
      {players.map((player, index) => (
        <div key={index} className="player-pick">
          <div className="player-info">
            <TeamLogo teamAbbr={player.team} /> {/* Display team logo */}
            <span className="player-name">{player.name}</span>
            <span className="player-team">({player.team})</span>
            <span className="player-stat">{player.stat}: {player.value}</span>
          </div>
          <div className="player-pick-options">
            <label>
              <input
                type="radio"
                name={player.name}
                value="over"
                checked={overUnder[player.name] === 'over'}
                onChange={() => onOverUnderChange(player.name, 'over')}
              />
              Over
            </label>
            <label>
              <input
                type="radio"
                name={player.name}
                value="under"
                checked={overUnder[player.name] === 'under'}
                onChange={() => onOverUnderChange(player.name, 'under')}
              />
              Under
            </label>
          </div>
        </div>
      ))}
    </section>
  );
}

export default PlayerPicks;
