
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { TravelPlan } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, MapPin, LightbulbIcon, DownloadIcon, MessageCircle } from 'lucide-react';
import TravelChat from './TravelChat';
import FlightDetailsCard from './FlightDetailsCard';
import { getAvailableFlights } from '@/services/flightService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/sonner';

interface TravelItineraryProps {
  travelPlan: TravelPlan;
  onReset: () => void;
  apiKey?: string;
}

const TravelItinerary: React.FC<TravelItineraryProps> = ({ travelPlan, onReset, apiKey }) => {
  const [showChat, setShowChat] = useState(false);
  const [flights, setFlights] = useState([]);
  const itineraryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get flights when the travel plan loads
    if (travelPlan && travelPlan.days && travelPlan.days.length > 0) {
      const departureDate = travelPlan.days[0].date;
      const returnDate = travelPlan.days[travelPlan.days.length - 1].date;
      const mockFlights = getAvailableFlights(
        "Your Location", // We don't know the actual origin
        travelPlan.destination || "Your Destination",
        departureDate,
        6
      );
      setFlights(mockFlights);
    }
  }, [travelPlan]);
  
  if (!travelPlan || !travelPlan.days || travelPlan.days.length === 0) {
    return null;
  }

  // Get a safe destination name for the PDF file
  const getDestination = () => {
    return travelPlan.destination || 'Your_Trip';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleDownloadPDF = async () => {
    if (!itineraryRef.current) return;

    toast.info("Generating your travel plan as PDF...");
    
    try {
      const content = itineraryRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Travel_Plan_${getDestination()}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-travel-dark">Your Travel Itinerary</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
            <DownloadIcon className="h-4 w-4" />
            Export PDF
          </Button>
          {apiKey && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={toggleChat}
            >
              <MessageCircle className="h-4 w-4" />
              {showChat ? 'Hide Chat' : 'Ask Questions'}
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={onReset}
          >
            Create New Plan
          </Button>
        </div>
      </div>
      
      {showChat && apiKey && (
        <div className="mb-6">
          <TravelChat apiKey={apiKey} travelPlan={travelPlan} />
        </div>
      )}

      {/* Flight Details Card */}
      <FlightDetailsCard 
        origin="Your Location" 
        destination={getDestination()}
        departureDate={travelPlan.days[0].date}
        returnDate={travelPlan.days[travelPlan.days.length - 1].date}
        flights={flights}
      />
      
      <div ref={itineraryRef}>
        <Card className="border-travel-primary/20 bg-gradient-to-br from-travel-light to-white">
          <CardHeader>
            <CardTitle className="text-travel-primary text-xl">Trip Summary</CardTitle>
            <CardDescription>{travelPlan.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-right font-medium">
              Estimated Total: <span className="text-travel-primary">{travelPlan.totalEstimatedCost}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 mt-6">
          {travelPlan.days.map((day) => (
            <Card key={day.day} className="travel-card">
              <CardHeader className="bg-gradient-to-r from-travel-primary to-travel-primary/80 text-white">
                <CardTitle className="text-xl flex justify-between">
                  <span>Day {day.day}</span>
                  <span>{formatDate(day.date)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <div key={index} className={cn(
                      "relative pl-6 pr-2 py-3 rounded-lg",
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    )}>
                      <div className="before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-travel-secondary before:rounded-full before:content-['']">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-travel-secondary" />
                            {activity.time}
                          </h4>
                          {activity.cost && (
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {activity.cost}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{activity.description}</p>
                        
                        {activity.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <LightbulbIcon className="h-5 w-5 text-travel-secondary" />
              Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {travelPlan.tips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-travel-primary font-medium">{index + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500 pt-4">
        <p>Generated using Gemini AI • Travel Planner</p>
      </div>
    </div>
  );
};

export default TravelItinerary;
