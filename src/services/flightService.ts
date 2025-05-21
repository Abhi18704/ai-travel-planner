
import { addHours, addMinutes, parseISO } from 'date-fns';
import { Flight } from '@/components/FlightDetailsCard';

// Mock airlines data
const airlines = [
  'Delta Air Lines',
  'United Airlines',
  'American Airlines',
  'British Airways',
  'Lufthansa',
  'Emirates',
  'Qatar Airways',
  'Singapore Airlines'
];

// Generate random flight number
const generateFlightNumber = (airline: string) => {
  const prefix = airline.split(' ')[0][0];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${number}`;
};

// Generate random price within a range
const generatePrice = (min: number, max: number) => {
  const price = Math.floor(min + Math.random() * (max - min));
  return `₹${price}`;
};

// Calculate flight duration
const calculateDuration = (departureTime: Date, arrivalTime: Date) => {
  const diffMs = arrivalTime.getTime() - departureTime.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// Generate a single flight
const generateFlight = (date: string, isLongHaul: boolean): Flight => {
  const baseDate = parseISO(date);
  const hourOffset = Math.floor(Math.random() * 12) + 6; // Flights between 6 AM and 6 PM
  const departureTime = addHours(baseDate, hourOffset);
  
  // Flight duration depends on if it's a long haul or not
  const flightDurationHours = isLongHaul 
    ? Math.floor(Math.random() * 8) + 4 // 4-12 hours for long haul
    : Math.floor(Math.random() * 3) + 1; // 1-4 hours for short haul
  
  const flightDurationMinutes = Math.floor(Math.random() * 60);
  const arrivalTime = addMinutes(addHours(departureTime, flightDurationHours), flightDurationMinutes);
  
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const minPrice = isLongHaul ? 500 : 150;
  const maxPrice = isLongHaul ? 2500 : 800;
  
  return {
    airline,
    flightNumber: generateFlightNumber(airline),
    departureTime: departureTime.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    duration: calculateDuration(departureTime, arrivalTime),
    price: generatePrice(minPrice, maxPrice),
    seatsAvailable: Math.floor(Math.random() * 50) + 1
  };
};

export const getAvailableFlights = (
  origin: string,
  destination: string,
  departureDate: string,
  numberOfFlights = 5
): Flight[] => {
  // Determine if this is likely a long-haul flight based on destination
  const longHaulDestinations = ['Tokyo', 'Singapore', 'Sydney', 'Dubai', 'Hong Kong', 'Bangkok'];
  const isLongHaul = longHaulDestinations.some(dest => 
    destination.toLowerCase().includes(dest.toLowerCase())
  );
  
  const flights: Flight[] = [];
  for (let i = 0; i < numberOfFlights; i++) {
    flights.push(generateFlight(departureDate, isLongHaul));
  }
  
  // Sort flights by departure time
  flights.sort((a, b) => 
    new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
  );
  
  return flights;
};
