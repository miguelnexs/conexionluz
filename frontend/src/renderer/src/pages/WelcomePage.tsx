import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import bgImage from '../assets/hero_bg.png'
import { ArrowRight, Sparkles } from 'lucide-react'

export function WelcomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      {/* Decorative background blur on the left side */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
      
      {/* Left Column: Content */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-[50%] lg:w-[45%] xl:w-[40%] p-8 sm:p-16 lg:p-20 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.1)] bg-background">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col max-w-xl mx-auto md:mx-0"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-[2rem] bg-gradient-to-br from-primary/10 to-accent/5 ring-1 ring-border shadow-lg flex items-center justify-center overflow-hidden mb-10"
          >
            <img src={logo} alt="Conexión Luz" className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-sm" />
          </motion.div>

          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Sistema Integral</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-foreground leading-[1.05] pb-2">
              Bienvenido a <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-pulse inline-block mt-2">
                Conexión Luz
              </span>
            </h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-6 mb-12 font-medium"
          >
            Todo lo que necesitas para administrar tus terapeutas, pacientes, citas, cursos y conversatorios en un entorno de orden, paz y conciencia.
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.7 }}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="w-fit"
          >
            <Button asChild size="lg" className="group h-16 px-10 text-lg font-bold rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground shadow-2xl hover:shadow-primary/40 transition-all duration-300">
              <Link to="/dashboard" className="flex items-center gap-3">
                Entrar al Dashboard
                <div className="bg-background/20 rounded-full p-2 group-hover:bg-background/40 transition-colors">
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden md:block relative flex-1 bg-black overflow-hidden">
        {/* Overlay gradient to smoothly blend the image with the left column */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-transparent opacity-80 w-32" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background/20" />
        
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bgImage} 
          alt="Conexión Luz Ambiental" 
          className="w-full h-full object-cover object-center" 
        />
        
        {/* Decorative glassmorphism badge on the image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-12 right-12 z-20 backdrop-blur-3xl bg-background/20 border border-white/20 p-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          <p className="relative text-white font-medium text-xl leading-snug drop-shadow-md">
            "Encuentra la armonía<br /> entre desarrollo<br />y tranquilidad."
          </p>
        </motion.div>
      </div>
    </div>
  )
}
