
import React, { useState } from 'react';
import TravelForm, { TravelFormData } from '@/components/TravelForm';
import TravelItinerary from '@/components/TravelItinerary';
import LoadingItinerary from '@/components/LoadingItinerary';
import ErrorDisplay from '@/components/ErrorDisplay';
import { generateTravelPlan, TravelPlan } from '@/services/geminiService';
import { Compass, Plane, MapPinned } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-travel-light/50 bg-travel-pattern">
      <div className="container px-4 py-12 mx-auto">
        {!travelPlan && !loading && !error && (
          <div className="max-w-xl mx-auto mb-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-travel-primary flex items-center justify-center">
                <Plane className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-travel-dark mb-4">
              AI Travel Planner
            </h1>
            <p className="text-gray-600 mb-8">
              Create a personalized travel itinerary with the power of Gemini AI. 
              Just tell us about your trip, and we'll plan it for you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-travel-primary/10 text-travel-primary p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="font-medium mb-1">Personalized Itineraries</h3>
                <p className="text-sm text-gray-500">Tailored to your interests, budget, and travel style.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-travel-secondary/10 text-travel-secondary p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <MapPinned className="h-5 w-5" />
                </div>
                <h3 className="font-medium mb-1">Hidden Gems</h3>
                <p className="text-sm text-gray-500">Discover local favorites and off-the-beaten-path attractions.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-travel-accent/10 text-travel-accent p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <div className="font-bold">$</div>
                </div>
                <h3 className="font-medium mb-1">Budget Planning</h3>
                <p className="text-sm text-gray-500">Stay within your budget with cost estimates for each activity.</p>
              </div>
            </div>
            
            <TravelForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {loading && <LoadingItinerary />}

        {error && <ErrorDisplay message={error} onRetry={handleRetry} />}

        {travelPlan && !loading && !error && (
          <TravelItinerary travelPlan={travelPlan} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
