import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/client'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Send, MessageSquare, User, Mail, Search, MessageCircle, AlertCircle, Loader2,
  Users, UserRound, Phone, MapPin, ShieldAlert, Award, ArrowRight, Link as LinkIcon, Check, CheckSquare, Plus, FileText, ChevronRight
} from 'lucide-react'

type ChatSession = {
  clientId: string
  patientId: number | null
  displayName: string
  email: string
  lastMessage: string
  lastMessageAt: string | null
  unreadCount: number
}

type ChatMessage = {
  id: number
  clientId: string
  patientId: number | null
  sender: 'client' | 'admin'
  senderName: string
  message: string
  isRead: boolean
  createdAt: string | null
}

type Patient = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  city?: string
  notes?: string
  userType?: string
  intakeCompleted?: boolean
}

const QUICK_TEMPLATES = [
  { label: '👋 Saludo', text: '¡Hola! ¿En qué te puedo ayudar hoy? 🌟' },
  { label: '🕒 Espera', text: 'Hemos recibido tu mensaje. Un miembro de nuestro equipo se comunicará contigo a la brevedad. 🙏' },
  { label: '🗓️ Cita', text: 'Puedes consultar los horarios de nuestros terapeutas y agendar una cita directamente en la sección "Calendario" de tu cuenta. 🌿' },
  { label: '✨ Despedida', text: '¡Muchas gracias por escribirnos! Que tengas un maravilloso día lleno de luz. ☀️' }
]

export function ChatPage(): JSX.Element {
  const { t } = useTranslation()
  
  // Tabs: 'chats' or 'patients'
  const [activeTab, setActiveTab] = useState<'chats' | 'patients'>('chats')
  
  // Lists
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  
  // Active session
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [replyText, setReplyText] = useState('')
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')
  
  // Loading & Action states
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [linkPatientId, setLinkPatientId] = useState<string>('')
  const [linkingLoading, setLinkingLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch all chat sessions
  const fetchSessions = async (showLoading = false) => {
    if (showLoading) setLoadingSessions(true)
    const res = await api.get<ChatSession[]>('/api/admin/chat/sessions/')
    if (res.ok) {
      setSessions(res.data)
    }
    if (showLoading) setLoadingSessions(false)
  }

  // Fetch all registered patients
  const fetchPatients = async (showLoading = false) => {
    if (showLoading) setLoadingPatients(true)
    const res = await api.get<Patient[]>('/api/patients/')
    if (res.ok) {
      setPatients(res.data)
    }
    if (showLoading) setLoadingPatients(false)
  }

  // Fetch messages for selected session
  const fetchMessages = async (clientId: string, showLoading = false) => {
    if (showLoading) setLoadingMessages(true)
    const res = await api.get<ChatMessage[]>(`/api/admin/chat/sessions/${clientId}/`)
    if (res.ok) {
      setMessages(res.data)
    }
    if (showLoading) setLoadingMessages(false)
  }

  // Initial load and polling for sessions list
  useEffect(() => {
    fetchSessions(true)
    fetchPatients(true)
    
    const interval = setInterval(() => {
      fetchSessions()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Poll for messages of the selected session
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([])
      return
    }
    fetchMessages(selectedSessionId, true)
    
    const interval = setInterval(() => {
      if (selectedSessionId) {
        fetchMessages(selectedSessionId)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [selectedSessionId])

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Select a session (from Chats list)
  const handleSelectSession = (clientId: string) => {
    setSelectedSessionId(clientId)
    setSessions(prev =>
      prev.map(s => (s.clientId === clientId ? { ...s, unreadCount: 0 } : s))
    )
  }

  // Start chat with a Patient directly
  const handleStartChatWithPatient = (patient: Patient) => {
    const targetCid = `patient_${patient.id}`
    
    // Check if session already exists
    const existing = sessions.find(s => s.patientId === patient.id || s.clientId === targetCid)
    
    if (existing) {
      setSelectedSessionId(existing.clientId)
    } else {
      // Create a temporary mock session
      const tempSession: ChatSession = {
        clientId: targetCid,
        patientId: patient.id,
        displayName: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        lastMessage: 'Iniciar conversación...',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0
      }
      
      setSessions(prev => [tempSession, ...prev])
      setSelectedSessionId(targetCid)
    }
    
    // Switch tab to chats
    setActiveTab('chats')
  }

  // Send admin message
  const handleSendReply = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault()
    
    const messageContent = customText ? customText.trim() : replyText.trim()
    if (!selectedSessionId || !messageContent || sendingMessage) return

    if (!customText) setReplyText('')
    setSendingMessage(true)

    const res = await api.post<ChatMessage>('/api/admin/chat/send/', {
      clientId: selectedSessionId,
      message: messageContent
    })

    if (res.ok) {
      setMessages(prev => [...prev, res.data])
      // Update session locally
      setSessions(prev =>
        prev.map(s =>
          s.clientId === selectedSessionId
            ? { ...s, lastMessage: messageContent, lastMessageAt: new Date().toISOString() }
            : s
        )
      )
    }
    setSendingMessage(false)
  }

  // Link anonymous session to patient account
  const handleLinkPatient = async () => {
    if (!selectedSessionId || !linkPatientId || linkingLoading) return
    
    setLinkingLoading(true)
    const res = await api.post<any>('/api/admin/chat/link/', {
      clientId: selectedSessionId,
      patientId: parseInt(linkPatientId)
    })
    
    if (res.ok) {
      // Refresh sessions list
      await fetchSessions(true)
      // Refresh messages thread
      await fetchMessages(selectedSessionId, true)
      setLinkPatientId('')
    }
    setLinkingLoading(false)
  }

  // Filtering
  const filteredSessions = sessions.filter(
    s =>
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPatients = patients.filter(
    p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  )

  const selectedSession = sessions.find(s => s.clientId === selectedSessionId)

  // Resolve matching Patient info for selected session
  const activePatientInfo = selectedSession?.patientId
    ? patients.find(p => p.id === selectedSession.patientId)
    : patients.find(p => p.email.toLowerCase() === selectedSession?.email?.toLowerCase())

  // Time format helper
  const formatTime = (isoString: string | null) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  // Get initials helper
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
  }

  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden bg-background rounded-3xl border border-border shadow-xl">
      {/* ── Left Sidebar (List pane) ────────────────────────────── */}
      <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
        
        {/* Toggle tabs */}
        <div className="p-4 border-b border-border flex flex-col gap-3 shrink-0">
          <div className="flex bg-muted/80 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('chats'); setSearchQuery('') }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chats'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Conversaciones</span>
            </button>
            <button
              onClick={() => { setActiveTab('patients'); setSearchQuery('') }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'patients'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Pacientes</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={activeTab === 'chats' ? 'Buscar chat...' : 'Buscar paciente...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border/80 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground transition-colors"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {activeTab === 'chats' ? (
            /* Tab: Active Chats */
            loadingSessions && sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs">Cargando conversaciones...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center p-4">
                <MessageSquare className="h-6 w-6 mb-1.5 opacity-40 text-primary" />
                <p className="text-xs font-bold text-foreground/80">No hay chats activos</p>
                <p className="text-[10px] mt-0.5 opacity-70">Las visitas de la web aparecerán aquí.</p>
              </div>
            ) : (
              filteredSessions.map(session => {
                const isSelected = session.clientId === selectedSessionId
                const initials = getInitials(session.displayName)
                return (
                  <button
                    key={session.clientId}
                    onClick={() => handleSelectSession(session.clientId)}
                    className={`w-full text-left p-3 rounded-2xl transition-all duration-200 flex gap-3 relative border ${
                      isSelected
                        ? 'bg-primary/10 text-primary border-primary/25 shadow-sm'
                        : 'hover:bg-muted/50 text-foreground border-transparent'
                    }`}
                  >
                    {/* Avatar initials with status marker */}
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20 text-xs font-black text-primary">
                        {session.patientId ? initials : 'VS'}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-xs truncate leading-snug">
                          {session.displayName}
                        </span>
                        {session.lastMessageAt && (
                          <span className="text-[9px] text-muted-foreground/80 shrink-0">
                            {formatTime(session.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground/75 truncate mt-0.5">
                        {session.lastMessage || 'Sin mensajes'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {session.unreadCount > 0 && (
                      <span className="absolute right-3.5 bottom-3.5 h-4.5 w-4.5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow animate-bounce">
                        {session.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })
            )
          ) : (
            /* Tab: All Patients */
            loadingPatients && patients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs">Cargando pacientes...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center p-4">
                <UserRound className="h-6 w-6 mb-1.5 opacity-40 text-primary" />
                <p className="text-xs font-bold text-foreground/80">No hay pacientes registrados</p>
              </div>
            ) : (
              filteredPatients.map(patient => {
                const name = `${patient.firstName} ${patient.lastName}`
                const initials = getInitials(name)
                return (
                  <button
                    key={patient.id}
                    onClick={() => handleStartChatWithPatient(patient)}
                    className="w-full text-left p-3 rounded-2xl transition-all duration-150 hover:bg-muted/60 text-foreground flex items-center gap-3 border border-transparent"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border text-xs font-black text-muted-foreground">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs truncate leading-snug">
                        {name}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {patient.email}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  </button>
                )
              })
            )
          )}
        </div>
      </div>

      {/* ── Middle Pane: Chat Conversation Thread ───────────────── */}
      <div className="flex-1 flex flex-col bg-background relative">
        {selectedSessionId && selectedSession ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card/65 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-sm font-black text-primary">
                  {selectedSession.patientId ? getInitials(selectedSession.displayName) : 'VS'}
                </div>
                <div>
                  <h3 className="font-black text-sm text-foreground leading-tight">
                    {selectedSession.displayName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{selectedSession.patientId ? 'Paciente Registrado' : 'Visitante Web'}</span>
                    {selectedSession.email && (
                      <>
                        <span className="opacity-50">•</span>
                        <span>{selectedSession.email}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs">Cargando mensajes...</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isAdmin = msg.sender === 'admin'
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                        isAdmin
                          ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none'
                          : 'bg-card text-foreground mr-auto border border-border rounded-tl-none'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 font-semibold mb-0.5">
                        {isAdmin ? 'Administración' : msg.senderName}
                      </span>
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      {msg.createdAt && (
                        <span className="text-[8px] opacity-60 text-right mt-1.5 self-end font-semibold">
                          {formatTime(msg.createdAt)}
                        </span>
                      )}
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Predefined Quick Replies */}
            <div className="px-4 py-2 bg-card/45 border-t border-border flex flex-wrap gap-2">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider self-center mr-1">Plantillas:</span>
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendReply(undefined, tmpl.text)}
                  className="bg-muted hover:bg-primary/10 hover:text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-border transition-colors cursor-pointer"
                  title={tmpl.text}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={e => handleSendReply(e)} className="p-4 border-t border-border bg-card flex gap-3 z-10">
              <input
                type="text"
                placeholder="Escribe una respuesta..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                disabled={sendingMessage}
                className="flex-1 bg-muted/60 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50 text-foreground transition-colors"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || sendingMessage}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center shrink-0 gap-1.5 text-xs"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Enviar</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center select-none bg-muted/5">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20 text-primary animate-bounce" />
            <h3 className="font-black text-base text-foreground">Bandeja de Entrada</h3>
            <p className="text-xs max-w-xs mt-1 leading-relaxed">
              Selecciona una conversación del panel izquierdo o un paciente registrado para comenzar a chatear en tiempo real.
            </p>
          </div>
        )}
      </div>

      {/* ── Right Sidebar: Detail panel (user info) ──────────────── */}
      <AnimatePresence>
        {selectedSessionId && selectedSession && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-border flex flex-col bg-card shrink-0 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Detalles del Usuario</span>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-5">
              
              {activePatientInfo ? (
                /* Detail: Patient Registered */
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center pb-2 border-b border-border/60">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-lg font-black text-primary mb-2">
                      {getInitials(`${activePatientInfo.firstName} ${activePatientInfo.lastName}`)}
                    </div>
                    <h4 className="font-bold text-sm text-foreground">
                      {activePatientInfo.firstName} {activePatientInfo.lastName}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 mt-1">
                      <Award className="h-3 w-3" />
                      <span>{activePatientInfo.userType || 'Paciente'}</span>
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-muted-foreground font-bold">Correo Electrónico</p>
                        <p className="text-foreground truncate">{activePatientInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold">Teléfono / Celular</p>
                        <p className="text-foreground">{activePatientInfo.phone || 'No registrado'}</p>
                      </div>
                    </div>
                    {activePatientInfo.city && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold">Ubicación</p>
                          <p className="text-foreground">{activePatientInfo.city}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold">Test de Admisión</p>
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                          activePatientInfo.intakeCompleted 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {activePatientInfo.intakeCompleted ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button asChild size="sm" className="w-full text-xs font-bold rounded-xl py-4 shadow">
                      <Link to={`/pacientes/${activePatientInfo.id}`}>
                        <span>Ver Ficha Completa</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                /* Detail: Anonymous Guest */
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center pb-2 border-b border-border/60">
                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border text-lg font-black text-muted-foreground mb-2">
                      VS
                    </div>
                    <h4 className="font-bold text-sm text-foreground">
                      Visitante Anónimo
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground text-[10px] font-bold border border-border mt-1">
                      <ShieldAlert className="h-3 w-3" />
                      <span>Sesión Temporal</span>
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-muted-foreground font-bold">Cliente ID</p>
                        <p className="text-foreground truncate font-mono text-[10px] bg-muted/60 p-1.5 rounded-md mt-0.5">{selectedSession.clientId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Association Form (Vincular a Paciente) */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground/75 tracking-wider">Vincular a Cuenta de Paciente</p>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Si este visitante ya tiene una cuenta o se identificó, asócialo para unificar su historial de mensajes.
                    </p>
                    <select
                      value={linkPatientId}
                      onChange={e => setLinkPatientId(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none text-foreground cursor-pointer"
                    >
                      <option value="">Selecciona paciente...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} ({p.email})
                        </option>
                      ))}
                    </select>
                    
                    <Button
                      onClick={handleLinkPatient}
                      disabled={!linkPatientId || linkingLoading}
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl py-4 bg-primary text-primary-foreground shadow"
                    >
                      {linkingLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                          <span>Vincular Cuenta</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
