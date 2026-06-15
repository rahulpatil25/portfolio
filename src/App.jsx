import React, { useState, useEffect } from "react"
import {
  CircleDot,
  Wand2,
  Terminal,
  Code2,
  Cpu,
  Brain,
  Database,
  ClipboardCheck,
  TrendingUp,
  Server,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
  Send,
  Menu,
  X,
  Sparkles
} from "lucide-react"

import CanvasBackground from "./components/CanvasBackground"
import AgentSimulator from "./components/AgentSimulator"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Badge } from "./components/ui/badge"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./components/ui/dialog"

// Project Details Data
const projectDetails = {
  autopm: {
    title: "Auto-Remedy ITSM Triage Suite",
    type: "AI Product & Release Operations",
    client: "Tata Technologies Limited",
    timeline: "6 Months (2025)",
    tags: ["Python", "FastAPI", "BMC Remedy API", "Incident Triage"],
    description: "The Auto-Remedy Triage Suite is a production-tested AI middleware that automates the intake, analysis, and routing of enterprise ITIL support tickets. The application reads unstructured incident text from BMC Remedy, leverages a custom classifier model to isolate key system components, scores priority status based on SLA requirements, and auto-dispatches tickets to the appropriate support queue. This replaces manual dispatch bottlenecks and enforces strict SLA resolution targets.",
    bullets: [
      "Designed an autonomous incident routing graph that reduced ticket triage and dispatch latency by <strong>90% (from 4 hours to under 30 seconds)</strong>.",
      "Built custom safety filters to strip out personally identifiable database access credentials before routing ticket context to external LLMs.",
      "Integrated with ITIL-compliant Change Management approval workflows, dynamically tracking release health indicators and server metrics.",
      "Developed comprehensive telemetry mapping incident resolution accuracy, false positive classifications, and SLA breach risks."
    ]
  },
  guardrail: {
    title: "Cognitive SQL Query Planner",
    type: "Database Agent & Performance Engineering",
    client: "MES Manufacturing Project",
    timeline: "5 Months (2024)",
    tags: ["SQL Server", "Python", "LangChain", "Index Optimizers"],
    description: "To resolve severe bottlenecks in shop floor reporting systems, I engineered a Cognitive SQL Query Planner. Operating as a database copilot agent, it runs EXPLAIN plans on queries, clusters execution paths, diagnoses table scans, and auto-generates optimized composite index recommendations. The system ensures high data availability while safely performing schema modifications in staging and production databases under strict transaction locks.",
    bullets: [
      "Built an autonomous DBA assistant that analyzes query plans and executes schema optimization scripts to maintain <strong>99.9% database uptime</strong>.",
      "Achieved a <strong>30% improvement in report generation speed</strong> across production tables containing over 1.2M rows of shop floor operations.",
      "Configured robust transactional rollback loops to revert schema modifications immediately if execution times or CPU usage thresholds are breached.",
      "Established cached connection pools and vector embeddings mapping query structures to previously optimized execution plans."
    ]
  },
  feedback: {
    title: "MES Automated Shop Floor Dashboard",
    type: "Web Application & Release Automation",
    client: "Tata Technologies Limited",
    timeline: "8 Months (2022 - 2023)",
    tags: [".NET Core", "React", "SQL Server", "IIS Deployments"],
    description: "Developed and managed the MES dashboard platform that visualizes real-time shop floor metrics for operations teams. The project involved writing secure database interfaces using .NET and React, creating real-time telemetry panels, and automating release deployments across 20+ IIS Windows Server environments. It bridges manufacturing telemetry with clear operational dashboards for production supervisors.",
    bullets: [
      "Built a secure, real-time analytics web dashboard tracking <strong>25+ shop floor operational metrics</strong> for the MES production database.",
      "Architected database index plans and optimized complex store procedures to process dashboard telemetry in under <strong>10ms response budgets</strong>.",
      "Led deployment automation scripts to publish builds across <strong>20 Windows Server environments</strong> with zero recorded downtime.",
      "Managed Level 2/3 production support, integrating BMC Remedy workflows to streamline user feature requests and hotfixes."
    ]
  }
}

// Skills Matrix Data
const skillsData = [
  {
    icon: <Database className="w-5 h-5 text-cyanCustom" />,
    title: "Database Performance & Uptime",
    description: "Managing enterprise database operations (SQL Server, MySQL, PostgreSQL) and configuring index optimization strategies to ensure 99.9% uptime.",
    category: "engineering",
    tags: ["SQL Server", "Index Optimization", "Uptime Ops"]
  },
  {
    icon: <Brain className="w-5 h-5 text-cyanCustom" />,
    title: "Cognitive Data Agents",
    description: "Implementing query analyzers and SQL databases persistence layers for RAG vector stores and LLM agent memory pipelines.",
    category: "engineering",
    tags: ["RAG Systems", "Vector Indexes", "SQL Agents"]
  },
  {
    icon: <ClipboardCheck className="w-5 h-5 text-purpleCustom" />,
    title: "ITIL & Release Operations",
    description: "Managing L2/3 application support, change verification metrics, and automated deployments to 20+ IIS Windows Server hosts.",
    category: "product",
    tags: ["ITIL Framework", "IIS Deployments", "Release Management"]
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-purpleCustom" />,
    title: "ITSM Product Triage",
    description: "Optimizing incident lifecycle flows and support workflows in BMC Remedy, reducing incident resolution times by 50%.",
    category: "product",
    tags: ["BMC Remedy", "Incident Triage", "SLA Strategy"]
  },
  {
    icon: <Code2 className="w-5 h-5 text-cyanCustom" />,
    title: "Programming & Frameworks",
    description: "Developing scalable backend web modules and dashboard clients with Python, .NET Core, React, and jQuery.",
    category: "stack",
    tags: ["Python", ".NET Core", "React", "C#", "C++"]
  },
  {
    icon: <Server className="w-5 h-5 text-cyanCustom" />,
    title: "Version Control & Systems",
    description: "Orchestrating code tracking, automated pipelines, and batch automation scripts across server instances.",
    category: "stack",
    tags: ["Git", "GitLab", "Batch Scripting", "Windows Server"]
  }
]

const App = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [activeFilter, setActiveFilter] = useState("all")
  
  // Modal State
  const [activeProjId, setActiveProjId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  // Contact Form State
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formSubject, setFormSubject] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [formStatus, setFormStatus] = useState({ type: "", text: "" })
  const [formLoading, setFormLoading] = useState(false)

  // Profile image validation
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Scroll event listener for Navbar background & Scroll Spy
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = document.querySelectorAll("section")
      let current = "hero"
      sections.forEach((section) => {
        const top = section.offsetTop
        const height = section.clientHeight
        if (window.scrollY >= top - 120) {
          current = section.getAttribute("id") || "hero"
        }
      })
      setActiveSection(current)
    }

    // Check if profile.jpg is present
    const img = new Image()
    img.src = "profile.jpg"
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageLoaded(false)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleOpenModal = (projId) => {
    setActiveProjId(projId)
    setModalOpen(true)
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormStatus({ type: "", text: "" })

    setTimeout(() => {
      setFormLoading(false)
      setFormStatus({
        type: "success",
        text: "Message sent successfully! Rahul will get in touch with you shortly."
      })
      setFormName("")
      setFormEmail("")
      setFormSubject("")
      setFormMessage("")

      setTimeout(() => {
        setFormStatus({ type: "", text: "" })
      }, 5000)
    }, 1200)
  }

  const filteredSkills = activeFilter === "all" 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeFilter)

  const activeProject = activeProjId ? projectDetails[activeProjId] : null

  return (
    <div className="relative min-h-screen">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none bg-grad-bg">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyanCustom rounded-full filter blur-[140px] opacity-15 animate-float-blob" style={{ animationDuration: "25s" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purpleCustom rounded-full filter blur-[140px] opacity-15 animate-float-blob" style={{ animationDuration: "30s" }} />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-pinkCustom rounded-full filter blur-[140px] opacity-15 animate-float-blob" style={{ animationDuration: "22s" }} />
      </div>
      <div className="bg-grid" />

      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 transition-all duration-300 ${scrolled ? "bg-[#060913]/85 backdrop-blur-md border-b border-white/5 h-[70px]" : "h-20"}`}>
        <a href="#hero" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <CircleDot className="w-6 h-6 text-cyanCustom filter drop-shadow-[0_0_5px_rgba(6,182,212,0.6)]" />
          <span>Rahul<span className="bg-grad-hybrid bg-clip-text text-transparent">.Dev</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-heading font-medium text-[#9ca3af]">
            {["home", "about", "simulator", "skills", "projects", "experience", "contact"].map((sec) => (
              <li key={sec}>
                <a
                  href={`#${sec === "home" ? "hero" : sec}`}
                  className={`relative py-1.5 transition-colors hover:text-white ${activeSection === (sec === "home" ? "hero" : sec) ? "text-white after:w-full" : "after:w-0"} after:absolute after:bottom-0 after:left-0 after:height-[2px] after:h-[2px] after:bg-grad-hybrid after:transition-all`}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block md:hidden text-[#f3f4f6]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed top-[70px] left-0 w-full h-[calc(100vh-70px)] bg-[#060913]/95 backdrop-blur-lg flex flex-col items-center pt-10 gap-8 text-[#9ca3af] font-heading font-semibold text-lg">
            {["home", "about", "simulator", "skills", "projects", "experience", "contact"].map((sec) => (
              <a
                key={sec}
                href={`#${sec === "home" ? "hero" : sec}`}
                onClick={() => setMobileMenuOpen(false)}
                className={activeSection === (sec === "home" ? "hero" : sec) ? "text-white" : ""}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center px-6 md:px-16 pt-24 max-w-[1300px] mx-auto z-10">
        <CanvasBackground />
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center w-full z-10">
          <div className="flex flex-col text-center lg:text-left">
            <div className="mb-4">
              <Badge variant="hybrid">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Engineering &times; Product
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 font-heading">
              Hi, I'm <span className="bg-grad-hybrid bg-clip-text text-transparent">Rahul Patil</span>
            </h1>
            <p className="text-[#9ca3af] text-lg mb-8 max-w-[580px] mx-auto lg:mx-0 font-body leading-relaxed">
              An AI Systems Engineer and Developer specializing in database optimization, robust data pipelines, and ITIL-compliant release automation.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              <Button asChild variant="hybrid" className="rounded-lg px-6 py-5 font-semibold text-sm">
                <a href="#simulator"><Terminal className="w-4 h-4 mr-2" /> Run Agent Simulation</a>
              </Button>
              <Button asChild variant="outline" className="rounded-lg border-white/10 px-6 py-5 font-semibold text-sm hover:border-cyanCustom/40 hover:bg-cyanCustom/5">
                <a href="#projects"><Code2 className="w-4 h-4 mr-2" /> View Projects</a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center z-10">
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px]">
              <div className="absolute inset-[-10px] bg-grad-hybrid rounded-[30px] filter blur-xl opacity-45 animate-pulse" />
              <div className="relative w-full h-full bg-[#0b0f19] rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
                {imageLoaded ? (
                  <img src="profile.jpg" alt="Rahul Dev Profile Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#151c30] text-[#9ca3af] p-6">
                    <Cpu className="w-16 h-16 mb-4 text-[#8b5cf6] filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    <span className="font-mono text-xs text-center">[ profile.jpg ]</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERSECTION (ABOUT) SECTION */}
      <section id="about" className="px-6 md:px-16 py-20 max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyanCustom mb-2 block">
            Core Philosophy
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            The Product &amp; Systems Intersection
          </h2>
        </div>
        
        <Card className="glass-panel relative border-t-2 border-t-cyanCustom overflow-hidden p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold font-heading text-white">Bridging Autonomous Technology and Human Value</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                Traditional product management answers <em>what</em> to build. Software engineering answers <em>how</em> to build it. But in the age of agentic AI, building systems that make autonomous decisions, execute tools, and handle non-deterministic workflows requires a unified discipline.
              </p>
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                As a hybrid practitioner, I design the cognitive frameworks (memory layers, planning loops, custom toolkits) while simultaneously driving the product vision (alignment matrices, latency-to-value trade-offs, and behavioral guardrails). This guarantees that autonomous agents don't just work in notebooks, but deliver reliable, repeatable enterprise value.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg border border-cyanCustom/25 bg-cyanCustom/10 text-cyanCustom mt-1">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-cyanCustom text-base">Agentic Engineering</h4>
                  <p className="text-[#9ca3af] text-xs mt-1 leading-relaxed">State-of-the-art implementation of ReAct loops, multi-agent frameworks (Autogen, CrewAI), cognitive memory databases, and guardrail architectures.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg border border-purpleCustom/25 bg-purpleCustom/10 text-purpleCustom mt-1">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-purpleCustom text-base">AI Product Strategy</h4>
                  <p className="text-[#9ca3af] text-xs mt-1 leading-relaxed">System evaluations (Evals), latency budgeting, user-in-the-loop feedback mechanisms, feature roadmaps, and business model alignment.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* INTERACTIVE DEMO (AGENT ARENA) */}
      <section id="simulator" className="px-6 md:px-16 py-20 max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyanCustom mb-2 block">
            Interactive Demo
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            The Agent Arena
          </h2>
        </div>
        <AgentSimulator />
      </section>

      {/* CORE EXPERTISE & SKILLS */}
      <section id="skills" className="px-6 md:px-16 py-20 max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyanCustom mb-2 block">
            Skills Matrix
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            My Capabilities
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto py-2">
          {[
            { id: "all", label: "All Disciplines" },
            { id: "engineering", label: "Agentic Engineering" },
            { id: "product", label: "Product Management" },
            { id: "stack", label: "Tech Stack" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-5 py-2 font-heading font-bold text-xs rounded-full border transition-all ${
                activeFilter === btn.id
                  ? "bg-grad-hybrid border-transparent text-white shadow-lg"
                  : "bg-white/3 border-white/5 text-[#9ca3af] hover:bg-white/5 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const isPM = skill.category === "product"
            return (
              <Card
                key={index}
                className={`glass-panel p-6 flex flex-col gap-4 border transition-all duration-300 hover:translate-y-[-4px] ${
                  isPM 
                    ? "hover:border-purpleCustom/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]" 
                    : "hover:border-cyanCustom/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)]"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg border flex items-center justify-center mt-1 ${
                  isPM 
                    ? "bg-purpleCustom/10 border-purpleCustom/20 text-purpleCustom" 
                    : "bg-cyanCustom/10 border-cyanCustom/20 text-cyanCustom"
                }`}>
                  {skill.icon}
                </div>
                <h3 className="text-lg font-bold font-heading text-white">{skill.title}</h3>
                <p className="text-[#9ca3af] text-xs leading-relaxed flex-grow">{skill.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[10px] font-heading font-semibold border border-white/5 bg-white/2 text-[#9ca3af] rounded transition-all hover:border-cyanCustom hover:text-cyanCustom"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="px-6 md:px-16 py-20 max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-[#8b5cf6] mb-2 block">
            My Portfolio
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Featured Innovations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 */}
          <Card className="glass-panel flex flex-col overflow-hidden border transition-all duration-300 hover:translate-y-[-6px] hover:border-purpleCustom/40 hover:shadow-[0_10px_35px_rgba(139,92,246,0.15)]">
            <div className="h-[200px] border-b border-white/5 bg-gradient-to-br from-[#0e1726] to-[#1a1e36] flex items-center justify-center relative">
              <Wand2 className="w-14 h-14 text-purpleCustom opacity-75 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <div className="absolute top-4 left-4">
                <Badge variant="hybrid">Hybrid Product</Badge>
              </div>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold font-heading text-white">Auto-PM Multi-Agent Suite</CardTitle>
              <CardDescription className="text-[#9ca3af] text-xs leading-relaxed mt-2">
                An autonomous agent team that translates simple software feature descriptions into comprehensive PRDs, architectures, and integration tests.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex flex-wrap gap-2 mt-auto">
              <Badge variant="cyan">Python</Badge>
              <Badge variant="cyan">LangGraph</Badge>
              <Badge variant="cyan">Claude 3.5</Badge>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button
                variant="ghost"
                onClick={() => handleOpenModal("autopm")}
                className="text-cyanCustom hover:text-pinkCustom p-0 bg-transparent flex items-center gap-1 text-xs hover:bg-transparent hover:translate-x-1 duration-200"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Project 2 */}
          <Card className="glass-panel flex flex-col overflow-hidden border transition-all duration-300 hover:translate-y-[-6px] hover:border-purpleCustom/40 hover:shadow-[0_10px_35px_rgba(139,92,246,0.15)]">
            <div className="h-[200px] border-b border-white/5 bg-gradient-to-br from-[#0e1726] to-[#1a1e36] flex items-center justify-center relative">
              <Terminal className="w-14 h-14 text-cyanCustom opacity-75 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              <div className="absolute top-4 left-4">
                <Badge variant="cyan">Engineering</Badge>
              </div>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold font-heading text-white">Cognitive Guardrail Router</CardTitle>
              <CardDescription className="text-[#9ca3af] text-xs leading-relaxed mt-2">
                An enterprise-grade middleware router that evaluates queries, enforces safety constraints, and dynamically routes prompts to specialized LLM sub-agents.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex flex-wrap gap-2 mt-auto">
              <Badge variant="cyan">FastAPI</Badge>
              <Badge variant="cyan">LlamaGuard</Badge>
              <Badge variant="cyan">Redis</Badge>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button
                variant="ghost"
                onClick={() => handleOpenModal("guardrail")}
                className="text-cyanCustom hover:text-pinkCustom p-0 bg-transparent flex items-center gap-1 text-xs hover:bg-transparent hover:translate-x-1 duration-200"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Project 3 */}
          <Card className="glass-panel flex flex-col overflow-hidden border transition-all duration-300 hover:translate-y-[-6px] hover:border-purpleCustom/40 hover:shadow-[0_10px_35px_rgba(139,92,246,0.15)]">
            <div className="h-[200px] border-b border-white/5 bg-gradient-to-br from-[#0e1726] to-[#1a1e36] flex items-center justify-center relative">
              <TrendingUp className="w-14 h-14 text-purpleCustom opacity-75 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <div className="absolute top-4 left-4">
                <Badge variant="purple">Product</Badge>
              </div>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold font-heading text-white">Agentic Feedback Pipeline</CardTitle>
              <CardDescription className="text-[#9ca3af] text-xs leading-relaxed mt-2">
                Continuous feedback analyzer that fetches App Store reviews, runs aspect-based sentiment analysis, maps failures to code components, and auto-drafts issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex flex-wrap gap-2 mt-auto">
              <Badge variant="cyan">GPT-4o</Badge>
              <Badge variant="cyan">RAG</Badge>
              <Badge variant="cyan">Jira API</Badge>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button
                variant="ghost"
                onClick={() => handleOpenModal("feedback")}
                className="text-cyanCustom hover:text-pinkCustom p-0 bg-transparent flex items-center gap-1 text-xs hover:bg-transparent hover:translate-x-1 duration-200"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section id="experience" className="px-6 md:px-16 py-20 max-w-[900px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyanCustom mb-2 block">
            Career Path
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Experience Timeline
          </h2>
        </div>

        <div className="relative timeline-line">
          {/* Timeline Item 1 */}
          <div className="relative pl-12 md:pl-[70px] mb-12">
            <div className="absolute top-1.5 left-[21px] w-5 h-5 rounded-full border-4 border-cyanCustom bg-[#060913] shadow-[0_0_10px_#06b6d4] transition-all hover:scale-110 hover:bg-white z-10" />
            <Card className="glass-panel p-6 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Developer &mdash; Database &amp; Applications</h3>
                  <span className="text-[#9ca3af] text-xs font-semibold">Tata Technologies Limited</span>
                </div>
                <Badge variant="cyan" className="text-[10px] px-2.5 py-0.5 rounded-full">Dec 2021 - Present</Badge>
              </div>
              <p className="text-[#9ca3af] text-xs leading-relaxed">
                Managing daily SQL Server, PostgreSQL, and MySQL operations maintaining 99.9% uptime. Optimizing database schema indexes resulting in a 30% speedup in MES reporting. Building internal dashboards with .NET, jQuery, React, and hosting web applications across IIS Windows Server instances.
              </p>
            </Card>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative pl-12 md:pl-[70px] mb-12">
            <div className="absolute top-1.5 left-[21px] w-5 h-5 rounded-full border-4 border-[#8b5cf6] bg-[#060913] shadow-[0_0_10px_#8b5cf6] transition-all hover:scale-110 hover:bg-white z-10" />
            <Card className="glass-panel p-6 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Release &amp; Technical Operations Specialist</h3>
                  <span className="text-[#9ca3af] text-xs font-semibold">Tata Technologies Limited</span>
                </div>
                <Badge variant="purple" className="text-[10px] px-2.5 py-0.5 rounded-full">Dec 2021 - Present</Badge>
              </div>
              <p className="text-[#9ca3af] text-xs leading-relaxed">
                Coordinating ITIL-aligned Change Management and Incident Management workflows using BMC Remedy, reducing incident triage-to-resolution latency by 50%. Leading Level 2/3 critical support calls and automating IIS server build deployments.
              </p>
            </Card>
          </div>

          {/* Timeline Item 3 */}
          <div className="relative pl-12 md:pl-[70px]">
            <div className="absolute top-1.5 left-[21px] w-5 h-5 rounded-full border-4 border-cyanCustom bg-[#060913] shadow-[0_0_10px_#06b6d4] transition-all hover:scale-110 hover:bg-white z-10" />
            <Card className="glass-panel p-6 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Bachelor of Engineering &mdash; Computer Engineering</h3>
                  <span className="text-[#9ca3af] text-xs font-semibold">Savitribai Phule Pune University</span>
                </div>
                <Badge variant="cyan" className="text-[10px] px-2.5 py-0.5 rounded-full">Aug 2016 - Nov 2020</Badge>
              </div>
              <p className="text-[#9ca3af] text-xs leading-relaxed">
                Graduated with a major in Computer Engineering, developing a strong core in data structures, SQL systems, operating networks, and programming methodologies (C++, Java, Python, C#).
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="px-6 md:px-16 py-20 max-w-[1300px] mx-auto z-10">
        <div className="text-center mb-12">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyanCustom mb-2 block">
            Get In Touch
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Let's Connect
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold font-heading text-white">Start a Conversation</h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              I am always open to discussing cognitive architectures, advanced agent systems, AI product strategies, or career opportunities.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 border border-white/5 bg-white/3 rounded-lg flex items-center justify-center text-cyanCustom">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email</h4>
                  <p className="text-sm font-semibold text-[#f3f4f6]">rahul.patil@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 border border-white/5 bg-white/3 rounded-lg flex items-center justify-center text-cyanCustom">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Location</h4>
                  <p className="text-sm font-semibold text-[#f3f4f6]">Pune, India (Open to Remote / Hybrid)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 border border-white/5 bg-white/3 hover:bg-grad-hybrid hover:text-white rounded-full flex items-center justify-center text-[#9ca3af] transition-all hover:translate-y-[-2px]" aria-label="LinkedIn Profile">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/5 bg-white/3 hover:bg-grad-hybrid hover:text-white rounded-full flex items-center justify-center text-[#9ca3af] transition-all hover:translate-y-[-2px]" aria-label="GitHub Profile">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/5 bg-white/3 hover:bg-grad-hybrid hover:text-white rounded-full flex items-center justify-center text-[#9ca3af] transition-all hover:translate-y-[-2px]" aria-label="Twitter Profile">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <Card className="glass-panel p-8">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold font-heading text-[#9ca3af]">Name</label>
                  <Input
                    type="text"
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="border-white/5 bg-white/1 focus-visible:border-cyanCustom/40 focus-visible:ring-cyanCustom/15"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold font-heading text-[#9ca3af]">Email</label>
                  <Input
                    type="email"
                    id="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="john@company.com"
                    required
                    className="border-white/5 bg-white/1 focus-visible:border-cyanCustom/40 focus-visible:ring-cyanCustom/15"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-semibold font-heading text-[#9ca3af]">Subject</label>
                <Input
                  type="text"
                  id="subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Collaboration / Job Opportunity"
                  required
                  className="border-white/5 bg-white/1 focus-visible:border-cyanCustom/40 focus-visible:ring-cyanCustom/15"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold font-heading text-[#9ca3af]">Message</label>
                <Textarea
                  id="message"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Hi Rahul, I would love to talk about..."
                  required
                  className="min-h-[120px] border-white/5 bg-white/1 focus-visible:border-cyanCustom/40 focus-visible:ring-cyanCustom/15"
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  variant="hybrid"
                  disabled={formLoading}
                  className="px-6 py-5 font-semibold text-xs rounded-lg flex items-center gap-1.5"
                >
                  {formLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-1" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Message
                    </>
                  )}
                </Button>
              </div>
              {formStatus.text && (
                <div className={`p-4 rounded-md border text-center text-xs ${
                  formStatus.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {formStatus.text}
                </div>
              )}
            </form>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-16 mt-20 z-10">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#9ca3af]">
          <span>&copy; 2026 Rahul Patil. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#hero" className="hover:text-cyanCustom">Privacy Policy</a>
            <a href="#hero" className="hover:text-cyanCustom">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {activeProject && (
          <DialogContent className="glass-panel text-[#f3f4f6] border-white/10 max-w-[640px] max-h-[90vh] overflow-y-auto p-8">
            <DialogHeader className="space-y-1">
              <div className="mb-2">
                <Badge variant="hybrid">{activeProject.type}</Badge>
              </div>
              <DialogTitle className="text-2xl font-extrabold font-heading text-white">{activeProject.title}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-4 my-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Partner / Context</span>
                <p className="font-semibold text-gray-300 mt-1">{activeProject.client}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Timeline</span>
                <p className="font-semibold text-gray-300 mt-1">{activeProject.timeline}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Core Tech</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeProject.tags.map((t, idx) => (
                    <Badge key={idx} variant="cyan" className="text-[9px] px-2 py-0">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-[#9ca3af] leading-relaxed mb-4">
              <p>{activeProject.description}</p>
            </div>

            <h4 className="font-heading font-extrabold text-sm border-b border-white/5 pb-2 text-white">Key Contributions &amp; Results</h4>
            <ul className="list-disc pl-5 flex flex-col gap-2.5 text-xs text-[#9ca3af] leading-relaxed">
              {activeProject.bullets.map((bullet, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }} />
              ))}
            </ul>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default App
