"use client";
import { Fragment } from "react";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const players = [
  "איציק",
  "ארז",
  "שלום",
  "מוטי",
  "אבירם",
  "אליאור",
  "מאיר",
  "טל טובי",
  "זיו",
  "טל מלמד",
  "רונן",
  "טל קן דרור",
  "אוהד",
  "מור",
  "שלומי",
  "מוטי מזרחי",
];

const matches = [
  { id: 1, date: "05.05.2026", time: "14:32", group: "A", home: "Mexico", away: "South Africa" },
  { id: 2, date: "12.06.2026", time: "05:00", group: "A", home: "South Korea", away: "Czech Republic" },
  { id: 3, date: "12.06.2026", time: "22:00", group: "B", home: "Canada", away: "Bosnia & Herzegovina" },
  { id: 4, date: "13.06.2026", time: "04:00", group: "D", home: "USA", away: "Paraguay" },
  { id: 5, date: "13.06.2026", time: "22:00", group: "B", home: "Qatar", away: "Switzerland" },
  { id: 6, date: "14.06.2026", time: "01:00", group: "C", home: "Brazil", away: "Morocco" },
  { id: 7, date: "14.06.2026", time: "04:00", group: "C", home: "Haiti", away: "Scotland" },
  { id: 8, date: "14.06.2026", time: "07:00", group: "D", home: "Australia", away: "Turkey" },
  { id: 9, date: "14.06.2026", time: "20:00", group: "E", home: "Germany", away: "Curacao" },
  { id: 10, date: "14.06.2026", time: "23:00", group: "E", home: "Ivory Coast", away: "Ecuador" },
];
const groups = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia & Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curacao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
};

function getDirection(home, away) {
  if (home === "" || away === "") return "";
  if (Number(home) > Number(away)) return "home";
  if (Number(home) < Number(away)) return "away";
  return "draw";
}

function calculatePoints(prediction, result) {
  if (!prediction || !result) return 0;
if (
  prediction.home === "" ||
  prediction.home == null ||
  prediction.away === "" ||
  prediction.away == null ||
  result.home === "" ||
  result.home == null ||
  result.away === "" ||
  result.away == null
) {
  return 0;
}

  if (
    Number(prediction.home) === Number(result.home) &&
    Number(prediction.away) === Number(result.away)
  ) {
    return 4.5;
  }

  if (getDirection(prediction.home, prediction.away) === getDirection(result.home, result.away)) {
    return 2;
  }

  return 0;
}

export default function Home() {
 const [selectedPlayer, setSelectedPlayer] = useState("");
 const [openMatchId, setOpenMatchId] = useState(null);
  const [role, setRole] = useState("");
  const [dbPlayers, setDbPlayers] = useState([]);
  const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authUser, setAuthUser] = useState(null);
const [participantName, setParticipantName] = useState("");
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
 const activePlayers = dbPlayers.filter((player) => player.is_active);
 const loggedInPlayer = activePlayers.find(
  (player) => player.email === authUser?.email
);
useEffect(() => {
  async function loadSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setAuthUser(session?.user ?? null);
  }

  loadSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setAuthUser(session?.user ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
useEffect(() => {
  if (!authUser || dbPlayers.length === 0) return;

  const matchingPlayer = dbPlayers.find(
    (player) => player.email === authUser.email
  );

  if (matchingPlayer) {
    setSelectedPlayer(matchingPlayer.name);
    setRole(matchingPlayer.role || "player");
  }
}, [authUser, dbPlayers]);
      useEffect(() => {
  if (authUser) return;

  if (!selectedPlayer && activePlayers.length > 0) {
    setSelectedPlayer(activePlayers[0].name);
  }
}, [activePlayers, selectedPlayer, authUser]);

  useEffect(() => {
  async function loadPlayers() {
    
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading players:", error);
      return;
    }


    setDbPlayers(data);
  }
  async function loadPredictions() {
  const { data, error } = await supabase
    .from("predictions")
    .select("*");

  if (error) {
    console.error("Error loading predictions:", error);
    return;
  }
  

  const formatted = {};

  data.forEach((row) => {
    if (!formatted[row.player_name]) {
      formatted[row.player_name] = {};
    }

    formatted[row.player_name][row.match_id] = {
      home: row.home_score,
      away: row.away_score,
    };
  });

  setPredictions(formatted);
}
async function loadBonusPredictions() {
  const { data, error } = await supabase
    .from("bonus_predictions")
    .select("*");

  if (error) {
    console.error("Error loading bonus predictions:", error);
    return;
  }

  const formatted = {};

  data.forEach((row) => {
    formatted[row.player_name] = {
      champion: row.champion || "",
      topScorer: row.top_scorer || "",
      ...row.group_winners,
    };
  });

  setBonusPredictions(formatted);
}

async function loadResults() {
  const { data, error } = await supabase
    .from("match_results")
    .select("*");

  if (error) {
    console.error("Error loading match results:", error);
    return;
  }

  const formatted = {};

  data.forEach((row) => {
    formatted[row.match_id] = {
      home: row.home_score === null ? "" : row.home_score,
      away: row.away_score === null ? "" : row.away_score,
    };
  });

  setResults(formatted);
}
async function loadAppSettings() {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error loading app settings:", error);
    return;
  }

  setManuallyUnlockedMatches(data.manually_unlocked_matches || []);
  setBonusManuallyUnlocked(data.bonus_manually_unlocked || false);
  setGroupStageFinished(data.group_stage_finished || false);
  setOfficialBonus(
  data.official_bonus || {
    champion: "",
    topScorer: "",
  }
);
}
loadPlayers();
loadPredictions();
loadBonusPredictions();
loadResults();
loadAppSettings();
}, []);

  const [page, setPage] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentPage") || "matches";
  }

  return "matches";
});
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [bonusPredictions, setBonusPredictions] = useState({});
  const [officialBonus, setOfficialBonus] = useState({
  champion: "",
  topScorer: "",
});
const [groupStageFinished, setGroupStageFinished] = useState(false);
const [manuallyUnlockedMatches, setManuallyUnlockedMatches] = useState([]);
const [bonusManuallyUnlocked, setBonusManuallyUnlocked] = useState(false);
useEffect(() => {
  localStorage.setItem("currentPage", page);
}, [page]);
  async function updatePrediction(matchId, side, value) {

  const currentPrediction =
    predictions[selectedPlayer]?.[matchId] || {
      home: "",
      away: "",
    };

  const updatedPrediction = {
    ...currentPrediction,
    [side]: value,
  };

  setPredictions((prev) => ({
    ...prev,
    [selectedPlayer]: {
      ...(prev[selectedPlayer] || {}),
      [matchId]: updatedPrediction,
    },
  }));

 const { data, error } = await supabase
  .from("predictions")
  .upsert(
    [
      {
        player_name: selectedPlayer,
        match_id: matchId,
        home_score:
          updatedPrediction.home === ""
            ? null
            : Number(updatedPrediction.home),
        away_score:
          updatedPrediction.away === ""
            ? null
            : Number(updatedPrediction.away),
      },
    ],
    {
      onConflict: "player_name,match_id",
    }
  )
  .select();

if (error) {
  console.error("Error saving prediction:", error);
  showMessage("שגיאה בשמירת ההימור: " + error.message, "error");
  return;
}


showMessage("ההימור נשמר בהצלחה");
}

 async function updateResult(matchId, side, value) {
  if (role !== "admin") {
    alert("רק מנהל יכול לעדכן תוצאות");
    return;
  }

  setResults((prev) => ({
    ...prev,
    [matchId]: {
      ...(prev[matchId] || { home: "", away: "" }),
      [side]: value,
    },
  }));
  const updatedResult = {
  ...(results[matchId] || { home: "", away: "" }),
  [side]: value,
};

const { error } = await supabase
  .from("match_results")
  .upsert(
    [
      {
        match_id: matchId,
        home_score:
          updatedResult.home === "" ? null : Number(updatedResult.home),
        away_score:
          updatedResult.away === "" ? null : Number(updatedResult.away),
      },
    ],
    {
      onConflict: "match_id",
    }
  );

if (error) {
  console.error("Error saving match result:", error);
  showMessage("שגיאה בשמירת תוצאת המשחק", "error");
  return;
}

showMessage("תוצאת המשחק נשמרה בהצלחה");
}
 async function updateBonusQualifier(group, index, value) {

  const playerBonus = bonusPredictions[selectedPlayer] || {};
  const currentGroup = playerBonus[group] || ["", ""];

  const updatedGroup = [...currentGroup];
  updatedGroup[index] = value;

  const updatedBonus = {
    ...playerBonus,
    [group]: updatedGroup,
  };

  setBonusPredictions((prev) => ({
    ...prev,
    [selectedPlayer]: updatedBonus,
  }));

  const { champion, topScorer, ...groups } = updatedBonus;

  const { error } = await supabase
    .from("bonus_predictions")
    .upsert(
      [
        {
          player_name: selectedPlayer,
          champion: champion || null,
          top_scorer: topScorer || null,
          group_winners: groups,
        },
      ],
      {
        onConflict: "player_name",
      }
    );

  if (error) {
  console.error("Error saving bonus prediction:", error);
  showMessage("שגיאה בשמירת הבונוסים: " + error.message, "error");
  return;
}

showMessage("הבונוסים נשמרו בהצלחה");
}

async function updateSpecialBonus(field, value) {

  const playerBonus = bonusPredictions[selectedPlayer] || {};

  const updatedBonus = {
    ...playerBonus,
    [field]: value,
  };

  setBonusPredictions((prev) => ({
    ...prev,
    [selectedPlayer]: updatedBonus,
  }));

  const { champion, topScorer, ...groups } = updatedBonus;

  const { error } = await supabase
    .from("bonus_predictions")
    .upsert(
      [
        {
          player_name: selectedPlayer,
          champion: champion || null,
          top_scorer: topScorer || null,
          group_winners: groups,
        },
      ],
      {
        onConflict: "player_name",
      }
    );

  if (error) {
  console.error("Error saving special bonus:", error);
  showMessage("שגיאה בשמירת הבונוס: " + error.message, "error");
  return;
}

showMessage("הבונוס נשמר בהצלחה");
}
function calculateGroupTable(groupName, matches, groups, results) {
  const teams = groups[groupName];

  const table = teams.map((team) => ({
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  }));

  matches
    .filter((match) => match.group === groupName)
    .forEach((match) => {
      const result = results[match.id];

      if (
        !result ||
        result.home === "" ||
        result.away === ""
      ) {
        return;
      }

      const homeTeam = table.find((t) => t.team === match.home);
      const awayTeam = table.find((t) => t.team === match.away);

      const homeGoals = Number(result.home);
      const awayGoals = Number(result.away);

      homeTeam.played++;
      awayTeam.played++;

      homeTeam.gf += homeGoals;
      homeTeam.ga += awayGoals;

      awayTeam.gf += awayGoals;
      awayTeam.ga += homeGoals;

      if (homeGoals > awayGoals) {
        homeTeam.wins++;
        awayTeam.losses++;
        homeTeam.points += 3;
      } else if (homeGoals < awayGoals) {
        awayTeam.wins++;
        homeTeam.losses++;
        awayTeam.points += 3;
      } else {
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }

      homeTeam.gd = homeTeam.gf - homeTeam.ga;
      awayTeam.gd = awayTeam.gf - awayTeam.ga;
    });

  return table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}
function calculateBonusPoints(
  player,
  bonusPredictions,
  officialBonus,
  groupStageFinished,
  matches,
  groups,
  results
) {
  let total = 0;

  const playerBonus = bonusPredictions[player] || {};

  // עולות מהבתים
  if (groupStageFinished) {
    Object.keys(groups).forEach((groupName) => {
      const table = calculateGroupTable(
        groupName,
        matches,
        groups,
        results
      );

      const qualifiedTeams = table
        .slice(0, 2)
        .map((team) => team.team);

      const predictedTeams =
        playerBonus[groupName] || [];

      predictedTeams.forEach((team) => {
        if (qualifiedTeams.includes(team)) {
          total += 1;
        }
      });
    });
  }

  // אלופה
  if (
    playerBonus.champion &&
    playerBonus.champion === officialBonus.champion
  ) {
    total += 9;
  }

  // מלך שערים
 if (
  playerBonus.topScorer &&
  officialBonus.topScorer &&
  playerBonus.topScorer.toLowerCase() ===
    officialBonus.topScorer.toLowerCase()
) {
  total += 8;
}

  return total;
}
function calculateScoreBreakdown(
  player,
  predictions,
  results,
  matches,
  bonusPredictions,
  officialBonus,
  groupStageFinished,
  groups
) {
  let matchPoints = 0;
  let qualifiersPoints = 0;
  let championPoints = 0;
  let topScorerPoints = 0;
  let exactHits = 0;
let correctDirections = 0;

  matches.forEach((match) => {
  const prediction = predictions[player]?.[match.id];
  const result = results[match.id];

  const points = calculatePoints(prediction, result);
  matchPoints += points;

  if (points === 4.5) {
    exactHits += 1;
  } else if (points === 2) {
    correctDirections += 1;
  }
});

  const playerBonus = bonusPredictions[player] || {};

  if (groupStageFinished) {
    Object.keys(groups).forEach((groupName) => {
      const table = calculateGroupTable(groupName, matches, groups, results);
      const qualifiedTeams = table.slice(0, 2).map((team) => team.team);
      const predictedTeams = playerBonus[groupName] || [];

      predictedTeams.forEach((team) => {
        if (qualifiedTeams.includes(team)) {
          qualifiersPoints += 1;
        }
      });
    });
  }

  if (playerBonus.champion && playerBonus.champion === officialBonus.champion) {
    championPoints = 9;
  }

  if (
  playerBonus.topScorer &&
  officialBonus.topScorer &&
  playerBonus.topScorer.toLowerCase() === officialBonus.topScorer.toLowerCase()
) {
  topScorerPoints = 8;
}

  const total =
    matchPoints + qualifiersPoints + championPoints + topScorerPoints;

  return {
    matchPoints,
    qualifiersPoints,
    championPoints,
    topScorerPoints,
    exactHits,
correctDirections,
    total,
  };
}
function isMatchLocked(match, manuallyUnlockedMatches) {
  if (manuallyUnlockedMatches.includes(match.id)) {
    return false;
  }

  const [day, month, year] = match.date.split(".");
  const [hours, minutes] = match.time.split(":");

  const matchDateTime = new Date(
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+03:00`
);

  const lockTime = new Date(
    matchDateTime.getTime() - 5 * 60 * 1000
  );

  return new Date() >= lockTime;
}
function isBonusLocked(bonusManuallyUnlocked) {
  if (bonusManuallyUnlocked) {
    return false;
  }

  const bonusDeadline = new Date(2026, 5, 11, 17, 0);

  return new Date() >= bonusDeadline;
}
  const leaderboard = useMemo(() => {
  return activePlayers
  .map((playerObj) => {
    const player = playerObj.name;
      const breakdown = calculateScoreBreakdown(
        player,
        predictions,
        results,
        matches,
        bonusPredictions,
        officialBonus,
        groupStageFinished,
        groups
      );

      return {
        player,
        ...breakdown,
      };
    })
   .sort((a, b) => {
  if (b.total !== a.total) return b.total - a.total;
  if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
  if (b.correctDirections !== a.correctDirections) return b.correctDirections - a.correctDirections;

  const bonusA = a.qualifiersPoints + a.championPoints + a.topScorerPoints;
  const bonusB = b.qualifiersPoints + b.championPoints + b.topScorerPoints;

  if (bonusB !== bonusA) return bonusB - bonusA;
  if (b.championPoints !== a.championPoints) return b.championPoints - a.championPoints;
  if (b.topScorerPoints !== a.topScorerPoints) return b.topScorerPoints - a.topScorerPoints;

  return 0;
});
}, [
  activePlayers,
  predictions,
  results,
  matches,
  bonusPredictions,
  officialBonus,
  groupStageFinished,
  groups,
]);
async function signUp() {
  const existingPlayer = dbPlayers.find(
    (player) => player.email === authEmail
  );

  if (existingPlayer) {
    showMessage("המייל כבר קיים במערכת", "error");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: authEmail,
    password: authPassword,
  });

  if (error) {
    console.error("Signup error:", error);
    showMessage("שגיאה: " + error.message, "error");
    return;
  }

  const { error: playerError } = await supabase.from("players").insert([
    {
      name: participantName,
      email: authEmail,
      role: "player",
      is_active: true,
    },
  ]);

  if (playerError) {
    console.error("Player insert error:", playerError);
    showMessage("המשתמש נרשם, אבל הייתה שגיאה בהוספה לטבלת המשתתפים", "error");
    return;
  }

  


showMessage("נרשמת בהצלחה");
}

async function signIn() {
  

  const { data, error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password: authPassword,
  });

  

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  setAuthUser(data.user);

  const matchingPlayer = dbPlayers.find(
    (player) => player.email === data.user.email
  );

  if (matchingPlayer) {
    setSelectedPlayer(matchingPlayer.name);
    setRole(matchingPlayer.role || "player");
  }

  showMessage("התחברת בהצלחה");
}

async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Signout error:", error);
    showMessage("שגיאה בהתנתקות: " + error.message, "error");
    return;
  }

  setAuthUser(null);
  setRole("");
  setSelectedPlayer("");
  showMessage("התנתקת בהצלחה");
}
function showMessage(text, type = "success") {
  setMessage(text);
  setMessageType(type);

  setTimeout(() => {
    setMessage("");
    setMessageType("");
  }, 3000);
}
async function saveAppSettings(updatedMatches, updatedBonus, updatedGroupStage) {
  const { error } = await supabase
    .from("app_settings")
    .update({
      manually_unlocked_matches: updatedMatches,
      bonus_manually_unlocked: updatedBonus,
      group_stage_finished: updatedGroupStage,
    })
    .eq("id", 1);

  if (error) {
  console.error("Error saving app settings:", error);
  showMessage("שגיאה בשמירת הגדרות הניהול: " + error.message, "error");
  return false;
}

showMessage("הגדרות הניהול נשמרו בהצלחה");
return true;
}
  return (
    
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white p-2 md:p-8 text-xs md:text-base">
      {message && (
  <div
    className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl font-black shadow-2xl ${
      messageType === "error"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-black"
    }`}
  >
    {message}
  </div>
)}
      <div className="max-w-7xl mx-auto">
       <header className="mb-4 bg-gradient-to-l from-yellow-400 to-sky-400 text-slate-950 rounded-3xl p-4 md:p-6">
         <h1 className="text-2xl md:text-5xl font-black mb-2">
            World Cup Predictor 2026
          </h1>
          <p className="font-bold">
          מערכת ניחושים למונדיאל 2026 - משחקים, בונוסים, טבלאות ודירוג.
          </p>
        </header>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6">
  <div className="text-xl font-black mb-4">
    התחברות
  </div>
  {!authUser && (
  <div className="text-center text-slate-300 mb-4 font-bold">
    יש להתחבר כדי לצפות ולהשתתף בהימורים
  </div>
)}

  <div className="flex flex-col gap-3 max-w-md">
    <input
  type="text"
  placeholder="שם המשתתף"
  value={participantName}
  onChange={(e) => setParticipantName(e.target.value)}
  className="bg-slate-800 rounded-xl p-3"
/>
    <input
      type="email"
      placeholder="אימייל"
      value={authEmail}
      onChange={(e) => setAuthEmail(e.target.value)}
      className="bg-slate-800 rounded-xl p-3"
    />

    <input
      type="password"
      placeholder="סיסמה"
      value={authPassword}
      onChange={(e) => setAuthPassword(e.target.value)}
      className="bg-slate-800 rounded-xl p-3"
    />

    <div className="flex gap-3">
  {!authUser ? (
    <>
      <button
        onClick={signUp}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-black"
      >
        הרשמה
      </button>

      <button
        onClick={signIn}
        className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-xl font-black"
      >
        התחברות
      </button>
    </>
  ) : (
    <button
      onClick={signOut}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-black"
    >
      התנתקות
    </button>
  )}
</div>

    {authUser && (
      <div className="text-green-400 font-black">
        מחובר: {authUser.email}
      </div>
    )}
  </div>
</div>

<div className={authUser ? "" : "hidden"}>

        <section className="mb-6 bg-slate-900 border border-slate-800 rounded-3xl p-4">
          {role === "admin" && (
  <>
    <label className="block mb-2 font-bold">
      בחר משתתף לבדיקה:
    </label>

    <select
      value={selectedPlayer}
      onChange={(e) => setSelectedPlayer(e.target.value)}
      className="w-full md:w-80 bg-slate-800 border border-slate-700 rounded-xl p-3 font-bold"
    >
     {(role === "admin"
  ? activePlayers
  : loggedInPlayer
  ? [loggedInPlayer]
  : []
).map((player) => (
  <option key={player.id} value={player.name}>
    {player.name}
  </option>
))}
    </select>
    {role === "admin" &&
  loggedInPlayer &&
  selectedPlayer &&
  selectedPlayer !== loggedInPlayer.name && (
    <div className="mt-3 bg-red-500 text-white px-4 py-3 rounded-2xl font-black">
      מצב מנהל: אתה עורך כרגע את ההימורים של {selectedPlayer}
    </div>
)}
  </>
)}


<div className="mt-3 text-yellow-400 font-black">
  מצב נוכחי: {role}
</div>
{authUser && loggedInPlayer && (
  <div className="mt-2 text-green-400 font-black">
    מחובר כמשתתף: {loggedInPlayer.name}
  </div>
)}
<div className="mt-2 font-black text-white-900">
  משתתפים מהענן: {dbPlayers.map((p) => p.name).join(", ")}
</div>

</section>

        <nav className="mb-6 flex gap-3 overflow-x-auto">
          <button
          
            onClick={() => setPage("matches")}
            className={`px-5 py-3 rounded-xl font-bold ${
              page === "matches" ? "bg-yellow-400 text-slate-950" : "bg-slate-800"
            }`}
          >
            הימורי משחקים
          </button>
          <button
  onClick={() => setPage("bonus")}
  className={`px-5 py-3 rounded-xl font-bold ${
    page === "bonus"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800"
  }`}
>
  הימורי בונוס
</button>
<button
  onClick={() => setPage("bonusAll")}
  className={`px-5 py-3 rounded-xl font-bold ${
    page === "bonusAll"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800"
  }`}
>
  כל הימורי הבונוס
</button>

          {role === "admin" && (
  <button
    onClick={() => setPage("admin")}
    className={`px-5 py-3 rounded-xl font-bold ${
      page === "admin"
        ? "bg-yellow-400 text-slate-950"
        : "bg-slate-800"
    }`}
  >
    ניהול תוצאות
  </button>
)}
<button
  onClick={() => setPage("leaderboard")}
  className={`px-5 py-3 rounded-xl font-bold ${
    page === "leaderboard" ? "bg-yellow-400 text-slate-950" : "bg-slate-800"
  }`}
>
  טבלת דירוג
</button>
<button
  onClick={() => setPage("groups")}
  className={`px-5 py-3 rounded-xl font-bold ${
    page === "groups"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800"
  }`}
>
  טבלאות בתים
</button>

<button
  onClick={() => setPage("all")}
  className={`px-5 py-3 rounded-xl font-bold ${
    page === "all"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800"
  }`}
>
  כל ההימורים
</button>

          <button
            onClick={() => setPage("rules")}
            className={`px-5 py-3 rounded-xl font-bold ${
              page === "rules" ? "bg-yellow-400 text-slate-950" : "bg-slate-800"
            }`}
          >
            חוקים
          </button>
        </nav>

        {page === "matches" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-4">
              הימורי משחקים - {selectedPlayer}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 text-sm">
                    <th className="text-right p-2">מס'</th>
                    <th className="text-right p-2">תאריך</th>
                    <th className="text-right p-2">שעה</th>
                    <th className="text-right p-2">בית</th>
                   <th className="sticky right-0 z-30 bg-slate-900 text-right p-2 border-l border-slate-700 w-[170px] min-w-[170px] max-w-[170px]">
  משחק
</th>
                    <th className="text-center p-2">הימור</th>
                    <th className="text-center p-2">תוצאה</th>
                    <th className="text-center p-2">סטטוס</th>
                    <th className="text-center p-2">ניקוד</th>
                  </tr>
                </thead>

                <tbody>
                  {matches.map((match) => {
                    const prediction =
                      predictions[selectedPlayer]?.[match.id] || { home: "", away: "" };
                    const result = results[match.id] || { home: "", away: "" };
                    const points = calculatePoints(prediction, result);

                    return (
                      <tr key={match.id} className="bg-slate-800">
                        <td className="p-3 rounded-r-xl font-bold">{match.id}</td>
                        <td className="p-3">{match.date}</td>
                        <td className="p-3">{match.time}</td>
                        <td className="p-3">{match.group}</td>
                        <td className="sticky right-0 z-20 bg-slate-800 p-3 font-bold border-l border-slate-700 w-[170px] min-w-[170px] max-w-[170px]">
  {match.home} נגד {match.away}
</td>
                        <td className="p-3">
                          <div className="flex justify-center items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={prediction.home ?? ""}
                              disabled={isMatchLocked(match, manuallyUnlockedMatches)}
                              onChange={(e) =>
                                updatePrediction(match.id, "home", e.target.value)
                              }
                              className="w-14 bg-slate-700 rounded-xl p-2 text-center"
                            />
                            <span>:</span>
                            <input
                              type="number"
                              min="0"
                              value={prediction.away ?? ""}
                              disabled={isMatchLocked(match, manuallyUnlockedMatches)}
                              onChange={(e) =>
                                updatePrediction(match.id, "away", e.target.value)
                              }
                              className="w-14 bg-slate-700 rounded-xl p-2 text-center"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {result.home !== "" && result.away !== "" ? (
  <span>{result.away}:{result.home}</span>
) : (
  "-"
)}
                        </td>
                        <td className="p-3 text-center">
  {isMatchLocked(match, manuallyUnlockedMatches) ? (
    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black">
      נעול
    </span>
  ) : (
    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-black">
      פתוח
    </span>
  )}
</td>
                        <td className="p-3 rounded-l-xl text-center text-yellow-400 font-black">
                          {points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
                {page === "bonus" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-2">
              הימורי בונוס - {selectedPlayer}
            </h2>

            <p className="text-slate-400 mb-6">
              בכל בית יש לבחור בדיוק 2 עולות מתוך 4 הקבוצות באותו בית.
            </p>
            <div
  className={`mb-6 rounded-2xl p-4 font-black ${
    isBonusLocked(bonusManuallyUnlocked)
      ? "bg-red-500 text-white"
      : "bg-green-500 text-black"
  }`}
>
  {isBonusLocked(bonusManuallyUnlocked)
    ? "הימורי הבונוס נעולים"
    : "הימורי הבונוס פתוחים עד 11.06.2026 בשעה 17:00"}
</div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(groups).map(([groupName, teams]) => {
                const playerBonus = bonusPredictions[selectedPlayer] || {};
                const selectedGroup = playerBonus[groupName] || ["", ""];

                return (
                  <div
                    key={groupName}
                    className="bg-slate-800 rounded-3xl p-4 border border-slate-700"
                  >
                    <h3 className="text-xl font-black mb-4">
                      בית {groupName}
                    </h3>

                    <div className="space-y-3">
                      <select
                        value={selectedGroup[0]}
                        disabled={isBonusLocked(bonusManuallyUnlocked)}
                        onChange={(e) =>
                          updateBonusQualifier(groupName, 0, e.target.value)
                        }
                        className="w-full bg-slate-700 rounded-xl p-3 font-bold"
                      >
                        <option value="">בחר עולה ראשונה</option>
                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedGroup[1]}
                        disabled={isBonusLocked(bonusManuallyUnlocked)}
                        onChange={(e) =>
                          updateBonusQualifier(groupName, 1, e.target.value)
                        }
                        className="w-full bg-slate-700 rounded-xl p-3 font-bold"
                      >
                        <option value="">בחר עולה שנייה</option>
                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700">
                <h3 className="text-xl font-black mb-3">
                  ניחוש אלופה - 9 נק'
                </h3>

                <select
                  value={(bonusPredictions[selectedPlayer] || {}).champion || ""}
                  disabled={isBonusLocked(bonusManuallyUnlocked)}
                  onChange={(e) => updateSpecialBonus("champion", e.target.value)}
                  className="w-full bg-slate-700 rounded-xl p-3 font-bold"
                >
                  <option value="">בחר אלופה</option>
                  {Object.values(groups).flat().map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700">
                <h3 className="text-xl font-black mb-3">
                  ניחוש מלך שערים - 8 נק'
                </h3>

                <input
                  type="text"
                  value={(bonusPredictions[selectedPlayer] || {}).topScorer || ""}
                  disabled={isBonusLocked(bonusManuallyUnlocked)}
                  onChange={(e) => updateSpecialBonus("topScorer", e.target.value)}
                  placeholder="שם השחקן"
                  className="w-full bg-slate-700 rounded-xl p-3 font-bold"
                />
              </div>
            </div>
          </section>
        )}
                {page === "bonusAll" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-6">
              כל הימורי הבונוס
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="border-collapse table-fixed w-auto">
                <colgroup>
  <col style={{ width: "110px" }} />
  {activePlayers.map((player) => (
    <col key={player.id} style={{ width: "80px" }} />
  ))}
</colgroup>
                <thead>
                  <tr className="bg-slate-950 text-slate-300 sticky top-0 z-20">
                    <th className="sticky right-0 bg-slate-950 z-30 p-3 text-right border-l border-slate-800 min-w-[180px]">
                      קטגוריה
                    </th>

                    {activePlayers.map((player) => (
  <th
    key={player.id}
    className="p-3 text-center border-l border-slate-800 min-w-[140px]"
  >
    {player.name}
  </th>
))}
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(groups).map((groupName) => (
  <Fragment key={groupName}>
    <tr className="border-t border-slate-800">
      <td className="sticky right-0 bg-slate-900 z-10 p-3 border-l border-slate-800 font-black">
        בית {groupName} - עולה 1
      </td>

      {activePlayers.map((player) => (
        <td
          key={player.id}
          className="p-3 text-center border-l border-slate-800 font-bold"
        >
          {(bonusPredictions[player.name]?.[groupName] || ["", ""])[0] || "-"}
        </td>
      ))}
    </tr>

    <tr className="border-t border-slate-800">
      <td className="sticky right-0 bg-slate-900 z-10 p-3 border-l border-slate-800 font-black">
        בית {groupName} - עולה 2
      </td>

      {activePlayers.map((player) => (
        <td
          key={player.id}
          className="p-3 text-center border-l border-slate-800 font-bold"
        >
          {(bonusPredictions[player.name]?.[groupName] || ["", ""])[1] || "-"}
        </td>
      ))}
    </tr>
  </Fragment>
))}

                  <tr className="border-t border-slate-800 bg-slate-800">
                    <td className="sticky right-0 bg-slate-800 z-10 p-3 border-l border-slate-800 font-black text-yellow-400">
                      אלופה
                    </td>

                    {activePlayers.map((player) => (
  <td
    key={player.id}
    className="p-3 text-center border-l border-slate-800 font-bold"
  >
    {bonusPredictions[player.name]?.champion || "-"}
  </td>
))}
                  </tr>

                  <tr className="border-t border-slate-800 bg-slate-800">
                    <td className="sticky right-0 bg-slate-800 z-10 p-3 border-l border-slate-800 font-black text-sky-400">
                      מלך שערים
                    </td>

                    {activePlayers.map((player) => (
  <td
    key={player.id}
    className="p-3 text-center border-l border-slate-800 font-bold"
  >
    {bonusPredictions[player.name]?.topScorer || "-"}
  </td>
))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === "admin" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-4">ניהול תוצאות אמת</h2>
            <p className="text-slate-400 mb-4">
              כאן המנהל מזין את תוצאת המשחק בפועל. בשלב נוקאאוט מזינים תוצאת 90 דקות בלבד.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
  <div className="bg-slate-800 rounded-2xl p-4">
    <label className="block mb-2 font-black">
      אלופה בפועל
    </label>

    <select
  value={officialBonus.champion}
  onChange={async (e) => {
  const updatedOfficialBonus = {
    ...officialBonus,
    champion: e.target.value,
  };

  setOfficialBonus(updatedOfficialBonus);

  const { error } = await supabase
    .from("app_settings")
    .update({
      official_bonus: updatedOfficialBonus,
    })
    .eq("id", 1);

  if (error) {
    console.error("Error saving official bonus:", error);
  }
}}
      className="w-full bg-slate-700 rounded-xl p-3 font-bold"
    >
      <option value="">בחר אלופה</option>
      {Object.values(groups).flat().map((team) => (
        <option key={team} value={team}>
          {team}
        </option>
      ))}
    </select>
  </div>

  <div className="bg-slate-800 rounded-2xl p-4">
    <label className="block mb-2 font-black">
      מלך שערים בפועל
    </label>

    <input
      type="text"
      value={officialBonus.topScorer}
      onChange={async (e) => {
  const updatedOfficialBonus = {
    ...officialBonus,
    topScorer: e.target.value,
  };

  setOfficialBonus(updatedOfficialBonus);

  const { error } = await supabase
    .from("app_settings")
    .update({
      official_bonus: updatedOfficialBonus,
    })
    .eq("id", 1);

  if (error) {
    console.error("Error saving official bonus:", error);
  }
}}
      placeholder="שם השחקן"
      className="w-full bg-slate-700 rounded-xl p-3 font-bold"
    />
  </div>
</div>
<div className="mb-6">
  <button
    onClick={() => {
  const updatedGroupStage = !groupStageFinished;

  setGroupStageFinished(updatedGroupStage);

  saveAppSettings(
    manuallyUnlockedMatches,
    bonusManuallyUnlocked,
    updatedGroupStage
  );
}}
    className={`px-6 py-3 rounded-2xl font-black ${
      groupStageFinished
        ? "bg-green-500 text-black"
        : "bg-slate-700 text-white"
    }`}
  >
    {groupStageFinished
      ? "שלב הבתים הסתיים ✓"
      : "חשב ניקוד עולות"}
  </button>
</div>
<div className="mb-6">
  <button
    onClick={() => {
  const updatedBonus = !bonusManuallyUnlocked;

  setBonusManuallyUnlocked(updatedBonus);

  saveAppSettings(
    manuallyUnlockedMatches,
    updatedBonus,
    groupStageFinished
  );
}}
    className={`px-6 py-3 rounded-2xl font-black ${
      bonusManuallyUnlocked
        ? "bg-green-500 text-black"
        : "bg-slate-700 text-white"
    }`}
  >
    {bonusManuallyUnlocked
      ? "הימורי בונוס פתוחים ידנית"
      : "פתח הימורי בונוס ידנית"}
  </button>
</div>

            <div className="space-y-3">
              {matches.map((match) => {
                const result = results[match.id] || { home: "", away: "" };

                return (
                  <div
                    key={match.id}
                    className="bg-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="font-black">
                        {match.home} נגד {match.away}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {match.date} | {match.time} | בית {match.group}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={result.home}
                        onChange={(e) =>
                          updateResult(match.id, "home", e.target.value)
                        }
                        className="w-16 bg-slate-700 rounded-xl p-2 text-center"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        min="0"
                        value={result.away}
                        onChange={(e) =>
                          updateResult(match.id, "away", e.target.value)
                        }
                        className="w-16 bg-slate-700 rounded-xl p-2 text-center"
                      />
                    </div>
                    <button
  onClick={() => {
  let updatedMatches;

  if (manuallyUnlockedMatches.includes(match.id)) {
    updatedMatches = manuallyUnlockedMatches.filter((id) => id !== match.id);
  } else {
    updatedMatches = [...manuallyUnlockedMatches, match.id];
  }

  setManuallyUnlockedMatches(updatedMatches);

  saveAppSettings(
    updatedMatches,
    bonusManuallyUnlocked,
    groupStageFinished
  );
}}
  className={`px-4 py-2 rounded-xl font-black ${
    manuallyUnlockedMatches.includes(match.id)
      ? "bg-green-500 text-black"
      : "bg-slate-700 text-white"
  }`}
>
  {manuallyUnlockedMatches.includes(match.id)
    ? "פתוח ידנית"
    : "פתח ידנית"}
</button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {page === "leaderboard" && (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
    <h2 className="text-2xl font-black mb-4">טבלת דירוג</h2>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-slate-400 text-sm">
            <th className="text-right p-2">מיקום</th>
            <th className="text-right p-2">משתתף</th>
            <th className="text-center p-2">נק׳ משחקים</th>
            <th className="text-center p-2">נק׳ עולות</th>
            <th className="text-center p-2">אלופה</th>
            <th className="text-center p-2">מלך שערים</th>
            <th className="text-center p-2">סה״כ</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((row, index) => (
            <tr key={row.player} className="bg-slate-800">
              <td className="p-3 rounded-r-xl font-black">
                {index + 1}
              </td>

              <td className="p-3 font-black">
                {row.player}
              </td>

              <td className="p-3 text-center">
                {row.matchPoints}
              </td>

              <td className="p-3 text-center">
                {row.qualifiersPoints}
              </td>

              <td className="p-3 text-center">
                {row.championPoints}
              </td>

              <td className="p-3 text-center">
                {row.topScorerPoints}
              </td>

              <td className="p-3 rounded-l-xl text-center text-yellow-400 font-black text-xl">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}
                        {page === "all" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-2 md:p-4">
            <h2 className="text-2xl font-black mb-4">כל ההימורים</h2>

            <div className="hidden md:block overflow-auto max-h-[75vh] rounded-2xl border border-slate-800 text-xs md:text-sm">
              <table className="border-collapse min-w-max">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 text-xs md:text-sm sticky top-0 z-20">
                    <th className="sticky right-0 z-30 bg-slate-950 text-right p-3 border-l border-slate-800 w-[170px] md:w-[240px]">
  משחק
</th>

                    {activePlayers.map((player) => {
  let total = 0;

  matches.forEach((match) => {
    total += calculatePoints(
      predictions[player.name]?.[match.id],
      results[match.id]
    );
  });

  return (
    <th
     key={player.id}
      className="p-1 md:p-2 text-center border-l border-slate-800 w-[62px] min-w-[62px] max-w-[62px] md:w-[85px] md:min-w-[85px] md:max-w-[85px]"
    >
      <div className="font-black">
        {player.name}
      </div>

      <div className="text-yellow-400 text-sm font-black mt-1">
        {total} נק'
      </div>
    </th>
  );
})}

                   
                  </tr>
                </thead>

                <tbody>
                  {matches.map((match) => {
                    const result =
                      results[match.id] || {
                        home: "",
                        away: "",
                      };

                    return (
                      <tr key={match.id} className="border-t border-slate-800">
                        <td className="sticky right-0 z-10 bg-slate-900 p-3 border-l border-slate-800 w-[170px] min-w-[170px] max-w-[170px] md:w-[240px] md:min-w-[240px] md:max-w-[240px]">
                          <div className="font-black">
                            {match.home} נגד {match.away}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {match.date} | {match.time} | בית {match.group}
                          </div>
                          <div className="text-green-400 text-sm font-black mt-1">
  תוצאת אמת:{" "}
  {result.home !== "" &&
  result.home != null &&
  result.away !== "" &&
  result.away != null
    ? `${result.home} : ${result.away}`
    : "-"}
</div>
                        </td>

                       {activePlayers.map((player) => {
  const prediction =
    predictions[player.name]?.[match.id] || {
      home: "",
      away: "",
    };

  const points = calculatePoints(
    prediction,
    result
  );

                          return (
                            <td
                              key={player}
                             className="p-1 md:p-3 text-center border-l border-slate-800"
                            >
                              <div className="font-bold">
                                {prediction.home !== "" && prediction.away !== "" ? (
  <span className="inline-flex items-center gap-1" dir="rtl">
    <span>{prediction.home}</span>
    <span>:</span>
    <span>{prediction.away}</span>
  </span>
) : (
  "-"
)}
                              </div>

                              <div className="text-yellow-400 text-sm font-black">
                                {points} נק'
                              </div>
                            </td>
                          );
                        })}

                        
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-4">
  {matches.map((match) => {
    const result = results[match.id];

    return (
      <div
        key={match.id}
        className="bg-slate-950 border border-slate-800 rounded-2xl p-3"
      >
        <div className="mb-3">
          <div className="font-black text-base text-white mb-1">
            {match.home} - {match.away}
          </div>

          <div className="text-slate-400 text-xs">
            {match.date} | {match.time} | {match.group}
          </div>

          <div className="mt-2 text-sm font-bold text-yellow-300">
            תוצאת אמת:{" "}
           {result
  ? `${result.home} - ${result.away}`
  : "טרם עודכן"}
          </div>
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
  {(openMatchId === match.id
    ? activePlayers
    : activePlayers.slice(0, 4)
  ).map((player) => {
            const prediction = predictions[player.name]?.[match.id];

            const points =
              prediction && result
                ? calculatePoints(prediction, result)
                : 0;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 bg-slate-900 rounded-xl p-2 border border-slate-800"
              >
                <div className="font-bold text-slate-100 truncate">
                  {player.name}
                </div>

                <div className="text-center text-slate-300 text-sm">
                  {prediction &&
 prediction.home !== null &&
 prediction.away !== null &&
 prediction.home !== "" &&
 prediction.away !== ""
  ? `${prediction.home} - ${prediction.away}`
  : "-"}
                </div>

                <div className="font-black text-sky-300 min-w-[45px] text-left">
                  {points} נק׳
                </div>
              </div>
            );
          })}
               </div>

        {activePlayers.length > 4 && (
          <button
            onClick={() =>
              setOpenMatchId(openMatchId === match.id ? null : match.id)
            }
            className="w-full mt-2 text-sm text-sky-400 font-bold"
          >
            {openMatchId === match.id
              ? "הסתר"
              : `הצג עוד ${activePlayers.length - 4} משתתפים`}
          </button>
        )}
      </div>
    );
  })}
</div>
          </section>
        )}
        {page === "groups" && (
          <section className="space-y-6">
            <h2 className="text-3xl font-black">
              טבלאות בתים
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Object.keys(groups).map((groupName) => {
                const table = calculateGroupTable(
                  groupName,
                  matches,
                  groups,
                  results
                );

                return (
                  <div
                    key={groupName}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-4"
                  >
                    <h3 className="text-2xl font-black mb-4">
                      בית {groupName}
                    </h3>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-700">
                          <th className="text-right py-2">#</th>
                          <th className="text-right py-2">נבחרת</th>
                          <th className="text-center py-2">מש'</th>
                          <th className="text-center py-2">ז'</th>
                          <th className="text-center py-2">ת'</th>
                          <th className="text-center py-2">ה'</th>
                          <th className="text-center py-2">הפ'</th>
                          <th className="text-center py-2">נק'</th>
                        </tr>
                      </thead>

                      <tbody>
                        {table.map((team, index) => (
                          <tr
                            key={team.team}
                            className={`border-t border-slate-800 ${
                              index < 2 ? "bg-slate-800" : ""
                            }`}
                          >
                            <td className="py-3 font-black">
                              {index + 1}
                            </td>

                            <td className="py-3 font-bold">
                              {team.team}
                            </td>

                            <td className="text-center">
                              {team.played}
                            </td>

                            <td className="text-center">
                              {team.gf}
                            </td>

                            <td className="text-center">
                              {team.ga}
                            </td>

                            <td className="text-center">
                              {team.gd}
                            </td>

                            <td className="text-center">
                              {team.wins}
                            </td>

                            <td className="text-center font-black text-yellow-400">
                              {team.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {page === "rules" && (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
    <h2 className="text-2xl font-black mb-4">חוקי המשחק</h2>

    <div className="space-y-3 font-bold">
      <div className="bg-slate-800 rounded-2xl p-4">בול פגיעה - 4.5 נק'</div>
      <div className="bg-slate-800 rounded-2xl p-4">ניחוש ניצחון/תיקו - 2 נק'</div>
      <div className="bg-slate-800 rounded-2xl p-4">
        ניחוש 2 עולות מכל בית - על כל ניחוש נק' אחת
      </div>
      <div className="bg-slate-800 rounded-2xl p-4">ניחוש אלופה - 9 נק'</div>
      <div className="bg-slate-800 rounded-2xl p-4">ניחוש מלך שערים - 8 נק'</div>
    </div>

    <h3 className="text-xl font-black mt-8 mb-4">שוברי שיוויון</h3>

    <ol className="space-y-3 list-decimal pr-6 font-bold">
      <li>מספר ניחושי בול פגיעה</li>
      <li>מספר ניחושי ניצחון/תיקו</li>
      <li>סך הנקודות מהימורי בונוס</li>
      <li>ניחוש נכון של אלופה</li>
      <li>ניחוש נכון של מלך שערים</li>
      <li>במידה ועדיין קיים שוויון - חלוקת המקום</li>
    </ol>
  </section>
)}
</div>
</div>
</main>
);
}