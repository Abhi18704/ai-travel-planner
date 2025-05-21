
import React, { useState } from 'react';
import TravelForm, { TravelFormData } from '@/components/TravelForm';
import TravelItinerary from '@/components/TravelItinerary';
import LoadingItinerary from '@/components/LoadingItinerary';
import ErrorDisplay from '@/components/ErrorDisplay';
import { generateTravelPlan, TravelPlan } from '@/services/geminiService';
import { Compass, Plane, MapPinned, Globe, Briefcase, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TravelFormData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: TravelFormData) => {
    setFormData(data);
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateTravelPlan({
        source: data.source,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        travelers: data.travelers,
        interests: data.interests
      }, data.apiKey);
      
      setTravelPlan(plan);
      toast({
        title: "Itinerary generated!",
        description: `Your travel plan from ${data.source} to ${data.destination} is ready.`,
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate travel plan. Please check your API key and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTravelPlan(null);
    setError(null);
  };

  const handleRetry = () => {
    if (formData) {
      handleSubmit(formData);
    } else {
      setError(null);
    }
  };

  const destinations = [
    { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=300&auto=format&fit=crop" },
    { name: "Bali", image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=300&auto=format&fit=crop" },
    { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=300&auto=format&fit=crop" },
    { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=300&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-travel-light/30 bg-travel-pattern">
      {!travelPlan && !loading && !error && (
        <>
          {/* Hero Section */}
          <section className="relative bg-travel-primary py-16 md:py-24">
            <div className="absolute inset-0 bg-gradient-to-r from-travel-primary to-travel-dark opacity-90"></div>
            <div className="container px-4 mx-auto relative z-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-white mb-8 md:mb-0 md:pr-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Your Dream Trip,<br />Planned by AI
                  </h1>
                  <p className="text-xl opacity-90 mb-8">
                    Create personalized travel itineraries powered by Gemini AI in seconds. Just tell us where and when - we'll do the rest.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-travel-primary hover:bg-gray-100"
                      onClick={() => document.getElementById('plan-your-trip')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Plane className="mr-2 h-5 w-5" />
                      Plan Your Trip
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex justify-center md:justify-end">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 bg-travel-secondary/90 text-white p-3 rounded-lg shadow-lg z-10">
                      <p className="text-sm font-medium">AI-powered itineraries</p>
                      <p className="text-xs opacity-90">Personalized for your interests</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-xl rotate-3 transform">
                      <img 
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500&auto=format&fit=crop" 
                        alt="Travel Planning" 
                        className="rounded-md w-full md:max-w-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center text-travel-dark mb-12">Why Plan with AI Travel Planner</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-travel-primary/10 text-travel-primary rounded-full flex items-center justify-center mb-4">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized Itineraries</h3>
                  <p className="text-gray-600">
                    Get day-by-day plans customized to your interests, travel style, and budget. Never miss the best spots.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-travel-secondary/10 text-travel-secondary rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Budget Planning</h3>
                  <p className="text-gray-600">
                    Our AI provides cost estimates and helps you stay within your budget while maximizing experiences.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-travel-light bg-opacity-50 text-travel-dark rounded-full flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Local Insights</h3>
                  <p className="text-gray-600">
                    Discover hidden gems and get insider tips that you won't find in typical travel guides.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Destinations */}
          <section className="py-16 bg-gray-50">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center text-travel-dark mb-2">Popular Destinations</h2>
              <p className="text-center text-gray-600 mb-10">Get inspired for your next adventure</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((dest, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={dest.image} 
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-xl font-bold">{dest.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Form Section with a clean design */}
          <section className="py-16 bg-white" id="plan-your-trip">
            <div className="container px-4 mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-travel-dark mb-2">Plan Your Perfect Trip</h2>
                <p className="text-center text-gray-600 mb-8">
                  Just tell us where you want to go and let AI do the rest
                </p>
                
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <TravelForm onSubmit={handleSubmit} loading={loading} />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials/How it works */}
          <section className="py-16 bg-gray-50">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center text-travel-dark mb-12">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-travel-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                  <h3 className="text-xl font-semibold mb-3">Enter Your Details</h3>
                  <p className="text-gray-600">
                    Tell us about your destination, dates, budget, and what you love to do when traveling.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-travel-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-3">AI Creates Your Plan</h3>
                  <p className="text-gray-600">
                    Our AI analyzes thousands of options to create a personalized day-by-day itinerary just for you.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-travel-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                  <h3 className="text-xl font-semibold mb-3">Enjoy Your Trip</h3>
                  <p className="text-gray-600">
                    Get a complete itinerary with activities, estimated costs, and local tips to make your trip amazing.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {loading && <LoadingItinerary />}

      {error && <ErrorDisplay message={error} onRetry={handleRetry} />}

      {travelPlan && !loading && !error && (
        <TravelItinerary 
          travelPlan={travelPlan} 
          onReset={handleReset} 
          apiKey={formData?.apiKey}
        />
      )}
    </div>
  );
};

export default Index;
