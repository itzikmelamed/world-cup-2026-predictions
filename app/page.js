"use client";
import { Fragment } from "react";

import { useMemo, useState, useRef } from "react";
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
  { id: 1, date: "11.06.2026", time: "22:00", stage: "בתים", group: "A", home: "Mexico", away: "South Africa" },
  { id: 2, date: "12.06.2026", time: "05:00", stage: "בתים", group: "A", home: "South Korea", away: "Czech Republic" },
  { id: 3, date: "12.06.2026", time: "22:00", stage: "בתים", group: "B", home: "Canada", away: "Bosnia & Herzegovina" },
  { id: 4, date: "13.06.2026", time: "04:00", stage: "בתים", group: "D", home: "USA", away: "Paraguay" },
  { id: 5, date: "13.06.2026", time: "22:00", stage: "בתים", group: "B", home: "Qatar", away: "Switzerland" },
  { id: 6, date: "14.06.2026", time: "01:00", stage: "בתים", group: "C", home: "Brazil", away: "Morocco" },
  { id: 7, date: "14.06.2026", time: "04:00", stage: "בתים", group: "C", home: "Haiti", away: "Scotland" },
  { id: 8, date: "14.06.2026", time: "07:00", stage: "בתים", group: "D", home: "Australia", away: "Turkey" },
  { id: 9, date: "14.06.2026", time: "20:00", stage: "בתים", group: "E", home: "Germany", away: "Curacao" },
  { id: 10, date: "14.06.2026", time: "23:00", stage: "בתים", group: "F", home: "Netherlands", away: "Japan" },
  { id: 11, date: "15.06.2026", time: "02:00", stage: "בתים", group: "E", home: "Ivory Coast", away: "Ecuador" },
  { id: 12, date: "15.06.2026", time: "05:00", stage: "בתים", group: "F", home: "Sweden", away: "Tunisia" },
  { id: 13, date: "15.06.2026", time: "19:00", stage: "בתים", group: "H", home: "Spain", away: "Cape Verde" },
  { id: 14, date: "15.06.2026", time: "22:00", stage: "בתים", group: "G", home: "Belgium", away: "Egypt" },
  { id: 15, date: "16.06.2026", time: "01:00", stage: "בתים", group: "H", home: "Saudi Arabia", away: "Uruguay" },
  { id: 16, date: "16.06.2026", time: "04:00", stage: "בתים", group: "G", home: "Iran", away: "New Zealand" },
  { id: 17, date: "16.06.2026", time: "22:00", stage: "בתים", group: "I", home: "France", away: "Senegal" },
  { id: 18, date: "17.06.2026", time: "01:00", stage: "בתים", group: "I", home: "Iraq", away: "Norway" },
  { id: 19, date: "17.06.2026", time: "04:00", stage: "בתים", group: "J", home: "Argentina", away: "Algeria" },
  { id: 20, date: "17.06.2026", time: "07:00", stage: "בתים", group: "J", home: "Austria", away: "Jordan" },
  { id: 21, date: "17.06.2026", time: "20:00", stage: "בתים", group: "K", home: "Portugal", away: "DR Congo" },
  { id: 22, date: "17.06.2026", time: "23:00", stage: "בתים", group: "L", home: "England", away: "Croatia" },
  { id: 23, date: "18.06.2026", time: "02:00", stage: "בתים", group: "L", home: "Ghana", away: "Panama" },
  { id: 24, date: "18.06.2026", time: "05:00", stage: "בתים", group: "K", home: "Uzbekistan", away: "Colombia" },
  { id: 25, date: "18.06.2026", time: "19:00", stage: "בתים", group: "A", home: "Czech Republic", away: "South Africa" },
  { id: 26, date: "18.06.2026", time: "22:00", stage: "בתים", group: "B", home: "Switzerland", away: "Bosnia & Herzegovina" },
  { id: 27, date: "19.06.2026", time: "01:00", stage: "בתים", group: "B", home: "Canada", away: "Qatar" },
  { id: 28, date: "19.06.2026", time: "04:00", stage: "בתים", group: "A", home: "Mexico", away: "South Korea" },
  { id: 29, date: "19.06.2026", time: "22:00", stage: "בתים", group: "D", home: "USA", away: "Australia" },
  { id: 30, date: "20.06.2026", time: "01:00", stage: "בתים", group: "C", home: "Scotland", away: "Morocco" },
  { id: 31, date: "20.06.2026", time: "03:30", stage: "בתים", group: "C", home: "Brazil", away: "Haiti" },
  { id: 32, date: "20.06.2026", time: "06:00", stage: "בתים", group: "D", home: "Turkey", away: "Paraguay" },
  { id: 33, date: "20.06.2026", time: "20:00", stage: "בתים", group: "F", home: "Netherlands", away: "Sweden" },
  { id: 34, date: "20.06.2026", time: "23:00", stage: "בתים", group: "E", home: "Germany", away: "Ivory Coast" },
  { id: 35, date: "21.06.2026", time: "03:00", stage: "בתים", group: "E", home: "Ecuador", away: "Curacao" },
  { id: 36, date: "21.06.2026", time: "07:00", stage: "בתים", group: "F", home: "Tunisia", away: "Japan" },
  { id: 37, date: "21.06.2026", time: "19:00", stage: "בתים", group: "H", home: "Spain", away: "Saudi Arabia" },
  { id: 38, date: "21.06.2026", time: "22:00", stage: "בתים", group: "G", home: "Belgium", away: "Iran" },
  { id: 39, date: "22.06.2026", time: "01:00", stage: "בתים", group: "H", home: "Uruguay", away: "Cape Verde" },
  { id: 40, date: "22.06.2026", time: "04:00", stage: "בתים", group: "G", home: "New Zealand", away: "Egypt" },
  { id: 41, date: "22.06.2026", time: "20:00", stage: "בתים", group: "J", home: "Argentina", away: "Austria" },
  { id: 42, date: "23.06.2026", time: "00:00", stage: "בתים", group: "I", home: "France", away: "Iraq" },
  { id: 43, date: "23.06.2026", time: "03:00", stage: "בתים", group: "I", home: "Norway", away: "Senegal" },
  { id: 44, date: "23.06.2026", time: "06:00", stage: "בתים", group: "J", home: "Jordan", away: "Algeria" },
  { id: 45, date: "23.06.2026", time: "20:00", stage: "בתים", group: "K", home: "Portugal", away: "Uzbekistan" },
  { id: 46, date: "23.06.2026", time: "23:00", stage: "בתים", group: "L", home: "England", away: "Ghana" },
  { id: 47, date: "24.06.2026", time: "02:00", stage: "בתים", group: "L", home: "Panama", away: "Croatia" },
  { id: 48, date: "24.06.2026", time: "05:00", stage: "בתים", group: "K", home: "Colombia", away: "DR Congo" },
  { id: 49, date: "24.06.2026", time: "22:00", stage: "בתים", group: "B", home: "Switzerland", away: "Canada" },
  { id: 50, date: "24.06.2026", time: "22:00", stage: "בתים", group: "B", home: "Bosnia & Herzegovina", away: "Qatar" },
  { id: 51, date: "25.06.2026", time: "01:00", stage: "בתים", group: "C", home: "Morocco", away: "Haiti" },
  { id: 52, date: "25.06.2026", time: "01:00", stage: "בתים", group: "C", home: "Scotland", away: "Brazil" },
  { id: 53, date: "25.06.2026", time: "04:00", stage: "בתים", group: "A", home: "South Africa", away: "South Korea" },
  { id: 54, date: "25.06.2026", time: "04:00", stage: "בתים", group: "A", home: "Czech Republic", away: "Mexico" },
  { id: 55, date: "25.06.2026", time: "23:00", stage: "בתים", group: "E", home: "Curacao", away: "Ivory Coast" },
  { id: 56, date: "25.06.2026", time: "23:00", stage: "בתים", group: "E", home: "Ecuador", away: "Germany" },
  { id: 57, date: "26.06.2026", time: "02:00", stage: "בתים", group: "F", home: "Tunisia", away: "Netherlands" },
  { id: 58, date: "26.06.2026", time: "02:00", stage: "בתים", group: "F", home: "Japan", away: "Sweden" },
  { id: 59, date: "26.06.2026", time: "05:00", stage: "בתים", group: "D", home: "Turkey", away: "USA" },
  { id: 60, date: "26.06.2026", time: "05:00", stage: "בתים", group: "D", home: "Paraguay", away: "Australia" },
  { id: 61, date: "26.06.2026", time: "22:00", stage: "בתים", group: "I", home: "Norway", away: "France" },
  { id: 62, date: "26.06.2026", time: "22:00", stage: "בתים", group: "I", home: "Senegal", away: "Iraq" },
  { id: 63, date: "27.06.2026", time: "03:00", stage: "בתים", group: "H", home: "Cape Verde", away: "Saudi Arabia" },
  { id: 64, date: "27.06.2026", time: "03:00", stage: "בתים", group: "H", home: "Uruguay", away: "Spain" },
  { id: 65, date: "27.06.2026", time: "06:00", stage: "בתים", group: "G", home: "New Zealand", away: "Belgium" },
  { id: 66, date: "27.06.2026", time: "06:00", stage: "בתים", group: "G", home: "Egypt", away: "Iran" },
  { id: 67, date: "28.06.2026", time: "00:00", stage: "בתים", group: "L", home: "Panama", away: "England" },
  { id: 68, date: "28.06.2026", time: "00:00", stage: "בתים", group: "L", home: "Croatia", away: "Ghana" },
  { id: 69, date: "28.06.2026", time: "02:30", stage: "בתים", group: "K", home: "Colombia", away: "Portugal" },
  { id: 70, date: "28.06.2026", time: "02:30", stage: "בתים", group: "K", home: "DR Congo", away: "Uzbekistan" },
  { id: 71, date: "28.06.2026", time: "05:00", stage: "בתים", group: "J", home: "Algeria", away: "Austria" },
  { id: 72, date: "28.06.2026", time: "05:00", stage: "בתים", group: "J", home: "Jordan", away: "Argentina" },
  { id: 73, date: "28.06.2026", time: "22:00", stage: "32 האחרונות", group: "", home: "A2", away: "B2" },
  { id: 74, date: "29.06.2026", time: "20:00", stage: "32 האחרונות", group: "", home: "C1", away: "F2" },
  { id: 75, date: "29.06.2026", time: "23:30", stage: "32 האחרונות", group: "", home: "E1", away: "3rd A/B/C/D/F" },
  { id: 76, date: "30.06.2026", time: "04:00", stage: "32 האחרונות", group: "", home: "F1", away: "C2" },
  { id: 77, date: "30.06.2026", time: "20:00", stage: "32 האחרונות", group: "", home: "E2", away: "I2" },
  { id: 78, date: "01.07.2026", time: "00:00", stage: "32 האחרונות", group: "", home: "I1", away: "3rd C/D/F/G/H" },
  { id: 79, date: "01.07.2026", time: "04:00", stage: "32 האחרונות", group: "", home: "A1", away: "3rd C/E/F/H/I" },
  { id: 80, date: "01.07.2026", time: "19:00", stage: "32 האחרונות", group: "", home: "L1", away: "3rd E/H/I/J/K" },
  { id: 81, date: "01.07.2026", time: "23:00", stage: "32 האחרונות", group: "", home: "G1", away: "3rd A/E/H/I/J" },
  { id: 82, date: "02.07.2026", time: "03:00", stage: "32 האחרונות", group: "", home: "D1", away: "3rd B/E/F/I/J" },
  { id: 83, date: "02.07.2026", time: "22:00", stage: "32 האחרונות", group: "", home: "H1", away: "J2" },
  { id: 84, date: "03.07.2026", time: "02:00", stage: "32 האחרונות", group: "", home: "K2", away: "L2" },
  { id: 85, date: "03.07.2026", time: "06:00", stage: "32 האחרונות", group: "", home: "B1", away: "3rd E/F/G/I/J" },
  { id: 86, date: "03.07.2026", time: "21:00", stage: "32 האחרונות", group: "", home: "D2", away: "G2" },
  { id: 87, date: "04.07.2026", time: "01:00", stage: "32 האחרונות", group: "", home: "J1", away: "H2" },
  { id: 88, date: "04.07.2026", time: "04:30", stage: "32 האחרונות", group: "", home: "K1", away: "3rd D/E/I/J/L" },
  { id: 89, date: "04.07.2026", time: "20:00", stage: "שמינית", group: "", home: "Winner M73", away: "Winner M75" },
  { id: 90, date: "05.07.2026", time: "00:00", stage: "שמינית", group: "", home: "Winner M74", away: "Winner M77" },
  { id: 91, date: "05.07.2026", time: "23:00", stage: "שמינית", group: "", home: "Winner M76", away: "Winner M78" },
  { id: 92, date: "06.07.2026", time: "03:00", stage: "שמינית", group: "", home: "Winner M79", away: "Winner M80" },
  { id: 93, date: "06.07.2026", time: "22:00", stage: "שמינית", group: "", home: "Winner M83", away: "Winner M84" },
  { id: 94, date: "07.07.2026", time: "03:00", stage: "שמינית", group: "", home: "Winner M81", away: "Winner M82" },
  { id: 95, date: "07.07.2026", time: "19:00", stage: "שמינית", group: "", home: "Winner M86", away: "Winner M88" },
  { id: 96, date: "07.07.2026", time: "23:00", stage: "שמינית", group: "", home: "Winner M85", away: "Winner M87" },
  { id: 97, date: "09.07.2026", time: "23:00", stage: "רבע גמר", group: "", home: "Winner M89", away: "Winner M90" },
  { id: 98, date: "10.07.2026", time: "22:00", stage: "רבע גמר", group: "", home: "Winner M93", away: "Winner M94" },
  { id: 99, date: "12.07.2026", time: "00:00", stage: "רבע גמר", group: "", home: "Winner M91", away: "Winner M92" },
  { id: 100, date: "12.07.2026", time: "04:00", stage: "רבע גמר", group: "", home: "Winner M95", away: "Winner M96" },
  { id: 101, date: "14.07.2026", time: "22:00", stage: "חצי גמר", group: "", home: "Winner M97", away: "Winner M98" },
  { id: 102, date: "15.07.2026", time: "22:00", stage: "חצי גמר", group: "", home: "Winner M99", away: "Winner M100" },
  { id: 103, date: "19.07.2026", time: "00:00", stage: "Third Place Playoff", group: "", home: "Loser M101", away: "Loser M102" },
  { id: 104, date: "19.07.2026", time: "22:00", stage: "גמר", group: "", home: "Winner M101", away: "Winner M102" },
];

const groups = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia & Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curacao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};
const teamFlags = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  "Czech Republic": "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia & Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴",
  USA: "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Turkey: "🇹🇷",
  Germany: "🇩🇪",
  Curacao: "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
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
const nextOpenMatchRef = useRef(null);
const [messageType, setMessageType] = useState("");
const [knockoutMatches, setKnockoutMatches] = useState({});
const [adminResultsSearch, setAdminResultsSearch] = useState("");
const [adminResultsFilter, setAdminResultsFilter] = useState("all");
const [allBetsStageFilter, setAllBetsStageFilter] = useState("all");
const [allBetsStatusFilter, setAllBetsStatusFilter] = useState("all");
const [allBetsSearch, setAllBetsSearch] = useState("");
const [matchCardsFilter, setMatchCardsFilter] = useState("all");
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

async function loadKnockoutMatches() {
  const { data, error } = await supabase
    .from("knockout_matches")
    .select("*");

  if (error) {
    console.error("Error loading knockout matches:", error);
    return;
  }

  const formatted = {};

  data.forEach((row) => {
    formatted[row.match_id] = {
      home_team: row.home_team,
      away_team: row.away_team,
      winner_team: row.winner_team,
      loser_team: row.loser_team,
    };
  });

  setKnockoutMatches(formatted);
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
async function updateKnockoutWinner(match, winnerTeam) {
  if (!winnerTeam) {
  const progression = knockoutProgression[match.id];

  const currentUpdated = {
    ...(knockoutMatches[match.id] || {}),
    winner_team: null,
    loser_team: null,
  };

  setKnockoutMatches((prev) => {
    const next = {
      ...prev,
      [match.id]: currentUpdated,
    };

    if (progression?.nextMatch && progression?.side) {
      next[progression.nextMatch] = {
        ...(next[progression.nextMatch] || {}),
        [`${progression.side}_team`]: null,
      };
    }

    if (progression?.loserNextMatch && progression?.loserSide) {
      next[progression.loserNextMatch] = {
        ...(next[progression.loserNextMatch] || {}),
        [`${progression.loserSide}_team`]: null,
      };
    }

    return next;
  });

  await supabase.from("knockout_matches").upsert(
    {
      match_id: match.id,
      home_team: currentUpdated.home_team || null,
      away_team: currentUpdated.away_team || null,
      winner_team: null,
      loser_team: null,
    },
    { onConflict: "match_id" }
  );

  if (progression?.nextMatch && progression?.side) {
    const nextData = knockoutMatches[progression.nextMatch] || {};

    await supabase.from("knockout_matches").upsert(
      {
        match_id: progression.nextMatch,
        home_team:
          progression.side === "home"
            ? null
            : nextData.home_team || null,
        away_team:
          progression.side === "away"
            ? null
            : nextData.away_team || null,
        winner_team: nextData.winner_team || null,
        loser_team: nextData.loser_team || null,
      },
      { onConflict: "match_id" }
    );
  }

  if (progression?.loserNextMatch && progression?.loserSide) {
    const loserNextData =
      knockoutMatches[progression.loserNextMatch] || {};

    await supabase.from("knockout_matches").upsert(
      {
        match_id: progression.loserNextMatch,
        home_team:
          progression.loserSide === "home"
            ? null
            : loserNextData.home_team || null,
        away_team:
          progression.loserSide === "away"
            ? null
            : loserNextData.away_team || null,
        winner_team: loserNextData.winner_team || null,
        loser_team: loserNextData.loser_team || null,
      },
      { onConflict: "match_id" }
    );
  }

  return;
}

  const homeTeam = getDisplayTeam(match, "home");
  const awayTeam = getDisplayTeam(match, "away");

  const loserTeam = winnerTeam === homeTeam ? awayTeam : homeTeam;
  const progression = knockoutProgression[match.id];

  const currentUpdated = {
    ...(knockoutMatches[match.id] || {}),
    winner_team: winnerTeam,
    loser_team: loserTeam,
  };

  setKnockoutMatches((prev) => ({
    ...prev,
    [match.id]: currentUpdated,
  }));

  await supabase.from("knockout_matches").upsert(
    {
      match_id: match.id,
      home_team: currentUpdated.home_team || null,
      away_team: currentUpdated.away_team || null,
      winner_team: currentUpdated.winner_team || null,
      loser_team: currentUpdated.loser_team || null,
    },
    { onConflict: "match_id" }
  );

  if (!progression) return;

  const nextUpdated = {
    ...(knockoutMatches[progression.nextMatch] || {}),
    [`${progression.side}_team`]: winnerTeam,
  };

  setKnockoutMatches((prev) => ({
    ...prev,
    [progression.nextMatch]: nextUpdated,
  }));

  await supabase.from("knockout_matches").upsert(
    {
      match_id: progression.nextMatch,
      home_team: nextUpdated.home_team || null,
      away_team: nextUpdated.away_team || null,
      winner_team: nextUpdated.winner_team || null,
      loser_team: nextUpdated.loser_team || null,
    },
    { onConflict: "match_id" }
  );

  if (progression.loserNextMatch && progression.loserSide) {
    const loserNextUpdated = {
      ...(knockoutMatches[progression.loserNextMatch] || {}),
      [`${progression.loserSide}_team`]: loserTeam,
    };

    setKnockoutMatches((prev) => ({
      ...prev,
      [progression.loserNextMatch]: loserNextUpdated,
    }));

    await supabase.from("knockout_matches").upsert(
      {
        match_id: progression.loserNextMatch,
        home_team: loserNextUpdated.home_team || null,
        away_team: loserNextUpdated.away_team || null,
        winner_team: loserNextUpdated.winner_team || null,
        loser_team: loserNextUpdated.loser_team || null,
      },
      { onConflict: "match_id" }
    );
  }
}

async function updateKnockoutTeam(matchId, side, value) {
  const existing = knockoutMatches[matchId] || {};

  const updated = {
    ...existing,
    [side]: value,
  };

  setKnockoutMatches((prev) => ({
    ...prev,
    [matchId]: updated,
  }));

  const { error } = await supabase
    .from("knockout_matches")
    .upsert(
      {
        match_id: matchId,
        home_team: updated.home_team || null,
        away_team: updated.away_team || null,
        winner_team: updated.winner_team || null,
        loser_team: updated.loser_team || null,
      },
      { onConflict: "match_id" }
    );

  if (error) {
    console.error("Error saving knockout teams:", error);
    alert(error.message);
  }
}
async function refreshAllData() {
  await loadPlayers();
  await loadPredictions();
  await loadBonusPredictions();
  await loadResults();
  await loadAppSettings();
  await loadKnockoutMatches();
}
useEffect(() => {
  refreshAllData();
}, []);

  const [page, setPage] = useState(() => {
  if (typeof window !== "undefined") {
  return localStorage.getItem("currentPage") || "matchesCards";
  }
return "matchesCards";
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

const match = matches.find((m) => m.id === matchId);

if (
  match &&
  !match.group &&
  updatedResult.home !== "" &&
  updatedResult.home != null &&
  updatedResult.away !== "" &&
  updatedResult.away != null
) {
  const homeScore = Number(updatedResult.home);
  const awayScore = Number(updatedResult.away);

  if (homeScore > awayScore) {
    await updateKnockoutWinner(match, getDisplayTeam(match, "home"));
  } else if (awayScore > homeScore) {
    await updateKnockoutWinner(match, getDisplayTeam(match, "away"));
  }
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
  const cleanName = participantName.trim();
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

  const { data: newPlayer, error: playerError } = await supabase
  .from("players")
  .insert([
    {
      name: cleanName,
      email: authEmail,
      role: "player",
      is_active: true,
    },
  ])
  .select()
  .single();

if (playerError) {
  console.error("Player insert error:", playerError);
  showMessage("המשתמש נרשם, אבל הייתה שגיאה בהוספה לטבלת המשתתפים", "error");
  return;
}

setDbPlayers((prev) => [...prev, newPlayer]);

  
setAuthUser(data.user);

const freshPlayer = await supabase
  .from("players")
  .select("*")
  .eq("email", authEmail)
  .single();

if (freshPlayer.data) {
  setSelectedPlayer(freshPlayer.data.name);
  setRole(freshPlayer.data.role || "player");
}
await refreshAllData();

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

  const { data: freshPlayers, error: playersError } = await supabase
    .from("players")
    .select("*")
    .order("id", { ascending: true });

  if (playersError) {
    console.error("Error loading players after signin:", playersError);
    showMessage("התחברת, אבל הייתה שגיאה בטעינת המשתתפים", "error");
    return;
  }

  setDbPlayers(freshPlayers);

  const matchingPlayer = freshPlayers.find(
    (player) => player.email === data.user.email
  );

  if (matchingPlayer) {
    setSelectedPlayer(matchingPlayer.name);
    setRole(matchingPlayer.role || "player");
  }

  await refreshAllData();

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
const filteredAllBetsMatches = matches.filter((match) => {
  const searchText = allBetsSearch.trim().toLowerCase();

  const matchesSearch =
    searchText === "" ||
    match.home.toLowerCase().includes(searchText) ||
    match.away.toLowerCase().includes(searchText);

  const matchesStage =
    allBetsStageFilter === "all" ||
    (allBetsStageFilter === "groups" && match.group) ||
    (allBetsStageFilter === "knockout" && !match.group);

  const locked = isMatchLocked(match, manuallyUnlockedMatches);

  const matchesStatus =
    allBetsStatusFilter === "all" ||
    (allBetsStatusFilter === "open" && !locked) ||
    (allBetsStatusFilter === "locked" && locked);

  return matchesSearch && matchesStage && matchesStatus;
});
const scrollToNextOpenMatch = () => {
  if (nextOpenMatchRef.current) {
    nextOpenMatchRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};
const updatedResultsCount = Object.values(results).filter(
  (result) =>
    result.home !== "" &&
    result.home != null &&
    result.away !== "" &&
    result.away != null
).length;
const filteredAdminMatches = matches.filter((match) => {
  const result = results[match.id] || { home: "", away: "" };

  const hasResult =
    result.home !== "" &&
    result.home != null &&
    result.away !== "" &&
    result.away != null;

  const searchText = adminResultsSearch.trim().toLowerCase();

  const matchesSearch =
    searchText === "" ||
    match.home.toLowerCase().includes(searchText) ||
    match.away.toLowerCase().includes(searchText);

  const matchesStatus =
  adminResultsFilter === "all" ||
  (adminResultsFilter === "groups" && match.group) ||
  (adminResultsFilter === "knockout" && !match.group) ||
  (adminResultsFilter === "updated" && hasResult) ||
  (adminResultsFilter === "missing" && !hasResult);

  return matchesSearch && matchesStatus;
});
const getFlagUrl = (team) => {
  const flags = {
  Mexico: "https://flagcdn.com/w40/mx.png",
  "South Africa": "https://flagcdn.com/w40/za.png",
  "South Korea": "https://flagcdn.com/w40/kr.png",
  "Czech Republic": "https://flagcdn.com/w40/cz.png",

  Canada: "https://flagcdn.com/w40/ca.png",
  "Bosnia & Herzegovina": "https://flagcdn.com/w40/ba.png",
  Qatar: "https://flagcdn.com/w40/qa.png",
  Switzerland: "https://flagcdn.com/w40/ch.png",

  Brazil: "https://flagcdn.com/w40/br.png",
  Morocco: "https://flagcdn.com/w40/ma.png",
  Haiti: "https://flagcdn.com/w40/ht.png",
  Scotland: "https://flagcdn.com/w40/gb-sct.png",

  USA: "https://flagcdn.com/w40/us.png",
  Paraguay: "https://flagcdn.com/w40/py.png",
  Australia: "https://flagcdn.com/w40/au.png",
  Turkey: "https://flagcdn.com/w40/tr.png",

  Germany: "https://flagcdn.com/w40/de.png",
  Curacao: "https://flagcdn.com/w40/cw.png",
  "Ivory Coast": "https://flagcdn.com/w40/ci.png",
  Ecuador: "https://flagcdn.com/w40/ec.png",

  Netherlands: "https://flagcdn.com/w40/nl.png",
  Japan: "https://flagcdn.com/w40/jp.png",
  Sweden: "https://flagcdn.com/w40/se.png",
  Tunisia: "https://flagcdn.com/w40/tn.png",

  Belgium: "https://flagcdn.com/w40/be.png",
  Egypt: "https://flagcdn.com/w40/eg.png",
  Iran: "https://flagcdn.com/w40/ir.png",
  "New Zealand": "https://flagcdn.com/w40/nz.png",

  Spain: "https://flagcdn.com/w40/es.png",
  "Cape Verde": "https://flagcdn.com/w40/cv.png",
  "Saudi Arabia": "https://flagcdn.com/w40/sa.png",
  Uruguay: "https://flagcdn.com/w40/uy.png",

  France: "https://flagcdn.com/w40/fr.png",
  Senegal: "https://flagcdn.com/w40/sn.png",
  Iraq: "https://flagcdn.com/w40/iq.png",
  Norway: "https://flagcdn.com/w40/no.png",

  Argentina: "https://flagcdn.com/w40/ar.png",
  Algeria: "https://flagcdn.com/w40/dz.png",
  Austria: "https://flagcdn.com/w40/at.png",
  Jordan: "https://flagcdn.com/w40/jo.png",

  Portugal: "https://flagcdn.com/w40/pt.png",
  "DR Congo": "https://flagcdn.com/w40/cd.png",
  Uzbekistan: "https://flagcdn.com/w40/uz.png",
  Colombia: "https://flagcdn.com/w40/co.png",

  England: "https://flagcdn.com/w40/gb-eng.png",
  Croatia: "https://flagcdn.com/w40/hr.png",
  Ghana: "https://flagcdn.com/w40/gh.png",
  Panama: "https://flagcdn.com/w40/pa.png",
};

  return flags[team] || null;
};

const getDisplayTeam = (match, side) => {
  if (match.group) {
    return side === "home" ? match.home : match.away;
  }

  const knockoutData = knockoutMatches[match.id];

  if (!knockoutData) {
    return side === "home" ? match.home : match.away;
  }

  if (side === "home") {
    return knockoutData.home_team || match.home;
  }

  return knockoutData.away_team || match.away;
};

const knockoutProgression = {
  73: { nextMatch: 89, side: "home" },
  75: { nextMatch: 89, side: "away" },

  74: { nextMatch: 90, side: "home" },
  77: { nextMatch: 90, side: "away" },

  76: { nextMatch: 91, side: "home" },
  78: { nextMatch: 91, side: "away" },

  79: { nextMatch: 92, side: "home" },
  80: { nextMatch: 92, side: "away" },

  83: { nextMatch: 93, side: "home" },
  84: { nextMatch: 93, side: "away" },

  81: { nextMatch: 94, side: "home" },
  82: { nextMatch: 94, side: "away" },

  86: { nextMatch: 95, side: "home" },
  88: { nextMatch: 95, side: "away" },

  85: { nextMatch: 96, side: "home" },
  87: { nextMatch: 96, side: "away" },

  89: { nextMatch: 97, side: "home" },
  90: { nextMatch: 97, side: "away" },

  93: { nextMatch: 98, side: "home" },
  94: { nextMatch: 98, side: "away" },

  91: { nextMatch: 99, side: "home" },
  92: { nextMatch: 99, side: "away" },

  95: { nextMatch: 100, side: "home" },
  96: { nextMatch: 100, side: "away" },

  97: { nextMatch: 101, side: "home" },
  98: { nextMatch: 101, side: "away" },

  99: { nextMatch: 102, side: "home" },
  100: { nextMatch: 102, side: "away" },

  101: {
    nextMatch: 104,
    side: "home",
    loserNextMatch: 103,
    loserSide: "home",
  },

  102: {
    nextMatch: 104,
    side: "away",
    loserNextMatch: 103,
    loserSide: "away",
  },
};

  return (
    
    <main
  dir="rtl"
  className="min-h-screen bg-slate-950 text-white p-2 md:p-8 text-xs md:text-base"
>
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
       <header className="mb-4">
  {/* Desktop Hero */}
<div
  className="hidden md:block relative overflow-hidden rounded-3xl border border-yellow-400/25 shadow-2xl min-h-[300px]"
  style={{
    backgroundImage:
      "linear-gradient(to bottom, rgba(2,6,23,0.00), rgba(2,6,23,0.05), rgba(2,6,23,0.35)), url('/hero-bg.png')",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="absolute top-5 right-6 z-10 inline-flex items-center gap-2 rounded-full bg-yellow-400/25 px-5 py-2 text-sm font-black text-yellow-300 border border-yellow-400/40 backdrop-blur-sm">
    🏆 מונדיאל 2026
  </div>

  <div className="absolute top-5 left-6 z-10 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-sm px-4 py-2 text-sm font-black">
    <span className="text-slate-300 ml-2">סטטוס מערכת</span>
    <span className="text-green-400">● פעילה</span>
  </div>

  <div className="absolute bottom-6 left-8 z-10">
    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-2xl">
      World Cup Predictor 2026
    </h1>
  </div>
</div>

  {/* Mobile Hero */}
  <div
    className="md:hidden relative overflow-hidden rounded-3xl border border-yellow-400/25 shadow-2xl bg-cover bg-top min-h-[520px]"
    style={{
      backgroundImage:
        "linear-gradient(to bottom, rgba(2,6,23,0.05), rgba(2,6,23,0.25), rgba(2,6,23,0.95)), url('/hero-bg.png')",
    }}
  >
    <div className="absolute inset-x-4 bottom-5">
      <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-base font-black text-yellow-300 border border-yellow-400/30 mb-4">
        🏆 מונדיאל 2026
      </div>

      <h1 className="text-4xl font-black text-white leading-tight drop-shadow-2xl">
        World Cup Predictor 2026
      </h1>

      <div className="mt-5 rounded-2xl bg-black/55 border border-white/10 backdrop-blur-sm p-4">
        <div className="text-slate-300 text-base mb-1">סטטוס מערכת</div>
        <div className="text-green-400 text-3xl font-black">● פעילה</div>
      </div>
    </div>
  </div>
</header>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
  <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-5 shadow-2xl">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <div className="text-2xl font-black">כניסה למערכת</div>
        <div className="text-slate-400 font-bold mt-1">
          התחבר כדי לצפות, להמר ולעקוב אחרי הדירוג
        </div>
      </div>

      <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950 text-2xl font-black">
        🏆
      </div>
    </div>

    {!authUser ? (
      <div className="space-y-3">
        <input
          type="text"
          placeholder="שם המשתתף - נדרש להרשמה"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 font-bold outline-none focus:border-yellow-400"
        />

        <input
          type="email"
          placeholder="אימייל"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 font-bold outline-none focus:border-yellow-400"
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 font-bold outline-none focus:border-yellow-400"
        />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={signUp}
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-3 rounded-2xl font-black shadow-lg"
          >
            הרשמה
          </button>

          <button
            onClick={signIn}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-2xl font-black shadow-lg"
          >
            התחברות
          </button>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl bg-green-500/10 border border-green-400/30 p-4">
        <div className="text-green-400 font-black text-lg mb-1">
          מחובר למערכת
        </div>

        <div className="text-slate-300 font-bold break-all">
          {authUser.email}
        </div>

        <button
          onClick={signOut}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-2xl font-black"
        >
          התנתקות
        </button>
      </div>
    )}
  </div>

  <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-5 shadow-2xl">
    <div className="text-2xl font-black mb-4">פרטי משתתף</div>

    {authUser && loggedInPlayer ? (
      <div className="space-y-3">
        <div className="rounded-2xl bg-slate-800 border border-slate-700 p-4">
          <div className="text-slate-400 font-bold mb-1">מחובר כמשתתף</div>
          <div className="text-2xl font-black text-yellow-300">
            {loggedInPlayer.name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-4">
            <div className="text-slate-400 font-bold mb-1">הרשאה</div>
            <div className="font-black text-sky-300">{role}</div>
          </div>

          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-4">
            <div className="text-slate-400 font-bold mb-1">משתתפים</div>
            <div className="font-black text-green-400">
              {activePlayers.length}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl bg-slate-800 border border-slate-700 p-4 text-slate-300 font-bold leading-7">
        אחרי התחברות יוצגו כאן שם המשתתף, ההרשאה ומצב המשתמש.
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

        <nav className="mb-6 flex gap-2 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-2 shadow-2xl scrollbar-hide">
          {false && (
  <button
    onClick={() => setPage("matches")}
    className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
      page === "matches"
        ? "bg-yellow-400 text-slate-950"
        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
    }`}
  >
    הימורי משחקים
  </button>
)}
          <button
  onClick={() => setPage("matchesCards")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "matchesCards"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
 הימורי משחקים
</button>
          <button
  onClick={() => setPage("bonus")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "bonus"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
  הימורי בונוס
</button>
<button
  onClick={() => setPage("bonusAll")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "bonusAll"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
  כל הימורי הבונוס
</button>

          {role === "admin" && (
  <button
    onClick={() => setPage("admin")}
   className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
      page === "admin"
        ? "bg-yellow-400 text-slate-950"
        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
    }`}
  >
    ניהול תוצאות
  </button>
)}
<button
  onClick={() => setPage("leaderboard")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "leaderboard" ? "bg-yellow-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
  טבלת דירוג
</button>
<button
  onClick={() => setPage("groups")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "groups"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
  טבלאות בתים
</button>

<button
  onClick={() => setPage("all")}
  className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
    page === "all"
      ? "bg-yellow-400 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
  }`}
>
  כל ההימורים
</button>

          <button
            onClick={() => setPage("rules")}
            className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
              page === "rules" ? "bg-yellow-400 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            חוקים
          </button>
        </nav>

        {page === "matches" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <h2 className="text-2xl font-black">
      הימורי משחקים
    </h2>
    <div className="text-slate-400 font-bold mt-1">
      משתתף נוכחי: <span className="text-yellow-300">{selectedPlayer}</span>
    </div>
  </div>

  <div className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 font-black text-slate-300">
    סה״כ משחקים: <span className="text-yellow-300">{matches.length}</span>
  </div>
</div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-300 text-sm bg-slate-950/80 backdrop-blur sticky top-0 z-10">
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
                      <tr
  key={match.id}
  className={`transition-all duration-200 hover:bg-slate-700/80 ${
    isMatchLocked(match, manuallyUnlockedMatches)
      ? "bg-red-950/30"
      : "bg-green-950/20"
  }`}
>
                        <td className="p-3 rounded-r-xl font-bold">{match.id}</td>
                        <td className="p-3 font-bold text-slate-300">{match.date}</td>
                        <td className="p-3 font-black text-sky-300">{match.time}</td>
                        <td className="p-3">
  <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 rounded-full bg-yellow-400 text-slate-950 font-black">
    {match.group ? `בית ${match.group}` : match.stage}
  </span>
</td>
                        <td className="sticky right-0 z-30 bg-slate-900 p-3 border-l border-slate-800 w-[180px] min-w-[180px] max-w-[180px]">
  <div className="flex flex-col items-center justify-center text-center leading-5">
    <span className="font-bold text-slate-100 text-sm">
      {match.home}
    </span>

    <span className="text-[10px] uppercase tracking-widest text-slate-500 my-1">
      VS
    </span>

    <span className="font-bold text-slate-100 text-sm">
      {match.away}
    </span>
  </div>
</td>
                        <td className="p-3">
                          <div className="flex flex-col items-center gap-2">
  <input
    type="number"
    min="0"
    value={prediction.home ?? ""}
    disabled={isMatchLocked(match, manuallyUnlockedMatches)}
    onChange={(e) =>
      updatePrediction(match.id, "home", e.target.value)
    }
    className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-2 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
  />

  <input
    type="number"
    min="0"
    value={prediction.away ?? ""}
    disabled={isMatchLocked(match, manuallyUnlockedMatches)}
    onChange={(e) =>
      updatePrediction(match.id, "away", e.target.value)
    }
    className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-2 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
  />
</div>
                        </td>
                        <td className="p-3 text-center">
  {result.home !== "" && result.away !== "" ? (
    <div className="inline-flex flex-col items-center gap-2 rounded-2xl bg-slate-950 border border-slate-700 px-4 py-2 font-black text-green-400 shadow-lg">
      <span>{result.home}</span>
      <span className="text-[10px] text-slate-500">VS</span>
      <span>{result.away}</span>
    </div>
  ) : (
    <span className="text-slate-500 font-bold">טרם עודכן</span>
  )}
</td>
                        <td className="p-3 text-center">
  {isMatchLocked(match, manuallyUnlockedMatches) ? (
    <span className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-2xl text-sm font-black">
      🔒 נעול
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 rounded-2xl text-sm font-black">
      🟢 פתוח
    </span>
  )}
</td>
                        <td
  className={`p-3 rounded-l-xl text-center font-black ${
    points === 4.5
      ? "text-yellow-300"
      : points === 2
      ? "text-sky-300"
      : "text-slate-500"
  }`}
>
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
                    className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700 shadow-xl hover:border-yellow-400/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
  <h3 className="text-xl font-black">
    בית {groupName}
  </h3>

  <div className="rounded-full bg-yellow-400 text-slate-950 px-3 py-1 text-xs font-black">
    2 עולות
  </div>
</div>
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
                      {selectedGroup[0] && (
  <div className="flex items-center gap-2 text-sm font-black text-slate-200 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
    {getFlagUrl(selectedGroup[0]) && (
      <img
        src={getFlagUrl(selectedGroup[0])}
        alt={selectedGroup[0]}
        className="w-5 h-5 rounded-full object-cover"
      />
    )}
    <span>{selectedGroup[0]}</span>
  </div>
)}

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
                      {selectedGroup[1] && (
  <div className="flex items-center gap-2 text-sm font-black text-slate-200 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
    {getFlagUrl(selectedGroup[1]) && (
      <img
        src={getFlagUrl(selectedGroup[1])}
        alt={selectedGroup[1]}
        className="w-5 h-5 rounded-full object-cover"
      />
    )}
    <span>{selectedGroup[1]}</span>
  </div>
)}
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
                {(bonusPredictions[selectedPlayer] || {}).champion && (
  <div className="mt-3 flex items-center gap-2 text-sm font-black text-slate-200 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
    {getFlagUrl((bonusPredictions[selectedPlayer] || {}).champion) && (
      <img
        src={getFlagUrl((bonusPredictions[selectedPlayer] || {}).champion)}
        alt={(bonusPredictions[selectedPlayer] || {}).champion}
        className="w-5 h-5 rounded-full object-cover"
      />
    )}
    <span>{(bonusPredictions[selectedPlayer] || {}).champion}</span>
  </div>
)}
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
        {page === "matchesCards" && (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
    <div className="mb-6">
      <h2 className="text-2xl font-black">
       הימורי משחקים
      </h2>

      <div className="text-slate-400 font-bold mt-1">
        משתתף נוכחי:{" "}
        <span className="text-yellow-300">{selectedPlayer}</span>
      </div>
    </div>
    {(() => {
  const nextMatch = matches
  .filter((match) => {
    const locked = isMatchLocked(match, manuallyUnlockedMatches);

    if (matchCardsFilter === "open") return !locked;
    if (matchCardsFilter === "locked") return locked;
    if (matchCardsFilter === "groups") return !!match.group;
    if (matchCardsFilter === "knockout") return !match.group;

    return true;
  })
  .find((match) => !isMatchLocked(match, manuallyUnlockedMatches));

  if (!nextMatch) return null;

  return (
    <div className="mb-5 rounded-3xl border border-yellow-400/40 bg-yellow-400/10 p-4">
      <div className="text-yellow-300 font-black mb-2">
        המשחק הקרוב להימור
      </div>

      <div className="flex items-center gap-3 text-white font-black text-lg">
  <div className="flex items-center gap-2">
    {getFlagUrl(getDisplayTeam(nextMatch, "home")) && (
  <img
    src={getFlagUrl(getDisplayTeam(nextMatch, "home"))}
    alt={getDisplayTeam(nextMatch, "home")}
    className="w-6 h-6 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(nextMatch, "home")}</span>
  </div>

  <span className="text-slate-400">נגד</span>

  <div className="flex items-center gap-2">
    {getFlagUrl(getDisplayTeam(nextMatch, "away")) && (
  <img
    src={getFlagUrl(getDisplayTeam(nextMatch, "away"))}
    alt={getDisplayTeam(nextMatch, "away")}
    className="w-6 h-6 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(nextMatch, "away")}</span>
  </div>
</div>

      <div className="text-slate-400 font-bold mt-1">
        משחק {nextMatch.id} | {nextMatch.date} | {nextMatch.time} |{" "}
        {nextMatch.group ? `בית ${nextMatch.group}` : nextMatch.stage}
      </div>

      <button
        type="button"
        onClick={() => {
          const el = document.getElementById(`match-card-${nextMatch.id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-5 py-2 rounded-2xl transition-all"
      >
        קפוץ למשחק
      </button>
    </div>
  );
})()}
<div className="mb-5 flex gap-2 overflow-x-auto pb-2">
  {[
    { key: "all", label: "כל המשחקים" },
    { key: "open", label: "פתוחים" },
    { key: "locked", label: "נעולים" },
    { key: "groups", label: "שלב בתים" },
    { key: "knockout", label: "נוקאאוט" },
  ].map((filter) => (
    <button
      key={filter.key}
      onClick={() => setMatchCardsFilter(filter.key)}
      className={`whitespace-nowrap px-4 py-2 rounded-2xl font-black text-sm transition-all ${
        matchCardsFilter === filter.key
          ? "bg-yellow-400 text-slate-950"
          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
      }`}
    >
      {filter.label}
    </button>
  ))}
</div>
    <div className="grid gap-4">
      {matches
  .filter((match) => {
    const locked = isMatchLocked(match, manuallyUnlockedMatches);

    if (matchCardsFilter === "open") return !locked;
    if (matchCardsFilter === "locked") return locked;
    if (matchCardsFilter === "groups") return !!match.group;
    if (matchCardsFilter === "knockout") return !match.group;

    return true;
  })
  .map((match) => {
        const prediction =
          predictions[selectedPlayer]?.[match.id] || {
            home: "",
            away: "",
          };

        const result = results[match.id] || {
          home: "",
          away: "",
        };

        const points = calculatePoints(prediction, result);

        const locked = isMatchLocked(
          match,
          manuallyUnlockedMatches
        );

        return (
          <div
  id={`match-card-${match.id}`}
  key={match.id}
  className={`rounded-3xl border p-4 transition-all ${
              locked
                ? "border-red-500/30 bg-red-950/20"
                : "border-green-500/30 bg-green-950/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
  <div className="font-black text-yellow-300">
    משחק {match.id}
  </div>

  <div className="flex items-center gap-2">
    <div className="text-sm font-bold text-slate-400">
      {match.group ? `בית ${match.group}` : match.stage}
    </div>

    {locked ? (
      <span className="inline-flex items-center rounded-full bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-1 text-xs font-black">
        🔒 נעול
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/40 text-green-300 px-3 py-1 text-xs font-black">
        🟢 פתוח
      </span>
    )}
  </div>
</div>

            <div className="text-sm text-slate-400 font-bold mb-4">
              {match.date} | {match.time}
            </div>
            {!match.group && knockoutMatches[match.id]?.winner_team && (
  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-black">
    עולה: {knockoutMatches[match.id].winner_team}
  </div>
)}

            <div className="space-y-3">
  <div className="grid grid-cols-[1fr_70px_70px] items-center gap-3">
    <div className="flex items-center gap-2 font-black text-white">
  {getFlagUrl(getDisplayTeam(match, "home")) && (
  <img
    src={getFlagUrl(getDisplayTeam(match, "home"))}
    alt={getDisplayTeam(match, "home")}
    className="w-6 h-6 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(match, "home")}</span>
</div>

    <input
      type="number"
      min="0"
      value={prediction.home ?? ""}
      disabled={locked}
      onChange={(e) =>
        updatePrediction(match.id, "home", e.target.value)
      }
      className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-3 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40"
    />

    <div className="text-center text-green-400 font-black">
      {result.home !== "" ? result.home : "-"}
    </div>
  </div>

  <div className="grid grid-cols-[1fr_70px_70px] items-center gap-3">
    <div className="flex items-center gap-2 font-black text-white">
  {getFlagUrl(getDisplayTeam(match, "away")) && (
  <img
    src={getFlagUrl(getDisplayTeam(match, "away"))}
    alt={getDisplayTeam(match, "away")}
    className="w-6 h-6 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(match, "away")}</span>
</div>

    <input
      type="number"
      min="0"
      value={prediction.away ?? ""}
      disabled={locked}
      onChange={(e) =>
        updatePrediction(match.id, "away", e.target.value)
      }
      className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-3 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40"
    />

    <div className="text-center text-green-400 font-black">
      {result.away !== "" ? result.away : "-"}
    </div>
  </div>

  <div className="grid grid-cols-[1fr_70px_70px] gap-3 text-[11px] text-slate-500 font-bold">
    <div></div>
    <div className="text-center">הימור</div>
    <div className="text-center">אמת</div>
  </div>
</div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
  <div className="text-slate-400 font-bold text-sm">
    ניקוד
  </div>

  <div
    className={`font-black text-lg ${
      points === 4.5
        ? "text-yellow-300"
        : points === 2
        ? "text-sky-300"
        : "text-slate-500"
    }`}
  >
    {points}
  </div>
</div>
          </div>
        );
      })}
    </div>
  </section>
)}
                {page === "bonusAll" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-6">
              כל הימורי הבונוס
            </h2>

           <div className="overflow-auto max-h-[75vh] rounded-2xl border border-slate-800">
              <table className="border-collapse table-fixed w-auto">
                <colgroup>
  <col style={{ width: "95px" }} />
  {activePlayers.map((player) => (
   <col key={player.id} style={{ width: "90px" }} />
  ))}
</colgroup>
                <thead>
                  <tr className="bg-slate-950 text-slate-300 sticky top-0 z-20">
                    <th className="sticky right-0 bg-slate-950 z-30 p-2 text-right border-l border-slate-800 w-[95px] min-w-[95px] max-w-[95px] text-xs">
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
      <td className="sticky right-0 bg-slate-900 z-10 p-2 border-l border-slate-800 font-black w-[95px] min-w-[95px] max-w-[95px] text-xs leading-tight">
        בית {groupName} - עולה 1
      </td>

      {activePlayers.map((player) => (
        <td
          key={player.id}
          className="p-3 text-center border-l border-slate-800 font-bold"
        >
         {(() => {
  const team =
    (bonusPredictions[player.name]?.[groupName] || ["", ""])[0];

  return team ? (
    <div className="flex items-center justify-center gap-1">
      {getFlagUrl(team) && (
        <img
          src={getFlagUrl(team)}
          alt={team}
          className="w-4 h-4 object-cover rounded-full"
        />
      )}

      <span>{team}</span>
    </div>
  ) : (
    "-"
  );
})()}
        </td>
      ))}
    </tr>

    <tr className="border-t border-slate-800">
      <td className="sticky right-0 bg-slate-900 z-10 p-2 border-l border-slate-800 font-black w-[95px] min-w-[95px] max-w-[95px] text-xs leading-tight">
        בית {groupName} - עולה 2
      </td>

      {activePlayers.map((player) => (
        <td
          key={player.id}
          className="p-3 text-center border-l border-slate-800 font-bold"
        >
          {(() => {
  const team =
    (bonusPredictions[player.name]?.[groupName] || ["", ""])[1];

  return team ? (
    <div className="flex items-center justify-center gap-1">
      {getFlagUrl(team) && (
        <img
          src={getFlagUrl(team)}
          alt={team}
          className="w-4 h-4 object-cover rounded-full"
        />
      )}

      <span>{team}</span>
    </div>
  ) : (
    "-"
  );
})()}
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
    {(() => {
  const team = bonusPredictions[player.name]?.champion;

  return team ? (
    <div className="flex items-center justify-center gap-1">
      {getFlagUrl(team) && (
        <img
          src={getFlagUrl(team)}
          alt={team}
          className="w-4 h-4 rounded-full object-cover"
        />
      )}

      <span>{team}</span>
    </div>
  ) : (
    "-"
  );
})()}
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
            <div className="mb-4 inline-flex items-center rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2 font-black text-slate-300">
  עודכנו {updatedResultsCount} מתוך {matches.length} משחקים
</div>
<div className="mb-6 flex gap-2 overflow-x-auto pb-2">
  {[
  { key: "all", label: "כל המשחקים" },
  { key: "groups", label: "שלב בתים" },
  { key: "knockout", label: "נוקאאוט" },
  { key: "updated", label: "עודכנו" },
  { key: "missing", label: "טרם עודכנו" },
].map((filter) => (
    <button
      key={filter.key}
      type="button"
      onClick={() => setAdminResultsFilter(filter.key)}
      className={`whitespace-nowrap px-4 py-2 rounded-2xl font-black text-sm transition-all ${
        adminResultsFilter === filter.key
          ? "bg-yellow-400 text-slate-950"
          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
      }`}
    >
      {filter.label}
    </button>
  ))}
</div>
<input
  type="text"
  value={adminResultsSearch}
  onChange={(e) => setAdminResultsSearch(e.target.value)}
  placeholder="חיפוש לפי נבחרת..."
  className="mb-6 w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 font-bold outline-none focus:border-yellow-400"
/>
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
              {filteredAdminMatches.map((match) => {
                const result = results[match.id] || { home: "", away: "" };
                const hasResult =
  result.home !== "" &&
  result.home != null &&
  result.away !== "" &&
  result.away != null;

                return (
                  <div
                    key={match.id}
                    className={`rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border ${
  hasResult
    ? "bg-green-950/20 border-green-500/30"
    : "bg-slate-800 border-slate-700"
}`}
                  >
                    <div>
                      <div className="font-black">
  {getDisplayTeam(match, "home")} נגד{" "}
  {getDisplayTeam(match, "away")}
</div>

{!match.group && (
  <div className="grid grid-cols-2 gap-2 mt-3">
    <input
      type="text"
      value={knockoutMatches[match.id]?.home_team || ""}
      onChange={(e) =>
        updateKnockoutTeam(
          match.id,
          "home_team",
          e.target.value
        )
      }
      placeholder="נבחרת בית"
      className="bg-slate-700 rounded-xl p-2 text-sm font-bold"
    />

    <input
      type="text"
      value={knockoutMatches[match.id]?.away_team || ""}
      onChange={(e) =>
        updateKnockoutTeam(
          match.id,
          "away_team",
          e.target.value
        )
      }
      placeholder="נבחרת חוץ"
      className="bg-slate-700 rounded-xl p-2 text-sm font-bold"
    />
  </div>
)}
{!match.group && (
  <div className="mt-3">
    <label className="block mb-2 text-sm font-black text-slate-300">
      עולה לשלב הבא
    </label>

    <select
      value={knockoutMatches[match.id]?.winner_team || ""}
      onChange={(e) => {
  console.log("Winner selected:", match.id, e.target.value);
  updateKnockoutWinner(match, e.target.value);
}}
      className="w-full bg-slate-700 rounded-xl p-2 text-sm font-bold"
    >
      <option value="">בחר עולה</option>

      <option value={getDisplayTeam(match, "home")}>
        {getDisplayTeam(match, "home")}
      </option>

      <option value={getDisplayTeam(match, "away")}>
        {getDisplayTeam(match, "away")}
      </option>
    </select>
  </div>
)}
                      <div className="text-slate-400 text-sm">
                        {match.date} | {match.time} | {match.group ? `בית ${match.group}` : match.stage}
                      </div>
                      <div className="mt-2">
  {hasResult ? (
    <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/40 text-green-300 px-3 py-1 text-xs font-black">
      ✓ עודכן
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-700 border border-slate-600 text-slate-300 px-3 py-1 text-xs font-black">
      טרם עודכן
    </span>
  )}
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
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-2 md:p-4">
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <h2 className="text-2xl font-black">טבלת דירוג</h2>
    <div className="text-slate-400 font-bold mt-1">
      דירוג המשתתפים לפי ניקוד כולל ושוברי שוויון
    </div>
  </div>

  <div className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 font-black text-slate-300">
    מוביל כרגע:{" "}
    <span className="text-yellow-300">
      {leaderboard[0]?.player || "-"}
    </span>
  </div>
</div>

    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="border-collapse min-w-[760px] text-xs md:text-sm">
        <thead>
          <tr className="bg-slate-950 text-slate-300 sticky top-0 z-30">
            <th className="sticky right-0 z-40 bg-slate-950 text-center p-2 border-l border-slate-800 w-[45px] min-w-[45px] max-w-[45px]">
              #
            </th>

            <th className="sticky right-[45px] z-40 bg-slate-950 text-right p-2 border-l border-slate-800 w-[95px] min-w-[95px] max-w-[95px]">
              משתתף
            </th>

            <th className="sticky right-[140px] z-40 bg-slate-950 text-center p-2 border-l border-slate-800 w-[65px] min-w-[65px] max-w-[65px]">
              סה״כ
            </th>

            <th className="text-center p-2 border-l border-slate-800 w-[80px] min-w-[80px]">
              משחקים
            </th>

            <th className="text-center p-2 border-l border-slate-800 w-[80px] min-w-[80px]">
              עולות
            </th>

            <th className="text-center p-2 border-l border-slate-800 w-[80px] min-w-[80px]">
              אלופה
            </th>

            <th className="text-center p-2 border-l border-slate-800 w-[90px] min-w-[90px]">
              מלך שערים
            </th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((row, index) => (
            <tr
  key={row.player}
  className="border-t border-slate-800 bg-slate-900 hover:bg-slate-800/80 transition-colors duration-200"
>
              <td
  className={`sticky right-0 z-20 bg-slate-900 text-center p-2 border-l border-slate-800 font-black w-[45px] min-w-[45px] max-w-[45px] ${
    index === 0
      ? "text-yellow-300"
      : index === 1
      ? "text-slate-300"
      : index === 2
      ? "text-amber-600"
      : "text-white"
  }`}
>
  {index === 0
    ? "🥇"
    : index === 1
    ? "🥈"
    : index === 2
    ? "🥉"
    : index + 1}
</td>

              <td
  className={`sticky right-[45px] z-20 p-2 border-l border-slate-800 font-black w-[95px] min-w-[95px] max-w-[95px] truncate ${
    index === 0
      ? "bg-slate-900 text-yellow-300"
      : index === 1
      ? "bg-slate-900 text-slate-200"
      : index === 2
      ? "bg-slate-900 text-amber-400"
      : "bg-slate-900 text-white"
  }`}
>
  {row.player}
</td>

              <td
  className={`sticky right-[140px] z-20 text-center p-2 border-l border-slate-800 font-black text-lg w-[65px] min-w-[65px] max-w-[65px] ${
    index === 0
      ? "bg-slate-900 text-yellow-300"
      : index === 1
      ? "bg-slate-900 text-slate-200"
      : index === 2
      ? "bg-slate-900 text-amber-400"
      : "bg-slate-900 text-yellow-400"
  }`}
>
  {row.total}
</td>
              <td className="p-2 text-center border-l border-slate-800">
                {row.matchPoints}
              </td>

              <td className="p-2 text-center border-l border-slate-800">
                {row.qualifiersPoints}
              </td>

              <td className="p-2 text-center border-l border-slate-800">
                {row.championPoints}
              </td>

              <td className="p-2 text-center border-l border-slate-800">
                {row.topScorerPoints}
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
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <h2 className="text-2xl font-black">כל ההימורים</h2>
    <div className="text-slate-400 font-bold mt-1">
      צפייה מרוכזת בכל הניחושים לפי משחק ומשתתף
    </div>
  </div>

  <div className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 font-black text-slate-300">
    משתתפים: <span className="text-yellow-300">{activePlayers.length}</span>
  </div>
</div>
<div className="mb-3 text-sm font-black text-slate-400">
  מציג {filteredAllBetsMatches.length} מתוך {matches.length} משחקים
</div>
<div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
  <input
    type="text"
    value={allBetsSearch}
    onChange={(e) => setAllBetsSearch(e.target.value)}
    placeholder="חיפוש לפי נבחרת..."
    className="bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 font-bold outline-none focus:border-yellow-400"
  />

  <select
    value={allBetsStageFilter}
    onChange={(e) => setAllBetsStageFilter(e.target.value)}
    className="bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 font-bold outline-none focus:border-yellow-400"
  >
    <option value="all">כל השלבים</option>
    <option value="groups">שלב בתים</option>
    <option value="knockout">נוקאאוט</option>
  </select>

  <select
    value={allBetsStatusFilter}
    onChange={(e) => setAllBetsStatusFilter(e.target.value)}
    className="bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 font-bold outline-none focus:border-yellow-400"
  >
    <option value="all">כל הסטטוסים</option>
    <option value="open">פתוחים</option>
    <option value="locked">נעולים</option>
  </select>
  <button
  type="button"
  onClick={() => {
    setAllBetsSearch("");
    setAllBetsStageFilter("all");
    setAllBetsStatusFilter("all");
  }}
  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl px-4 py-3 font-black text-slate-200"
>
  איפוס סינונים
</button>

</div>
            <div className="hidden md:block overflow-auto max-h-[75vh] rounded-2xl border border-slate-800 text-xs md:text-sm">
              <table className="border-collapse min-w-max">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 text-xs md:text-sm sticky top-0 z-20">
                    <th className="sticky right-0 z-30 bg-slate-950 text-right p-3 border-l border-slate-800 w-[170px] md:w-[240px]">
  משחק
</th>

                    {activePlayers.map((player) => {
  let total = 0;
  let exactHits = 0;
let correctResults = 0;

  matches.forEach((match) => {
    total += calculatePoints(
      predictions[player.name]?.[match.id],
      results[match.id]
    );
    const pts = calculatePoints(
  predictions[player.name]?.[match.id],
  results[match.id]
);

if (pts === 4.5) {
  exactHits++;
} else if (pts === 2) {
  correctResults++;
}
  });

  return (
    <th
     key={player.id}
      className={`p-1 md:p-2 text-center border-l border-slate-800 w-[62px] min-w-[62px] max-w-[62px] md:w-[85px] md:min-w-[85px] md:max-w-[85px] ${
  player.name === selectedPlayer
    ? "bg-yellow-500/10"
    : "bg-slate-950"
}`}
    >
      <div className="flex flex-col items-center gap-1">
  <div
    className={`font-black text-xs md:text-sm ${
      player.name === selectedPlayer
        ? "text-yellow-300"
        : "text-white"
    }`}
  >
    {player.name}
  </div>

  <div className="rounded-full bg-slate-800 px-2 py-1 text-[10px] md:text-xs font-black text-yellow-400 border border-slate-700">
    {total} נק'
  </div>
  <div className="flex flex-col items-center gap-0.5 text-[10px] font-black text-slate-400">
  <div className="text-yellow-300">🎯 {exactHits}</div>
  <div className="text-sky-300">✅ {correctResults}</div>
</div>
</div>
    </th>
  );
})}

                   
                  </tr>
                </thead>

                <tbody>
                  {filteredAllBetsMatches.length === 0 && (
  <tr>
    <td
      colSpan={activePlayers.length + 1}
      className="p-6 text-center text-slate-400 font-black"
    >
      לא נמצאו משחקים שמתאימים לסינון
    </td>
  </tr>
)}
                  {filteredAllBetsMatches.map((match) => {
                    const result =
                      results[match.id] || {
                        home: "",
                        away: "",
                      };

                    return (
                      <tr
  key={match.id}
  className={`border-t border-slate-800 ${
    isMatchLocked(match, manuallyUnlockedMatches)
      ? "bg-red-950/20"
      : "bg-green-950/10"
  }`}
>
                        <td className="sticky right-0 z-10 bg-slate-900 p-3 border-l border-slate-800 w-[170px] min-w-[170px] max-w-[170px] md:w-[240px] md:min-w-[240px] md:max-w-[240px]">
                          <div className="space-y-1 font-black">
  <div className="flex items-center gap-2">
    {getFlagUrl(getDisplayTeam(match, "home")) && (
  <img
    src={getFlagUrl(getDisplayTeam(match, "home"))}
    alt={getDisplayTeam(match, "home")}
    className="w-5 h-5 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(match, "home")}</span>
  </div>

  <div className="text-slate-500 text-xs font-black">
    נגד
  </div>

  <div className="flex items-center gap-2">
    {getFlagUrl(getDisplayTeam(match, "away")) && (
  <img
    src={getFlagUrl(getDisplayTeam(match, "away"))}
    alt={getDisplayTeam(match, "away")}
    className="w-5 h-5 rounded-full object-cover"
  />
)}

<span>{getDisplayTeam(match, "away")}</span>
  </div>
</div>
                          <div className="text-slate-400 text-sm">
  {match.date} | {match.time} | {match.group ? `בית ${match.group}` : match.stage}
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
{!match.group && knockoutMatches[match.id]?.winner_team && (
  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-black">
    עולה: {knockoutMatches[match.id].winner_team}
  </div>
)}
<div className="mt-2">
  {isMatchLocked(match, manuallyUnlockedMatches) ? (
    <span className="inline-flex items-center bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-1 rounded-full text-xs font-black">
      🔒 נעול
    </span>
  ) : (
    <span className="inline-flex items-center bg-green-500/20 border border-green-500/40 text-green-300 px-3 py-1 rounded-full text-xs font-black">
      🟢 פתוח
    </span>
  )}
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
  const pointStyle =
  points === 4.5
    ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-300"
    : points === 2
    ? "bg-sky-400/20 border-sky-400/50 text-sky-300"
    : "bg-slate-950 border-slate-800 text-slate-400";

                          return (
                            <td
                              key={player}
                             className={`p-1 md:p-3 text-center border-l border-slate-800 ${
  points > 0 ? pointStyle : ""
} ${
  player.name === selectedPlayer
    ? "ring-1 ring-yellow-400/30"
    : ""
}`}
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

                              <div
  className={`text-sm font-black mt-1 ${
    points === 4.5
      ? "text-yellow-300"
      : points === 2
      ? "text-sky-300"
      : "text-slate-500"
  }`}
>
  {points === 4.5
    ? "🎯 4.5"
    : points === 2
    ? "✓ 2"
    : "0"}
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
  {filteredAllBetsMatches.map((match) => {
    const result = results[match.id];
    const sortedPlayers = [...activePlayers].sort((a, b) => {
  const predictionA = predictions[a.name]?.[match.id];
  const predictionB = predictions[b.name]?.[match.id];

  const pointsA =
    predictionA && result ? calculatePoints(predictionA, result) : 0;

  const pointsB =
    predictionB && result ? calculatePoints(predictionB, result) : 0;

  return pointsB - pointsA;
});

    return (
      <div
        key={match.id}
        className="bg-slate-950 border border-slate-800 rounded-2xl p-3"
      >
        <div className="mb-3">
          <div className="flex items-center justify-center gap-3 font-black text-base text-white mb-1">
  <div className="flex items-center gap-2">
  {getFlagUrl(getDisplayTeam(match, "home")) && (
    <img
      src={getFlagUrl(getDisplayTeam(match, "home"))}
      alt={getDisplayTeam(match, "home")}
      className="w-5 h-5 rounded-full object-cover"
    />
  )}

  <span>{getDisplayTeam(match, "home")}</span>
</div>

  <span className="text-slate-500 text-xs">
    נגד
  </span>

  <div className="flex items-center gap-2">
  {getFlagUrl(getDisplayTeam(match, "away")) && (
    <img
      src={getFlagUrl(getDisplayTeam(match, "away"))}
      alt={getDisplayTeam(match, "away")}
      className="w-5 h-5 rounded-full object-cover"
    />
  )}

  <span>{getDisplayTeam(match, "away")}</span>
</div>
</div>

          <div className="text-slate-400 text-xs">
            {match.date} | {match.time} | {match.group ? `בית ${match.group}` : match.stage}
          </div>

          <div className="mt-2 text-sm font-bold text-yellow-300">
            תוצאת אמת:{" "}
           {result
  ? `${result.home} - ${result.away}`
  : "טרם עודכן"}
          </div>
          {!match.group && knockoutMatches[match.id]?.winner_team && (
  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-black">
    עולה: {knockoutMatches[match.id].winner_team}
  </div>
)}
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
  {(openMatchId === match.id
    ? sortedPlayers
: sortedPlayers.slice(0, 4)
  ).map((player) => {
            const prediction = predictions[player.name]?.[match.id];

            const points =
              prediction && result
                ? calculatePoints(prediction, result)
                : 0;

            return (
              <div
                key={player.id}
               className={`flex items-center justify-between gap-2 rounded-xl p-2 border ${
  player.name === selectedPlayer
    ? "bg-yellow-500/10 border-yellow-400"
    : "bg-slate-900 border-slate-800"
}`}
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
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div>
    <h2 className="text-3xl font-black">
      טבלאות בתים
    </h2>

    <div className="text-slate-400 font-bold mt-1">
      הטבלאות מתעדכנות אוטומטית לפי תוצאות המשחקים
    </div>
  </div>

  <div className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 font-black text-slate-300">
    ✓ שתי הראשונות עולות שלב
  </div>
</div>
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
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl hover:border-yellow-400/20 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
  <h3 className="text-2xl font-black">
    בית {groupName}
  </h3>

  <div className="rounded-full bg-yellow-400 text-slate-950 px-3 py-1 text-xs font-black">
    World Cup 2026
  </div>
</div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-300 border-b border-slate-700 bg-slate-950/70">
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
  className={`border-t border-slate-800 transition-colors duration-200 hover:bg-slate-800/80 ${
    index < 2
      ? "bg-green-500/10"
      : "bg-slate-900"
  }`}
>
                            <td className="py-3 font-black">
  {index + 1}

  {index < 2 && (
    <span className="mr-2 text-green-400">
      ✓
    </span>
  )}
</td>

                            <td className="py-3 font-bold">
  <div className="flex items-center gap-2">
    {getFlagUrl(team.team) && (
      <img
        src={getFlagUrl(team.team)}
        alt={team.team}
        className="w-5 h-5 rounded-full object-cover"
      />
    )}

    <span>{team.team}</span>
  </div>
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

                            <td className="text-center">
  <span className="inline-flex items-center justify-center min-w-[36px] rounded-full bg-yellow-400 text-slate-950 px-2 py-1 font-black">
    {team.points}
  </span>
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
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
  <div className="text-yellow-300 font-black mb-2">
    ⏰ נעילת הימורים
  </div>
  <div className="text-slate-300 font-bold leading-7">
    ניתן להמר או לערוך הימור על כל משחק עד 5 דקות לפני תחילת המשחק.
    לאחר מועד זה המשחק יינעל ולא ניתן יהיה לשנות את ההימור.
  </div>
</div>

    <div className="grid gap-3 md:grid-cols-2">
  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg">
    <div className="text-yellow-300 font-black text-lg mb-1">
      🎯 בול פגיעה
    </div>

    <div className="text-slate-300 font-bold">
      4.5 נקודות
    </div>
  </div>

  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg">
    <div className="text-sky-300 font-black text-lg mb-1">
      ✓ ניחוש נכון
    </div>

    <div className="text-slate-300 font-bold">
      ניחוש ניצחון / תיקו - 2 נקודות
    </div>
  </div>

  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg">
    <div className="text-green-300 font-black text-lg mb-1">
      🏆 עולות מהבתים
    </div>

    <div className="text-slate-300 font-bold">
      כל נבחרת נכונה - נקודה אחת
    </div>
  </div>

  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg">
    <div className="text-yellow-300 font-black text-lg mb-1">
      👑 אלופת העולם
    </div>

    <div className="text-slate-300 font-bold">
      9 נקודות
    </div>
  </div>

  <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg md:col-span-2">
    <div className="text-red-300 font-black text-lg mb-1">
      ⚽ מלך שערים
    </div>

    <div className="text-slate-300 font-bold">
      8 נקודות
    </div>
  </div>
</div>

    <div className="mt-8 rounded-3xl bg-slate-950 border border-slate-800 p-5">
  <h3 className="text-xl font-black mb-4">
    שוברי שוויון
  </h3>

  <div className="space-y-3">
    {[
      "מספר ניחושי בול פגיעה",
      "מספר ניחושי ניצחון/תיקו",
      "סך הנקודות מהימורי בונוס",
      "ניחוש נכון של אלופה",
      "ניחוש נכון של מלך שערים",
      "במידה ועדיין קיים שוויון - חלוקת המקום",
    ].map((rule, index) => (
      <div
        key={rule}
        className="flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 p-3 font-bold"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-slate-950 font-black">
          {index + 1}
        </span>

        <span className="text-slate-200">
          {rule}
        </span>
      </div>
    ))}
  </div>
</div>
  </section>
)}
</div>
</div>
<footer className="mt-10 border-t border-slate-800 pt-6 pb-2 text-center">
  <div className="text-slate-400 font-bold">
    World Cup Predictor 2026
  </div>

  <div className="text-slate-600 text-sm mt-2">
    Built for the ultimate World Cup experience
  </div>
</footer>
</main>
);
}