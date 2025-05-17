
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { BentoGrid } from "@/components/BentoGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ff-blue/5 to-ff-purple/5 -z-10" />
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in font-futuristic tracking-tight">
              Rescuing Food,<br />
              <span className="gradient-text">Feeding Communities</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg animate-fade-in" style={{animationDelay: "0.2s"}}>
              Connect surplus food with those in need while earning rewards for your positive impact on the community and environment.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
              <Button asChild variant="gradient" size="lg">
                <Link to="/donate">Donate Food</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/map">
                  Find Food
                  <MapPin className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="w-full h-[400px] md:h-[500px] relative">
              <div className="absolute top-0 right-0 w-[90%] h-[90%] rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="https://img.freepik.com/premium-photo/happy-indian-children-enjoy-food-bread-dirty-crowded-streets-social-problem-poverty-hunger-lack-clean-drinking-water_184982-5918.jpg"
                  alt="Food donation app"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">FoodFlag System</h3>
                    <p className="text-sm opacity-90">Connect donors with recipients in real-time</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[60%] h-[40%] rounded-3xl overflow-hidden shadow-lg border p-4 z-10 glass-card border-ff-blue/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-ff-green/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-ff-green" />
                  </div>
                  <div>
                    <h4 className="font-medium">Rewards & Impact</h4>
                    <p className="text-m text-white/70">Earn FeedCoins for your contributions</p>
                    <p className="text-m text-white/70">A plate of food may seem small to you, but to someone hungry, it's a message that they are seen, loved, and not forgotten.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bento Grid Navigation Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 font-futuristic tracking-tight">DASHBOARD</h2>
          <p className="text-center text-white/70 mb-12">Access all FeedForward services through our intuitive dashboard</p>
          
          <BentoGrid />
        </div>
      </section>
    </div>
  );
}
