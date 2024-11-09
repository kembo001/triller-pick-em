// TeamPicks.js
import React from 'react';
import * as NBAIcons from 'react-nba-logos';

function TeamLogo({ teamAbbr }) {
  const TeamIcon = NBAIcons[teamAbbr];
  return TeamIcon ? <TeamIcon size={50} /> : null;
}

function TeamOption({ team, isSelected, onChange }) {
  return (
    <label className="team">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onChange(team.name)}
      />
      <TeamLogo teamAbbr={team.name} />
      <span className="team-name">{team.fullName}</span>
    </label>
  );
}

function TeamPicks({ games = [], picks, onPickChange }) { // Default to an empty array
  if (!games.length) {
    return <p>Loading games...</p>;
  }

  return (
    <section>
      {games.map((game, index) => (
        <div key={index} className="game-pick">
          <TeamOption
            team={game.team1}
            isSelected={!!picks[game.team1.name]}
            onChange={onPickChange}
          />
          <span className="vs">VS</span>
          <TeamOption
            team={game.team2}
            isSelected={!!picks[game.team2.name]}
            onChange={onPickChange}
          />
        </div>
      ))}
    </section>
  );
}

export default TeamPicks;
