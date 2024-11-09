// TeamPicks.js
import React from 'react';
import * as NBAIcons from 'react-nba-logos';


// Define the list of games here to keep this component self-contained
// Full list of NBA teams with abbreviations and full names
const games = [
  { team1: { name: "ATL", fullName: "Hawks" }, team2: { name: "BOS", fullName: "Celtics" } },
  { team1: { name: "BKN", fullName: "Nets" }, team2: { name: "CHA", fullName: "Hornets" } },
  { team1: { name: "CHI", fullName: "Bulls" }, team2: { name: "CLE", fullName: "Cavaliers" } },
  { team1: { name: "DAL", fullName: "Mavericks" }, team2: { name: "DEN", fullName: "Nuggets" } },
  { team1: { name: "DET", fullName: "Pistons" }, team2: { name: "GSW", fullName: "Warriors" } },
  { team1: { name: "HOU", fullName: "Rockets" }, team2: { name: "IND", fullName: "Pacers" } },
  { team1: { name: "LAC", fullName: "Clippers" }, team2: { name: "LAL", fullName: "Lakers" } },
  { team1: { name: "MEM", fullName: "Grizzlies" }, team2: { name: "MIA", fullName: "Heat" } },
  { team1: { name: "MIL", fullName: "Bucks" }, team2: { name: "MIN", fullName: "Timberwolves" } },
  { team1: { name: "NOP", fullName: "Pelicans" }, team2: { name: "NYK", fullName: "Knicks" } },
  { team1: { name: "OKC", fullName: "Thunder" }, team2: { name: "ORL", fullName: "Magic" } },
  { team1: { name: "PHI", fullName: "76ers" }, team2: { name: "PHX", fullName: "Suns" } },
  { team1: { name: "POR", fullName: "Trail Blazers" }, team2: { name: "SAC", fullName: "Kings" } },
  { team1: { name: "SAS", fullName: "Spurs" }, team2: { name: "TOR", fullName: "Raptors" } },
  { team1: { name: "UTA", fullName: "Jazz" }, team2: { name: "WAS", fullName: "Wizards" } }
];


// Function to render the appropriate team logo component
function TeamLogo({ teamAbbr }) {
  const TeamIcon = NBAIcons[teamAbbr];
  return TeamIcon ? <TeamIcon size={50} /> : null;
}

function TeamPicks({ picks, onPickChange }) {
  return (
    <section>
      {games.map((game, index) => (
        <div key={index} className="game-pick">
          <label className="team">
            <input
              type="checkbox"
              checked={!!picks[game.team1.name]}
              onChange={() => onPickChange(game.team1.name)}
            />
            <TeamLogo teamAbbr={game.team1.name} /> {/* Render team1 logo */}
            <span className="team-name">{game.team1.fullName}</span>
          </label>
          <span className="vs">VS</span>
          <label className="team">
            <input
              type="checkbox"
              checked={!!picks[game.team2.name]}
              onChange={() => onPickChange(game.team2.name)}
            />
            <TeamLogo teamAbbr={game.team2.name} /> {/* Render team2 logo */}
            <span className="team-name">{game.team2.fullName}</span>
          </label>
        </div>
      ))}
    </section>
  );
}

export default TeamPicks;