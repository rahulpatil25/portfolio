import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Code, Terminal } from "lucide-react"
import { Button } from "./ui/button"

const simulatorTasks = {
  generate_prd: {
    filename: "sql_agent.py",
    code: `from agent_db import DatabaseAgent, QueryAnalyzer
from db_tools import run_explain, apply_index

agent = DatabaseAgent(
    role="SQL Performance Agent",
    system_prompt="Analyze slow SQL queries and apply optimal indexes.",
    tools=[run_explain, apply_index]
)

result = agent.run("Optimize SELECT * FROM orders WHERE user_id = 99 AND status = 'pending'")
print(f"Index applied: {result.index_name}")`,
    steps: [
      { type: "thinking", text: "Instantiating SQL Performance Agent with database explain tool..." },
      { type: "thinking", text: "Analyzing query: 'Optimize SELECT * FROM orders WHERE user_id = 99 AND status = 'pending''" },
      { type: "tool-call", text: "Executing query plan analyzer: run_explain(query='SELECT * FROM orders WHERE user_id = 99 AND status = 'pending'')..." },
      { type: "text", text: "    -> Tool return: Scan type: Seq Scan (Table Scan). Cost: 18,400. Rows scanned: 1,200,000." },
      { type: "thinking", text: "Sequential scan detected on 1.2M rows. Diagnosing bottleneck: Missing composite index on (user_id, status)." },
      { type: "tool-call", text: "Calling database schema editor: apply_index(table='orders', columns=['user_id', 'status'])..." },
      { type: "text", text: "    -> Tool return: Composite index 'idx_orders_user_status' created successfully." },
      { type: "thinking", text: "Re-running query plan analysis to verify performance metrics..." },
      { type: "success", text: "SUCCESS: Query optimized. Scan type: Index Scan. Cost reduced from 18,400 to 0.04 (99.9% improvement)." }
    ]
  },
  eval_pipeline: {
    filename: "incident_router.py",
    code: `from itsm_agent import IncidentRoutingAgent
from remedy_tools import parse_incident, route_to_team

agent = IncidentRoutingAgent(
    role="Remedy Triage Coordinator",
    system_prompt="Categorize incoming BMC Remedy tickets and route to engineering teams.",
    tools=[parse_incident, route_to_team]
)

ticket = "Urgently need access to the production MES database. Reports are failing."
result = agent.run(ticket)
print(f"Ticket routed to: {result.assigned_group}")`,
    steps: [
      { type: "thinking", text: "Loading ITIL-aligned Incident Triage classification matrix..." },
      { type: "thinking", text: "Reading incoming Remedy incident ticket text: 'Urgently need access to the production MES database. Reports are failing.'" },
      { type: "tool-call", text: "Calling parser: parse_incident(ticket_text='Urgently need access to the production MES database. Reports are failing.')..." },
      { type: "text", text: "    -> Aspect breakdown: Category=Access/Database, Priority=P2, TargetSystem=MES Database." },
      { type: "thinking", text: "Identifying optimal team assignment based on SLA targets (P2 resolution target = 4 hours)." },
      { type: "tool-call", text: "Executing dispatch: route_to_team(incident_id='INC-88902', group='DBA-MES-Support')..." },
      { type: "text", text: "    -> Tool return: Routed successfully. Incident owner set to DBA-MES-Support. SLA timer started." },
      { type: "thinking", text: "Auto-drafting standard diagnostic log for the DBA group queue..." },
      { type: "success", text: "SUCCESS: Ticket INC-88902 triaged and assigned to DBA-MES-Support in 420ms (SLA target met)." }
    ]
  },
  resolve_latency: {
    filename: "deploy_agent.py",
    code: `from deploy_agent import DeployAgent
from server_tools import run_sanity_eval, publish_to_server

agent = DeployAgent(
    role="DevOps Deployment Orchestrator",
    system_prompt="Deploy build to target Windows Servers and run ITIL-compliant sanity checks.",
    tools=[run_sanity_eval, publish_to_server]
)

targets = ["IIS-Prod-01", "IIS-Prod-02", "IIS-Prod-03"]
result = agent.run(build_dir="./dist", target_servers=targets)
print(f"Deployment status: {result.status}")`,
    steps: [
      { type: "thinking", text: "Initializing ITIL Change Management approved deployment workflow..." },
      { type: "thinking", text: "Target environments identified: 3 IIS Production Windows Servers." },
      { type: "tool-call", text: "Executing server copy: publish_to_server(build_dir='./dist', target='IIS-Prod-01')..." },
      { type: "text", text: "    -> Copy return: 124 files transferred. IIS service recycled." },
      { type: "thinking", text: "Executing automated sanity checks on deployed API endpoints..." },
      { type: "tool-call", text: "Invoking test suit: run_sanity_eval(host='http://IIS-Prod-01')..." },
      { type: "text", text: "    -> Test return: HTTP 200 OK. DbConnection: SUCCESS. UI load time: 12ms." },
      { type: "thinking", text: "Repeating deployment and verification for target servers IIS-Prod-02 and IIS-Prod-03..." },
      { type: "success", text: "SUCCESS: Deployment complete on all 3 target environments. ITIL change record updated to CLOSED-SUCCESS." }
    ]
  }
}

const highlightSyntax = (rawText) => {
  if (rawText.trim().startsWith("#")) {
    return `<span class="text-gray-500 italic">${rawText}</span>`
  }

  let escaped = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  const keywords = ["def", "class", "from", "import", "return", "if", "else", "print", "echo", "grep"]
  keywords.forEach((kw) => {
    const reg = new RegExp(`\\b${kw}\\b`, "g")
    escaped = escaped.replace(reg, `<span class="text-pink-500 font-semibold">${kw}</span>`)
  })

  // Color strings
  escaped = escaped.replace(/(["'])(.*?)\1/g, `<span class="text-emerald-400">"$2"</span>`)

  return escaped
}

const AgentSimulator = () => {
  const [activeTask, setActiveTask] = useState("generate_prd")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  const [typedLines, setTypedLines] = useState([])
  const [consoleLogs, setConsoleLogs] = useState([])
  
  const codeEditorRef = useRef(null)
  const consolePanelRef = useRef(null)
  
  const stateRef = useRef({
    codeLines: [],
    codeLineIdx: 0,
    codeCharIdx: 0,
    consoleStepIdx: 0,
    codeTicker: null,
    consoleTicker: null,
  })

  const currentTask = simulatorTasks[activeTask]

  // Initialize workspace when active task changes
  useEffect(() => {
    resetWorkspace()
    return () => clearTickers()
  }, [activeTask])

  // Scroll to bottom of editor and console
  useEffect(() => {
    if (codeEditorRef.current) {
      codeEditorRef.current.scrollTop = codeEditorRef.current.scrollHeight
    }
  }, [typedLines])

  useEffect(() => {
    if (consolePanelRef.current) {
      consolePanelRef.current.scrollTop = consolePanelRef.current.scrollHeight
    }
  }, [consoleLogs])

  const clearTickers = () => {
    clearInterval(stateRef.current.codeTicker)
    clearTimeout(stateRef.current.consoleTicker)
  }

  const resetWorkspace = () => {
    clearTickers()
    setIsPlaying(false)
    setIsPaused(false)

    const lines = currentTask.code.split("\n")
    stateRef.current = {
      codeLines: lines,
      codeLineIdx: 0,
      codeCharIdx: 0,
      consoleStepIdx: 0,
      codeTicker: null,
      consoleTicker: null,
    }

    // Set editor lines to empty structure (to maintain line numbers spacing)
    setTypedLines(lines.map(() => ""))
    setConsoleLogs([
      {
        prompt: ">",
        text: `Loaded workspace [${currentTask.filename}]. Click play to compile and run.`,
        type: "system",
      },
    ])
  }

  const startSimulation = () => {
    setIsPlaying(true)
    setIsPaused(false)
    
    // Clear console and editor line contents
    setConsoleLogs([
      {
        prompt: "system",
        text: `Launching task thread... loading ${currentTask.filename} in sandbox...`,
        type: "thinking",
      },
    ])
    setTypedLines(stateRef.current.codeLines.map(() => ""))
    
    stateRef.current.codeLineIdx = 0
    stateRef.current.codeCharIdx = 0
    stateRef.current.consoleStepIdx = 0
    
    writeChar()
  }

  const writeChar = () => {
    const state = stateRef.current
    if (state.codeLineIdx >= state.codeLines.length) {
      // Done typing code
      setConsoleLogs((prev) => [
        ...prev,
        { prompt: "system", text: "Source code compiled successfully. Running process...", type: "success" },
      ])
      state.consoleTicker = setTimeout(runStep, 1000)
      return
    }

    const currentLine = state.codeLines[state.codeLineIdx]

    state.codeTicker = setInterval(() => {
      setTypedLines((prev) => {
        const next = [...prev]
        if (state.codeCharIdx < currentLine.length) {
          next[state.codeLineIdx] = currentLine.substring(0, state.codeCharIdx + 1)
          state.codeCharIdx++
        } else {
          clearInterval(state.codeTicker)
          // Highlight code when line finishes
          next[state.codeLineIdx] = highlightSyntax(currentLine)
          state.codeLineIdx++
          state.codeCharIdx = 0
          
          state.consoleTicker = setTimeout(writeChar, 80)
        }
        return next
      })
    }, 20)
  }

  const runStep = () => {
    const state = stateRef.current
    const steps = currentTask.steps
    
    if (state.consoleStepIdx >= steps.length) {
      setIsPlaying(false)
      setIsPaused(false)
      setConsoleLogs((prev) => [
        ...prev,
        { prompt: "system", text: "Workflow completed. Sandboxed environment saved.", type: "success" },
      ])
      return
    }

    const step = steps[state.consoleStepIdx]
    let promptSym = ">"
    if (step.type === "thinking") promptSym = "reflect"
    if (step.type === "tool-call") promptSym = "tool-use"
    if (step.type === "success") promptSym = "done"

    setConsoleLogs((prev) => [
      ...prev,
      { prompt: promptSym, text: step.text, type: step.type },
    ])

    state.consoleStepIdx++
    state.consoleTicker = setTimeout(runStep, 1200)
  }

  const pauseSimulation = () => {
    clearTickers()
    setIsPaused(true)
    setConsoleLogs((prev) => [
      ...prev,
      { prompt: "system", text: "Workflow paused. Click resume to continue.", type: "thinking" },
    ])
  }

  const resumeSimulation = () => {
    setIsPaused(false)
    setConsoleLogs((prev) => [
      ...prev,
      { prompt: "system", text: "Resuming workflow thread...", type: "thinking" },
    ])

    const state = stateRef.current
    if (state.codeLineIdx < state.codeLines.length) {
      writeChar()
    } else {
      runStep()
    }
  }

  const isShell = currentTask.filename.endsWith(".sh")

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[520px] rounded-lg border border-white/10 bg-[#0d121f]/75 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Sidebar Tasks */}
      <div className="flex flex-col gap-4 p-5 border-b md:border-b-0 md:border-r border-white/10 bg-[#0a0e17]/85">
        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[#6b7280]">
          Select Agent Workflow
        </span>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTask("generate_prd")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md border text-left flex-grow md:flex-grow-0 transition-all ${
              activeTask === "generate_prd"
                ? "bg-cyanCustom/10 border-cyanCustom/20 text-cyanCustom font-bold"
                : "bg-transparent border-transparent text-[#9ca3af] hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-database" /> SQL Optimizer
          </button>
          <button
            onClick={() => setActiveTask("eval_pipeline")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md border text-left flex-grow md:flex-grow-0 transition-all ${
              activeTask === "eval_pipeline"
                ? "bg-cyanCustom/10 border-cyanCustom/20 text-cyanCustom font-bold"
                : "bg-transparent border-transparent text-[#9ca3af] hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-ticket" /> ITSM Ticket Router
          </button>
          <button
            onClick={() => setActiveTask("resolve_latency")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md border text-left flex-grow md:flex-grow-0 transition-all ${
              activeTask === "resolve_latency"
                ? "bg-purpleCustom/10 border-purpleCustom/20 text-purpleCustom font-bold"
                : "bg-transparent border-transparent text-[#9ca3af] hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-server" /> Deploy Automation
          </button>
        </div>
      </div>

      {/* Editor & Console Window */}
      <div className="grid grid-rows-[40px_1fr_140px] bg-[#0d121e]/40">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-5 bg-[#0a0e17]/60 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-1 text-xs font-mono text-[#9ca3af] bg-[#0d121f]/80 border-t border-l border-r border-white/10 rounded-t-md mt-1.5">
            {isShell ? (
              <Terminal className="w-3.5 h-3.5 text-purpleCustom" />
            ) : (
              <Code className="w-3.5 h-3.5 text-cyanCustom" />
            )}
            <span>{currentTask.filename}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={startSimulation}
                className="w-7 h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                title="Run Simulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </Button>
            ) : isPaused ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={resumeSimulation}
                className="w-7 h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                title="Resume Simulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={pauseSimulation}
                className="w-7 h-7 text-[#9ca3af] hover:text-white hover:bg-white/5"
                title="Pause Simulation"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={resetWorkspace}
              className="w-7 h-7 text-[#9ca3af] hover:text-white hover:bg-white/5"
              title="Reset Console"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div
          ref={codeEditorRef}
          className="p-5 font-mono text-xs text-[#f3f4f6] leading-relaxed overflow-y-auto max-h-[300px]"
        >
          {typedLines.map((lineContent, idx) => (
            <div key={idx} className="flex mb-1">
              <span className="w-9 text-right text-gray-600 select-none pr-4">{idx + 1}</span>
              <span
                className="whitespace-pre-wrap flex-grow"
                dangerouslySetInnerHTML={{ __html: lineContent || "&nbsp;" }}
              />
            </div>
          ))}
        </div>

        {/* Terminal Console */}
        <div
          ref={consolePanelRef}
          className="flex flex-col gap-1.5 p-4 border-t border-white/10 bg-[#080c14]/90 font-mono text-xs overflow-y-auto"
        >
          {consoleLogs.map((log, idx) => {
            let promptColor = "text-purpleCustom"
            let textColor = "text-gray-400"
            let fontWeight = "font-normal"

            if (log.type === "thinking") {
              promptColor = "text-cyanCustom"
              textColor = "text-white"
              fontWeight = "font-medium"
            } else if (log.type === "tool-call") {
              promptColor = "text-amber-400"
              textColor = "text-amber-300"
            } else if (log.type === "success") {
              promptColor = "text-emerald-400"
              textColor = "text-emerald-400"
              fontWeight = "font-bold"
            }

            return (
              <div key={idx} className="flex gap-2.5 items-start console-entry-anim">
                <span className={`select-none font-semibold ${promptColor}`}>{log.prompt}</span>
                <span className={`${textColor} ${fontWeight}`}>{log.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AgentSimulator
