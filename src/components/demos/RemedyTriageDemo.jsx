import React, { useState } from "react"
import { Send, Shield, Search, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"

const templates = [
  {
    label: "MES Access Issue",
    text: "Urgently need access to the production MES database. Reports are failing. My temporary database password is 'AdminMesPass2026' - please check."
  },
  {
    label: "SQL Server Down",
    text: "Connection timeout on IIS-Prod-01 server. SQL Server operational logs show connection pool exhausted. Cannot fetch shop floor metrics."
  },
  {
    label: "BMC Remedy Sync Failure",
    text: "BMC Remedy is failing to synchronize change approvals to Jenkins build hooks. Deployments are blocked."
  }
]

const RemedyTriageDemo = () => {
  const [ticketText, setTicketText] = useState("")
  const [logs, setLogs] = useState([])
  const [status, setStatus] = useState("idle") // idle, running, finished
  const [triageResult, setTriageResult] = useState(null)

  const handleSelectTemplate = (text) => {
    setTicketText(text)
    setLogs([])
    setStatus("idle")
    setTriageResult(null)
  }

  const runTriage = () => {
    if (!ticketText.trim()) return

    setStatus("running")
    setLogs([])
    setTriageResult(null)

    const steps = [
      { text: "Reading incident payload from BMC Remedy queue...", delay: 600, type: "info" },
      { text: "Executing PII & Credential Scrubbing Scanner...", delay: 1200, type: "scan" },
      { text: "Sensitive data found and redacted successfully.", delay: 1800, type: "scrub" },
      { text: "Running aspect-based query classification on processed ticket text...", delay: 2400, type: "info" },
      { text: "Aspects isolated: System, Component, Urgency indicator.", delay: 3000, type: "classify" },
      { text: "Comparing incident keywords against ITIL SLA metrics matrix...", delay: 3600, type: "info" },
      { text: "Optimal support team resolved based on workload and SLA priority.", delay: 4200, type: "success" }
    ]

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.text])

        // Custom action logs logic
        if (step.type === "scrub") {
          // Redact password
          const redacted = ticketText.replace(/(password is ['"])(.*?)(['"])/gi, "$1********$3")
          setTicketText(redacted)
        }

        if (step.type === "success") {
          setStatus("finished")
          
          // Determine parameters based on ticket text keywords
          const textLower = ticketText.toLowerCase()
          let target = "General Infrastructure"
          let group = "SysOps-Support"
          let priority = "P3 - Moderate"
          let sla = "8 Hours"

          if (textLower.includes("mes") || textLower.includes("database") || textLower.includes("sql")) {
            target = "MES Shop Floor Database"
            group = "DBA-MES-Support"
            priority = textLower.includes("urgently") || textLower.includes("timeout") ? "P2 - High" : "P3 - Moderate"
            sla = priority === "P2 - High" ? "4 Hours" : "8 Hours"
          }
          if (textLower.includes("down") || textLower.includes("failed")) {
            priority = "P1 - Critical"
            sla = "1 Hour"
          }

          setTriageResult({
            ticketId: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
            targetSystem: target,
            priority,
            assignedGroup: group,
            slaTarget: sla
          })
        }
      }, step.delay)
    })
  }

  return (
    <div className="flex flex-col gap-6 text-sm text-[#9ca3af]">
      <div>
        <p className="text-[#f3f4f6] text-xs font-semibold mb-2">Select a template ticket or type your own:</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTemplate(tpl.text)}
              className="px-3 py-1 bg-white/3 border border-white/5 rounded-md hover:bg-white/10 hover:border-white/10 text-xs font-heading text-gray-300"
            >
              {tpl.label}
            </button>
          ))}
        </div>
        <Textarea
          value={ticketText}
          onChange={(e) => setTicketText(e.target.value)}
          placeholder="Paste ticket text here..."
          className="min-h-[90px] text-xs border-white/10 bg-white/2 placeholder:text-gray-600 focus-visible:border-cyanCustom/40"
          disabled={status === "running"}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={runTriage}
          disabled={status === "running" || !ticketText.trim()}
          variant="hybrid"
          className="text-xs h-8 px-4 rounded-md"
        >
          {status === "running" ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-1.5" /> Triaging...
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 mr-1.5" /> Triage Incident
            </>
          )}
        </Button>
      </div>

      {/* Simulator logs and results */}
      {logs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-[#080c14] border border-white/5 font-mono text-[11px] flex flex-col gap-2 max-h-[160px] overflow-y-auto">
            {logs.map((log, idx) => {
              const isLast = idx === logs.length - 1
              let color = "text-gray-400"
              if (log.includes("redacted") || log.includes("Scrubbing")) color = "text-amber-400"
              if (log.includes("SUCCESS") || log.includes("resolved")) color = "text-emerald-400"
              return (
                <div key={idx} className={`flex gap-2 ${color} ${isLast && status === "running" ? "animate-pulse" : ""}`}>
                  <span>&gt;</span>
                  <span>{log}</span>
                </div>
              )
            })}
          </div>

          {triageResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 text-[#f3f4f6]">
              <div className="flex flex-col gap-2">
                <h4 className="font-heading font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Incident Triaged successfully
                </h4>
                <div className="text-xs text-[#9ca3af] mt-1 flex flex-col gap-1">
                  <p><strong>Remedy ID:</strong> <span className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">{triageResult.ticketId}</span></p>
                  <p><strong>Target Component:</strong> <span className="text-white">{triageResult.targetSystem}</span></p>
                  <p><strong>Impact Priority:</strong> <span className="text-white">{triageResult.priority}</span></p>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-end border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-5 text-xs text-[#9ca3af]">
                <p><strong>Assigned Group:</strong> <span className="text-white font-semibold">{triageResult.assignedGroup}</span></p>
                <p><strong>SLA Resolution Target:</strong> <span className="text-white font-semibold">{triageResult.slaTarget}</span></p>
                <p className="text-[10px] text-emerald-500/70 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> PII credentials redacted in logs.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RemedyTriageDemo
