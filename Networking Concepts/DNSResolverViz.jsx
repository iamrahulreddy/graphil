import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Globe,
  Server,
  ShieldCheck,
  Shield,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Info,
  Terminal,
  Activity,
  Box,
  Lock,
  Search,
  Database,
  ArrowRight,
  Layers,
  CheckCircle,
  AlertTriangle,
  Network,
  RefreshCw,
  ArrowLeft,
  FastForward,
  Turtle,
  Plus,
  Minus,
  CircleDot,
  ChevronUp,
  BookOpen, // Added for Glossary
} from "lucide-react";

/**
 * Professional DNS Visualization Learning Tool
 * Enhanced with modern UI, smooth animations, detailed explanations, and improved responsiveness
 */

// ---------------------------------------------------------
// Helpers and constants
// ---------------------------------------------------------

const RECORD_TYPES = [
  { v: "A", desc: "IPv4 address record" },
  { v: "AAAA", desc: "IPv6 address record" },
  { v: "CNAME", desc: "Canonical name (alias)" },
  { v: "MX", desc: "Mail exchange record" },
  { v: "NS", desc: "Name server record" },
  { v: "TXT", desc: "Text record" },
];

const STAGES = [
  "Client",
  "Stub Resolver",
  "Recursive Resolver",
  "Root",
  "TLD",
  "Authoritative",
  "Return",
];

const DEFAULT_DOMAIN = "www.example.com";

const prettyTime = (ms) => `${Math.round(ms)} ms`;

const makePacket = ({ qname, qtype, withDNSSEC, stage, answer }) => {
  return {
    header: {
      id: Math.floor(Math.random() * 65535),
      qr: stage === "Return" ? 1 : 0,
      opcode: 0,
      aa: stage === "Authoritative" ? 1 : 0,
      tc: 0,
      rd: 1,
      ra: stage === "Return" ? 1 : 0,
      ad: withDNSSEC ? 1 : 0,
      cd: 0,
      rcode: 0,
      do: withDNSSEC ? 1 : 0,
    },
    question: [{ name: qname, type: qtype, class: "IN" }],
    answer:
      answer && stage === "Return"
        ? [
            {
              name: qname,
              type: qtype,
              class: "IN",
              ttl: 300,
              data:
                qtype === "A"
                  ? "93.184.216.34"
                  : qtype === "AAAA"
                  ? "2606:2800:220:1:248:1893:25c8:1946"
                  : qtype === "CNAME"
                  ? "example-cdn.example.net."
                  : qtype === "MX"
                  ? "10 mx1.example.com."
                  : qtype === "NS"
                  ? "ns1.example.com."
                  : qtype === "TXT"
                  ? '"v=spf1 include:_spf.example.net ~all"'
                  : "—",
            },
          ]
        : [],
    authority:
      stage === "Root" || stage === "TLD"
        ? [
            {
              name:
                stage === "Root" ? "." : qname.split(".").slice(-2).join("."),
              type: "NS",
              class: "IN",
              ttl: 172800,
              data:
                stage === "Root"
                  ? "a.root-servers.net."
                  : `ns1.${qname.split(".").slice(-2).join(".")}.`,
            },
          ]
        : [],
    additional:
      withDNSSEC &&
      (stage === "TLD" || stage === "Authoritative" || stage === "Return")
        ? [
            { type: "DNSKEY", alg: "RSASHA256", keyTag: 12345 },
            { type: "RRSIG", covered: "A", exp: "2025-12-31T00:00:00Z" },
          ]
        : [],
  };
};

// ---------------------------------------------------------
// Step engine
// ---------------------------------------------------------

const buildSimulation = ({ domain, qtype, withDNSSEC, cacheWarm }) => {
  const steps = [];

  steps.push({
    stage: "Client",
    label: `User enters ${domain} and requests ${qtype} record`,
    detail:
      "The application or OS first checks its local cache for the answer.",
    icon: <Globe className="w-5 h-5" />,
    color: "bg-sky-500",
    gradient: "from-sky-500 to-sky-600",
  });

  steps.push({
    stage: "Stub Resolver",
    label: "Stub resolver forwards query to recursive resolver",
    detail:
      "This is a network request to an ISP or public DNS resolver (e.g., 8.8.8.8).",
    icon: <Activity className="w-5 h-5" />,
    color: "bg-indigo-500",
    gradient: "from-indigo-500 to-indigo-600",
  });

  if (cacheWarm) {
    steps.push({
      stage: "Recursive Resolver",
      label: "Cache hit at recursive resolver!",
      detail:
        "The answer is already in the resolver's cache and is not expired (TTL is valid).",
      answer: true,
      icon: <Server className="w-5 h-5" />,
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600",
    });
    steps.push({
      stage: "Return",
      label: "Cached answer returned immediately to client",
      detail:
        "The client receives the final answer from the recursive resolver's cache.",
      answer: true,
      icon: <Database className="w-5 h-5" />,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
    });
    return steps;
  }

  steps.push({
    stage: "Recursive Resolver",
    label: "Recursive resolver begins iterative resolution",
    detail: withDNSSEC
      ? "Cache miss. Sends network query to a Root server, setting DO bit for DNSSEC."
      : "Cache miss. Sends network query to one of the 13 Root server clusters.",
    icon: <Server className="w-5 h-5" />,
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
  });

  steps.push({
    stage: "Root",
    label: "Root server provides a referral to the TLD server",
    detail:
      "Responds with the NS records for the Top-Level Domain (e.g., .com).",
    icon: <Layers className="w-5 h-5" />,
    color: "bg-amber-500",
    gradient: "from-amber-500 to-amber-600",
  });

  steps.push({
    stage: "TLD",
    label: "TLD server provides a referral to the authoritative server",
    detail:
      "Responds with the NS records for the domain's authoritative name servers.",
    icon: <Layers className="w-5 h-5" />,
    color: "bg-orange-500",
    gradient: "from-orange-500 to-orange-600",
  });

  steps.push({
    stage: "Authoritative",
    label: "Authoritative server returns the final answer",
    detail: withDNSSEC
      ? "Provides the answer with its cryptographic signature (RRSIG) for validation."
      : "Responds with the final resource record (the 'answer').",
    answer: true,
    icon: <Server className="w-5 h-5" />,
    color: "bg-red-500",
    gradient: "from-red-500 to-red-600",
  });

  steps.push({
    stage: "Return",
    label: "Recursive resolver returns final answer to client",
    detail:
      "The answer is sent back to the client and stored in the resolver's cache for its TTL duration.",
    answer: true,
    icon: <Database className="w-5 h-5" />,
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600",
  });

  return steps;
};

// ---------------------------------------------------------
// UI atoms
// ---------------------------------------------------------

const Section = ({ title, icon, children, right, theme }) => (
  <div
    className={`rounded-xl border ${
      theme === "dark"
        ? "border-slate-700 bg-slate-800"
        : "border-slate-200 bg-white"
    } shadow-sm`}
  >
    <div
      className={`px-4 py-3 border-b ${
        theme === "dark"
          ? "border-slate-700 bg-slate-700"
          : "border-slate-200 bg-slate-50"
      } flex items-center justify-between flex-wrap gap-2`}
    >
      <div
        className={`flex items-center gap-2 ${
          theme === "dark" ? "text-slate-200" : "text-slate-700"
        } font-semibold`}
      >
        {icon}
        <span>{title}</span>
      </div>
      <div>{right}</div>
    </div>
    <div
      className={`p-4 ${
        theme === "dark" ? "text-slate-200" : "text-slate-800"
      }`}
    >
      {children}
    </div>
  </div>
);

const Pill = ({ children, color = "bg-emerald-600", theme }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${color}`}
  >
    {children}
  </span>
);

const NodeCard = ({
  title,
  subtitle,
  icon,
  active,
  accent,
  theme,
  color,
  gradient,
}) => (
  <div
    className={[
      "relative rounded-xl border shadow-sm w-full transition-all duration-300",
      active
        ? `border-emerald-400 ring-2 ring-emerald-200 ${
            theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50"
          }`
        : `border-${theme === "dark" ? "slate-700" : "slate-200"} ${
            theme === "dark" ? "bg-slate-700" : "bg-white"
          }`,
    ].join(" ")}
  >
    <div className="p-4 flex items-center gap-3">
      <div
        className={[
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          active
            ? `bg-gradient-to-br ${gradient} text-white`
            : theme === "dark"
            ? "bg-slate-600 text-slate-200"
            : "bg-slate-50 text-slate-600",
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-semibold font-mono ${
            theme === "dark" ? "text-slate-100" : "text-slate-800"
          } truncate`}
        >
          {title}
        </div>
        <div
          className={`text-xs font-mono ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          } truncate`}
        >
          {subtitle}
        </div>
      </div>
      <div className="flex-shrink-0">{accent}</div>
    </div>
  </div>
);

const Arrow = ({ active, theme }) => (
  <div className="flex items-center justify-center py-1">
    <ArrowRight
      className={`w-5 h-5 ${
        active
          ? theme === "dark"
            ? "text-emerald-400"
            : "text-emerald-600"
          : theme === "dark"
          ? "text-slate-500"
          : "text-slate-400"
      }`}
    />
  </div>
);

const KeyVal = ({ k, v, theme }) => (
  <div
    className={`text-xs font-mono ${
      theme === "dark" ? "text-slate-300" : "text-slate-600"
    } flex items-center justify-between gap-3`}
  >
    <span
      className={`font-medium ${
        theme === "dark" ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {k}
    </span>
    <span
      className={`font-mono break-all text-right ${
        theme === "dark" ? "text-slate-200" : "text-slate-800"
      }`}
    >
      {v}
    </span>
  </div>
);

const StatusBadge = ({ status, theme }) => {
  let colorClass = "";
  let icon = null;

  switch (status) {
    case "success":
      colorClass =
        theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      icon = <CheckCircle className="w-4 h-4" />;
      break;
    case "error":
      colorClass =
        theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800";
      icon = <AlertTriangle className="w-4 h-4" />;
      break;
    case "info":
      colorClass =
        theme === "dark"
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-800";
      icon = <Info className="w-4 h-4" />;
      break;
    default:
      colorClass =
        theme === "dark"
          ? "bg-slate-900 text-slate-300"
          : "bg-slate-100 text-slate-800";
      icon = <CircleDot className="w-4 h-4" />;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono font-medium ${colorClass}`}
    >
      {icon}
      <span className="ml-1">{status}</span>
    </span>
  );
};

// ---------------------------------------------------------
// Inspector and Log
// ---------------------------------------------------------

const Inspector = ({ packet, theme }) => {
  if (!packet) {
    return (
      <div
        className={`text-sm font-mono ${
          theme === "dark" ? "text-slate-400" : "text-slate-500"
        }`}
      >
        No packet yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        className={`rounded-lg border ${
          theme === "dark"
            ? "border-slate-700 bg-slate-700"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`px-3 py-2 border-b ${
            theme === "dark"
              ? "border-slate-700 bg-slate-600"
              : "border-slate-200 bg-slate-50"
          } flex items-center gap-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          } text-sm font-semibold font-mono`}
        >
          <Box className="w-4 h-4" />
          Header
        </div>
        <div
          className={`p-3 space-y-1 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {Object.entries(packet.header).map(([k, v]) => (
            <KeyVal key={k} k={k.toUpperCase()} v={String(v)} theme={theme} />
          ))}
        </div>
      </div>
      <div
        className={`rounded-lg border ${
          theme === "dark"
            ? "border-slate-700 bg-slate-700"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`px-3 py-2 border-b ${
            theme === "dark"
              ? "border-slate-700 bg-slate-600"
              : "border-slate-200 bg-slate-50"
          } flex items-center gap-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          } text-sm font-semibold font-mono`}
        >
          <Search className="w-4 h-4" />
          Question
        </div>
        <div
          className={`p-3 space-y-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {packet.question.map((q, idx) => (
            <div
              key={idx}
              className={`rounded-md ${
                theme === "dark" ? "bg-slate-600" : "bg-slate-50"
              } p-2`}
            >
              <KeyVal k="NAME" v={q.name} theme={theme} />
              <KeyVal k="TYPE" v={q.type} theme={theme} />
              <KeyVal k="CLASS" v={q.class} theme={theme} />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`rounded-lg border ${
          theme === "dark"
            ? "border-slate-700 bg-slate-700"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`px-3 py-2 border-b ${
            theme === "dark"
              ? "border-slate-700 bg-slate-600"
              : "border-slate-200 bg-slate-50"
          } flex items-center gap-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          } text-sm font-semibold font-mono`}
        >
          <Database className="w-4 h-4" />
          Answer
        </div>
        <div
          className={`p-3 space-y-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {packet.answer.length === 0 && (
            <div
              className={`text-xs font-mono ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No answers yet
            </div>
          )}
          {packet.answer.map((a, idx) => (
            <div
              key={idx}
              className={`rounded-md ${
                theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50"
              } p-2 border ${
                theme === "dark"
                  ? "border-emerald-800/30"
                  : "border-emerald-100"
              }`}
            >
              <KeyVal k="NAME" v={a.name} theme={theme} />
              <KeyVal k="TYPE" v={a.type} theme={theme} />
              <KeyVal k="TTL" v={String(a.ttl)} theme={theme} />
              <KeyVal k="DATA" v={a.data} theme={theme} />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`rounded-lg border ${
          theme === "dark"
            ? "border-slate-700 bg-slate-700"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`px-3 py-2 border-b ${
            theme === "dark"
              ? "border-slate-700 bg-slate-600"
              : "border-slate-200 bg-slate-50"
          } flex items-center gap-2 ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          } text-sm font-semibold font-mono`}
        >
          <Layers className="w-4 h-4" />
          Authority & Additional
        </div>
        <div
          className={`p-3 space-y-3 ${
            theme === "dark" ? "text-slate-200" : "text-slate-800"
          }`}
        >
          <div>
            <div
              className={`text-xs font-semibold font-mono ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } mb-1`}
            >
              Authority
            </div>
            {packet.authority.length === 0 && (
              <div
                className={`text-xs font-mono ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                None
              </div>
            )}
            {packet.authority.map((a, idx) => (
              <div
                key={idx}
                className={`rounded-md ${
                  theme === "dark" ? "bg-slate-600" : "bg-slate-50"
                } p-2`}
              >
                <KeyVal k="NAME" v={a.name} theme={theme} />
                <KeyVal k="TYPE" v={a.type} theme={theme} />
                <KeyVal k="DATA" v={a.data} theme={theme} />
              </div>
            ))}
          </div>
          <div>
            <div
              className={`text-xs font-semibold font-mono ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } mb-1`}
            >
              Additional
            </div>
            {packet.additional.length === 0 && (
              <div
                className={`text-xs font-mono ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                None
              </div>
            )}
            {packet.additional.map((x, idx) => (
              <div
                key={idx}
                className={`rounded-md ${
                  theme === "dark" ? "bg-slate-600" : "bg-slate-50"
                } p-2`}
              >
                <KeyVal k="TYPE" v={x.type} theme={theme} />
                {"alg" in x && <KeyVal k="ALG" v={x.alg} theme={theme} />}
                {"keyTag" in x && (
                  <KeyVal k="KEYTAG" v={String(x.keyTag)} theme={theme} />
                )}
                {"covered" in x && (
                  <KeyVal k="COVERED" v={x.covered} theme={theme} />
                )}
                {"exp" in x && <KeyVal k="EXP" v={x.exp} theme={theme} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LogPanel = ({ logs, theme }) => (
  <div
    className={`rounded-xl border ${
      theme === "dark"
        ? "border-slate-700 bg-black"
        : "border-slate-200 bg-white"
    } overflow-hidden`}
  >
    <div
      className={`px-4 py-2 border-b ${
        theme === "dark"
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-slate-50"
      } text-sm flex items-center gap-2 ${
        theme === "dark" ? "text-slate-200" : "text-slate-700"
      } font-mono`}
    >
      <Terminal className="w-4 h-4" />
      Resolution Log
    </div>
    <div
      className={`h-[540px] overflow-auto p-3 font-mono text-xs ${
        theme === "dark" ? "text-slate-200" : "text-slate-800"
      }`}
    >
      {logs.length === 0 && (
        <div
          className={`${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          [waiting for simulation]
        </div>
      )}
      {logs.map((l, i) => (
        <div
          key={i}
          className={`${
            l.stage === "Client"
              ? theme === "dark"
                ? "text-sky-400"
                : "text-sky-600"
              : l.stage === "Stub Resolver"
              ? theme === "dark"
                ? "text-indigo-400"
                : "text-indigo-600"
              : l.stage === "Recursive Resolver"
              ? theme === "dark"
                ? "text-emerald-400"
                : "text-emerald-600"
              : l.stage === "Root"
              ? theme === "dark"
                ? "text-amber-400"
                : "text-amber-600"
              : l.stage === "TLD"
              ? theme === "dark"
                ? "text-orange-400"
                : "text-orange-600"
              : l.stage === "Authoritative"
              ? theme === "dark"
                ? "text-red-400"
                : "text-red-600"
              : theme === "dark"
              ? "text-purple-400"
              : "text-purple-600"
          }`}
        >
          <span
            className={`${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            [{prettyTime(l.t)}]
          </span>{" "}
          <span className="font-medium">{l.stage.toUpperCase()}</span>{" "}
          <span
            className={`${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}
          >
            - {l.msg}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------
// Main App
// ---------------------------------------------------------

const App = () => {
  const [domain, setDomain] = useState(DEFAULT_DOMAIN);
  const [qtype, setQtype] = useState("A");
  const [withDNSSEC, setWithDNSSEC] = useState(true);
  const [speed, setSpeed] = useState(1200);
  const [isRunning, setIsRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [packet, setPacket] = useState(null);
  const [cacheWarm, setCacheWarm] = useState(false);
  const [expandedHelp, setExpandedHelp] = useState(false);
  const [expandedGlossary, setExpandedGlossary] = useState(true);
  const [theme, setTheme] = useState("light");
  const [showPerformance, setShowPerformance] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    startTime: 0,
    endTime: 0,
    duration: 0,
    steps: 0,
  });

  const steps = useMemo(
    () => buildSimulation({ domain, qtype, withDNSSEC, cacheWarm }),
    [domain, qtype, withDNSSEC, cacheWarm]
  );

  const timelineRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    setIsRunning(false);
    setStageIndex(0);
    setLogs([]);
    setPacket(null);
    setPerformanceMetrics({
      startTime: 0,
      endTime: 0,
      duration: 0,
      steps: 0,
    });
    clearInterval(timerRef.current);
  }, []);

  const stepOnce = useCallback(
    (nextIdx) => {
      const idx = Math.min(nextIdx, steps.length - 1);
      const s = steps[idx];
      const elapsed = Date.now() - (startTimeRef.current || Date.now());

      setLogs((prev) => [
        ...prev,
        { t: elapsed, stage: s.stage, msg: `${s.label}. ${s.detail}` },
      ]);

      const p = makePacket({
        qname: domain,
        qtype,
        withDNSSEC,
        stage: s.stage,
        answer: !!s.answer,
      });
      setPacket(p);

      setStageIndex(idx);

      if (idx === 0) {
        setPerformanceMetrics((prev) => ({
          ...prev,
          startTime: Date.now(),
          steps: 0,
        }));
      }
      setPerformanceMetrics((prev) => ({ ...prev, steps: idx + 1 }));
    },
    [steps, domain, qtype, withDNSSEC]
  );

  const play = useCallback(() => {
    reset();
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setPerformanceMetrics((prev) => ({ ...prev, startTime: Date.now() }));
    let i = 0;
    stepOnce(0);
    timerRef.current = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setPerformanceMetrics((prev) => ({
          ...prev,
          endTime: Date.now(),
          duration: Date.now() - prev.startTime,
        }));
      } else {
        stepOnce(i);
      }
    }, Math.max(200, speed));
  }, [reset, speed, stepOnce, steps.length]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setPerformanceMetrics((prev) => ({
      ...prev,
      endTime: Date.now(),
      duration: Date.now() - prev.startTime,
    }));
  }, []);

  const next = useCallback(() => {
    if (!isRunning) {
      const nextIdx = Math.min(stageIndex + 1, steps.length - 1);
      if (stageIndex === 0 && logs.length === 0) {
        startTimeRef.current = Date.now();
        setPerformanceMetrics((prev) => ({ ...prev, startTime: Date.now() }));
      }
      stepOnce(nextIdx);
      setStageIndex(nextIdx);
    }
  }, [isRunning, stageIndex, steps.length, logs.length, stepOnce]);

  const prev = useCallback(() => {
    if (!isRunning && stageIndex > 0) {
      const prevIdx = Math.max(stageIndex - 1, 0);
      stepOnce(prevIdx);
      setStageIndex(prevIdx);
    }
  }, [isRunning, stageIndex, stepOnce]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const nodeActive = (name) => steps[stageIndex]?.stage === name;

  const StageRow = () => (
    <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
      {/* 1. Client */}
      <div className="w-full">
        <NodeCard
          title="Client"
          subtitle="Browser / App"
          icon={<Globe className="w-5 h-5" />}
          active={nodeActive("Client")}
          accent={<Pill>Source</Pill>}
          theme={theme}
          color="bg-sky-500"
          gradient="from-sky-500 to-sky-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("Client") || nodeActive("Stub Resolver")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 2. Stub Resolver */}
      <div className="w-full">
        <NodeCard
          title="Stub Resolver"
          subtitle="OS resolver"
          icon={<Activity className="w-5 h-5" />}
          active={nodeActive("Stub Resolver")}
          accent={<Pill color="bg-sky-600">RD=1</Pill>}
          theme={theme}
          color="bg-indigo-500"
          gradient="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("Stub Resolver") || nodeActive("Recursive Resolver")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 3. Recursive Resolver */}
      <div className="w-full">
        <NodeCard
          title="Recursive Resolver"
          subtitle="ISP/Public resolver"
          icon={<Server className="w-5 h-5" />}
          active={nodeActive("Recursive Resolver")}
          accent={
            withDNSSEC ? (
              <Pill color="bg-violet-600">DO=1</Pill>
            ) : (
              <Pill color="bg-slate-500">Iterative</Pill>
            )
          }
          theme={theme}
          color="bg-emerald-500"
          gradient="from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("Recursive Resolver") || nodeActive("Root")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 4. Root */}
      <div className="w-full">
        <NodeCard
          title="Root"
          subtitle="Root NS referral"
          icon={<Layers className="w-5 h-5" />}
          active={nodeActive("Root")}
          accent={<Pill color="bg-amber-600">NS</Pill>}
          theme={theme}
          color="bg-amber-500"
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("Root") || nodeActive("TLD")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 5. TLD */}
      <div className="w-full">
        <NodeCard
          title="TLD"
          subtitle="TLD NS referral"
          icon={<Layers className="w-5 h-5" />}
          active={nodeActive("TLD")}
          accent={<Pill color="bg-orange-600">NS</Pill>}
          theme={theme}
          color="bg-orange-500"
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("TLD") || nodeActive("Authoritative")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 6. Authoritative */}
      <div className="w-full">
        <NodeCard
          title="Authoritative"
          subtitle="Holds final RRset"
          icon={<Server className="w-5 h-5" />}
          active={nodeActive("Authoritative")}
          accent={
            withDNSSEC ? (
              <div className="flex items-center gap-1 flex-wrap">
                <Pill color="bg-violet-600">RRSIG</Pill>
                <Pill color="bg-violet-600">DNSKEY</Pill>
              </div>
            ) : (
              <Pill color="bg-emerald-600">Answer</Pill>
            )
          }
          theme={theme}
          color="bg-red-500"
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Arrow down */}
      <ChevronDown
        className={`w-8 h-8 ${
          nodeActive("Authoritative") || nodeActive("Return")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
            ? "text-slate-600"
            : "text-slate-300"
        }`}
      />

      {/* 7. Return */}
      <div className="w-full">
        <NodeCard
          title="Return"
          subtitle="Answer to client + cache"
          icon={<Database className="w-5 h-5" />}
          active={nodeActive("Return")}
          accent={<Pill color="bg-purple-600">RA=1</Pill>}
          theme={theme}
          color="bg-purple-500"
          gradient="from-purple-500 to-purple-600"
        />
      </div>
    </div>
  );

  const GlossaryEntry = ({ term, children }) => (
    <div>
      <div
        className={`text-sm font-mono font-medium ${
          theme === "dark" ? "text-emerald-300" : "text-emerald-700"
        }`}
      >
        {term}
      </div>
      <p
        className={`text-xs font-mono mt-1 ${
          theme === "dark" ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {children}
      </p>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          theme === "dark"
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Server
              className={`w-6 h-6 flex-shrink-0 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <div>
              <div
                className={`text-${
                  theme === "dark" ? "slate-100" : "slate-900"
                } font-bold font-mono`}
              >
                DNS Visualization
              </div>
              <div
                className={`text-xs font-mono ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Learn DNS resolution, records, caching, and DNSSEC
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-mono ${
                theme === "dark"
                  ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Controls */}
        <Section
          title="Controls"
          icon={<Activity className="w-4 h-4" />}
          right={
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={play}
                disabled={isRunning}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-mono ${
                  isRunning
                    ? theme === "dark"
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-slate-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
                aria-label="Play"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Play</span>
              </button>
              <button
                onClick={pause}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-mono ${
                  theme === "dark"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
                aria-label="Pause"
              >
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">Pause</span>
              </button>
              <button
                onClick={prev}
                disabled={isRunning || stageIndex === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-mono ${
                  isRunning || stageIndex === 0
                    ? theme === "dark"
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-slate-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
                aria-label="Previous"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={next}
                disabled={isRunning}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-mono ${
                  isRunning
                    ? theme === "dark"
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-slate-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
                aria-label="Step"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline">Next</span>
              </button>
              <button
                onClick={reset}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm font-mono ${
                  theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "bg-slate-700 hover:bg-slate-800"
                }`}
                aria-label="Reset"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          }
          theme={theme}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label
                className={`text-xs font-medium font-mono ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Domain
              </label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className={`w-full rounded-md border font-mono ${
                  theme === "dark"
                    ? "border-slate-600 bg-slate-700 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="example.com"
              />
            </div>
            <div className="space-y-1">
              <label
                className={`text-xs font-medium font-mono ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Record Type
              </label>
              <div
                className={`relative ${
                  theme === "dark" ? "text-white" : "text-slate-800"
                }`}
              >
                <select
                  className={`w-full appearance-none rounded-md border font-mono ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  value={qtype}
                  onChange={(e) => setQtype(e.target.value)}
                >
                  {RECORD_TYPES.map((r) => (
                    <option key={r.v} value={r.v}>
                      {r.v}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-4 h-4 absolute right-3 top-2.5 ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  } pointer-events-none`}
                />
              </div>
              <div
                className={`text-[11px] font-mono ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {RECORD_TYPES.find((x) => x.v === qtype)?.desc}
              </div>
            </div>
            <div className="space-y-1">
              <label
                className={`text-xs font-medium font-mono ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Speed (ms)
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpeed(1200)}
                  title="Slow (1200ms)"
                  className={`flex-1 px-2 py-1 rounded font-mono text-xs ${
                    speed === 1200
                      ? theme === "dark"
                        ? "bg-sky-600 text-white"
                        : "bg-sky-600 text-white"
                      : theme === "dark"
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <Turtle className="w-4 h-4 mx-auto" />
                  <span className="text-[10px]">1200</span>
                </button>
                <button
                  onClick={() => setSpeed(800)}
                  title="Normal (800ms)"
                  className={`flex-1 px-2 py-1 rounded font-mono text-xs ${
                    speed === 800
                      ? theme === "dark"
                        ? "bg-sky-600 text-white"
                        : "bg-sky-600 text-white"
                      : theme === "dark"
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <RefreshCw className="w-4 h-4 mx-auto" />
                  <span className="text-[10px]">800</span>
                </button>
                <button
                  onClick={() => setSpeed(400)}
                  title="Fast (400ms)"
                  className={`flex-1 px-2 py-1 rounded font-mono text-xs ${
                    speed === 400
                      ? theme === "dark"
                        ? "bg-sky-600 text-white"
                        : "bg-sky-600 text-white"
                      : theme === "dark"
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <FastForward className="w-4 h-4 mx-auto" />
                  <span className="text-[10px]">400</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  className={`text-xs font-medium font-mono ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  DNSSEC
                </label>
                <button
                  onClick={() => setWithDNSSEC((v) => !v)}
                  className={[
                    "w-full inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm border font-mono",
                    withDNSSEC
                      ? theme === "dark"
                        ? "bg-violet-600 text-white border-violet-700"
                        : "bg-violet-600 text-white border-violet-700"
                      : theme === "dark"
                      ? "bg-slate-700 text-slate-300 border-slate-600"
                      : "bg-white text-slate-700 border-slate-300",
                  ].join(" ")}
                >
                  {withDNSSEC ? (
                    <>
                      <ShieldCheck className="w-4 h-4" /> On
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" /> Off
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-1">
                <label
                  className={`text-xs font-medium font-mono ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Cache
                </label>
                <button
                  onClick={() => setCacheWarm((v) => !v)}
                  className={[
                    "w-full inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm border font-mono",
                    cacheWarm
                      ? theme === "dark"
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-emerald-600 text-white border-emerald-700"
                      : theme === "dark"
                      ? "bg-slate-700 text-slate-300 border-slate-600"
                      : "bg-white text-slate-700 border-slate-300",
                  ].join(" ")}
                >
                  <Database className="w-4 h-4" />
                  {cacheWarm ? "Warm" : "Cold"}
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {showPerformance && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                theme === "dark" ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Network
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <span className="font-medium font-mono">Performance</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  className={`p-2 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Duration
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      theme === "dark" ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {performanceMetrics.duration > 0
                      ? `${Math.round(performanceMetrics.duration)} ms`
                      : "—"}
                  </div>
                </div>
                <div
                  className={`p-2 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Steps
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      theme === "dark" ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {performanceMetrics.steps} / {steps.length}
                  </div>
                </div>
                <div
                  className={`p-2 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Cache
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      theme === "dark" ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {cacheWarm ? "Hit" : "Miss"}
                  </div>
                </div>
                <div
                  className={`p-2 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Security
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      theme === "dark" ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {withDNSSEC ? "DNSSEC" : "Plain"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Diagram */}
        <Section
          title="Resolution Path"
          icon={<Search className="w-4 h-4" />}
          right={
            <div
              className={`text-xs font-mono ${
                theme === "dark" ? "text-slate-300" : "text-slate-500"
              }`}
            >
              Step {stageIndex + 1} of {steps.length}
              {isRunning && <span className="ml-1 animate-pulse">•</span>}
            </div>
          }
          theme={theme}
        >
          <div ref={timelineRef} className="space-y-4">
            <StageRow />
          </div>
        </Section>

        {/* Inspector and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Section
            title="Packet Inspector"
            icon={<Info className="w-4 h-4" />}
            right={
              withDNSSEC ? (
                <div className="flex items-center gap-2">
                  <Lock
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-violet-400" : "text-violet-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono ${
                      theme === "dark" ? "text-violet-300" : "text-violet-700"
                    } font-medium`}
                  >
                    DO=1, RRSIG/DNSKEY
                  </span>
                </div>
              ) : null
            }
            theme={theme}
          >
            <Inspector packet={packet} theme={theme} />
          </Section>
          <LogPanel logs={logs} theme={theme} />
        </div>

        {/* Help */}
        <Section
          title="Documentation"
          icon={<Info className="w-4 h-4" />}
          right={
            <button
              onClick={() => setExpandedHelp((v) => !v)}
              className={`inline-flex items-center gap-1 text-sm font-mono ${
                theme === "dark"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-emerald-700 hover:text-emerald-800"
              }`}
            >
              {expandedHelp ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {expandedHelp ? "Hide" : "Learn more"}
            </button>
          }
          theme={theme}
        >
          {expandedHelp && (
            <div
              className={`text-xs font-mono ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } space-y-2`}
            >
              <p>
                The client asks its stub resolver, which forwards a recursive
                query to a recursive resolver that either answers from cache or
                performs iterative lookups starting at the root, then the TLD,
                and finally the authoritative server for the target domain.
              </p>
              <p>
                The final response includes RRsets like A/AAAA/CNAME/MX/NS/TXT
                depending on the query, and the recursive resolver caches the
                data for the TTL to speed up future lookups.
              </p>
              <p>
                With DNSSEC enabled, the DO bit is set in queries and the
                resolver obtains RRSIG and DNSKEY records to validate responses
                before accepting and returning them to the client.
              </p>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Sources: RFC 1034, RFC 1035, RFC 4033, RFC 4034, RFC 4035
                (DNSSEC), Cloudflare DNS documentation, BIND 9 Administrator
                Reference Manual.
              </div>

              <div
                className={`mt-4 p-3 rounded-lg border border-dashed ${
                  theme === "dark"
                    ? "border-slate-600 bg-slate-800"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span className="font-medium">Usage Tips</span>
                </div>
                <ul
                  className={`text-xs ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } space-y-1`}
                >
                  <li>
                    • Use Play/Pause/Next/Prev buttons to control simulation
                  </li>
                  <li>• Try different record types (A, AAAA, MX, etc.)</li>
                  <li>• Toggle cache state to see caching effects</li>
                  <li>• Enable DNSSEC to understand its security role</li>
                  <li>• Toggle between light/dark mode for visibility</li>
                  <li>• Adjust speed to match your learning pace</li>
                </ul>
              </div>
            </div>
          )}
        </Section>

        {/* NEW: Glossary Section */}
        <Section
          title="Glossary"
          icon={<BookOpen className="w-4 h-4" />}
          right={
            <button
              onClick={() => setExpandedGlossary((v) => !v)}
              className={`inline-flex items-center gap-1 text-sm font-mono ${
                theme === "dark"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-emerald-700 hover:text-emerald-800"
              }`}
            >
              {expandedGlossary ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {expandedGlossary ? "Hide" : "Show terms"}
            </button>
          }
          theme={theme}
        >
          {expandedGlossary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlossaryEntry term="DNS">
                Domain Name System. The Internet's phonebook, translating
                human-readable domain names (e.g., www.example.com) into
                machine-readable IP addresses.
              </GlossaryEntry>
              <GlossaryEntry term="DNSSEC">
                DNS Security Extensions. Adds security by enabling DNS responses
                to be cryptographically signed, protecting against data spoofing
                (cache poisoning).
              </GlossaryEntry>
              <GlossaryEntry term="Stub Resolver">
                A simple DNS client on a user's machine (part of the OS) that
                forwards DNS queries to a recursive resolver.
              </GlossaryEntry>
              <GlossaryEntry term="Recursive Resolver">
                A server (e.g., at an ISP or a public provider like 8.8.8.8)
                that accepts queries from clients and performs the full lookup
                process to find the answer.
              </GlossaryEntry>
              <GlossaryEntry term="Root Server">
                The first step in a DNS lookup. There are 13 logical root server
                clusters that direct queries to the correct TLD servers.
              </GlossaryEntry>
              <GlossaryEntry term="TLD Server">
                Top-Level Domain server. Manages names for a specific TLD (e.g.,
                .com, .org). It refers queries to the domain's authoritative
                name server.
              </GlossaryEntry>
              <GlossaryEntry term="Authoritative Server">
                The final authority for a specific domain. It holds the DNS
                records and provides the definitive answer to a query.
              </GlossaryEntry>
              <GlossaryEntry term="Cache">
                Temporary storage of DNS records. A 'Warm' cache (cache hit)
                returns a stored answer quickly. A 'Cold' cache (cache miss)
                requires a full lookup.
              </GlossaryEntry>
              <GlossaryEntry term="TTL (Time To Live)">
                A value in a DNS record specifying how long (in seconds) a
                resolver should cache the record before it needs to be fetched
                again.
              </GlossaryEntry>
              <GlossaryEntry term="A Record">
                An 'Address' record that maps a domain name to an IPv4 address
                (e.g., 93.184.216.34).
              </GlossaryEntry>
              <GlossaryEntry term="AAAA Record">
                Maps a domain name to an IPv6 address (e.g.,
                2606:2800:220:1:248:1893:25c8:1946).
              </GlossaryEntry>
              <GlossaryEntry term="CNAME Record">
                A 'Canonical Name' record used to alias one domain name to
                another.
              </GlossaryEntry>
              <GlossaryEntry term="MX Record">
                A 'Mail Exchange' record that directs a domain's email to a
                specific mail server.
              </GlossaryEntry>
              <GlossaryEntry term="NS Record">
                A 'Name Server' record that delegates a domain to a set of
                authoritative name servers.
              </GlossaryEntry>
              <GlossaryEntry term="DO bit (DNSSEC OK)">
                A flag in a DNS query header indicating that the client is
                DNSSEC-aware and wants DNSSEC-related records in the response.
              </GlossaryEntry>
              <GlossaryEntry term="RRSIG (Resource Record Signature)">
                A DNSSEC record containing a digital signature for a set of
                records, used to verify their authenticity.
              </GlossaryEntry>
              <GlossaryEntry term="DNSKEY">
                A DNSSEC record containing the public key used to verify RRSIG
                records for a specific zone.
              </GlossaryEntry>
              <GlossaryEntry term="Iterative Query">
                A query where the DNS server provides the best answer it has,
                typically a referral to another server. Recursive resolvers use
                iterative queries.
              </GlossaryEntry>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

// SVG Icons
const Sun = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const Moon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export default App;
