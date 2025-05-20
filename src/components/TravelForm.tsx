
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface TravelFormProps {
  onSubmit: (formData: TravelFormData) => void;
  loading: boolean;
}

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string[];
  apiKey: string;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: [],
    apiKey: ''
  });
  const [newInterest, setNewInterest] = useState('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (selectedStartDate) {
      setFormData(prev => ({ 
        ...prev, 
        startDate: format(selectedStartDate, 'yyyy-MM-dd') 
      }));
    }
  }, [selectedStartDate]);

  useEffect(() => {
    if (selectedEndDate) {
      setFormData(prev => ({ 
        ...prev, 
        endDate: format(selectedEndDate, 'yyyy-MM-dd') 
      }));
    }
  }, [selectedEndDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(item => item !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const validateForm = () => {
    return (
      formData.source.trim() !== '' &&
      formData.destination.trim() !== '' &&
      formData.startDate !== '' &&
      formData.endDate !== '' &&
      formData.budget.trim() !== '' &&
      formData.travelers.trim() !== '' &&
      formData.interests.length > 0 &&
      formData.apiKey.trim() !== ''
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="source">Departure City</Label>
        <Input
          id="source"
          name="source"
          placeholder="e.g., New York"
          value={formData.source}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="e.g., Paris"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedStartDate ? format(selectedStartDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedStartDate}
                onSelect={(date) => {
                  setSelectedStartDate(date);
                  setStartDateOpen(false);
                  
                  // If end date is before start date or not set, update it
                  if (!selectedEndDate || (date && selectedEndDate < date)) {
                    const newEndDate = date ? addDays(date, 7) : undefined;
                    setSelectedEndDate(newEndDate);
                  }
                }}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedEndDate ? format(selectedEndDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={(date) => {
                  setSelectedEndDate(date);
                  setEndDateOpen(false);
                }}
                initialFocus
                disabled={(date) => date < (selectedStartDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="budget"
            placeholder="e.g., $2000"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            placeholder="e.g., 2"
            value={formData.travelers}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests</Label>
        <div className="flex gap-2">
          <Input
            id="newInterest"
            placeholder="e.g., Museums, Hiking, Food"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
          />
          <Button 
            type="button" 
            onClick={handleAddInterest}
            variant="outline"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.interests.map((interest, index) => (
            <div key={index} className="bg-travel-primary/10 text-travel-primary px-3 py-1 rounded-full flex items-center gap-1">
              {interest}
              <button 
                type="button" 
                onClick={() => handleRemoveInterest(interest)}
                className="text-travel-primary hover:text-travel-dark focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {formData.interests.length === 0 && (
          <p className="text-sm text-muted-foreground">Add at least one interest</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">
          Gemini API Key 
          <span className="text-xs text-muted-foreground ml-2">
            (Get from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>)
          </span>
        </Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          placeholder="Enter your Gemini API Key"
          value={formData.apiKey}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-muted-foreground">
          Your API key is only used for this request and not stored.
        </p>
      </div>

      <Button type="submit" className="w-full bg-travel-primary hover:bg-travel-primary/90" disabled={loading}>
        {loading ? 'Generating Itinerary...' : 'Create Travel Plan'}
      </Button>
    </form>
  );
};

export default TravelForm;
