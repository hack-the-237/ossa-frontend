
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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the register function from AuthContext
      await register(name, email, password);
      // Navigate happens in the AuthContext
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Feature slides for the carousel
  const features = [
    {
      title: "Get Started Today",
      description: "Join Proposal Cloud and start creating professional proposals in minutes.",
      image: "/OSSA.png"
    },
    {
      title: "Advanced Analytics",
      description: "Track proposal performance and gain insights to improve your win rate.",
      image: "/OSSA.svg"
    },
    {
      title: "Expert Templates",
      description: "Access a library of professionally designed templates for any industry.",
      image: "/OSSA_icon.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[600px] flex overflow-hidden rounded-2xl shadow-xl">
        {/* Left panel */}
        <div className="w-1/2 bg-white p-12 flex flex-col">
          <div className="mb-8">
            <img src="/OSSA_icon.png" alt="Logo" className="h-8" />
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground mb-8">
              Join Proposal Cloud to start creating winning proposals
            </p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full"
                />
              </div>

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
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
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
              <p>Join thousands of businesses using Proposal Cloud to win more deals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
