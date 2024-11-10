// src/UserPicks.js
import React, { useState, useEffect } from 'react';
import { db, ref, onValue } from './firebase';

function UserPicks() {
  const [userPicks, setUserPicks] = useState([]);
  const [gameResults, setGameResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [userScores, setUserScores] = useState([]);

  // Fetch user picks from Firebase
  const fetchUserPicks = () => {
    const picksRef = ref(db, 'picks/');
    onValue(picksRef, (snapshot) => {
      const fetchedPicks = [];
      snapshot.forEach((childSnapshot) => {
        const pick = childSnapshot.val();

        // If date is missing, generate it from the timestamp
        if (!pick.date && pick.timestamp) {
          const dateObj = new Date(pick.timestamp);
          pick.date = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        }

        // Check and log each pick to ensure it has the date and teamPicks properties
        if (pick.date && pick.teamPicks) {
          console.log("Fetched Pick:", pick);  // Log each valid pick
          fetchedPicks.push(pick);
        } else {
          console.warn("Pick missing required fields (date or teamPicks):", pick);
        }
      });
      setUserPicks(fetchedPicks);
    });
  };

  // Fetch game results from the BallDontLie API for a specific date
  const fetchGameResults = async (date) => {
    const apiUrl = `https://api.balldontlie.io/v1/games?start_date=${date}&end_date=${date}`;
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': '7a839f49-89fc-405d-b6f3-bbc69abe42ad',
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.data
        .map((game) => {
          // Determine if the game has completed based on score
          const isGameComplete = game.home_team_score !== 0 || game.visitor_team_score !== 0;
          const winner = isGameComplete
            ? game.home_team_score > game.visitor_team_score
              ? game.home_team.abbreviation
              : game.visitor_team.abbreviation
            : null;
  
          return {
            homeTeam: game.home_team.abbreviation,
            visitorTeam: game.visitor_team.abbreviation,
            winner, // Only set winner if game is complete
          };
        })
        .filter((game) => game.winner); // Only include games with a winner
    } catch (error) {
      console.error("Error fetching game results:", error);
      return []; // Return an empty array on error
    }
    
  };

  useEffect(() => {
    fetchUserPicks();
  }, []);

  // Fetch and cache game results for each unique date when a user made picks
  useEffect(() => {
    const uniqueDates = [...new Set(userPicks.map((pick) => pick.date).filter(Boolean))];

    uniqueDates.forEach(async (date) => {
      if (!gameResults[date]) {
        const results = await fetchGameResults(date);
        setGameResults((prevResults) => ({
          ...prevResults,
          [date]: results,
        }));
      }
    });
  }, [userPicks]);

  // Calculate scores after game results are fetched
  useEffect(() => {
    if (userPicks.length > 0 && Object.keys(gameResults).length > 0) {
      const scores = userPicks.map((user) => {
        const resultsForDate = gameResults[user.date] || [];
        let correctPicks = 0;

        resultsForDate.forEach((game) => {
          if (user.teamPicks.includes(game.winner)) {
            correctPicks += 1;
          }
        });

        console.log(`User: ${user.name}, Date: ${user.date}, Correct Picks: ${correctPicks}`);
        return { name: user.name, correctPicks };
      });
      setUserScores(scores);
      setLoading(false);
    }
  }, [userPicks, gameResults]);

  console.log("User Picks:", userPicks);
  console.log("Game Results:", gameResults);
  console.log("User Scores:", userScores);

  return (
    <div>
      <h2>User Picks and Game Results</h2>
      {loading ? <p>Loading...</p> : <p>Data Loaded!</p>}
      
      <h3>Scores:</h3>
      <ul>
        {userScores.map((user) => (
          <li key={user.name}>
            {user.name}: {user.correctPicks} correct picks
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPicks;
