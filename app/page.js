"use client";
import { Fragment } from "react";

import { useMemo, useState, useRef } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { didYouKnowFacts } from "@/data/didYouKnowFacts";

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
  { id: 74, date: "29.06.2026", time: "23:30", stage: "32 האחרונות", group: "", home: "E1", away: "3rd A/B/C/D/F" },
  { id: 75, date: "30.06.2026", time: "04:00", stage: "32 האחרונות", group: "", home: "F1", away: "C2" },
  { id: 76, date: "29.06.2026", time: "20:00", stage: "32 האחרונות", group: "", home: "C1", away: "F2" },
  { id: 77, date: "01.07.2026", time: "00:00", stage: "32 האחרונות", group: "", home: "I1", away: "3rd C/D/F/G/H" },
  { id: 78, date: "30.06.2026", time: "20:00", stage: "32 האחרונות", group: "", home: "E2", away: "I2" },
  { id: 79, date: "01.07.2026", time: "04:00", stage: "32 האחרונות", group: "", home: "A1", away: "3rd C/E/F/H/I" },
  { id: 80, date: "01.07.2026", time: "19:00", stage: "32 האחרונות", group: "", home: "L1", away: "3rd E/H/I/J/K" },
  { id: 81, date: "02.07.2026", time: "03:00", stage: "32 האחרונות", group: "", home: "D1", away: "3rd B/E/F/I/J" },
  { id: 82, date: "01.07.2026", time: "23:00", stage: "32 האחרונות", group: "", home: "G1", away: "3rd A/E/H/I/J" },
  { id: 83, date: "03.07.2026", time: "02:00", stage: "32 האחרונות", group: "", home: "K2", away: "L2" },
  { id: 84, date: "02.07.2026", time: "22:00", stage: "32 האחרונות", group: "", home: "H1", away: "J2" },
  { id: 85, date: "03.07.2026", time: "06:00", stage: "32 האחרונות", group: "", home: "B1", away: "3rd E/F/G/I/J" },
  { id: 86, date: "04.07.2026", time: "01:00", stage: "32 האחרונות", group: "", home: "J1", away: "H2" },
  { id: 87, date: "04.07.2026", time: "04:30", stage: "32 האחרונות", group: "", home: "K1", away: "3rd D/E/I/J/L" },
  { id: 88, date: "03.07.2026", time: "21:00", stage: "32 האחרונות", group: "", home: "D2", away: "G2" },
  { id: 89, date: "05.07.2026", time: "00:00", stage: "שמינית", group: "", home: "Winner M74", away: "Winner M77" },
  { id: 90, date: "04.07.2026", time: "20:00", stage: "שמינית", group: "", home: "Winner M73", away: "Winner M75" },
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

function hasCompletePrediction(prediction) {
  return (
    prediction?.home !== "" &&
    prediction?.home != null &&
    prediction?.away !== "" &&
    prediction?.away != null
  );
}

function getDailyDidYouKnowFact(date = new Date()) {
  const tournamentStartDate = new Date("2026-06-11T00:00:00");
  const currentDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const daysFromStart = Math.floor(
    (currentDate - tournamentStartDate) / (1000 * 60 * 60 * 24)
  );
  const factIndex =
    ((daysFromStart % didYouKnowFacts.length) + didYouKnowFacts.length) %
    didYouKnowFacts.length;

  return didYouKnowFacts[factIndex];
}

const DID_YOU_KNOW_SEEN_FACT_IDS_KEY = "didYouKnowSeenFactIds";

function getStoredDidYouKnowSeenFactIds() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(
      DID_YOU_KNOW_SEEN_FACT_IDS_KEY
    );
    const parsedValue = JSON.parse(storedValue || "[]");

    if (!Array.isArray(parsedValue)) return [];

    const validFactIds = new Set(didYouKnowFacts.map((fact) => fact.id));

    return parsedValue.filter(
      (factId, index) =>
        Number.isInteger(factId) &&
        validFactIds.has(factId) &&
        parsedValue.indexOf(factId) === index
    );
  } catch {
    return [];
  }
}

function storeDidYouKnowSeenFactIds(seenFactIds) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    DID_YOU_KNOW_SEEN_FACT_IDS_KEY,
    JSON.stringify(seenFactIds)
  );
}

function rememberDidYouKnowFact(factId) {
  const seenFactIds = getStoredDidYouKnowSeenFactIds();

  if (seenFactIds.includes(factId)) return seenFactIds;

  const updatedSeenFactIds = [...seenFactIds, factId];
  storeDidYouKnowSeenFactIds(updatedSeenFactIds);

  return updatedSeenFactIds;
}

function getRandomDidYouKnowFact(currentFactId) {
  if (didYouKnowFacts.length <= 1) {
    rememberDidYouKnowFact(didYouKnowFacts[0]?.id);
    return didYouKnowFacts[0];
  }

  let seenFactIds = rememberDidYouKnowFact(currentFactId);
  let candidateFacts = didYouKnowFacts.filter(
    (fact) => !seenFactIds.includes(fact.id)
  );

  if (candidateFacts.length === 0) {
    seenFactIds = [currentFactId];
    storeDidYouKnowSeenFactIds(seenFactIds);
    candidateFacts = didYouKnowFacts.filter((fact) => fact.id !== currentFactId);
  }

  const randomFact =
    candidateFacts[Math.floor(Math.random() * candidateFacts.length)];

  storeDidYouKnowSeenFactIds([...seenFactIds, randomFact.id]);

  return randomFact;
}

export default function Home() {
 const [selectedPlayer, setSelectedPlayer] = useState("");
 const [openMatchId, setOpenMatchId] = useState(null);
  const [role, setRole] = useState("");
  const [dbPlayers, setDbPlayers] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authUser, setAuthUser] = useState(null);
const [participantName, setParticipantName] = useState("");
const [message, setMessage] = useState("");
const nextOpenMatchRef = useRef(null);
const [countdown, setCountdown] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});
const [messageType, setMessageType] = useState("");
const [knockoutMatches, setKnockoutMatches] = useState({});
const [adminResultsSearch, setAdminResultsSearch] = useState("");
const [adminResultsFilter, setAdminResultsFilter] = useState("all");
const [allBetsStageFilter, setAllBetsStageFilter] = useState("all");
const [allBetsStatusFilter, setAllBetsStatusFilter] = useState("all");
const [allBetsSearch, setAllBetsSearch] = useState("");
const [matchCardsFilter, setMatchCardsFilter] = useState("all");
const [didYouKnowFact, setDidYouKnowFact] = useState(getDailyDidYouKnowFact);
const [showDidYouKnowModal, setShowDidYouKnowModal] = useState(false);
const activePlayers = dbPlayers.filter(
  (player) =>
    player.is_active &&
    player.is_approved &&
    player.role !== "viewer"
);
 const currentPlayer = dbPlayers.find(
  (player) => player.email === authUser?.email
);
 const loggedInPlayer = dbPlayers.find(
  (player) => player.email === authUser?.email
);
useEffect(() => {
  rememberDidYouKnowFact(didYouKnowFact.id);
}, [didYouKnowFact.id]);

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
  const finalMatchTime = new Date("2026-07-19T22:00:00+03:00");

  function updateCountdown() {
    const now = new Date();
    const diff = finalMatchTime - now;

    if (diff <= 0) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    setCountdown({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  }

  updateCountdown();

  const interval = setInterval(updateCountdown, 1000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!authUser?.email) return;

  let cancelled = false;

  async function syncAuthUserToPlayer() {
    const { data: existingPlayers, error: findError } = await supabase
      .from("players")
      .select("*")
      .eq("email", authUser.email)
      .order("is_approved", { ascending: false })
      .order("id", { ascending: true });

    if (findError) {
      console.error("Error finding player by email:", findError);
      return;
    }

    let player = existingPlayers?.[0];

    if (!player) {
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split("@")[0] ||
        "משתתף חדש";

      const { data: newPlayer, error: insertError } = await supabase
        .from("players")
        .insert([
          {
            name: fullName,
            email: authUser.email,
            role: "player",
            is_active: true,
            is_approved: false,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating Google player:", insertError);
        return;
      }

      player = newPlayer;
      await refreshAllData();
    }

    if (cancelled || !player) return;

    if (!player.is_approved) {
      setSelectedPlayer("");
      setRole("pending");
      showMessage("החשבון שלך ממתין לאישור אדמין", "error");
    } else if (!player.is_active) {
      setSelectedPlayer("");
      setRole("blocked");
      showMessage("החשבון שלך הושבת", "error");
    } else {
      setSelectedPlayer(player.role === "viewer" ? "" : player.name);
      setRole(player.role || "player");
    }
  }

  syncAuthUserToPlayer();

  return () => {
    cancelled = true;
  };
}, [authUser?.email]);

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
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error loading predictions:", error);
      return;
    }

    const batch = data || [];
    rows.push(...batch);

    if (batch.length < pageSize) {
      break;
    }
  }

  const formatted = {};

  rows.forEach((row) => {
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

const buildGroupWinnersPayload = (playerBonus) => {
  return Object.keys(groups).reduce((payload, groupName) => {
    payload[groupName] = playerBonus[groupName] || ["", ""];
    return payload;
  }, {});
};

async function updateBonusQualifier(groupName, index, value) {
  if (!selectedPlayer) return;
  
  const { data: latestSettings, error: settingsError } = await supabase
  .from("app_settings")
  .select("bonus_manually_unlocked")
  .eq("id", 1)
  .single();

if (settingsError) {
  console.error("Error checking latest bonus settings:", settingsError);

  showMessage("שגיאה בבדיקת סטטוס נעילת הבונוסים", "error");
  return;
}

const latestBonusManuallyUnlocked =
  latestSettings?.bonus_manually_unlocked || false;

if (
  isBonusLocked(latestBonusManuallyUnlocked) &&
  !(role === "admin" && adminBonusEditMode)
) {
  showMessage(
    "ניחושי הבונוס נעולים ולא ניתן לשנות אותם",
    "error"
  );

  return;
}

  const { data: currentBonusPlayer, error: playerCheckError } = await supabase
  .from("players")
  .select("id, name, email, role, is_active, is_approved")
  .eq("email", authUser?.email)
  .single();

if (playerCheckError || !currentBonusPlayer) {
  console.error("Error checking player permission:", playerCheckError);
  showMessage("שגיאה בבדיקת הרשאות משתמש", "error");
  return;
}

if (!currentBonusPlayer.is_active) {
  showMessage("החשבון שלך מושבת", "error");
  return;
}

if (!currentBonusPlayer.is_approved) {
  showMessage("החשבון שלך ממתין לאישור אדמין", "error");
  return;
}

if (currentBonusPlayer.role === "viewer") {
  showMessage("אין לך הרשאה לשמור הימורי בונוס", "error");
  return;
}

const playerName =
    currentBonusPlayer.role === "admin" && selectedPlayer
      ? selectedPlayer
      : currentBonusPlayer.name;

const currentBonus = bonusPredictions[playerName] || {};
const currentGroup = currentBonus[groupName] || ["", ""];
const nextGroup = [...currentGroup];
nextGroup[index] = value;

const updatedBonus = {
  ...currentBonus,
  [groupName]: nextGroup,
};

setBonusPredictions((prev) => ({
  ...prev,
  [playerName]: updatedBonus,
}));

  const groupWinners = buildGroupWinnersPayload(updatedBonus);
  const { error } = await supabase.from("bonus_predictions").upsert(
    {
      player_name: playerName,
      champion: updatedBonus.champion || null,
      top_scorer: updatedBonus.topScorer || null,
      group_winners: groupWinners,
    },
    { onConflict: "player_name" }
  );

  if (error) {
    console.error("Error saving bonus qualifier:", error);
  }
}

async function updateSpecialBonus(field, value) {
  if (!selectedPlayer) return;
  const currentLoggedIn = dbPlayers.find((p) => p.email === authUser?.email);
  if (!currentLoggedIn || !currentLoggedIn.is_approved) {
    showMessage("החשבון שלך ממתין לאישור אדמין", "error");
    return;
  }
  if (currentLoggedIn.role === "viewer") {
    showMessage("אין לך הרשאה לשמור ניחושי בונוס", "error");
    return;
  }

  const { data: latestSettings, error: settingsError } = await supabase
  .from("app_settings")
  .select("bonus_manually_unlocked")
  .eq("id", 1)
  .single();

if (settingsError) {
  console.error("Error checking latest bonus settings:", settingsError);

  showMessage("שגיאה בבדיקת סטטוס נעילת הבונוסים", "error");
  return;
}

const latestBonusManuallyUnlocked =
  latestSettings?.bonus_manually_unlocked || false;

if (
  isBonusLocked(latestBonusManuallyUnlocked) &&
  !(role === "admin" && adminBonusEditMode)
) {
  showMessage(
    "ניחושי הבונוס נעולים ולא ניתן לשנות אותם",
    "error"
  );

  return;
}

  const currentBonus = bonusPredictions[selectedPlayer] || {};
  const updatedBonus = {
    ...currentBonus,
    [field === "champion" ? "champion" : "topScorer"]: value,
  };

 const { data: currentBonusPlayer, error: playerCheckError } = await supabase
  .from("players")
  .select("id, name, email, role, is_active, is_approved")
  .eq("email", authUser?.email)
  .single();

if (playerCheckError || !currentBonusPlayer) {
  console.error("Error checking player permission:", playerCheckError);
  showMessage("שגיאה בבדיקת הרשאות משתמש", "error");
  return;
}

if (!currentBonusPlayer.is_active) {
  showMessage("החשבון שלך מושבת", "error");
  return;
}

if (!currentBonusPlayer.is_approved) {
  showMessage("החשבון שלך ממתין לאישור אדמין", "error");
  return;
}

if (currentBonusPlayer.role === "viewer") {
  showMessage("אין לך הרשאה לשמור הימורי בונוס", "error");
  return;
}

const playerName =
    currentBonusPlayer.role === "admin" && selectedPlayer
      ? selectedPlayer
      : currentBonusPlayer.name;
  setBonusPredictions((prev) => ({
    ...prev,
    [playerName]: updatedBonus,
  }));

  const groupWinners = buildGroupWinnersPayload(updatedBonus);
  const { error } = await supabase.from("bonus_predictions").upsert(
    {
      player_name: playerName,
      champion: updatedBonus.champion || null,
      top_scorer: updatedBonus.topScorer || null,
      group_winners: groupWinners,
    },
    { onConflict: "player_name" }
  );

  if (error) {
    console.error("Error saving special bonus:", error);
  }
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
  const manualThirdPlaceData = data.manual_third_place_qualifiers || {};
  setManualThirdPlaceQualifiers(
    Array.isArray(manualThirdPlaceData)
      ? manualThirdPlaceData.reduce(
          (acc, team) => ({ ...acc, [team]: true }),
          {}
        )
      : manualThirdPlaceData
  );
setOfficialBonus(
  data.official_bonus || {
    champion: "",
    topScorer: "",
  }
);
  setLeaderboardSnapshot(data.leaderboard_snapshot || null);
}
async function upsertKnockoutMatchData(matchId, data) {
  const { error } = await supabase.from("knockout_matches").upsert(
    {
      match_id: matchId,
      home_team: data.home_team || null,
      away_team: data.away_team || null,
      winner_team: data.winner_team || null,
      loser_team: data.loser_team || null,
    },
    { onConflict: "match_id" }
  );

  if (error) {
    console.error("Error saving knockout match:", matchId, error);
    throw error;
  }
}

async function clearKnockoutMatchResults(matchIds = []) {
  if (!matchIds.length) return;

  setResults((prev) => {
    const next = { ...prev };
    matchIds.forEach((id) => {
      next[id] = { home: "", away: "" };
    });
    return next;
  });

  const updates = matchIds.map((match_id) => ({
    match_id,
    home_score: null,
    away_score: null,
  }));

  const { error } = await supabase
    .from("match_results")
    .upsert(updates, { onConflict: "match_id" });

  if (error) {
    console.error("Error clearing knockout match results:", error);
  }
}

async function cascadeKnockoutCleanup(matchId, removedTeams, stateSnapshot = {}) {
  const progression = knockoutProgression[matchId];
  if (!progression) return { knockoutUpdates: {}, clearedResults: [] };

  let cleanupUpdates = {};
  let clearedResults = [];
  const branches = [
    { nextMatch: progression.nextMatch, side: progression.side },
    { nextMatch: progression.loserNextMatch, side: progression.loserSide },
  ];

  for (const branch of branches) {
    if (!branch.nextMatch || !branch.side) continue;

    const childId = branch.nextMatch;
    const existing =
      cleanupUpdates[childId] || stateSnapshot[childId] || knockoutMatches[childId] || {};
    const updated = { ...existing };
    let changed = false;

    ["home_team", "away_team", "winner_team", "loser_team"].forEach((field) => {
      if (removedTeams.includes(updated[field])) {
        updated[field] = null;
        changed = true;
      }
    });

    if ((!updated.home_team || !updated.away_team) && (updated.winner_team || updated.loser_team)) {
      updated.winner_team = null;
      updated.loser_team = null;
      changed = true;
    }

    if (changed) {
      cleanupUpdates[childId] = updated;
      if (
        results[childId]?.home !== "" &&
        results[childId]?.home != null &&
        results[childId]?.away !== "" &&
        results[childId]?.away != null
      ) {
        clearedResults.push(childId);
      }

      const nextSnapshot = { ...stateSnapshot, ...cleanupUpdates };
      const deeper = await cascadeKnockoutCleanup(childId, removedTeams, nextSnapshot);
      cleanupUpdates = { ...cleanupUpdates, ...deeper.knockoutUpdates };
      clearedResults = [...clearedResults, ...deeper.clearedResults];
    }
  }

  return { knockoutUpdates: cleanupUpdates, clearedResults };
}

async function updateKnockoutWinner(match, winnerTeam) {
  const existing = knockoutMatches[match.id] || {};
  const previousWinner = existing.winner_team;
  const previousLoser = existing.loser_team;
  const removedTeams = [previousWinner, previousLoser].filter(
    (team) => team && team !== winnerTeam
  );

  if (!winnerTeam) {
    const currentUpdated = {
      ...existing,
      winner_team: null,
      loser_team: null,
    };
    const cleanupState = { ...knockoutMatches, [match.id]: currentUpdated };
    const cleanupResult =
      removedTeams.length > 0
        ? await cascadeKnockoutCleanup(match.id, removedTeams, cleanupState)
        : { knockoutUpdates: {}, clearedResults: [] };
    const mergedUpdates = { [match.id]: currentUpdated, ...cleanupResult.knockoutUpdates };

    setKnockoutMatches((prev) => ({ ...prev, ...mergedUpdates }));
    await Promise.all(
      Object.entries(mergedUpdates).map(([matchId, data]) =>
        upsertKnockoutMatchData(matchId, data)
      )
    );
    await clearKnockoutMatchResults(cleanupResult.clearedResults);
    return;
  }

  const homeTeam = getDisplayTeam(match, "home");
  const awayTeam = getDisplayTeam(match, "away");
  const loserTeam = winnerTeam === homeTeam ? awayTeam : homeTeam;
  const progression = knockoutProgression[match.id];
  const currentUpdated = {
    ...existing,
    winner_team: winnerTeam,
    loser_team: loserTeam,
  };
  const mergedUpdates = {
    [match.id]: currentUpdated,
  };

  if (progression) {
    mergedUpdates[progression.nextMatch] = {
      ...(knockoutMatches[progression.nextMatch] || {}),
      [`${progression.side}_team`]: winnerTeam,
    };

    if (progression.loserNextMatch && progression.loserSide) {
      mergedUpdates[progression.loserNextMatch] = {
        ...(knockoutMatches[progression.loserNextMatch] || {}),
        [`${progression.loserSide}_team`]: loserTeam,
      };
    }
  }

  const cleanupUpdates =
    removedTeams.length > 0
      ? await cascadeKnockoutCleanup(match.id, removedTeams, {
          ...knockoutMatches,
          ...mergedUpdates,
        })
      : {};
  const finalUpdates = { ...mergedUpdates, ...cleanupUpdates };

  setKnockoutMatches((prev) => ({ ...prev, ...finalUpdates }));
  await Promise.all(
    Object.entries(finalUpdates).map(([matchId, data]) =>
      upsertKnockoutMatchData(matchId, data)
    )
  );
}

async function updatePlayerActive(playerId, isActive) {
  const confirmMessage = isActive
    ? "האם אתה בטוח שברצונך להחזיר את המשתמש?"
    : "האם אתה בטוח שברצונך להשבית את המשתמש?";

  const confirmed = window.confirm(confirmMessage);

  if (!confirmed) {
    return;
  }

  const { error } = await supabase
    .from("players")
    .update({ is_active: isActive })
    .eq("id", playerId);

  if (error) {
    console.error("Error updating player active status:", error);
    showMessage("שגיאה בעדכון סטטוס המשתתף", "error");
    return;
  }

  setDbPlayers((prev) =>
    prev.map((player) =>
      player.id === playerId
        ? { ...player, is_active: isActive }
        : player
    )
  );

  showMessage("סטטוס המשתתף עודכן בהצלחה");
}

async function updatePlayerName(player, newName) {
  const cleanName = newName.trim();

  if (!cleanName) {
    showMessage("שם המשתתף לא יכול להיות ריק", "error");
    return;
  }

  const oldName = player.name;

  const { error: playerError } = await supabase
    .from("players")
    .update({ name: cleanName })
    .eq("id", player.id);

  if (playerError) {
    console.error("Error updating player name:", playerError);
    showMessage("שגיאה בעדכון שם המשתתף", "error");
    return;
  }

  const { error: predictionsError } = await supabase
    .from("predictions")
    .update({ player_name: cleanName })
    .eq("player_name", oldName);

  if (predictionsError) {
    console.error("Error updating predictions player name:", predictionsError);
    showMessage("שם המשתתף עודכן, אך הייתה שגיאה בעדכון ההימורים", "error");
    return;
  }

  const { error: bonusError } = await supabase
    .from("bonus_predictions")
    .update({ player_name: cleanName })
    .eq("player_name", oldName);

  if (bonusError) {
    console.error("Error updating bonus predictions player name:", bonusError);
    showMessage("שם המשתתף עודכן, אך הייתה שגיאה בעדכון הימורי הבונוס", "error");
    return;
  }

  setDbPlayers((prev) =>
    prev.map((p) =>
      p.id === player.id ? { ...p, name: cleanName } : p
    )
  );

  setEditingPlayerId(null);
  setEditingPlayerName("");

  showMessage("שם המשתתף עודכן בהצלחה");
}

async function approvePlayer(playerId, newRole) {
  const { error } = await supabase
    .from("players")
    .update({
      is_approved: true,
      is_active: true,
      role: newRole,
    })
    .eq("id", playerId);

  if (error) {
    console.error("Error approving player:", error);
    showMessage("שגיאה באישור המשתמש", "error");
    return;
  }

  setDbPlayers((prev) =>
    prev.map((player) =>
      player.id === playerId
        ? {
            ...player,
            is_approved: true,
            is_active: true,
            role: newRole,
          }
        : player
    )
  );

  showMessage(
    newRole === "viewer"
      ? "המשתמש אושר כצפיין"
      : "המשתמש אושר כמשתתף"
  );
}

async function updatePlayerRole(playerId, newRole) {
  const { error } = await supabase
    .from("players")
    .update({ role: newRole })
    .eq("id", playerId);

  if (error) {
    console.error("Error updating player role:", error);
    showMessage("שגיאה בעדכון תפקיד המשתמש", "error");
    return;
  }

  setDbPlayers((prev) =>
    prev.map((player) =>
      player.id === playerId ? { ...player, role: newRole } : player
    )
  );

  showMessage(
    newRole === "viewer"
      ? "המשתמש הוגדר כצפיין"
      : "המשתמש הוגדר כמשתתף"
  );
}

async function deletePlayerCompletely(player) {
  const confirmed = window.confirm(
    `האם אתה בטוח שברצונך למחוק לגמרי את ${player.name}? פעולה זו תמחק גם את כל ההימורים והבונוסים שלו.`
  );

  if (!confirmed) return;

  const secondConfirm = window.confirm(
    "אישור נוסף: המחיקה היא לצמיתות מתוך מערכת המשחק. להמשיך?"
  );

  if (!secondConfirm) return;

  const { error: predictionsError } = await supabase
    .from("predictions")
    .delete()
    .eq("player_name", player.name);

  if (predictionsError) {
    console.error("Error deleting predictions:", predictionsError);
    showMessage("שגיאה במחיקת הימורי המשחקים", "error");
    return;
  }

  const { error: bonusError } = await supabase
    .from("bonus_predictions")
    .delete()
    .eq("player_name", player.name);

  if (bonusError) {
    console.error("Error deleting bonus predictions:", bonusError);
    showMessage("שגיאה במחיקת הימורי הבונוס", "error");
    return;
  }

  const { error: playerError } = await supabase
    .from("players")
    .delete()
    .eq("id", player.id);

  if (playerError) {
    console.error("Error deleting player:", playerError);
    showMessage("שגיאה במחיקת המשתמש", "error");
    return;
  }

  setDbPlayers((prev) => prev.filter((p) => p.id !== player.id));

  showMessage("המשתמש נמחק לגמרי ממערכת המשחק");
}

async function updateKnockoutTeam(matchId, side, value) {
  const existing = knockoutMatches[matchId] || {};

  // normalize empty string to null
  const newValue = value === "" ? null : value;
  const previousValue = existing[side] === "" ? null : existing[side];

  // prepare updated for this match: always reset winner/loser when teams change
  const updated = {
    ...existing,
    [side]: newValue,
    winner_team: null,
    loser_team: null,
  };

  // snapshot to pass to cascade so it sees this match's updated state
  const cleanupState = { ...knockoutMatches, [matchId]: updated };

  // if the previous side held a real team and it was removed or replaced, run cleanup
  const removedTeams = [];
  if (previousValue && previousValue !== newValue) removedTeams.push(previousValue);

  const cleanupResult =
    removedTeams.length > 0
      ? await cascadeKnockoutCleanup(matchId, removedTeams, cleanupState)
      : { knockoutUpdates: {}, clearedResults: [] };

  const finalUpdates = { [matchId]: updated, ...cleanupResult.knockoutUpdates };

  setKnockoutMatches((prev) => ({ ...prev, ...finalUpdates }));
  await Promise.all(
    Object.entries(finalUpdates).map(([mId, data]) => upsertKnockoutMatchData(mId, data))
  );
  await clearKnockoutMatchResults(cleanupResult.clearedResults);
}
async function refreshAllData() {
  await loadPlayers();
  await loadPredictions();
  await loadBonusPredictions();
  await loadResults();
  await loadAppSettings();
  await loadKnockoutMatches();
}

const [page, setPage] = useState("matchesCards");
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [savingPredictionKeys, setSavingPredictionKeys] = useState({});
  const predictionSaveQueueRef = useRef({});
  const predictionDraftRef = useRef({});
  const savingPrediction = Object.keys(savingPredictionKeys).length > 0;
  const [editingPlayerId, setEditingPlayerId] = useState(null);
const [editingPlayerName, setEditingPlayerName] = useState("");
  const [bonusPredictions, setBonusPredictions] = useState({});
  const [showDailyTopList, setShowDailyTopList] = useState(false);
  const [showYesterdayTopList, setShowYesterdayTopList] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showBullList, setShowBullList] = useState(false);
  const [showGuessKingList, setShowGuessKingList] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [officialBonus, setOfficialBonus] = useState({
  champion: "",
  topScorer: "",
});
const [groupStageFinished, setGroupStageFinished] = useState(false);
const [manuallyUnlockedMatches, setManuallyUnlockedMatches] = useState([]);
const [bonusManuallyUnlocked, setBonusManuallyUnlocked] = useState(false);
const [adminBonusEditMode, setAdminBonusEditMode] = useState(false);
const [manualThirdPlaceQualifiers, setManualThirdPlaceQualifiers] = useState({});
const [leaderboardSnapshot, setLeaderboardSnapshot] = useState(null);
const [serverTime, setServerTime] = useState(null);

const qualifiedBonusTeamsByGroup = (() => {
  if (!groupStageFinished) return {};

  const bestThirdPlaceTeams = getBestThirdPlaceTeams(
    matches,
    groups,
    results,
    manualThirdPlaceQualifiers
  );

  return Object.keys(groups).reduce((acc, groupName) => {
    const table = calculateGroupTable(groupName, matches, groups, results);
    const topTwoTeams = table.slice(0, 2).map((team) => team.team);
    const qualifiedThirdPlaceTeams = bestThirdPlaceTeams
      .filter((team) => team.group === groupName && team.isQualified)
      .map((team) => team.team);

    acc[groupName] = new Set([...topTwoTeams, ...qualifiedThirdPlaceTeams]);
    return acc;
  }, {});
})();

// Hall of Fame data
const hallOfFameTournaments = [
  {
    year: "יורו 2012",
    gold: "ארז",
    silver: "איציק",
    bronze: "שלום"
  },
  {
    year: "מונדיאל 2014",
    gold: "אליאור",
    silver: "איציק",
    bronze: "טל קן דרור"
  },
  {
    year: "יורו 2016",
    gold: "ארז",
    silver: "שלום",
    bronze: "טל מלמד"
  },
  {
    year: "מונדיאל 2018",
    gold: "מוטי",
    silver: "אוהד",
    bronze: "איציק ואבירם"
  },
  {
    year: "יורו 2020",
    gold: "טל קן דרור",
    silver: "ארז",
    bronze: "מוטי"
  },
  {
    year: "מונדיאל 2022",
    gold: "טל טובי",
    silver: "רונן",
    bronze: "טל קן דרור"
  },
  {
    year: "יורו 2024",
    gold: "איציק",
    silver: "טל מלמד",
    bronze: "מוטי"
  },
  {
    year: "מונדיאל 2026",
    gold: "—",
    silver: "—",
    bronze: "—"
  }
];

const hallOfFameAllTimeData = [
  { name: "ארז", gold: 2, silver: 1, bronze: 0 },
  { name: "איציק", gold: 1, silver: 2, bronze: 1 },
  { name: "מוטי", gold: 1, silver: 0, bronze: 2 },
  { name: "טל קן דרור", gold: 1, silver: 0, bronze: 2 },
  { name: "אליאור", gold: 1, silver: 0, bronze: 0 },
  { name: "טל טובי", gold: 1, silver: 0, bronze: 0 },
  { name: "שלום", gold: 0, silver: 1, bronze: 1 },
  { name: "טל מלמד", gold: 0, silver: 1, bronze: 1 },
  { name: "אוהד", gold: 0, silver: 1, bronze: 0 },
  { name: "רונן", gold: 0, silver: 1, bronze: 0 },
  { name: "אבירם", gold: 0, silver: 0, bronze: 1 }
];

const hallOfFameAllTimeSorted = useMemo(() => {
  return hallOfFameAllTimeData
    .map(player => ({
      ...player,
      totalPodiums: player.gold + player.silver + player.bronze
    }))
    .sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.totalPodiums !== a.totalPodiums) return b.totalPodiums - a.totalPodiums;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });
}, []);

useEffect(() => {
  const savedPage = localStorage.getItem("currentPage");
  if (savedPage) {
    setPage(savedPage);
  }
}, []);
useEffect(() => {
  localStorage.setItem("currentPage", page);
}, [page]);

useEffect(() => {
  async function loadServerTime() {
    const { data, error } = await supabase.rpc("get_server_time");

    if (error) {
      console.error("Error loading server time:", error);
      return;
    }

    console.log("Server time raw:", data);
console.log("Server time local:", new Date(data));

    setServerTime(new Date(data));
  }

  loadServerTime();

  const interval = setInterval(() => {
    loadServerTime();
  }, 10000);

  refreshAllData();

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (
    role === "viewer" &&
    (page === "matches" ||
      page === "matchesCards" ||
      page === "bonus")
  ) {
    setPage("leaderboard");
  }

  if (role === "pending") {
    setPage("leaderboard");
  }
}, [role, page]);

useEffect(() => {
  if (!authUser?.email) return;

  async function updatePresence() {
    const { error } = await supabase
      .from("players")
      .update({
        last_seen: new Date().toISOString(),
        current_page: page,
      })
      .eq("email", authUser.email);

    if (error) {
      console.error("Presence update error:", error);
    } else {
      console.log("Presence updated");
    }
  }

  updatePresence();

  const interval = setInterval(updatePresence, 30000);

  return () => clearInterval(interval);
}, [authUser?.email, page]);

function setPredictionKeySaving(key, isSaving) {
  setSavingPredictionKeys((prev) => {
    if (isSaving) {
      return { ...prev, [key]: true };
    }

    const next = { ...prev };
    delete next[key];
    return next;
  });
}

async function savePredictionToSupabase(playerName, matchId, prediction) {
  return supabase
    .from("predictions")
    .upsert(
      [
        {
          player_name: playerName,
          match_id: matchId,
          home_score:
            prediction.home === ""
              ? null
              : Number(prediction.home),
          away_score:
            prediction.away === ""
              ? null
              : Number(prediction.away),
        },
      ],
      {
        onConflict: "player_name,match_id",
      }
    );
}

async function queuePredictionSave(playerName, matchId, prediction) {
  const key = `${playerName}-${matchId}`;
  const queue =
    predictionSaveQueueRef.current[key] || {
      inFlight: false,
      pending: null,
      latest: null,
    };

  predictionSaveQueueRef.current[key] = queue;
  queue.latest = prediction;
  predictionDraftRef.current[key] = prediction;

  if (queue.inFlight) {
    queue.pending = prediction;
    return;
  }

  queue.inFlight = true;
  setPredictionKeySaving(key, true);

  let predictionToSave = prediction;

  while (predictionToSave) {
    queue.pending = null;

    const { error } = await savePredictionToSupabase(
      playerName,
      matchId,
      predictionToSave
    );

    if (error) {
      console.error("Error saving prediction:", error);
      showMessage("שגיאה בשמירת ההימור: " + error.message, "error");
      break;
    }

    predictionToSave = queue.pending;
  }

  queue.inFlight = false;
  delete predictionSaveQueueRef.current[key];
  setPredictionKeySaving(key, false);

  if (!predictionToSave) {
    showMessage("ההימור נשמר בהצלחה");
  }
}

  async function updatePrediction(matchId, side, value) {
  const localPlayerName =
    role === "admin" && selectedPlayer
      ? selectedPlayer
      : loggedInPlayer?.name;
  const localSaveKey = localPlayerName
    ? `${localPlayerName}-${matchId}`
    : null;

  if (localPlayerName && localSaveKey) {
    const currentDraft =
      predictionDraftRef.current[localSaveKey] ||
      predictionSaveQueueRef.current[localSaveKey]?.latest ||
      predictions[localPlayerName]?.[matchId] || {
        home: "",
        away: "",
      };

    predictionDraftRef.current[localSaveKey] = {
      ...currentDraft,
      [side]: value,
    };
  }

  try {
     const { data: currentLoggedIn, error: playerCheckError } = await supabase
  .from("players")
  .select("id, name, email, role, is_active, is_approved")
  .eq("email", authUser?.email)
  .single();

if (playerCheckError || !currentLoggedIn) {
  console.error("Error checking player permission:", playerCheckError);
  showMessage("שגיאה בבדיקת הרשאות משתמש", "error");
  return;
}

if (!currentLoggedIn.is_active) {
  showMessage("החשבון שלך מושבת", "error");
  return;
}

if (!currentLoggedIn.is_approved) {
  showMessage("החשבון שלך ממתין לאישור אדמין", "error");
  return;
}

if (currentLoggedIn.role === "viewer") {
  showMessage("אין לך הרשאה להגיש הימורים", "error");
  return;
}
    const { data: latestSettings, error: settingsError } = await supabase
      .from("app_settings")
      .select("manually_unlocked_matches")
      .eq("id", 1)
      .single();

    if (settingsError) {
      console.error("Error checking latest app settings:", settingsError);
      showMessage("שגיאה בבדיקת סטטוס נעילה", "error");
      return;
    }

    const latestManuallyUnlockedMatches =
      latestSettings?.manually_unlocked_matches || [];

    const match = matches.find((m) => m.id === matchId);
    const locked =
      match &&
      isMatchLocked(
        match,
        latestManuallyUnlockedMatches,
        knockoutMatches,
        results
      );

    if (
      locked
    ) {
      showMessage("לא ניתן לשמור, המשחק נעול או קרוב להתחלה", "error");
      return;
    }

    const playerName =
      currentLoggedIn.role === "admin" && selectedPlayer
        ? selectedPlayer
        : currentLoggedIn.name;

    const saveKey = `${playerName}-${matchId}`;

    const draftPrediction = predictionDraftRef.current[saveKey];

const currentPrediction =
  draftPrediction ||
  predictionSaveQueueRef.current[saveKey]?.latest ||
  predictions[playerName]?.[matchId] || {
    home: "",
    away: "",
  };

    const updatedPrediction =
      draftPrediction ||
      {
            ...currentPrediction,
            [side]: value,
          };

    predictionDraftRef.current[saveKey] = updatedPrediction;

    setPredictions((prev) => ({
      ...prev,
      [playerName]: {
  ...(prev[playerName] || {}),
  [matchId]: updatedPrediction,
},
    }));

    await queuePredictionSave(playerName, matchId, updatedPrediction);
  } catch (error) {
    console.error("Unexpected error saving prediction:", error);
    showMessage("שגיאה לא צפויה בשמירת ההימור", "error");
  }
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
    const homeTeam = getDisplayTeam(match, "home");
    const awayTeam = getDisplayTeam(match, "away");
    const homeScore = Number(updatedResult.home);
    const awayScore = Number(updatedResult.away);

    if (isRealTeamName(homeTeam) && isRealTeamName(awayTeam)) {
      if (homeScore > awayScore) {
        await updateKnockoutWinner(match, homeTeam);
      } else if (awayScore > homeScore) {
        await updateKnockoutWinner(match, awayTeam);
      }
    }
  }

  showMessage("תוצאת המשחק נשמרה בהצלחה");
}
function hasCompleteResult(result) {
  return (
    result &&
    result.home !== "" &&
    result.home != null &&
    result.away !== "" &&
    result.away != null
  );
}

function getHeadToHeadStats(tiedTeams, groupMatches, results) {
  const tiedTeamNames = new Set(tiedTeams.map((team) => team.team));
  const stats = Object.fromEntries(
    tiedTeams.map((team) => [
      team.team,
      { points: 0, gf: 0, ga: 0, gd: 0 },
    ])
  );

  groupMatches.forEach((match) => {
    if (!tiedTeamNames.has(match.home) || !tiedTeamNames.has(match.away)) {
      return;
    }

    const result = results[match.id];
    if (!hasCompleteResult(result)) {
      return;
    }

    const homeGoals = Number(result.home);
    const awayGoals = Number(result.away);
    const homeStats = stats[match.home];
    const awayStats = stats[match.away];

    homeStats.gf += homeGoals;
    homeStats.ga += awayGoals;
    awayStats.gf += awayGoals;
    awayStats.ga += homeGoals;

    if (homeGoals > awayGoals) {
      homeStats.points += 3;
    } else if (homeGoals < awayGoals) {
      awayStats.points += 3;
    } else {
      homeStats.points += 1;
      awayStats.points += 1;
    }

    homeStats.gd = homeStats.gf - homeStats.ga;
    awayStats.gd = awayStats.gf - awayStats.ga;
  });

  return stats;
}

function splitBySameHeadToHeadRank(teams, groupMatches, results, originalOrder) {
  if (teams.length <= 1) return teams.map((team) => [team]);

  const stats = getHeadToHeadStats(teams, groupMatches, results);
  const sorted = [...teams].sort((a, b) => {
    const statsA = stats[a.team];
    const statsB = stats[b.team];

    if (statsB.points !== statsA.points) return statsB.points - statsA.points;
    if (statsB.gd !== statsA.gd) return statsB.gd - statsA.gd;
    if (statsB.gf !== statsA.gf) return statsB.gf - statsA.gf;
    return originalOrder[a.team] - originalOrder[b.team];
  });

  const groupsByRank = [];
  sorted.forEach((team) => {
    const teamStats = stats[team.team];
    const previousGroup = groupsByRank[groupsByRank.length - 1];
    const previousTeam = previousGroup?.[0];
    const previousStats = previousTeam ? stats[previousTeam.team] : null;

    if (
      previousStats &&
      previousStats.points === teamStats.points &&
      previousStats.gd === teamStats.gd &&
      previousStats.gf === teamStats.gf
    ) {
      previousGroup.push(team);
    } else {
      groupsByRank.push([team]);
    }
  });

  if (groupsByRank.length === 1) {
    return groupsByRank;
  }

  return groupsByRank.flatMap((group) =>
    group.length > 1
      ? splitBySameHeadToHeadRank(group, groupMatches, results, originalOrder)
      : [group]
  );
}

function compareOptionalTieBreakers(a, b) {
  if (
    Number.isFinite(a.fairPlayPoints) &&
    Number.isFinite(b.fairPlayPoints) &&
    b.fairPlayPoints !== a.fairPlayPoints
  ) {
    return b.fairPlayPoints - a.fairPlayPoints;
  }

  if (
    Number.isFinite(a.fifaRanking) &&
    Number.isFinite(b.fifaRanking) &&
    a.fifaRanking !== b.fifaRanking
  ) {
    return a.fifaRanking - b.fifaRanking;
  }

  return 0;
}

function rankTeamsTiedOnPoints(tiedTeams, groupMatches, results, originalOrder) {
  const headToHeadGroups = splitBySameHeadToHeadRank(
    tiedTeams,
    groupMatches,
    results,
    originalOrder
  );

  return headToHeadGroups.flatMap((group) =>
    [...group].sort((a, b) => {
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;

      const optionalTieBreaker = compareOptionalTieBreakers(a, b);
      if (optionalTieBreaker !== 0) return optionalTieBreaker;

      return originalOrder[a.team] - originalOrder[b.team];
    })
  );
}

function sortGroupTableByFifaTieBreakers(table, groupName, matches, results, originalOrder) {
  const groupMatches = matches.filter((match) => match.group === groupName);
  const sortedByPoints = [...table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return originalOrder[a.team] - originalOrder[b.team];
  });

  const ranked = [];
  for (let index = 0; index < sortedByPoints.length; index++) {
    const samePointTeams = [sortedByPoints[index]];

    while (
      sortedByPoints[index + 1] &&
      sortedByPoints[index + 1].points === samePointTeams[0].points
    ) {
      samePointTeams.push(sortedByPoints[index + 1]);
      index++;
    }

    ranked.push(
      ...(
        samePointTeams.length > 1
          ? rankTeamsTiedOnPoints(samePointTeams, groupMatches, results, originalOrder)
          : samePointTeams
      )
    );
  }

  return ranked;
}

function calculateGroupTable(groupName, matches, groups, results) {
  const teams = groups[groupName];
  const originalOrder = Object.fromEntries(
    teams.map((team, index) => [team, index])
  );

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

      if (!hasCompleteResult(result)) {
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

  return sortGroupTableByFifaTieBreakers(
    table,
    groupName,
    matches,
    results,
    originalOrder
  );
}
function getBestThirdPlaceTeams(matches, groups, results, manualOverrides = {}) {
  const thirdPlaceTeams = Object.keys(groups)
    .map((groupName) => {
      const table = calculateGroupTable(groupName, matches, groups, results);
      const thirdTeam = table[2];

      if (!thirdTeam) return null;

      const hasManualOverride = Object.prototype.hasOwnProperty.call(
        manualOverrides,
        thirdTeam.team
      );
      const isManualQualified = hasManualOverride
        ? manualOverrides[thirdTeam.team] === true
        : false;

      return {
        ...thirdTeam,
        group: groupName,
        hasManualOverride,
        isManualQualified,
      };
    })
    .filter(Boolean);

  const sorted = [...thirdPlaceTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  return sorted.map((team, index) => ({
    ...team,
    rank: index + 1,
    isAutoQualified: index < 8,
    isQualified: team.hasManualOverride
      ? team.isManualQualified
      : index < 8,
  }));
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

  const bestThirdPlaceTeams = getBestThirdPlaceTeams(
    matches,
    groups,
    results,
    manualThirdPlaceQualifiers
  );

  const qualifiedThirdPlaceTeams = bestThirdPlaceTeams
    .filter((team) => team.isQualified)
    .map((team) => team.team);

  if (groupStageFinished) {
    Object.keys(groups).forEach((groupName) => {
      const table = calculateGroupTable(groupName, matches, groups, results);
      const topTwoTeams = table.slice(0, 2).map((team) => team.team);

      const qualifiedTeams = [
        ...topTwoTeams,
        ...qualifiedThirdPlaceTeams,
      ];
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
function parseMatchDateTime(match) {
  const [day, month, year] = match.date.split(".");
  const [hours, minutes] = match.time.split(":");

  return new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+03:00`
  );
}

const MATCH_LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;

function hasMatchResult(match, results = {}) {
  const result = results[match.id];

  return (
    result?.home !== "" &&
    result?.home != null &&
    result?.away !== "" &&
    result?.away != null
  );
}

function isMatchLive(match, currentTime, results = {}) {
  if (!currentTime || hasMatchResult(match, results)) return false;

  const matchDateTime = parseMatchDateTime(match);
  const liveUntil = new Date(matchDateTime.getTime() + MATCH_LIVE_WINDOW_MS);

  return currentTime >= matchDateTime && currentTime < liveUntil;
}

function getJumpTargetMatch(matches, serverTime, results = {}) {
  const currentTime = serverTime ? new Date(serverTime) : new Date();
  const sortedMatches = [...matches].sort(
    (a, b) => parseMatchDateTime(a).getTime() - parseMatchDateTime(b).getTime()
  );

  return (
    sortedMatches.find((match) => isMatchLive(match, currentTime, results)) ||
    sortedMatches.find((match) => parseMatchDateTime(match) > currentTime) ||
    sortedMatches[sortedMatches.length - 1] ||
    null
  );
}

function isMatchToday(match, serverTime) {
  if (!match?.date || !match?.time) return false;

  const matchDateTime = parseMatchDateTime(match);
  const today = serverTime ? new Date(serverTime) : new Date();

  const matchDate = matchDateTime.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
  const todayDate = today.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });

  return matchDate === todayDate;
}

function isMatchOnDate(match, targetDate, serverTime) {
  if (!match?.date || !match?.time) return false;

  const matchDateTime = parseMatchDateTime(match);
  const dateToCheck = targetDate ? new Date(targetDate) : serverTime ? new Date(serverTime) : new Date();

  const matchDate = matchDateTime.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });
  const targetDateString = dateToCheck.toLocaleDateString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });

  return matchDate === targetDateString;
}

function getDailyTopPerformerForDate(
  activePlayers,
  predictions,
  results,
  matches,
  serverTime,
  targetDate,
  titleSingular,
  titlePlural
) {
  const matchesForDate = matches.filter((match) => {
    const result = results[match.id];

    return (
      result &&
      result.home != null &&
      result.home !== "" &&
      result.away != null &&
      result.away !== "" &&
      isMatchOnDate(match, targetDate, serverTime)
    );
  });

  if (matchesForDate.length === 0) {
    return { hasResults: false };
  }

  const scores = activePlayers.map((playerObj) => {
    const player = playerObj.name;
    const points = matchesForDate.reduce((sum, match) => {
      const prediction = predictions[player]?.[match.id];
      const result = results[match.id];
      return sum + calculatePoints(prediction, result);
    }, 0);

    return { player, points };
  });

  const maxPoints = Math.max(...scores.map((row) => row.points));
  const winners = scores.filter((row) => row.points === maxPoints).map((row) => row.player);

  return {
    hasResults: true,
    points: maxPoints,
    winners,
    title: winners.length === 1 ? titleSingular : titlePlural,
  };
}

function getDailyTopPerformer(activePlayers, predictions, results, matches, serverTime) {
  const todayMatches = matches.filter((match) => {
    const result = results[match.id];

    return (
      result &&
      result.home != null &&
      result.home !== "" &&
      result.away != null &&
      result.away !== "" &&
      isMatchToday(match, serverTime)
    );
  });

  if (todayMatches.length === 0) {
    return { hasResultsToday: false };
  }

  const scores = activePlayers.map((playerObj) => {
    const player = playerObj.name;
    const points = todayMatches.reduce((sum, match) => {
      const prediction = predictions[player]?.[match.id];
      const result = results[match.id];
      return sum + calculatePoints(prediction, result);
    }, 0);

    return { player, points };
  });

  const maxPoints = Math.max(...scores.map((row) => row.points));
  const winners = scores.filter((row) => row.points === maxPoints).map((row) => row.player);

  return {
    hasResultsToday: true,
    points: maxPoints,
    winners,
    title: winners.length === 1 ? "⭐ מצטיין היום" : "⭐ מצטייני היום",
  };
}

function getPlayerProfile(row, predictions, matches) {
  const savedPredictions = predictions[row.player] || {};
  // number of saved predictions by this player (for "הימורים שמולאו")
  const savedPredictionsCount = Object.values(savedPredictions).filter(
    (prediction) =>
      prediction &&
      prediction.home != null &&
      prediction.home !== "" &&
      prediction.away != null &&
      prediction.away !== ""
  ).length;

  // completedMatches: matches that have a final result in `results` (passed via outer scope)
  const completedMatches = matches
    .map((match) => ({ match, result: results[match.id] }))
    .filter(({ result }) =>
      result &&
      result.home != null &&
      result.home !== "" &&
      result.away != null &&
      result.away !== ""
    )
    .map(({ match, result }) => {
      const prediction = savedPredictions[match.id];
      const points = calculatePoints(prediction, result);
      const [day, month, year] = match.date.split(".");
      const [hours, minutes] = match.time.split(":");
      return {
        points,
        timestamp: new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hours),
          Number(minutes)
        ).getTime(),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  const completedMatchesCount = completedMatches.length;

  let bestStreak = 0;
  let currentStreak = 0;
  let streak = 0;

  for (const match of completedMatches) {
    if (match.points > 0) {
      streak += 1;
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    } else {
      streak = 0;
    }
  }

  for (let i = completedMatches.length - 1; i >= 0; i -= 1) {
    if (completedMatches[i].points > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  // Use matchPoints from the leaderboard row (sum of calculatePoints for matches)
  const playerMatchPoints = row.matchPoints || 0;

  const successRate = completedMatchesCount > 0
    ? Math.round((playerMatchPoints / (completedMatchesCount * 4.5)) * 100)
    : 0;

  const totalMatches = matches?.length;

  return {
    player: row.player,
    total: row.total,
    exactHits: row.exactHits,
    correctDirections: row.correctDirections,
    bonusPoints: row.qualifiersPoints + row.championPoints + row.topScorerPoints,
    successCount: row.exactHits + row.correctDirections,
    completedPredictions: savedPredictionsCount,
    successRate,
    matchProgress: totalMatches
      ? `${savedPredictionsCount} מתוך ${totalMatches}`
      : `${savedPredictionsCount}`,
    currentStreak,
    bestStreak,
  };
}

function isRealTeamName(team) {
  if (!team) return false;

  const value = String(team).trim();

  if (value === "") return false;
  if (value.includes("Winner")) return false;
  if (value.includes("Loser")) return false;
  if (value.includes("3rd")) return false;
  if (/^[A-L][12]$/.test(value)) return false;

  return Object.values(groups).flat().includes(value);
}
function isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches = {}, results = {}) {
  if (!match.group) {
    const knockoutData = knockoutMatches[match.id];

    const homeTeam = knockoutData?.home_team || match.home;
    const awayTeam = knockoutData?.away_team || match.away;

    const hasRealKnockoutTeams =
      isRealTeamName(homeTeam) && isRealTeamName(awayTeam);

    if (hasMatchResult(match, results)) {
      return true;
    }

    if (!hasRealKnockoutTeams) {
      return true;
    }
  }

  if (manuallyUnlockedMatches.includes(match.id)) {
    return false;
  }

  const matchDateTime = parseMatchDateTime(match);
  const lockTime = new Date(matchDateTime.getTime() - 5 * 60 * 1000);

  return serverTime ? serverTime >= lockTime : true;
}
function getPredictionWarning(match, prediction, role, serverTime, manuallyUnlockedMatches, knockoutMatches = {}, results = {}) {
  const hasPrediction =
    prediction &&
    ((prediction.home !== "" && prediction.home != null) ||
      (prediction.away !== "" && prediction.away != null));

  if (role !== "player" && role !== "admin") return null;
  if (!serverTime) return null;
  if (hasPrediction) return null;
  if (isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results)) return null;

  const matchDateTime = parseMatchDateTime(match);
  const lockTime = new Date(matchDateTime.getTime() - 5 * 60 * 1000);
  const diffMs = lockTime.getTime() - serverTime.getTime();

  if (diffMs <= 0) return null;
  if (diffMs < 30 * 60 * 1000) {
    return {
      text: "🚨 דחוף",
      classes: "bg-red-500/20 border border-red-500/40 text-red-300",
    };
  }
  if (diffMs < 3 * 60 * 60 * 1000) {
    return {
      text: "⚠️ נסגר בקרוב",
      classes: "bg-orange-500/20 border border-orange-500/40 text-orange-300",
    };
  }
  if (diffMs < 24 * 60 * 60 * 1000) {
    return {
      text: "⏳ פחות מ-24 שעות",
      classes: "bg-yellow-400/20 border border-yellow-400/40 text-yellow-300",
    };
  }

  return null;
}
function getMatchCountdownText(match, serverTime) {
  if (!serverTime) return null;

  const matchDateTime = parseMatchDateTime(match);
  const diffMs = matchDateTime.getTime() - serverTime.getTime();
  if (diffMs <= 0) {
    return "המשחק התחיל";
  }

  const totalMinutes = Math.ceil(diffMs / (60 * 1000));
  const hoursRemaining = Math.floor(totalMinutes / 60);
  const minutesRemaining = totalMinutes % 60;

  if (hoursRemaining === 0) {
    return `מתחיל בעוד ${minutesRemaining} דקות`;
  }

  if (minutesRemaining === 0) {
    return `מתחיל בעוד ${hoursRemaining} שעות`;
  }

  return `מתחיל בעוד ${hoursRemaining} שעות ו-${minutesRemaining} דקות`;
}
function isBonusLocked(bonusManuallyUnlocked) {
  if (bonusManuallyUnlocked) {
    return false;
  }

  const bonusDeadline = new Date(2026, 5, 11, 17, 0);

  return serverTime ? serverTime >= bonusDeadline : true;
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

const getLeaderboardMovementLabel = (player) => {
  return leaderboardSnapshot?.movements?.[player] || "";
};

const dailyTopPerformer = useMemo(() => {
  return getDailyTopPerformer(activePlayers, predictions, results, matches, serverTime);
}, [activePlayers, predictions, results, matches, serverTime]);

const yesterdayTopPerformer = useMemo(() => {
  const currentDate = serverTime ? new Date(serverTime) : new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  return getDailyTopPerformerForDate(
    activePlayers,
    predictions,
    results,
    matches,
    serverTime,
    yesterday,
    "⭐ מצטיין אתמול",
    "⭐ מצטייני אתמול"
  );
}, [activePlayers, predictions, results, matches, serverTime]);

const bullKing = useMemo(() => {
  const list = leaderboard || [];
  if (!list || list.length === 0) return { hasAny: false, winners: [], hits: 0, title: "🎯 מלך הבולים" };

  const maxHits = Math.max(...list.map((r) => r.exactHits || 0));
  const winners = list.filter((r) => (r.exactHits || 0) === maxHits).map((r) => r.player);

  return {
    hasAny: maxHits > 0,
    winners,
    hits: maxHits,
    title: winners.length === 1 ? "🎯 מלך הבולים" : "🎯 מלכי הבולים",
  };
}, [leaderboard]);

const guessKing = useMemo(() => {
  const list = leaderboard || [];
  if (!list || list.length === 0) return { hasAny: false, winners: [], hits: 0, title: "👑 מלך הניחושים" };

  const maxHits = Math.max(...list.map((r) => r.correctDirections || 0));
  const winners = list.filter((r) => (r.correctDirections || 0) === maxHits).map((r) => r.player);

  return {
    hasAny: maxHits > 0,
    winners,
    hits: maxHits,
    title: winners.length === 1 ? "👑 מלך הניחושים" : "👑 מלכי הניחושים",
  };
}, [leaderboard]);

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
      is_approved: false,
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
  if (!freshPlayer.data.is_approved) {
    setSelectedPlayer("");
    setRole("pending");
    showMessage("החשבון שלך ממתין לאישור אדמין", "error");
  } else if (!freshPlayer.data.is_active) {
    setSelectedPlayer("");
    setRole("blocked");
    showMessage("החשבון שלך הושבת", "error");
  } else {
    setSelectedPlayer(freshPlayer.data.role === "viewer" ? "" : freshPlayer.data.name);
    setRole(freshPlayer.data.role || "player");
  }
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

  if (!matchingPlayer) {
    showMessage("המשתמש לא נמצא ברשימת המשתתפים", "error");
    return;
  }

  if (!matchingPlayer.is_approved) {
    setRole("pending");
    setSelectedPlayer("");
    showMessage("החשבון שלך ממתין לאישור אדמין", "error");
    return;
  }

  if (!matchingPlayer.is_active) {
    setRole("blocked");
    setSelectedPlayer("");
    showMessage("החשבון שלך הושבת", "error");
    return;
  }

  setSelectedPlayer(
    matchingPlayer.role === "viewer" ? "" : matchingPlayer.name
  );

  setRole(matchingPlayer.role || "player");

  await refreshAllData();

  showMessage("התחברת בהצלחה");
}
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    showMessage("שגיאה בהתחברות עם Google: " + error.message, "error");
  }
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
async function saveAppSettings(updatedMatches, updatedBonus, updatedGroupStage, updatedThirdPlace = null) {
  const updateObj = {
    manually_unlocked_matches: updatedMatches,
    bonus_manually_unlocked: updatedBonus,
    group_stage_finished: updatedGroupStage,
  };
  
  if (updatedThirdPlace !== null) {
    updateObj.manual_third_place_qualifiers = updatedThirdPlace;
  }
  
  const { error } = await supabase
    .from("app_settings")
    .update(updateObj)
    .eq("id", 1);

  if (error) {
  console.error("Error saving app settings:", error);
  showMessage("שגיאה בשמירת הגדרות הניהול: " + error.message, "error");
  return false;
}

showMessage("הגדרות הניהול נשמרו בהצלחה");
return true;
}

async function saveManualThirdPlaceQualifiers(qualifiers) {
  const { error } = await supabase
    .from("app_settings")
    .update({ manual_third_place_qualifiers: qualifiers })
    .eq("id", 1);

  if (error) {
    console.error("Error saving manual third place qualifiers:", error);
    showMessage("שגיאה בשמירת בחירה ידנית: " + error.message, "error");
    return false;
  }
  
  setManualThirdPlaceQualifiers(qualifiers);
  return true;
}
async function saveLeaderboardSnapshot() {
  const previousPositions = leaderboardSnapshot?.positions || {};
  const currentPositions = Object.fromEntries(
    leaderboard.map((row, index) => [row.player, index + 1])
  );
  const hasPositionChange = leaderboard.some(
    (row) => previousPositions[row.player] !== currentPositions[row.player]
  );

  if (!hasPositionChange && Object.keys(previousPositions).length > 0) {
    showMessage("אין שינוי בדירוג מאז השמירה האחרונה");
    return false;
  }

  const movements = Object.fromEntries(
    leaderboard.map((row) => {
      const currentPosition = currentPositions[row.player];
      const previousPosition = previousPositions[row.player];

      if (!previousPosition) return [row.player, "חדש"];

      const movement = previousPosition - currentPosition;
      if (movement > 0) return [row.player, `↑ +${movement}`];
      if (movement < 0) return [row.player, `↓ -${Math.abs(movement)}`];
      return [row.player, "→"];
    })
  );
  const snapshot = {
    savedAt: new Date().toISOString(),
    positions: currentPositions,
    movements,
  };

  const { error } = await supabase
    .from("app_settings")
    .update({ leaderboard_snapshot: snapshot })
    .eq("id", 1);

  if (error) {
    console.error("Error saving leaderboard snapshot:", error);
    showMessage("שגיאה בשמירת מצב הדירוג: " + error.message, "error");
    return false;
  }

  setLeaderboardSnapshot(snapshot);
  showMessage("מצב הדירוג נשמר בהצלחה");
  return true;
}
async function clearLeaderboardSnapshot() {
  const { error } = await supabase
    .from("app_settings")
    .update({ leaderboard_snapshot: null })
    .eq("id", 1);

  if (error) {
    console.error("Error clearing leaderboard snapshot:", error);
    showMessage("שגיאה בניקוי מצב הדירוג: " + error.message, "error");
    return false;
  }

  setLeaderboardSnapshot(null);
  showMessage("מצב הדירוג נוקה בהצלחה");
  return true;
}
const filteredAllBetsMatches = [...matches].filter((match) => {
  const searchText = allBetsSearch.trim().toLowerCase();

  const matchesSearch =
    searchText === "" ||
    match.home.toLowerCase().includes(searchText) ||
    match.away.toLowerCase().includes(searchText);

  const matchesStage =
    allBetsStageFilter === "all" ||
    (allBetsStageFilter === "groups" && match.group) ||
    (allBetsStageFilter === "knockout" && !match.group);

  const locked = isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results);

  const matchesStatus =
    allBetsStatusFilter === "all" ||
    (allBetsStatusFilter === "open" && !locked) ||
    (allBetsStatusFilter === "locked" && locked);

  return matchesSearch && matchesStage && matchesStatus;
}).sort((a, b) => {
  const kickoffDiff =
    parseMatchDateTime(a).getTime() - parseMatchDateTime(b).getTime();

  return kickoffDiff || a.id - b.id;
});
const scrollToNextOpenMatch = () => {
  if (nextOpenMatchRef.current) {
    nextOpenMatchRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};
const scrollToAllPredictionsJumpMatch = (options = {}) => {
  const targetMatches =
    options?.visibleOnly === true ? filteredAllBetsMatches : matches;
  const targetMatch = getJumpTargetMatch(targetMatches, serverTime, results);

  if (!targetMatch) return;

  const candidates = [
    document.getElementById(`all-predictions-mobile-match-${targetMatch.id}`),
    document.getElementById(`all-predictions-row-${targetMatch.id}`),
  ].filter(Boolean);
  const el = candidates.find((candidate) => candidate.offsetParent) || candidates[0];

  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    showMessage("המשחק לא מוצג בסינון הנוכחי");
  }
};
const scrollToNextIncompleteAdminMatch = () => {
  const nextMatch = matches.find((match) => {
    const result = results[match.id] || { home: "", away: "" };
    return (
      result.home === "" ||
      result.home == null ||
      result.away === "" ||
      result.away == null
    );
  });

  if (!nextMatch) {
    showMessage("כל המשחקים עודכנו");
    return;
  }

  const el = document.getElementById(`match-card-${nextMatch.id}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    showMessage("כל המשחקים עודכנו");
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

const getKnockoutStatus = (match) => {
  if (match.group) return null;

  const homeTeam = getDisplayTeam(match, "home");
  const awayTeam = getDisplayTeam(match, "away");

  const hasHome = isRealTeamName(homeTeam);
  const hasAway = isRealTeamName(awayTeam);

  if (!hasHome || !hasAway) {
    return "missing";
  }

  const winnerTeam = knockoutMatches[match.id]?.winner_team;

  if (winnerTeam && isRealTeamName(winnerTeam)) {
    return "decided";
  }

  return "ready";
};

const getMatchPredictionDistribution = (match) => {
  const homeTeam = getDisplayTeam(match, "home");
  const awayTeam = getDisplayTeam(match, "away");

  if (
    !homeTeam ||
    !awayTeam ||
    !isRealTeamName(homeTeam) ||
    !isRealTeamName(awayTeam)
  ) {
    return null;
  }

  const locked = isMatchLocked(
    match,
    manuallyUnlockedMatches,
    knockoutMatches,
    results
  );

  if (!locked) {
    return { locked: false };
  }

  const counts = { home: 0, tie: 0, away: 0 };

  Object.values(predictions).forEach((playerPredictions) => {
    const prediction = playerPredictions?.[match.id];

    if (
      prediction &&
      prediction.home != null &&
      prediction.home !== "" &&
      prediction.away != null &&
      prediction.away !== ""
    ) {
      const home = Number(prediction.home);
      const away = Number(prediction.away);

      if (home > away) counts.home += 1;
      else if (home === away) counts.tie += 1;
      else counts.away += 1;
    }
  });

  const total = counts.home + counts.tie + counts.away;

  if (total === 0) {
    return { locked: true, empty: true };
  }

  return {
    locked: true,
    empty: false,
    homeTeam,
    awayTeam,
    homePct: Math.round((counts.home / total) * 100),
    tiePct: Math.round((counts.tie / total) * 100),
    awayPct: Math.round((counts.away / total) * 100),
  };
};

const knockoutProgression = {
  73: { nextMatch: 90, side: "home" },
  75: { nextMatch: 90, side: "away" },

  74: { nextMatch: 89, side: "home" },
  77: { nextMatch: 89, side: "away" },

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

  const bonusLocked = isBonusLocked(bonusManuallyUnlocked);
  const canEditBonus = !bonusLocked || (role === "admin" && adminBonusEditMode);
console.log("inactive check", {
  authEmail: authUser?.email,
  loggedInPlayer,
  isActive: loggedInPlayer?.is_active,
});
if (
  authUser &&
  (role === "pending" ||
    (loggedInPlayer &&
      loggedInPlayer.is_approved === false))
) {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-yellow-500/40 rounded-3xl p-6 text-center">
        <h1 className="text-2xl font-black text-yellow-300 mb-3">
          החשבון שלך ממתין לאישור אדמין
        </h1>

        <p className="text-slate-300 font-bold mb-6">
          נרשמת בהצלחה, אך עדיין צריך אישור מנהל לפני שתוכל להשתמש במערכת.
        </p>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setAuthUser(null);
            setSelectedPlayer("");
            setRole("");
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-5 py-3 rounded-2xl"
        >
          התנתק
        </button>
      </div>
    </main>
  );
}
  if (authUser && loggedInPlayer && loggedInPlayer.is_active === false) {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 text-center">
        <h1 className="text-2xl font-black text-red-300 mb-3">
          החשבון שלך הושבת
        </h1>

        <p className="text-slate-300 font-bold mb-6">
          אין לך כרגע גישה למערכת. יש לפנות למנהל המשחק.
        </p>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setAuthUser(null);
            setSelectedPlayer("");
            setRole("");
          }}
          className="bg-red-500 hover:bg-red-400 text-white font-black px-5 py-3 rounded-2xl"
        >
          התנתק
        </button>
      </div>
    </main>
  );
}
function formatLastSeen(value) {
  if (!value) return "לא זמין";

  return new Date(value).toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "short",
  });
}
function isPlayerOnline(lastSeen) {
  if (!lastSeen) return false;

  const now = new Date();
  const last = new Date(lastSeen);

  return now - last < 2 * 60 * 1000;
}
  return (
    
    <main
  dir="rtl"
  className="min-h-screen pb-24 bg-slate-950 text-white p-2 md:p-8 text-xs md:text-base"
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
  <div className="absolute bottom-24 right-6 z-10 rounded-2xl bg-black/45 border border-yellow-400/20 backdrop-blur-sm px-5 py-3">
  <div className="text-yellow-300 text-xs font-black mb-2">
    ⏳ עוד כמה זמן לגמר הגדול
  </div>

  <div className="flex gap-4">
    <div className="text-center">
      <div className="text-2xl font-black text-white">
        {countdown.days}
      </div>
      <div className="text-xs text-slate-400">ימים</div>
    </div>

    <div className="text-center">
      <div className="text-2xl font-black text-white">
        {countdown.hours}
      </div>
      <div className="text-xs text-slate-400">שעות</div>
    </div>

    <div className="text-center">
      <div className="text-2xl font-black text-white">
        {countdown.minutes}
      </div>
      <div className="text-xs text-slate-400">דקות</div>
    </div>

    <div className="text-center">
      <div className="text-2xl font-black text-white">
        {countdown.seconds}
      </div>
      <div className="text-xs text-slate-400">שניות</div>
    </div>
  </div>
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

      <button
  onClick={() => setPage("rules")}
  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur-sm transition-all"
>
  ℹ️ חוקים
</button>

      <div className="mt-5 rounded-2xl bg-black/55 border border-white/10 backdrop-blur-sm p-4">
        <div className="text-slate-300 text-base mb-1">סטטוס מערכת</div>
        <div className="text-green-400 text-3xl font-black">● פעילה</div>
      </div>
      <div className="mt-4 rounded-2xl bg-black/55 border border-yellow-400/20 backdrop-blur-sm p-4">
  <div className="text-yellow-300 text-sm font-black mb-3">
    ⏳ עוד כמה זמן לגמר הגדול
  </div>

  <div className="grid grid-cols-4 gap-2 text-center">
    <div>
      <div className="text-2xl font-black text-white">
        {countdown.days}
      </div>
      <div className="text-xs text-slate-400">ימים</div>
    </div>

    <div>
      <div className="text-2xl font-black text-white">
        {countdown.hours}
      </div>
      <div className="text-xs text-slate-400">שעות</div>
    </div>

    <div>
      <div className="text-2xl font-black text-white">
        {countdown.minutes}
      </div>
      <div className="text-xs text-slate-400">דקות</div>
    </div>

    <div>
      <div className="text-2xl font-black text-white">
        {countdown.seconds}
      </div>
      <div className="text-xs text-slate-400">שניות</div>
    </div>
  </div>
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
        {showAdminLogin && (
  <>
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

    <div className="pt-2">
      

      <button
        onClick={signIn}
        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-2xl font-black shadow-lg"
      >
        התחברות
      </button>
    </div>
  </>
)}

<button
  onClick={signInWithGoogle}
  className="bg-white hover:bg-slate-100 text-slate-950 px-4 py-3 rounded-2xl font-black shadow-lg border border-slate-300"
>
  התחברות עם Google
</button>

<button
  onClick={() => setShowAdminLogin((prev) => !prev)}
  className="text-slate-400 hover:text-white text-sm font-bold mt-3"
>
  {showAdminLogin ? "הסתר כניסת מנהל" : "כניסת מנהל"}
</button>
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

        <div
          dir="rtl"
          className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-black text-yellow-300">💡 הידעת?</div>
              <p
                className="mt-1 overflow-hidden text-sm font-bold leading-6 text-slate-200"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {didYouKnowFact.text}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDidYouKnowModal(true)}
              className="shrink-0 rounded-full bg-yellow-400 px-3 py-2 text-sm font-black text-slate-950 hover:bg-yellow-300"
            >
              קרא עוד
            </button>
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
{role === "admin" && (
  <div className="mt-2 font-black text-white-900">
    משתתפים מהענן: {dbPlayers.map((p) => p.name).join(", ")}
  </div>
)}

</section>

        <nav className={`mb-6 gap-2 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-2 shadow-2xl scrollbar-hide ${
  role === "admin" ? "flex" : "hidden md:flex"
}`}>
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
         {role !== "viewer" && (
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
)}
          {role !== "viewer" && (
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
)}
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
{role === "admin" && (
  <button
    onClick={() => setPage("playersAdmin")}
    className={`whitespace-nowrap px-5 py-3 rounded-2xl font-black transition-all duration-200 ${
      page === "playersAdmin"
        ? "bg-yellow-400 text-slate-950"
        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
    }`}
  >
    ניהול משתתפים
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
    isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results)
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
    disabled={isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results)}
    onChange={(e) =>
      updatePrediction(match.id, "home", e.target.value)
    }
    className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-2 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
  />

  <input
    type="number"
    min="0"
    value={prediction.away ?? ""}
    disabled={isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results)}
    onChange={(e) =>
      updatePrediction(match.id, "away", e.target.value)
    }
    className="w-16 bg-slate-950 border border-slate-600 rounded-2xl p-2 text-center font-black text-lg outline-none focus:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
  />
</div>
{savingPrediction && (
  <div className="mt-2 text-xs font-bold text-yellow-300 text-center">
    שומר...
  </div>
)}
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
  {isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results) ? (
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

                {role === "admin" && (
                  <button
                    type="button"
                    onClick={() => setAdminBonusEditMode((prev) => !prev)}
                    className="mb-4 inline-flex items-center justify-center rounded-2xl bg-slate-700 px-4 py-3 font-black text-yellow-300 hover:bg-slate-600 transition"
                  >
                    {adminBonusEditMode
                      ? "🔒 סגור עריכת בונוסים לאדמין"
                      : "🔓 פתח עריכת בונוסים לאדמין"}
                  </button>
                )}

                <p className="text-slate-400 mb-6">
                  בכל בית יש לבחור בדיוק 2 עולות מתוך 4 הקבוצות באותו בית.
                </p>
                <div
  className={`mb-6 rounded-2xl p-4 font-black ${
    bonusLocked
      ? "bg-red-500 text-white"
      : "bg-green-500 text-black"
  }`}
>
  {bonusLocked
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
                        disabled={!canEditBonus}
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
                        disabled={!canEditBonus}
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
                  disabled={!canEditBonus}
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
                  disabled={!canEditBonus}
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
  const nextMatchCandidates = matches.filter((match) => {
    const locked = isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results);

    if (matchCardsFilter === "open") return !locked;
    if (matchCardsFilter === "locked") return locked;
    if (matchCardsFilter === "groups") return !!match.group;
    if (matchCardsFilter === "knockout") return !match.group;

    return true;
  })
  .filter((match) => !isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results));

  const nextMatch = getJumpTargetMatch(nextMatchCandidates, serverTime, results);

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
      {serverTime && (
        <div className="text-slate-300 text-sm mt-1">
          {getMatchCountdownText(nextMatch, serverTime)}
        </div>
      )}

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

  <button
    type="button"
    onClick={() => setPage("knockoutBracket")}
    className="whitespace-nowrap px-4 py-2 rounded-2xl font-black text-sm transition-all bg-slate-800 hover:bg-slate-700 text-slate-200"
  >
    עץ הנוקאאוט
  </button>
</div>
    <div className="grid gap-4">
      {matches
  .filter((match) => {
    const locked = isMatchLocked(match, manuallyUnlockedMatches, knockoutMatches, results);

    if (matchCardsFilter === "open") return !locked;
    if (matchCardsFilter === "locked") return locked;
    if (matchCardsFilter === "groups") return !!match.group;
    if (matchCardsFilter === "knockout") return !match.group;

    return true;
  })
  .sort((a, b) => {
    const kickoffDiff =
      parseMatchDateTime(a).getTime() - parseMatchDateTime(b).getTime();

    return kickoffDiff || a.id - b.id;
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
          manuallyUnlockedMatches,
          knockoutMatches,
          results
        );

        const warning = getPredictionWarning(
          match,
          prediction,
          role,
          serverTime,
          manuallyUnlockedMatches,
          knockoutMatches,
          results
        );

        const knockoutStatus = getKnockoutStatus(match);

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

  <div className="flex flex-wrap items-center gap-2">
    <div className="text-sm font-bold text-slate-400">
      {match.group ? `בית ${match.group}` : match.stage}
    </div>

    {knockoutStatus && (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${
          knockoutStatus === "missing"
            ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
            : knockoutStatus === "ready"
            ? "bg-green-500/20 border border-green-500/40 text-green-300"
            : "bg-yellow-400/20 border border-yellow-400/40 text-yellow-300"
        }`}
      >
        {knockoutStatus === "missing"
          ? "טרם נקבעו נבחרות"
          : knockoutStatus === "ready"
          ? "נבחרות הוזנו"
          : "הוכרע"}
      </span>
    )}

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

            <div className="text-sm text-slate-400 font-bold mb-2">
              {match.date} | {match.time}
            </div>
            {warning && (
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black mb-3 ${warning.classes}`}
              >
                {warning.text}
              </div>
            )}
            {!match.group &&
  knockoutMatches[match.id]?.winner_team &&
  [
    getDisplayTeam(match, "home"),
    getDisplayTeam(match, "away"),
  ].includes(knockoutMatches[match.id].winner_team) && (
  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-black">
    {getFlagUrl(knockoutMatches[match.id].winner_team) && (
      <img
        src={getFlagUrl(knockoutMatches[match.id].winner_team)}
        alt={knockoutMatches[match.id].winner_team}
        className="w-4 h-4 rounded-full object-cover"
      />
    )}

    <span>עולה: {knockoutMatches[match.id].winner_team}</span>
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
        {page === "knockoutBracket" && (() => {
          const round32Matches = matches
            .filter((match) => match.stage === "32 האחרונות" && !match.group)
            .sort((a, b) => a.id - b.id);
          const round16Matches = matches
            .filter((match) => match.stage === "שמינית" && !match.group)
            .sort((a, b) => a.id - b.id);
          const quarterMatches = matches
            .filter((match) => match.stage === "רבע גמר" && !match.group)
            .sort((a, b) => a.id - b.id);
          const semiMatches = matches
            .filter((match) => match.stage === "חצי גמר" && !match.group)
            .sort((a, b) => a.id - b.id);
          const finalMatch = matches.find((match) => match.stage === "גמר" && !match.group);

          const parseWinnerMatchIds = (value) => {
            const ids = [];
            for (const match of String(value).matchAll(/Winner M(\d+)/gi)) {
              ids.push(Number(match[1]));
            }
            return ids;
          };

          const orderMatchesByNextRound = (currentMatches, nextMatches) => {
            const matchById = Object.fromEntries(currentMatches.map((match) => [match.id, match]));
            const ordered = [];
            const used = new Set();

            nextMatches.forEach((parentMatch) => {
              const feederIds = [
                ...parseWinnerMatchIds(parentMatch.home),
                ...parseWinnerMatchIds(parentMatch.away),
              ];

              feederIds.forEach((id) => {
                if (matchById[id] && !used.has(id)) {
                  ordered.push(matchById[id]);
                  used.add(id);
                }
              });
            });

            currentMatches.forEach((match) => {
              if (!used.has(match.id)) {
                ordered.push(match);
              }
            });

            return ordered;
          };

          const matchById = Object.fromEntries(
            [...round32Matches, ...round16Matches, ...quarterMatches, ...semiMatches]
              .map((match) => [match.id, match])
          );

          const collectBranchMatchIds = (rootMatch) => {
            const ids = new Set();
            const collect = (match) => {
              if (!match || ids.has(match.id)) return;
              ids.add(match.id);
              const feederIds = [
                ...parseWinnerMatchIds(match.home),
                ...parseWinnerMatchIds(match.away),
              ];
              feederIds.forEach((childId) => collect(matchById[childId]));
            };
            collect(rootMatch);
            return ids;
          };

          const leftBranchMatchIds = finalMatch
            ? collectBranchMatchIds(matchById[101])
            : new Set();
          const rightBranchMatchIds = finalMatch
            ? collectBranchMatchIds(matchById[102])
            : new Set();

          const leftRound32 = round32Matches.filter((match) => leftBranchMatchIds.has(match.id));
          const rightRound32 = round32Matches.filter((match) => rightBranchMatchIds.has(match.id));
          const leftRound16 = round16Matches.filter((match) => leftBranchMatchIds.has(match.id));
          const rightRound16 = round16Matches.filter((match) => rightBranchMatchIds.has(match.id));
          const leftQuarter = quarterMatches.filter((match) => leftBranchMatchIds.has(match.id));
          const rightQuarter = quarterMatches.filter((match) => rightBranchMatchIds.has(match.id));
          const leftSemi = semiMatches.filter((match) => leftBranchMatchIds.has(match.id));
          const rightSemi = semiMatches.filter((match) => rightBranchMatchIds.has(match.id));

          const orderedLeftRound32 = orderMatchesByNextRound(leftRound32, leftRound16);
          const orderedRightRound32 = orderMatchesByNextRound(rightRound32, rightRound16);
          const orderedLeftRound16 = orderMatchesByNextRound(leftRound16, leftQuarter);
          const orderedRightRound16 = orderMatchesByNextRound(rightRound16, rightQuarter);
          const orderedLeftQuarter = orderMatchesByNextRound(leftQuarter, leftSemi);
          const orderedRightQuarter = orderMatchesByNextRound(rightQuarter, rightSemi);
          const orderedLeftSemi = orderMatchesByNextRound(leftSemi, finalMatch ? [finalMatch] : []);
          const orderedRightSemi = orderMatchesByNextRound(rightSemi, finalMatch ? [finalMatch] : []);

          const rowStarts = {
            round32: [1, 3, 5, 7, 9, 11, 13, 15],
            round16: [2, 6, 10, 14],
            quarter: [4, 12],
            semi: [8],
            final: [8],
          };

          const renderMatchCard = (match, side) => {
            const homeTeam = getDisplayTeam(match, "home");
            const awayTeam = getDisplayTeam(match, "away");
            const result = results[match.id] || { home: "", away: "" };
            const winner = knockoutMatches[match.id]?.winner_team;
            const homeLabel = isRealTeamName(homeTeam) ? homeTeam : "טרם נקבע";
            const awayLabel = isRealTeamName(awayTeam) ? awayTeam : "טרם נקבע";
            const homeWin = winner && winner === homeTeam;
            const awayWin = winner && winner === awayTeam;

            return (
              <div key={match.id} className="relative">
                {side === "left" && (
                  <div className="absolute right-0 top-1/2 h-[2px] w-12 -translate-y-1/2 bg-slate-700" />
                )}
                {side === "right" && (
                  <div className="absolute left-0 top-1/2 h-[2px] w-12 -translate-y-1/2 bg-slate-700" />
                )}

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-2 shadow-xl">
                  <div className="mb-1.5 text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    משחק {match.id}
                  </div>
                  <div className="mb-2 text-xs font-bold text-sky-300">
                    {match.date} | {match.time}
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { team: homeTeam, label: homeLabel, isWinner: homeWin, score: result.home },
                      { team: awayTeam, label: awayLabel, isWinner: awayWin, score: result.away },
                    ].map(({ team, label, isWinner, score }) => (
                      <div
                        key={`${match.id}-${label}`}
                        className={`flex items-center justify-between gap-2 rounded-2xl border px-2 py-1.5 ${
                          isWinner
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-slate-700 bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getFlagUrl(team) && (
                            <img
                              src={getFlagUrl(team)}
                              alt={label}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          )}
                          <span className="font-black text-slate-100 text-[0.86rem]">{label}</span>
                        </div>
                        <span className="text-xs text-slate-400">{score !== "" ? score : "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          };

          const renderGridColumn = (title, matches, side, starts) => (
            <div key={title} className="min-w-[200px]">
              <div className="mb-2 rounded-2xl bg-slate-950 px-3 py-2 text-center font-black text-slate-200 text-sm">
                {title}
              </div>
              <div
                className="grid min-h-[560px]"
                style={{ gridTemplateRows: "repeat(15, minmax(0, 1fr))" }}
              >
                {matches.map((match, index) => (
                  <div style={{ gridRowStart: starts[index] }} key={match.id}>
                    {renderMatchCard(match, side)}
                  </div>
                ))}
              </div>
            </div>
          );

          const finalWinner = finalMatch
            ? knockoutMatches[finalMatch.id]?.winner_team
            : null;

          return (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">עץ הנוקאאוט</h2>
                <div className="text-slate-400 font-bold mt-1">
                  מבט חזותי על תבנית נוקאאוט סימטרית
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPage("matchesCards")}
                className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-yellow-300"
              >
                חזרה להימורים
              </button>
            </div>

            <div className="overflow-auto rounded-3xl border border-slate-800 bg-slate-950/10 max-h-[68vh]">
              <div className="min-w-[1440px] p-2">
                <div className="flex items-start gap-3">
                  {renderGridColumn("32 האחרונות", orderedLeftRound32, "left", rowStarts.round32)}
                  {renderGridColumn("שמינית", orderedLeftRound16, "left", rowStarts.round16)}
                  {renderGridColumn("רבע גמר", orderedLeftQuarter, "left", rowStarts.quarter)}
                  {renderGridColumn("חצי גמר", orderedLeftSemi, "left", rowStarts.semi)}

                  <div className="min-w-[220px] flex flex-col items-center gap-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-xl w-full">
                      <div className="mb-2 text-center text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        גמר
                      </div>
                      {finalMatch ? (
                        <div style={{ gridRowStart: rowStarts.final[0] }}>
                          {renderMatchCard(finalMatch, "center")}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-slate-700 bg-slate-950 px-3 py-4 text-center text-[0.9rem] text-slate-500">
                          אין משחק גמר
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-3 text-center text-slate-100 shadow-xl w-full">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-amber-200">
                        🏆 אלופת העולם
                      </div>
                      {finalWinner && isRealTeamName(finalWinner) ? (
                        <div className="flex items-center justify-center gap-2 font-black text-base">
                          {getFlagUrl(finalWinner) && (
                            <img
                              src={getFlagUrl(finalWinner)}
                              alt={finalWinner}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          )}
                          <span>{finalWinner}</span>
                        </div>
                      ) : (
                        <div className="text-[0.95rem] text-slate-300">טרם נקבעה</div>
                      )}
                    </div>
                  </div>

                  {renderGridColumn("חצי גמר", orderedRightSemi, "right", rowStarts.semi)}
                  {renderGridColumn("רבע גמר", orderedRightQuarter, "right", rowStarts.quarter)}
                  {renderGridColumn("שמינית", orderedRightRound16, "right", rowStarts.round16)}
                  {renderGridColumn("32 האחרונות", orderedRightRound32, "right", rowStarts.round32)}
                </div>
              </div>
            </div>
          </section>
          );
        })()}

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
  const isQualified =
    groupStageFinished && qualifiedBonusTeamsByGroup[groupName]?.has(team);
  const highlightClass = groupStageFinished
    ? isQualified
      ? "bg-green-500/15 text-green-200 ring-1 ring-green-400/40"
      : "bg-red-500/15 text-red-200 ring-1 ring-red-400/40"
    : "";

  return team ? (
    <div className={`inline-flex max-w-full items-center justify-center gap-1 rounded-full px-2 py-1 ${highlightClass}`}>
      {getFlagUrl(team) && (
        <img
          src={getFlagUrl(team)}
          alt={team}
          className="h-4 w-4 shrink-0 rounded-full object-cover"
        />
      )}

      <span className="truncate">{team}</span>
      {groupStageFinished && (
        <span className="shrink-0 font-black">{isQualified ? "✓" : "✗"}</span>
      )}
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
  const isQualified =
    groupStageFinished && qualifiedBonusTeamsByGroup[groupName]?.has(team);
  const highlightClass = groupStageFinished
    ? isQualified
      ? "bg-green-500/15 text-green-200 ring-1 ring-green-400/40"
      : "bg-red-500/15 text-red-200 ring-1 ring-red-400/40"
    : "";

  return team ? (
    <div className={`inline-flex max-w-full items-center justify-center gap-1 rounded-full px-2 py-1 ${highlightClass}`}>
      {getFlagUrl(team) && (
        <img
          src={getFlagUrl(team)}
          alt={team}
          className="h-4 w-4 shrink-0 rounded-full object-cover"
        />
      )}

      <span className="truncate">{team}</span>
      {groupStageFinished && (
        <span className="shrink-0 font-black">{isQualified ? "✓" : "✗"}</span>
      )}
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
        {page === "playersAdmin" && role === "admin" && (
  <section className="space-y-6">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-2xl font-black text-yellow-300 mb-4">
        ניהול משתתפים
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
  <div className="text-slate-400 text-sm font-bold mb-1">
    סך הכול משתתפים
  </div>

  <div className="text-3xl font-black text-white">
    {dbPlayers.length}
  </div>
</div>
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm font-bold mb-1">משתתפים פעילים</div>
          <div className="text-3xl font-black text-green-400">
            {dbPlayers.filter(
  (p) =>
    p.is_active &&
    p.is_approved &&
    p.role !== "viewer"
).length}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm font-bold mb-1">משתתפים לא פעילים</div>
          <div className="text-3xl font-black text-red-400">
            {dbPlayers.filter((p) => !p.is_active).length}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm font-bold mb-1">אדמינים</div>
          <div className="text-3xl font-black text-yellow-300">
            {dbPlayers.filter((p) => p.role === "admin").length}
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
  <div className="text-slate-400 text-sm font-bold mb-1">
    צפיינים
  </div>

  <div className="text-3xl font-black text-purple-300">
    {
      dbPlayers.filter(
        (p) =>
          p.is_approved &&
          p.role === "viewer"
      ).length
    }
  </div>
</div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-right sticky right-0 z-30 bg-slate-800">שם</th>
              <th className="px-4 py-3 text-right">אימייל</th>
              <th className="px-4 py-3 text-right">תפקיד</th>
              <th className="px-4 py-3 text-right">סטטוס</th>
<th className="px-4 py-3 text-right">נראה לאחרונה</th>
<th className="px-4 py-3 text-right">עמוד נוכחי</th>
<th className="px-4 py-3 text-right">פעולה</th>
            </tr>
          </thead>

          <tbody>
            {[...dbPlayers]
  .sort((a, b) => {
    const rank = (p) => {
      if (p.role === "admin") return 0;
      if (p.is_approved && p.is_active && p.role === "player") return 1;
      if (p.is_approved && p.role === "viewer") return 2;
      if (!p.is_active) return 3;
      if (!p.is_approved) return 4;
      return 3;
    };

    const ra = rank(a);
    const rb = rank(b);

    if (ra !== rb) return ra - rb;

    return a.name.localeCompare(b.name, "he");
  })
  .map((player) => (
              <tr
                key={player.id}
                className="border-t border-slate-800 hover:bg-slate-800/50 transition"
              >
                <td className="px-4 py-3 font-black text-white whitespace-nowrap sticky right-0 z-20 bg-slate-900 border-l border-slate-800">
  {editingPlayerId === player.id ? (
    <input
      value={editingPlayerName}
      onChange={(e) => setEditingPlayerName(e.target.value)}
      className="bg-slate-950 border border-yellow-400 rounded-xl px-3 py-1 text-sm text-white outline-none"
    />
  ) : (
    player.name
  )}
</td>

                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {player.email}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${
                      player.role === "admin"
                        ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/40"
                        : "bg-sky-500/15 text-sky-300 border-sky-500/40"
                    }`}
                  >
                   {player.role === "admin"
  ? "אדמין"
  : player.role === "viewer"
  ? "צפיין"
  : "משתתף"}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
  {!player.is_approved ? (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black border bg-orange-500/15 text-orange-300 border-orange-500/40">
      ממתין לאישור
    </span>
  ) : (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${
        player.is_active
          ? "bg-green-500/15 text-green-300 border-green-500/40"
          : "bg-red-500/15 text-red-300 border-red-500/40"
      }`}
    >
      {player.is_active ? "פעיל" : "לא פעיל"}
    </span>
  )}
</td>
<td className="px-4 py-3 whitespace-nowrap">
  {isPlayerOnline(player.last_seen) ? (
    <div className="flex items-center gap-2 text-green-400 font-black">
      <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
      אונליין
    </div>
  ) : (
    <span className="text-slate-300">
      {formatLastSeen(player.last_seen)}
    </span>
  )}
</td>

<td className="px-4 py-3 text-slate-300 whitespace-nowrap">
  {player.current_page || "לא זמין"}
</td>

                <td className="px-4 py-3 whitespace-nowrap">
  <div className="flex flex-wrap gap-1 md:gap-2">
    {editingPlayerId === player.id ? (
      <>
        <button
          type="button"
          onClick={() => updatePlayerName(player, editingPlayerName)}
          className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30"
        >
          שמור
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingPlayerId(null);
            setEditingPlayerName("");
          }}
          className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-slate-500/20 border-slate-500/40 text-slate-300 hover:bg-slate-500/30"
        >
          ביטול
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={() => {
            setEditingPlayerId(player.id);
            setEditingPlayerName(player.name || "");
          }}
          className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-sky-500/20 border-sky-500/40 text-sky-300 hover:bg-sky-500/30"
        >
          ערוך שם
        </button>

        {player.role === "admin" ? (
  <span className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-black border bg-yellow-500/15 text-yellow-300 border-yellow-500/40">
    אדמין מוגן
  </span>
) : !player.is_approved ? (
  <>
    <button
      type="button"
      onClick={() => approvePlayer(player.id, "player")}
      className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30"
    >
      אשר כמשתתף
    </button>

    <button
      type="button"
      onClick={() => approvePlayer(player.id, "viewer")}
      className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
    >
      אשר כצפיין
    </button>
  </>
) : (
  <>
    <button
      type="button"
      onClick={() =>
        updatePlayerRole(
          player.id,
          player.role === "viewer" ? "player" : "viewer"
        )
      }
      className="px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
    >
      {player.role === "viewer" ? "הפוך למשתתף" : "הפוך לצפיין"}
    </button>

    <button
      type="button"
      onClick={() =>
        updatePlayerActive(player.id, !player.is_active)
      }
      className={`px-2 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border transition ${
        player.is_active
          ? "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
          : "bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30"
      }`}
    >
      {player.is_active ? "השבת" : "החזר"}
    </button>

    <button
  type="button"
  onClick={() => deletePlayerCompletely(player)}
  className="px-3 py-1 md:px-4 md:py-2 rounded-xl font-black text-xs md:text-sm border bg-red-900/30 border-red-500/50 text-red-300 hover:bg-red-900/50"
>
  מחק
</button>
  </>
)}
      </>
    )}
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
)}
        {page === "admin" && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h2 className="text-2xl font-black mb-4">ניהול תוצאות אמת</h2>
            <p className="text-slate-400 mb-4">
              כאן המנהל מזין את תוצאת המשחק בפועל. בשלב נוקאאוט מזינים תוצאת 90 דקות בלבד.
            </p>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div className="inline-flex items-center rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2 font-black text-slate-300">
    עודכנו {updatedResultsCount} מתוך {matches.length} משחקים
  </div>

  <button
    type="button"
    onClick={scrollToNextIncompleteAdminMatch}
    className="whitespace-nowrap px-4 py-2 rounded-2xl bg-yellow-400 text-slate-950 font-black transition-all hover:bg-yellow-300"
  >
    עבור למשחק הקרוב
  </button>
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
                const knockoutStatus = getKnockoutStatus(match);

                return (
                  <div
                    id={`match-card-${match.id}`}
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
    <select
  value={knockoutMatches[match.id]?.home_team || ""}
  onChange={(e) =>
    updateKnockoutTeam(
      match.id,
      "home_team",
      e.target.value
    )
  }
  className="bg-slate-700 rounded-xl p-2 text-sm font-bold"
>
  <option value="">בחר נבחרת בית</option>
  {Object.values(groups).flat().map((team) => (
    <option key={team} value={team}>
      {team}
    </option>
  ))}
</select>

    <select
  value={knockoutMatches[match.id]?.away_team || ""}
  onChange={(e) =>
    updateKnockoutTeam(
      match.id,
      "away_team",
      e.target.value
    )
  }
  className="bg-slate-700 rounded-xl p-2 text-sm font-bold"
>
  <option value="">בחר נבחרת חוץ</option>
  {Object.values(groups).flat().map((team) => (
    <option key={team} value={team}>
      {team}
    </option>
  ))}
</select>
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
                      <div className="mt-2 flex flex-wrap items-center gap-2">
  {hasResult ? (
    <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/40 text-green-300 px-3 py-1 text-xs font-black">
      ✓ עודכן
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-700 border border-slate-600 text-slate-300 px-3 py-1 text-xs font-black">
      טרם עודכן
    </span>
  )}
  {knockoutStatus && (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${
        knockoutStatus === "missing"
          ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
          : knockoutStatus === "ready"
          ? "bg-green-500/20 border border-green-500/40 text-green-300"
          : "bg-yellow-400/20 border border-yellow-400/40 text-yellow-300"
      }`}
    >
      {knockoutStatus === "missing"
        ? "טרם נקבעו נבחרות"
        : knockoutStatus === "ready"
        ? "נבחרות הוזנו"
        : "הוכרע"}
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

  <div className="flex flex-col sm:flex-row gap-2">
    {role === "admin" && (
      <>
        <button
          type="button"
          onClick={saveLeaderboardSnapshot}
          className="rounded-2xl bg-yellow-400 px-4 py-3 font-black text-slate-950 hover:bg-yellow-300"
        >
          שמור מצב דירוג נוכחי
        </button>
        <button
          type="button"
          onClick={clearLeaderboardSnapshot}
          className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 font-black text-slate-200 hover:bg-slate-700"
        >
          נקה Snapshot דירוג
        </button>
      </>
    )}

    <div className="rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 font-black text-slate-300">
      מוביל כרגע:{" "}
      <span className="text-yellow-300">
        {leaderboard[0]?.player || "-"}
      </span>
    </div>
  </div>
</div>

      <div className="mb-4 rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Yesterday top performer card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-black text-white sm:text-lg">
                {yesterdayTopPerformer.hasResults ? yesterdayTopPerformer.title : "עדיין אין מצטיין אתמול"}
              </div>
              {yesterdayTopPerformer.hasResults ? (
                <div className="mt-1 text-slate-300 text-sm">
                  {yesterdayTopPerformer.winners.length <= 3 ? (
                    yesterdayTopPerformer.winners.join(", ")
                  ) : (
                    <>
                      {yesterdayTopPerformer.winners.slice(0, 3).join(", ")}
                      <button
                        type="button"
                        onClick={() => setShowYesterdayTopList(true)}
                        className="ml-1 inline-flex items-center text-yellow-300 underline"
                      >
                        ועוד {yesterdayTopPerformer.winners.length - 3}
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {yesterdayTopPerformer.hasResults ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-right font-black text-yellow-300 sm:px-4 sm:py-2">
                {yesterdayTopPerformer.points} נקודות
              </div>
            ) : null}
          </div>

          {showYesterdayTopList && yesterdayTopPerformer.hasResults && yesterdayTopPerformer.winners.length > 3 ? (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
              <div className="font-black text-slate-100">רשימת מצטייני אתמול:</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {yesterdayTopPerformer.winners.map((name) => (
                  <span key={name} className="rounded-full bg-slate-800 px-3 py-1">
                    {name}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowYesterdayTopList(false)}
                className="mt-3 inline-flex rounded-full bg-slate-700 px-4 py-2 text-sm font-black text-white hover:bg-slate-600"
              >
                סגור
              </button>
            </div>
          ) : null}
        </div>
        {/* Daily top performer card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-black text-white sm:text-lg">
                {dailyTopPerformer.hasResultsToday ? dailyTopPerformer.title : "עדיין אין מצטיין היום"}
              </div>
              {dailyTopPerformer.hasResultsToday ? (
                <div className="mt-1 text-slate-300 text-sm">
                  {dailyTopPerformer.winners.length <= 3 ? (
                    dailyTopPerformer.winners.join(", ")
                  ) : (
                    <>
                      {dailyTopPerformer.winners.slice(0, 3).join(", ")}
                      <button
                        type="button"
                        onClick={() => setShowDailyTopList(true)}
                        className="ml-1 inline-flex items-center text-yellow-300 underline"
                      >
                        ועוד {dailyTopPerformer.winners.length - 3}
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {dailyTopPerformer.hasResultsToday ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-right font-black text-yellow-300 sm:px-4 sm:py-2">
                {dailyTopPerformer.points} נקודות
              </div>
            ) : null}
          </div>

          {showDailyTopList && dailyTopPerformer.hasResultsToday && dailyTopPerformer.winners.length > 3 ? (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
              <div className="font-black text-slate-100">רשימת מצטיינים:</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dailyTopPerformer.winners.map((name) => (
                  <span key={name} className="rounded-full bg-slate-800 px-3 py-1">
                    {name}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowDailyTopList(false)}
                className="mt-3 inline-flex rounded-full bg-slate-700 px-4 py-2 text-sm font-black text-white hover:bg-slate-600"
              >
                סגור
              </button>
            </div>
          ) : null}
        </div>

        {/* Bull-king card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 sm:p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-black text-white sm:text-lg">{bullKing.title}</div>
              {bullKing.hasAny ? (
                <div className="mt-1 text-slate-300 text-sm">
                  {bullKing.winners.length <= 3 ? (
                    bullKing.winners.join(", ")
                  ) : (
                    <>
                      {bullKing.winners.slice(0, 3).join(", ")}
                      <button
                        type="button"
                        onClick={() => setShowBullList(true)}
                        className="ml-1 inline-flex items-center text-yellow-300 underline"
                      >
                        ועוד {bullKing.winners.length - 3}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-1 text-slate-400 text-sm">טרם יש בולים</div>
              )}
            </div>

            {bullKing.hasAny ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-right font-black text-yellow-300 sm:px-4 sm:py-2">
                {bullKing.hits} בולים
              </div>
            ) : null}
          </div>

          <div className="mt-3 border-t border-slate-800 pt-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-black text-white sm:text-lg">{guessKing.title}</div>
                {guessKing.hasAny ? (
                  <div className="mt-1 text-slate-300 text-sm">
                    {guessKing.winners.length <= 3 ? (
                      guessKing.winners.join(", ")
                    ) : (
                      <>
                        {guessKing.winners.slice(0, 3).join(", ")}
                        <button
                          type="button"
                          onClick={() => setShowGuessKingList(true)}
                          className="ml-1 inline-flex items-center text-yellow-300 underline"
                        >
                          ועוד {guessKing.winners.length - 3}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 text-slate-400 text-sm">טרם יש ניחושים</div>
                )}
              </div>

              {guessKing.hasAny ? (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-right font-black text-yellow-300 sm:px-4 sm:py-2">
                  {guessKing.hits} ניחושים
                </div>
              ) : null}
            </div>
          </div>

          {showBullList && bullKing.hasAny && bullKing.winners.length > 3 ? (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
              <div className="font-black text-slate-100">רשימת מלכי הבולים:</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {bullKing.winners.map((name) => (
                  <span key={name} className="rounded-full bg-slate-800 px-3 py-1">
                    {name}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowBullList(false)}
                className="mt-3 inline-flex rounded-full bg-slate-700 px-4 py-2 text-sm font-black text-white hover:bg-slate-600"
              >
              סגור
            </button>
          </div>
        ) : null}

          {showGuessKingList && guessKing.hasAny && guessKing.winners.length > 3 ? (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
              <div className="font-black text-slate-100">רשימת מלכי הניחושים:</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {guessKing.winners.map((name) => (
                  <span key={name} className="rounded-full bg-slate-800 px-3 py-1">
                    {name}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowGuessKingList(false)}
                className="mt-3 inline-flex rounded-full bg-slate-700 px-4 py-2 text-sm font-black text-white hover:bg-slate-600"
              >
              סגור
            </button>
          </div>
        ) : null}
      </div>

        {/* Hall of fame card */}
        <button
          type="button"
          onClick={() => setShowHallOfFame(true)}
          className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-2.5 text-right transition-all hover:border-yellow-300 hover:bg-yellow-400/15 sm:p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-black text-white sm:text-lg">🏆 היכל התהילה</div>
              <div className="mt-1 text-sm text-slate-300">
                אלופי הטורנירים וטבלת כל הזמנים
              </div>
            </div>

            <div className="rounded-2xl bg-yellow-400 px-3 py-1.5 font-black text-slate-950 sm:px-4 sm:py-2">
              פתח
            </div>
          </div>
        </button>
      </div>
    </div>

    {showHallOfFame ? (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pb-24 sm:items-center sm:pb-0">
        <div className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100 shadow-2xl max-h-[calc(100vh-7rem)] overflow-y-auto md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black">🏆 היכל התהילה</h3>
              <div className="mt-1 text-sm font-bold text-slate-400">
                היסטוריית הזוכים מהטורנירים הקודמים
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHallOfFame(false)}
              className="rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-white hover:bg-slate-700"
            >
              סגור
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 md:p-4">
              <h4 className="mb-3 text-lg font-black text-yellow-300">
                אלופי הטורנירים
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="p-3 text-right">טורניר</th>
                      <th className="p-3 text-center">🥇 זהב</th>
                      <th className="p-3 text-center">🥈 כסף</th>
                      <th className="p-3 text-center">🥉 ארד</th>
                    </tr>
                  </thead>

                  <tbody>
                    {hallOfFameTournaments.map((tournament) => (
                      <tr
                        key={tournament.year}
                        className="border-t border-slate-800 bg-slate-900 hover:bg-slate-800/80"
                      >
                        <td className="p-3 font-black text-white">
                          {tournament.year}
                        </td>
                        <td className="p-3 text-center font-black text-yellow-300">
                          {tournament.gold}
                        </td>
                        <td className="p-3 text-center font-black text-slate-200">
                          {tournament.silver}
                        </td>
                        <td className="p-3 text-center font-black text-amber-500">
                          {tournament.bronze}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 md:p-4">
              <h4 className="mb-3 text-lg font-black text-yellow-300">
                👑 טבלת כל הזמנים
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full min-w-[460px] text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="p-3 text-right">#</th>
                      <th className="p-3 text-right">משתתף</th>
                      <th className="p-3 text-center">🥇</th>
                      <th className="p-3 text-center">🥈</th>
                      <th className="p-3 text-center">🥉</th>
                      <th className="p-3 text-center">סה״כ פודיומים</th>
                    </tr>
                  </thead>

                  <tbody>
                    {hallOfFameAllTimeSorted.map((player, index) => (
                      <tr
                        key={player.name}
                        className="border-t border-slate-800 bg-slate-900 hover:bg-slate-800/80"
                      >
                        <td className="p-3 font-black text-slate-300">
                          {index + 1}
                        </td>
                        <td className="p-3 font-black text-white">
                          {player.name}
                        </td>
                        <td className="p-3 text-center font-black text-yellow-300">
                          {player.gold}
                        </td>
                        <td className="p-3 text-center font-black text-slate-200">
                          {player.silver}
                        </td>
                        <td className="p-3 text-center font-black text-amber-500">
                          {player.bronze}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex min-w-[40px] justify-center rounded-full bg-yellow-400 px-3 py-1 font-black text-slate-950">
                            {player.totalPodiums}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null}

    {selectedProfile ? (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pb-24 sm:items-center sm:pb-0">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-black">{selectedProfile.player}</div>
              <div className="text-slate-400 text-sm">כרטיס שחקן</div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProfile(null)}
              className="rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-white hover:bg-slate-700"
            >
              סגור
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="text-slate-400 text-sm">סה"כ נקודות</div>
              <div className="text-2xl font-black text-yellow-300">{selectedProfile.total}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">בול פגיעה</div>
                <div className="text-lg font-black">{selectedProfile.exactHits}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">ניחוש כיוון נכון</div>
                <div className="text-lg font-black">{selectedProfile.correctDirections}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="text-slate-400 text-sm">נקודות בונוס</div>
              <div className="text-lg font-black">{selectedProfile.bonusPoints}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">אחוזי הצלחה</div>
                <div className="text-lg font-black">{selectedProfile.successRate}%</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">הימורים שמולאו</div>
                <div className="text-lg font-black">{selectedProfile.matchProgress}</div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">🔥 רצף נוכחי</div>
                <div className="text-lg font-black">{selectedProfile.currentStreak}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-slate-400 text-sm">🏆 רצף שיא</div>
                <div className="text-lg font-black">{selectedProfile.bestStreak}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null}

    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="border-collapse min-w-[760px] text-xs md:text-sm">
        <thead>
          <tr className="bg-slate-950 text-slate-300 sticky top-0 z-30">
            <th className="md:sticky md:right-0 z-40 bg-slate-950 text-center p-2 border-l border-slate-800 w-[45px] min-w-[45px] max-w-[45px]">
              #
            </th>

            <th className="md:sticky md:right-[45px] z-40 bg-slate-950 text-right p-2 border-l border-slate-800 w-[95px] min-w-[95px] max-w-[95px]">
              משתתף
            </th>

            <th className="md:sticky md:right-[140px] z-40 bg-slate-950 text-center p-2 border-l border-slate-800 w-[65px] min-w-[65px] max-w-[65px]">
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
  onClick={() => setSelectedProfile(getPlayerProfile(row, predictions, matches))}
  className={`cursor-pointer border-t border-slate-800 bg-slate-900 hover:bg-slate-800/80 transition-colors duration-200 ${
    currentPlayer?.name === row.player ? "ring-2 ring-emerald-500/50" : ""
  }`}
>
              <td
  className={`md:sticky md:right-0 z-20 bg-slate-900 text-center p-2 border-l border-slate-800 font-black w-[45px] min-w-[45px] max-w-[45px] ${
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
  {getLeaderboardMovementLabel(row.player) && (
    <div
      className={`mt-1 text-[10px] font-black ${
        getLeaderboardMovementLabel(row.player).startsWith("↑")
          ? "text-green-400"
          : getLeaderboardMovementLabel(row.player).startsWith("↓")
          ? "text-red-400"
          : "text-sky-300"
      }`}
    >
      {getLeaderboardMovementLabel(row.player)}
    </div>
  )}
</td>

              <td
 className={`md:sticky md:right-[45px] z-20 p-2 border-l border-slate-800 font-black w-[95px] min-w-[95px] max-w-[95px] truncate ${
    index === 0
      ? "bg-slate-900 text-yellow-300"
      : index === 1
      ? "bg-slate-900 text-slate-200"
      : index === 2
      ? "bg-slate-900 text-amber-400"
      : "bg-slate-900 text-white"
  }`}
>
  <div className="flex items-center justify-between gap-1">
    <span className="truncate">{row.player}</span>
    {currentPlayer?.name === row.player && (
      <span className="inline-block whitespace-nowrap rounded-full bg-emerald-600/80 text-white px-2 py-0.5 text-[10px] font-black">
        אתה
      </span>
    )}
  </div>
</td>

              <td
  className={`md:sticky md:right-[140px] z-20 text-center p-2 border-l border-slate-800 font-black text-lg w-[65px] min-w-[65px] max-w-[65px] ${
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
    <div className="mt-4 text-center text-xs text-slate-600">גרסה 1.0</div>
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
            <div className="hidden md:flex mb-4 justify-end">
              <button
                type="button"
                onClick={() => scrollToAllPredictionsJumpMatch({ visibleOnly: true })}
                className="rounded-2xl border border-yellow-400/50 bg-yellow-400 px-4 py-3 text-center font-black text-slate-950 shadow-lg shadow-yellow-400/10 transition-all hover:bg-yellow-300"
              >
                ⚽ קפוץ למשחק הבא
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
                    const distribution = getMatchPredictionDistribution(match);
                    const locked = isMatchLocked(
                      match,
                      manuallyUnlockedMatches,
                      knockoutMatches,
                      results
                    );

                    return (
                      <tr
  id={`all-predictions-row-${match.id}`}
  key={match.id}
  className={`border-t border-slate-800 ${
    locked
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
{distribution ? (
  <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
    {distribution.locked ? (
      distribution.empty ? (
        <div>עדיין אין ניחושים</div>
      ) : (
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
          <span className="font-black text-slate-100">📊 ניחושי המשתתפים:</span>
          <span className="text-slate-300">
            {distribution.homeTeam} {distribution.homePct}% | תיקו {distribution.tiePct}% | {distribution.awayTeam} {distribution.awayPct}%
          </span>
        </div>
      )
    ) : (
      <div>📊 ניחושי המשתתפים יוצגו לאחר נעילת המשחק</div>
    )}
  </div>
) : null}
{!match.group &&
  knockoutMatches[match.id]?.winner_team &&
  [
    getDisplayTeam(match, "home"),
    getDisplayTeam(match, "away"),
  ].includes(knockoutMatches[match.id].winner_team) && (
  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 text-xs font-black">
    עולה: {knockoutMatches[match.id].winner_team}
  </div>
)}
<div className="mt-2">
  {locked ? (
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

    const shouldHidePrediction = !locked && player.name !== selectedPlayer;

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
                                {shouldHidePrediction ? (
                                  <span className="text-slate-500 text-xs font-black">
                                    {hasCompletePrediction(prediction) ? "🔒 הימר" : "⏳ טרם הימר"}
                                  </span>
                                ) : prediction.home !== "" && prediction.away !== "" ? (
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
            <div className="md:hidden mb-4">
              <button
                type="button"
                onClick={scrollToAllPredictionsJumpMatch}
                className="w-full rounded-2xl border border-yellow-400/50 bg-yellow-400 px-4 py-3 text-center font-black text-slate-950 shadow-lg shadow-yellow-400/10 transition-all active:scale-[0.99]"
              >
                ⚽ קפוץ למשחק הבא
              </button>
            </div>
            <div className="md:hidden space-y-4">
  {filteredAllBetsMatches.map((match) => {
    const result = results[match.id];
    const distribution = getMatchPredictionDistribution(match);
    const locked = isMatchLocked(
      match,
      manuallyUnlockedMatches,
      knockoutMatches,
      results
    );
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
        id={`all-predictions-mobile-match-${match.id}`}
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
          {distribution ? (
            <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
              {distribution.locked ? (
                distribution.empty ? (
                  <div>עדיין אין ניחושים</div>
                ) : (
                  <div className="space-y-1">
                    <div className="font-black text-slate-100">📊 ניחושי המשתתפים:</div>
                    <div className="grid grid-cols-1 gap-1 text-slate-300">
                      <div>{distribution.homeTeam} {distribution.homePct}%</div>
                      <div>תיקו {distribution.tiePct}%</div>
                      <div>{distribution.awayTeam} {distribution.awayPct}%</div>
                    </div>
                  </div>
                )
              ) : (
                <div>📊 ניחושי המשתתפים יוצגו לאחר נעילת המשחק</div>
              )}
            </div>
          ) : null}
          {!match.group &&
  knockoutMatches[match.id]?.winner_team &&
  [
    getDisplayTeam(match, "home"),
    getDisplayTeam(match, "away"),
  ].includes(knockoutMatches[match.id].winner_team) && (
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

            const shouldHidePrediction = !locked && player.name !== selectedPlayer;

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
                  {shouldHidePrediction
                    ? hasCompletePrediction(prediction) ? "🔒 הימר" : "⏳ טרם הימר"
                    : prediction &&
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

</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-2xl">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("best-third-place-teams")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700"
              >
                מעבר לדירוג מקומות 3
              </button>

              <button
                type="button"
                onClick={() => setPage("knockoutBracket")}
                className="rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700"
              >
                ⚔️ עץ הנוקאאוט
              </button>
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
                          <th className="text-center py-2">נצ'</th>
                          <th className="text-center py-2">תיק'</th>
                          <th className="text-center py-2">הפ'</th>
                          <th className="text-center py-2">שז</th>
                          <th className="text-center py-2">שח</th>
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
                              {team.wins}
                            </td>

                            <td className="text-center">
                              {team.draws}
                            </td>

                            <td className="text-center">
                              {team.losses}
                            </td>

                            <td className="text-center">
                              {team.gf}
                            </td>

                            <td className="text-center">
                              {team.ga}
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

            {(() => {
              const bestThirdPlaceTeams = getBestThirdPlaceTeams(
                matches,
                groups,
                results,
                manualThirdPlaceQualifiers
              );

              const hasManualOverride =
                Object.keys(manualThirdPlaceQualifiers).length > 0;

              const handleManualOverride = async (teamName, value) => {
                const newOverrides = {
                  ...manualThirdPlaceQualifiers,
                  [teamName]: value,
                };

                const finalQualifiedCount = getBestThirdPlaceTeams(
                  matches,
                  groups,
                  results,
                  newOverrides
                ).filter((team) => team.isQualified).length;

                if (finalQualifiedCount > 8) {
                  showMessage("ניתן לבחור מקסימום 8 נבחרות עולות", "error");
                  return;
                }

                const success = await saveManualThirdPlaceQualifiers(newOverrides);
                if (success) {
                  showMessage("בחירה ידנית נשמרה");
                }
              };

              const handleReset = async () => {
                const success = await saveManualThirdPlaceQualifiers({});
                if (success) {
                  showMessage("חזרה לחישוב אוטומטי");
                }
              };

              return (
                <div
                  id="best-third-place-teams"
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-2xl font-black">
                        דירוג המקומות השלישיים
                      </h3>
                      <div className="text-slate-400 font-bold mt-1">
                        8 המקומות השלישיים הטובים ביותר עולים לשלב הבא
                      </div>
                    </div>

                    <div className="rounded-full bg-yellow-400 text-slate-950 px-4 py-2 text-sm font-black">
                      Top 8 Qualify
                    </div>
                  </div>
                  
                  {role === "admin" && (
                    <div className="mb-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-300">
                          מצב: {hasManualOverride ? "בחירה ידנית" : "אוטומטי"}
                        </div>
                        {hasManualOverride && (
                          <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-full bg-slate-700 border border-slate-600 px-3 py-1 text-xs font-black text-slate-200 hover:bg-slate-600"
                          >
                            חזור לחישוב אוטומטי
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {role !== "admin" && (
                    <div className="mb-4 text-sm font-bold text-slate-300">
                      מצב: {hasManualOverride ? "בחירה ידנית" : "אוטומטי"}
                    </div>
                  )}

                  <div className="overflow-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-950 text-slate-300">
                        <tr>
                          <th className="p-3 text-right">#</th>
                          <th className="p-3 text-right">בית</th>
                          <th className="p-3 text-right">נבחרת</th>
                          <th className="p-3 text-center">מש'</th>
                          <th className="p-3 text-center">נק'</th>
                          <th className="p-3 text-center">הפרש</th>
                          <th className="p-3 text-center">זכות</th>
                          <th className="p-3 text-center">סטטוס</th>
                          {role === "admin" && <th className="p-3 text-center">שליטה</th>}
                        </tr>
                      </thead>

                      <tbody>
                        {bestThirdPlaceTeams.map((team) => (
                          <tr
                            key={`${team.group}-${team.team}`}
                            className={
                              team.isQualified
                                ? "border-t border-slate-800 bg-emerald-500/10"
                                : "border-t border-slate-800 bg-red-500/10"
                            }
                          >
                            <td className="p-3 font-black">
                              {team.rank}
                            </td>
                            <td className="p-3 font-bold">
                              בית {team.group}
                            </td>
                            <td className="p-3 font-black">
                              {team.team}
                            </td>
                            <td className="p-3 text-center">
                              {team.played}
                            </td>
                            <td className="p-3 text-center font-black">
                              {team.points}
                            </td>
                            <td className="p-3 text-center">
                              {team.gd}
                            </td>
                            <td className="p-3 text-center">
                              {team.gf}
                            </td>
                            <td className="p-3 text-center">
                              {team.isQualified ? (
                                <span className="rounded-full bg-emerald-500 text-white px-3 py-1 text-xs font-black">
                                  עולה
                                </span>
                              ) : (
                                <span className="rounded-full bg-red-500 text-white px-3 py-1 text-xs font-black">
                                  לא עולה
                                </span>
                              )}
                            </td>
                            {role === "admin" && (
                              <td className="p-3 text-center">
                                {(() => {
                                  const manualValue = manualThirdPlaceQualifiers[team.team];
                                  return (
                                    <div className="inline-flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleManualOverride(team.team, true)}
                                        className={`rounded-full px-3 py-1 text-xs font-black transition-colors ${
                                          manualValue === true
                                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                            : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                        }`}
                                      >
                                        עולה
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleManualOverride(team.team, false)}
                                        className={`rounded-full px-3 py-1 text-xs font-black transition-colors ${
                                          manualValue === false
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                        }`}
                                      >
                                        לא עולה
                                      </button>
                                    </div>
                                  );
                                })()}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
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
{showDidYouKnowModal ? (
  <div
    dir="rtl"
    className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pb-24 sm:items-center sm:pb-0"
  >
    <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black">💡 הידעת?</h3>
          <div className="mt-1 text-sm font-bold text-slate-400">
            {didYouKnowFact.id} / {didYouKnowFacts.length}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDidYouKnowModal(false)}
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-white hover:bg-slate-700"
        >
          סגור
        </button>
      </div>

      <p className="mt-5 text-base font-bold leading-8 text-slate-200">
        {didYouKnowFact.text}
      </p>

      <button
        type="button"
        onClick={() =>
          setDidYouKnowFact((currentFact) =>
            getRandomDidYouKnowFact(currentFact.id)
          )
        }
        className="mt-6 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-slate-950 hover:bg-yellow-300"
      >
        🎲 הצג עובדה אקראית נוספת
      </button>
    </div>
  </div>
) : null}
<footer className="mt-10 border-t border-slate-800 pt-6 pb-2 text-center">
  <div className="text-slate-400 font-bold">
    World Cup Predictor 2026
  </div>

  <div className="text-slate-600 text-sm mt-2">
    Built for the ultimate World Cup experience
  </div>
</footer>
{authUser && (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl">
    <div className={`grid h-16 ${role === "viewer" ? "grid-cols-4" : "grid-cols-6"}`}>

      {role !== "viewer" && (
  <>
    <button
      onClick={() => setPage("matchesCards")}
      className={`flex flex-col items-center justify-center text-[10px] font-black ${
        page === "matchesCards"
          ? "text-yellow-300"
          : "text-slate-400"
      }`}
    >
      <span className="text-lg">⚽</span>
      <span>המשחקים שלי</span>
    </button>

    <button
      onClick={() => setPage("bonus")}
      className={`flex flex-col items-center justify-center text-[10px] font-black ${
        page === "bonus"
          ? "text-yellow-300"
          : "text-slate-400"
      }`}
    >
      <span className="text-lg">🏆</span>
      <span>הבונוס שלי</span>
    </button>
  </>
)}

      <button
        onClick={() => setPage("bonusAll")}
        className={`flex flex-col items-center justify-center text-[10px] font-black ${
          page === "bonusAll"
            ? "text-yellow-300"
            : "text-slate-400"
        }`}
      >
        <span className="text-lg">👥</span>
        <span>כל הבונוסים</span>
      </button>

      <button
        onClick={() => setPage("all")}
        className={`flex flex-col items-center justify-center text-[10px] font-black ${
          page === "all"
            ? "text-yellow-300"
            : "text-slate-400"
        }`}
      >
        <span className="text-lg">📋</span>
        <span>כל ההימורים</span>
      </button>

      <button
        onClick={() => setPage("leaderboard")}
        className={`flex flex-col items-center justify-center text-[10px] font-black ${
          page === "leaderboard"
            ? "text-yellow-300"
            : "text-slate-400"
        }`}
      >
        <span className="text-lg">🥇</span>
        <span>דירוג</span>
      </button>

      <button
        onClick={() => setPage("groups")}
        className={`flex flex-col items-center justify-center text-[10px] font-black ${
          page === "groups"
            ? "text-yellow-300"
            : "text-slate-400"
        }`}
      >
        <span className="text-lg">🌍</span>
        <span>בתים</span>
      </button>

    </div>
  </div>
)}
</main>
);
}
