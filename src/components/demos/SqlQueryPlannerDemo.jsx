import React, { useState } from "react"
import { Play, Zap, RefreshCw, BarChart2, ShieldAlert, Award } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

const queries = [
  {
    label: "MES Shop Orders Scan",
    sql: "SELECT * FROM orders WHERE user_id = 99 AND status = 'pending';",
    slowPlan: `EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 99 AND status = 'pending';

-> Seq Scan on orders (cost=0.00..18400.00 rows=145 width=128) (actual time=42.120..642.310 rows=142 loops=1)
     Filter: ((user_id = 99) AND (status = 'pending'::text))
     Rows Removed by Filter: 1,199,858
     Buffers: shared read=12040
Planning time: 0.155 ms
Execution time: 642.420 ms  <-- CRITICAL BOTTLENECK`,
    fastPlan: `EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 99 AND status = 'pending';

-> Index Scan using idx_orders_user_status on orders (cost=0.04..8.40 rows=145 width=128) (actual time=0.035..0.120 rows=142 loops=1)
     Index Cond: ((user_id = 99) AND (status = 'pending'::text))
     Buffers: shared hit=4
Planning time: 0.142 ms
Execution time: 0.145 ms  <-- 99.9% PERFORMANCE GAIN`,
    indexRecommend: "CREATE INDEX idx_orders_user_status ON orders(user_id, status);"
  },
  {
    label: "Aspect Sentiment Scan",
    sql: "SELECT * FROM app_reviews WHERE aspect = 'crash' AND date >= '2026-06-01';",
    slowPlan: `EXPLAIN (ANALYZE) SELECT * FROM app_reviews WHERE aspect = 'crash' AND date >= '2026-06-01';

-> Seq Scan on app_reviews (cost=0.00..4520.00 rows=12 width=256) (actual time=8.140..142.100 rows=10 loops=1)
     Filter: ((aspect = 'crash'::text) AND (date >= '2026-06-01'::date))
     Rows Removed by Filter: 324,500
Planning time: 0.210 ms
Execution time: 142.180 ms  <-- CRITICAL BOTTLENECK`,
    fastPlan: `EXPLAIN (ANALYZE) SELECT * FROM app_reviews WHERE aspect = 'crash' AND date >= '2026-06-01';

-> Index Scan using idx_reviews_aspect_date on app_reviews (cost=0.03..5.24 rows=12 width=256) (actual time=0.012..0.045 rows=10 loops=1)
     Index Cond: ((aspect = 'crash'::text) AND (date >= '2026-06-01'::date))
Planning time: 0.198 ms
Execution time: 0.052 ms  <-- 99.9% PERFORMANCE GAIN`,
    indexRecommend: "CREATE INDEX idx_reviews_aspect_date ON app_reviews(aspect, date);"
  }
]

const SqlQueryPlannerDemo = () => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [optimizerState, setOptimizerState] = useState("unoptimized") // unoptimized, optimizing, optimized
  const [terminalOutput, setTerminalOutput] = useState("")
  const [logs, setLogs] = useState([])

  const current = queries[selectedIdx]

  const handleSelectQuery = (idx) => {
    setSelectedIdx(idx)
    setOptimizerState("unoptimized")
    setTerminalOutput("")
    setLogs([])
  }

  const runExplain = () => {
    setOptimizerState("unoptimized")
    setLogs(["Running EXPLAIN ANALYZE on query database planner..."])
    
    setTimeout(() => {
      setTerminalOutput(current.slowPlan)
      setLogs((prev) => [...prev, "Execution plan mapped. Missing index detected."])
    }, 800)
  }

  const applyIndex = () => {
    if (optimizerState !== "unoptimized") return
    setOptimizerState("optimizing")
    setLogs((prev) => [...prev, "Initiating database schema alteration thread..."])
    
    setTimeout(() => {
      setLogs((prev) => [...prev, `Executing: ${current.indexRecommend}`])
    }, 600)

    setTimeout(() => {
      setLogs((prev) => [...prev, "Index created. Re-running query compilation plan..."])
    }, 1400)

    setTimeout(() => {
      setOptimizerState("optimized")
      setTerminalOutput(current.fastPlan)
      setLogs((prev) => [...prev, "SUCCESS: Index utilized. Query latency reduced by 99.9%!"])
    }, 2200)
  }

  return (
    <div className="flex flex-col gap-6 text-sm text-[#9ca3af]">
      <div>
        <p className="text-[#f3f4f6] text-xs font-semibold mb-2">Select a SQL query bottleneck to analyze:</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {queries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuery(idx)}
              className={`px-3 py-1 border rounded-md text-xs font-heading transition-all ${
                selectedIdx === idx
                  ? "bg-cyanCustom/10 border-cyanCustom/20 text-cyanCustom font-bold"
                  : "bg-white/3 border-white/5 text-gray-300 hover:bg-white/5"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="p-3 rounded-md bg-[#080c14] border border-white/5 font-mono text-[11px] text-gray-300 mb-3 whitespace-pre-wrap">
          {current.sql}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={runExplain}
            disabled={optimizerState === "optimizing"}
            variant="secondary"
            className="text-xs h-8 px-4 rounded-md border border-white/10"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Run Explain
          </Button>

          {terminalOutput && optimizerState === "unoptimized" && (
            <Button
              onClick={applyIndex}
              variant="hybrid"
              className="text-xs h-8 px-4 rounded-md animate-pulse shadow-md"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" /> Apply Recommended Index
            </Button>
          )}
        </div>
      </div>

      {logs.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Action Log stream */}
          <div className="flex flex-col gap-1.5 font-mono text-[10px] text-gray-400 bg-white/2 p-3 rounded border border-white/5">
            {logs.map((log, idx) => {
              let color = "text-gray-400"
              if (log.includes("Alteration") || log.includes("Executing")) color = "text-amber-400"
              if (log.includes("SUCCESS")) color = "text-emerald-400"
              return (
                <div key={idx} className={`flex gap-2 ${color}`}>
                  <span>&gt;</span>
                  <span>{log}</span>
                </div>
              )
            })}
          </div>

          {/* Explain Output Code Block */}
          {terminalOutput && (
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
                <BarChart2 className="w-3.5 h-3.5" /> Plan Output
              </div>
              <pre className="p-4 rounded-lg bg-[#080c14] border border-white/5 font-mono text-[11px] text-[#f3f4f6] leading-relaxed overflow-x-auto whitespace-pre">
                {terminalOutput}
              </pre>
            </div>
          )}

          {/* Performance Optimization Outcome banner */}
          {optimizerState === "optimized" && (
            <div className="flex items-center gap-4 p-5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 text-[#f3f4f6]">
              <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <h4 className="font-heading font-extrabold text-sm text-emerald-400">99.9% Query Speedup Achieved</h4>
                <p className="text-[#9ca3af]">
                  By converting the sequential database plan into an index scan, query cost dropped from <strong>18,400.00</strong> to <strong>8.40</strong>. Report generation speed was cut from <strong>642ms to 0.14ms</strong>, securing high data availability under concurrent MES loads.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SqlQueryPlannerDemo
