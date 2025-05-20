
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const LoadingItinerary: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-8 w-64 bg-gray-200 rounded-md mb-6 animate-pulse-slow"></div>
      
      <Card className="mb-6">
        <CardHeader className="space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse-slow"></div>
          <div className="h-4 w-full bg-gray-100 rounded-md animate-pulse-slow"></div>
          <div className="h-4 w-3/4 bg-gray-100 rounded-md animate-pulse-slow"></div>
        </CardHeader>
        <CardContent>
          <div className="h-5 w-40 ml-auto bg-gray-200 rounded-md animate-pulse-slow"></div>
        </CardContent>
      </Card>
      
      {[1, 2, 3].map((day) => (
        <Card key={day} className="mb-6">
          <CardHeader className="bg-gray-200 animate-pulse-slow">
            <div className="h-7 w-full bg-gray-300 rounded-md animate-pulse-slow"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((activity) => (
                <div key={activity} className="relative pl-6 pr-2 py-3 rounded-lg bg-gray-50 animate-pulse-slow">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse-slow"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((tip) => (
            <div key={tip} className="flex gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded-md animate-pulse-slow"></div>
              <div className="h-5 w-full bg-gray-200 rounded-md animate-pulse-slow"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingItinerary;
