
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <Card className="max-w-md mx-auto border-destructive/50">
      <CardHeader className="bg-destructive/10">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">Error</CardTitle>
        </div>
        <CardDescription>
          There was a problem generating your travel plan
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700">{message}</p>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h4 className="font-medium mb-2">Common issues:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Invalid or expired API key</li>
            <li>Network connection issues</li>
            <li>Gemini API service may be temporarily unavailable</li>
            <li>The request may have exceeded Gemini's usage limits</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorDisplay;
