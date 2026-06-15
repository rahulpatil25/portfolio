import React, { useState, useEffect, useRef } from "react"
import { Activity, ShieldAlert, Cpu, BarChart2 } from "lucide-react"

const MesDashboardDemo = () => {
  const [cacheActive, setCacheActive] = useState(false)
  const [latency, setLatency] = useState(640)
  const [throughput, setThroughput] = useState(140)
  const [uptime, setUptime] = useState(99.92)
  const [history, setHistory] = useState(Array(20).fill(640))
  
  const tickRef = useRef(null)

  useEffect(() => {
    // Start interval loop simulating real-time telemetry ticks
    tickRef.current = setInterval(() => {
      let baseLatency = cacheActive ? 4 : 580
      let variance = cacheActive ? Math.random() * 4 : Math.random() * 140
      let nextLatency = Math.floor(baseLatency + variance)
      
      setLatency(nextLatency)
      setHistory((prev) => {
        const next = [...prev.slice(1), nextLatency]
        return next
      })

      // Throughput fluctuations
      let baseThrough = cacheActive ? 220 : 120
      let nextThrough = Math.floor(baseThrough + (Math.random() * 40 - 20))
      setThroughput(nextThrough)

      // Tiny uptime fluctuations representing stability
      setUptime((prev) => {
        const drift = Math.random() * 0.001 - 0.0002
        const next = prev + drift
        return Math.min(100, Math.max(99.9, next))
      })

    }, 800)

    return () => clearInterval(tickRef.current)
  }, [cacheActive])

  // Map history values to SVG points for clean line rendering
  const maxVal = cacheActive ? 15 : 800
  const points = history
    .map((val, idx) => {
      const x = (idx / 19) * 100 // percent width
      // Scale y so that lower latency is at the bottom (inverted coordinate system in SVG)
      // We clamp val between 0 and 800
      const clamped = Math.min(800, Math.max(0, val))
      const y = 100 - (clamped / 800) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="flex flex-col gap-6 text-sm text-[#9ca3af]">
      {/* Caching control switch */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/3 border border-white/5">
        <div>
          <h4 className="font-heading font-extrabold text-xs text-white">Redis Cache &amp; Connection Pooling</h4>
          <p className="text-[11px] text-[#9ca3af] mt-1">
            Toggle the Redis caching layer to route query results from high-latency disk storage to in-memory caches.
          </p>
        </div>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={cacheActive}
              onChange={() => {
                setCacheActive(!cacheActive)
                setHistory(Array(20).fill(cacheActive ? 640 : 4))
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white" />
          </label>
        </div>
      </div>

      {/* Grid of live values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-lg border border-white/5 bg-[#080c14]/60 flex flex-col gap-1">
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Query Latency</span>
          <span className={`text-xl font-mono font-bold transition-colors duration-300 ${cacheActive ? "text-emerald-400" : "text-amber-500"}`}>
            {latency}ms
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> P95 Response
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-lg border border-white/5 bg-[#080c14]/60 flex flex-col gap-1">
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Throughput</span>
          <span className="text-xl font-mono font-bold text-white">
            {throughput} req/s
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Concurrent loads
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-lg border border-white/5 bg-[#080c14]/60 flex flex-col gap-1">
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Database Uptime</span>
          <span className="text-xl font-mono font-bold text-emerald-400">
            {uptime.toFixed(4)}%
          </span>
          <span className="text-[10px] text-gray-500">Target SLA: 99.9%</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-lg border border-white/5 bg-[#080c14]/60 flex flex-col gap-1">
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Incident Queue</span>
          <span className="text-xl font-mono font-bold text-white">0 Active</span>
          <span className="text-[10px] text-emerald-500/70 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> SLA Compliant
          </span>
        </div>
      </div>

      {/* SVG Canvas Live Plotting Latency */}
      <div className="relative p-5 rounded-lg border border-white/5 bg-[#080c14]">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase mb-4">
          <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> Telemetry Latency Plot</span>
          <span className={cacheActive ? "text-emerald-500" : "text-amber-500"}>
            {cacheActive ? "In-Memory Cache Active" : "Uncached Table Scan"}
          </span>
        </div>

        <div className="h-32 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Helper Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

            {/* Plot Line */}
            <polyline
              fill="none"
              stroke={cacheActive ? "#10b981" : "#f59e0b"}
              strokeWidth="2.5"
              points={points}
              className="transition-colors duration-300"
            />
          </svg>
        </div>

        {/* Chart Y-Axis indicators */}
        <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-2">
          <span>T - 15s</span>
          <span>Latency Spike: {cacheActive ? "~8ms" : "~750ms"}</span>
          <span>Live Ticks</span>
        </div>
      </div>
    </div>
  )
}

export default MesDashboardDemo
