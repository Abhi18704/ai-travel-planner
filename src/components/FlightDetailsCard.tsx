
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plane, Clock, DollarSign, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export type Flight = {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  seatsAvailable: number;
};

interface FlightDetailsCardProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  flights: Flight[];
}

const FlightDetailsCard: React.FC<FlightDetailsCardProps> = ({ 
  origin, 
  destination, 
  departureDate, 
  returnDate,
  flights 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEE, MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(parseISO(timeString), 'h:mm a');
    } catch (error) {
      return timeString;
    }
  };

  return (
    <Card className="border-travel-primary/20 bg-gradient-to-br from-travel-light/50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center mb-2">
          <Plane className="h-5 w-5 text-travel-primary mr-2" />
          <CardTitle className="text-travel-primary text-xl">Available Flights</CardTitle>
        </div>
        <CardDescription>
          Showing flights from {origin} to {destination} on {formatDate(departureDate)}
          {returnDate && ` with return on ${formatDate(returnDate)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {flights.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <TableCell className="font-medium">{flight.airline}</TableCell>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{formatTime(flight.departureTime)}</TableCell>
                    <TableCell>{formatTime(flight.arrivalTime)}</TableCell>
                    <TableCell>{flight.duration}</TableCell>
                    <TableCell className="text-travel-primary font-medium">{flight.price}</TableCell>
                    <TableCell>{flight.seatsAvailable} left</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No flights available for the selected dates. Please try different dates.
          </div>
        )}
        <div className="mt-4 text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" /> Flight times are shown in local time zones
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightDetailsCard;
