
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the login function from AuthContext
      await login(email, password);
      // No need to navigate here as it's handled in the AuthContext
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Feature slides for the carousel
  const features = [
    {
      title: "Smart Proposal Builder",
      description: "Create professional proposals in minutes with our AI-powered tools and templates.",
      image: "/public/OSSA.png"
    },
    {
      title: "RFP Analysis",
      description: "Automatically analyze RFPs to identify key requirements and win strategies.",
      image: "/public/OSSA.png"
    },
    {
      title: "Collaborative Editing",
      description: "Work together with your team in real-time to create winning proposals.",
      image: "/public/OSSA.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[600px] flex overflow-hidden rounded-2xl shadow-xl">
        {/* Left panel */}
        <div className="w-1/2 bg-white p-12 flex flex-col">
          <div className="mb-10">
            <img src="/public/OSSA.png" alt="Logo" className="h-8" />
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2">Log in</h1>
            <p className="text-muted-foreground mb-8">
              Welcome to OSSA Cloud. Please enter your login credentials below to 
              start using the app.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right panel with interactive carousel */}
        <div className="w-1/2 bg-primary p-12 flex flex-col justify-center items-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-primary opacity-90"></div>
          
          <div className="relative z-10 flex flex-col items-center max-w-md w-full">
            <Carousel className="w-full max-w-sm">
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col items-center">
                        <img 
                          src={feature.image} 
                          alt={feature.title} 
                          className="w-full h-40 object-contain mb-4"
                        />
                        <h2 className="text-xl font-bold text-center mb-2">{feature.title}</h2>
                        <p className="text-center text-sm opacity-90">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
                <CarouselNext className="relative static right-0 translate-y-0 ml-2" />
              </div>
            </Carousel>
            
            <div className="mt-6 text-center opacity-90">
              <p>OSSA is a private, cloud-base solution that helps you craft winning proposals faster and more effectively than ever before.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
