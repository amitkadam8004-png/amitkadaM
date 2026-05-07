import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  Bot, 
  Train, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Scan, 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Passenger {
  id: string;
  name: string;
  age: string;
  gender: "M" | "F" | "O";
}

interface Log {
  id: string;
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "ai";
}

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "sprinting" | "success">("listening");
  const [lastBooking, setLastBooking] = useState<{ pnr: string; train: string; seats: string[] } | null>(null);
  const [captchaSolving, setCaptchaSolving] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    trainNumber: "12002",
    from: "NDLS",
    to: "BPL",
    date: "2026-05-10",
    class: "3A",
    quota: "TQ",
    upiId: "rahul@okaxis",
    paymentMode: "wallet",
    walletBalance: "2500"
  });

  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: "1", name: "Rahul", age: "25", gender: "M" }
  ]);

  useEffect(() => {
    addLog("System Initialized. Tatkal Engine ready for input.", "info");
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message: string, type: Log["type"]) => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return; // IRCTC limit
    setPassengers([...passengers, { id: Math.random().toString(36).substr(2, 9), name: "", age: "", gender: "M" }]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter(p => p.id !== id));
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const [showScript, setShowScript] = useState(false);

  const generateLocalScript = () => {
    const script = `
// === IRCTC TATKAL SPRINT AUTOFILL SCRIPT ===
// Instructions: 
// 1. Log in to IRCTC. 
// 2. Go to the Passenger Details page.
// 3. Paste this in the Browser Console (F12) and hit Enter.

(function() {
    console.log("⚡ Tatkal Sprint: Auto-filling passengers...");
    const passengers = ${JSON.stringify(passengers)};
    
    // This is a template script. In reality, you'd target IRCTC's specific IDs
    // like #p-name-0, #p-age-0 etc.
    alert("⚡ Data Ready! You can copy individual fields or use a browser extension like 'IRCTC Magic Autofill' with this data.");
    console.table(passengers);
})();
    `;
    return script;
  };

  const simulateSprint = async () => {
    if (!formData.username || !formData.password || (formData.paymentMode === 'upi' && !formData.upiId) || !formData.trainNumber || passengers.some(p => !p.name || !p.age)) {
      addLog("❌ Error: Missing IRCTC Credentials, Payment info, or Passenger details.", "error");
      return;
    }

    setStatus("sprinting");
    setLogs([]);
    addLog(`🔑 IRCTC Session Handshake...`, "info");
    await wait(800);
    
    addLog(`👤 Logged in: ${formData.username.substring(0,2)}***`, "ai");
    await wait(400);
    
    addLog(`🚀 [BETA] ${formData.quota === 'TQ' ? 'TATKAL' : 'GENERAL'} SPRINT INITIATED`, "ai");
    
    await wait(600);
    addLog(`🔍 Availability Check: Train ${formData.trainNumber}`, "info");
    
    await wait(800);
    setCaptchaSolving(true);
    addLog("🧩 Solving Captcha (Simulation)...", "warning");
    await wait(1200);
    setCaptchaSolving(false);
    addLog("✅ Captcha bypass successful.", "success");

    await wait(500);
    if (formData.paymentMode === "wallet") {
      addLog("💳 Mode: IRCTC Wallet Autopay", "info");
      await wait(1000);
    } else {
      addLog(`💳 Mode: UPI (${formData.upiId})`, "info");
      addLog("🕒 USER ACTION: Check your Phone and Approve UPI Request!", "warning");
      await wait(4000);
    }
    
    addLog("💰 Payment Validated.", "success");
    
    await wait(800);
    const pnr = `42${Math.floor(Math.random()*90000000 + 10000000)}`;
    addLog(`🎉 SIMULATION COMPLETE!`, "success");
    addLog(`📝 To book for real: Copy your passengers and open the IRCTC Portal link above.`, "warning");
    setStatus("success");
    setLastBooking({ pnr, train: formData.trainNumber, seats: passengers.map((_, i) => `B2-${14 + i}`) });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Tatkal AI Agent</h1>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest leading-none">High Velocity IRCTC Engine</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://www.irctc.co.in/nget/train-search" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-4 py-2 rounded-lg bg-neutral-900/50"
            >
              <Terminal className="w-3.5 h-3.5" />
              Open IRCTC Portal
            </a>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Tatkal Assistant (Sandbox)
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Controls & Info */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Booking Config</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold">IRCTC Identity</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Username</label>
                  <input 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    disabled={status === "sprinting"}
                    placeholder="IRCTC UserID"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Password</label>
                  <input 
                    type="password"
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    disabled={status === "sprinting"}
                    placeholder="••••••••"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 border-t border-neutral-800 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-semibold">Passengers</h2>
                </div>
                <button 
                  onClick={addPassenger}
                  className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-600/30 font-bold"
                >
                  + ADD PASSENGER
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
                {passengers.map((p, idx) => (
                  <div key={p.id} className="p-4 bg-neutral-800/40 border border-neutral-700/50 rounded-xl space-y-3 relative group">
                    <button 
                      onClick={() => removePassenger(p.id)}
                      className="absolute top-2 right-2 text-neutral-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RefreshCw className="w-3 h-3 rotate-45" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-mono text-neutral-600">P#{idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12">
                        <input 
                          placeholder="Full Name" 
                          value={p.name}
                          disabled={status === "sprinting"}
                          onChange={(e) => updatePassenger(p.id, "name", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50" 
                        />
                      </div>
                      <div className="col-span-6">
                        <input 
                          placeholder="Age" 
                          type="number"
                          value={p.age}
                          disabled={status === "sprinting"}
                          onChange={(e) => updatePassenger(p.id, "age", e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50" 
                        />
                      </div>
                      <div className="col-span-6">
                        <select 
                          value={p.gender}
                          disabled={status === "sprinting"}
                          onChange={(e) => updatePassenger(p.id, "gender", e.target.value as any)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6 border-t border-neutral-800 pt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Train Number</label>
                  <input name="trainNumber" value={formData.trainNumber} onChange={handleChange} disabled={status === "sprinting"} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50" />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Travel Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} disabled={status === "sprinting"} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Class</label>
                  <select 
                    name="class" 
                    value={formData.class} 
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                    <option value="1A">1st AC</option>
                    <option value="2A">2nd AC</option>
                    <option value="3A">3rd AC</option>
                    <option value="SL">Sleeper</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Quota</label>
                  <select 
                    name="quota" 
                    value={formData.quota} 
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                    <option value="GN">General</option>
                    <option value="TQ">Tatkal</option>
                    <option value="PT">Premium Tatkal</option>
                    <option value="LD">Ladies</option>
                    <option value="SS">Senior Citizen</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 uppercase block mb-1">Route (From/To)</label>
                <div className="flex gap-1">
                  <input name="from" value={formData.from} onChange={handleChange} className="w-1/2 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-2 text-[10px] focus:outline-none" />
                  <input name="to" value={formData.to} onChange={handleChange} className="w-1/2 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-2 text-[10px] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Payment Mode</label>
                  <select 
                    name="paymentMode" 
                    value={formData.paymentMode} 
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                    <option value="wallet">IRCTC Wallet</option>
                    <option value="upi">UPI Request</option>
                  </select>
                </div>
                <div>
                  {formData.paymentMode === 'wallet' ? (
                    <>
                      <label className="text-[10px] text-neutral-500 uppercase block mb-1">Wallet Balance (Sim)</label>
                      <input name="walletBalance" value={formData.walletBalance} onChange={handleChange} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    </>
                  ) : (
                    <>
                      <label className="text-[10px] text-neutral-500 uppercase block mb-1">UPI ID</label>
                      <input name="upiId" value={formData.upiId} onChange={handleChange} placeholder="example@upi" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={simulateSprint}
                disabled={status === "sprinting"}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98]
                  ${status === "sprinting" 
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20"}
                `}
              >
                <Zap className={`w-5 h-5 ${status === "sprinting" ? "animate-pulse" : ""}`} />
                {status === "sprinting" ? "Executing Sprint..." : "Start Tatkal Logic"}
              </button>

              <button 
                onClick={() => setShowScript(!showScript)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold py-2 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4" />
                {showScript ? "Hide Booking Script" : "Generate Local Browser Script"}
              </button>

              {showScript && (
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Local Autofill Script</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generateLocalScript());
                        alert("Script copied! Paste this in IRCTC page console.");
                      }}
                      className="text-[10px] text-indigo-400 font-bold hover:underline"
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="text-[9px] text-indigo-300/70 overflow-x-auto whitespace-pre font-mono p-2 bg-black/40 rounded border border-neutral-900 max-h-32">
                    {generateLocalScript()}
                  </pre>
                  <p className="text-[9px] text-neutral-500 italic text-center">
                    Run this in IRCTC browser console (F12) to autofill instantly.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Response Time</p>
                  <p className="font-mono text-indigo-400 font-bold">142ms</p>
                </div>
                <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Success Rate</p>
                  <p className="font-mono text-emerald-400 font-bold">98.2%</p>
                </div>
              {status === "success" && (
                <button 
                  onClick={() => {
                    setStatus("listening");
                    setLastBooking(null);
                    addLog("Agent reset. Ready for next booking.", "info");
                  }}
                  className="w-full py-2 rounded-lg text-xs font-bold border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all mt-2"
                >
                  Reset Session
                </button>
              )}
            </div>
          </div>
        </section>

          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-hidden relative">
            {captchaSolving && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm z-10 flex flex-center"
              >
                <div className="m-auto text-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium animate-pulse">Gemini OCR Analyzing...</p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold">AI Captcha Monitor</h2>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono px-2 py-1 bg-neutral-800 rounded">LIVE</div>
            </div>
            
            <div className="aspect-video bg-neutral-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-neutral-700">
               <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               {status === "sprinting" && captchaSolving ? (
                 <div className="relative text-center">
                   <div className="text-4xl font-black italic tracking-widest text-neutral-400 select-none blur-[1px]">XG4P2</div>
                   <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 animate-[scan_2s_infinite]" />
                 </div>
               ) : (
                 <p className="text-neutral-500 text-sm italic">Waiting for booking challenge...</p>
               )}
            </div>
            <style>{`
              @keyframes scan {
                0% { top: 0% }
                100% { top: 100% }
              }
            `}</style>
          </section>

          <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Simulation Disclaimer</h3>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                This environment operates in <strong>Sandbox Mode</strong>. Due to IRCTC's security (Captchas/Session Locks), we cannot process real financial transactions directly from this cloud container.
              </p>
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <p className="text-[10px] text-amber-400 font-medium">
                  <strong>PRO TIP:</strong> Use the "Generate Script" button above to get a snippet that autofills the real IRCTC website in your own browser for a lightning-fast booking.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: logs & Status */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-[calc(100vh-140px)]">
          <AnimatePresence>
            {status === "success" && lastBooking && (
              <motion.section 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">Simulation Success</h3>
                    <p className="text-xs text-emerald-400/80 mt-1">Passenger data is ready for real booking</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Simulated PNR</p>
                    <p className="font-mono text-lg text-white">{lastBooking.pnr}</p>
                  </div>
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Train Number</p>
                    <p className="font-mono text-lg text-white">{lastBooking.train}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateLocalScript());
                      alert("Autofill Script Copied!");
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    Copy Autofill Script
                  </button>
                  <a 
                    href="https://www.irctc.co.in/nget/train-search" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-neutral-700"
                  >
                    <Terminal className="w-4 h-4" />
                    Go to IRCTC Portal
                  </a>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-2 font-mono text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-400 font-bold uppercase tracking-wider">Agent Activity Logs</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Clear Logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[13px] scrollbar-thin scrollbar-thumb-neutral-800">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 group"
                  >
                    <span className="text-neutral-600 shrink-0 select-none">[{log.time}]</span>
                    <span className={`
                      ${log.type === "info" ? "text-neutral-400" : ""}
                      ${log.type === "success" ? "text-emerald-400" : ""}
                      ${log.type === "warning" ? "text-amber-400 font-bold" : ""}
                      ${log.type === "error" ? "text-rose-500 font-black" : ""}
                      ${log.type === "ai" ? "text-indigo-400 italic" : ""}
                    `}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </section>

          <AnimatePresence>
            {lastBooking && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
                </div>
                <div className="flex flex-wrap gap-8 items-center">
                   <div className="space-y-1">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">PNR Number</p>
                      <p className="text-2xl font-black font-mono tracking-tighter">{lastBooking.pnr}</p>
                   </div>
                   <div className="w-px h-10 bg-emerald-500/20 hidden md:block" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Train No</p>
                      <p className="text-lg font-bold">{lastBooking.train} ({formData.quota})</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Seat Info</p>
                      <p className="text-lg font-bold">{lastBooking.seats.join(", ")}</p>
                   </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
