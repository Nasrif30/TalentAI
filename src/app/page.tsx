import { AuthForm } from '@/components/AuthForm'
import { BrainCircuit, Sparkles, Target, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[150px] pointer-events-none" />

      <main className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Hero Copy */}
        <div className="flex flex-col space-y-8">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">AI-Powered Recruitment</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">perfect fit</span>, faster than ever.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl">
            TalentAI uses advanced neural networks to parse CVs, match candidates with extreme precision, and automatically generate tailored interview questions.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex flex-col space-y-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Deep Context</h3>
              <p className="text-sm text-muted-foreground">Understands skills beyond keywords.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Instant Matching</h3>
              <p className="text-sm text-muted-foreground">Vector-based candidate ranking.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Target className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Targeted Interviews</h3>
              <p className="text-sm text-muted-foreground">AI-generated questions for missing skills.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form with Glassmorphism */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass border dark:border-white/10 border-black/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome to TalentAI</h2>
              <p className="text-muted-foreground text-sm">Sign in or create an account to continue.</p>
            </div>

            <AuthForm />
          </div>
        </div>

      </main>
    </div>
  )
}
