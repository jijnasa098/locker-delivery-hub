
import React from 'react';
import { Locker } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Box, Lock, Package, PackageOpen, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LockerMapProps {
  lockers: Locker[];
  onLockerSelect?: (lockerId: number) => void;
  selectedLockerId?: number;
}

const LockerMap = ({ lockers, onLockerSelect, selectedLockerId }: LockerMapProps) => {
  const getLockerSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'h-16 w-16';
      case 'medium': return 'h-20 w-20';
      case 'large': return 'h-24 w-24';
      default: return 'h-16 w-16';
    }
  };

  const getLockerIcon = (locker: Locker) => {
    if (locker.status === 'available') {
      return <Unlock className="h-6 w-6 text-green-500" />;
    } else {
      return <Lock className="h-6 w-6 text-red-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Locker Map</h3>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 bg-secondary/50 rounded-lg">
        {lockers.map((locker) => (
          <TooltipProvider key={locker.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    getLockerSizeClass(locker.size),
                    'border rounded-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all',
                    locker.status === 'available' ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-200',
                    selectedLockerId === locker.id && 'ring-2 ring-primary'
                  )}
                  onClick={() => onLockerSelect && locker.status === 'available' && onLockerSelect(locker.id)}
                >
                  <div className="flex justify-center mb-1">
                    {getLockerIcon(locker)}
                  </div>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    #{locker.id}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>Locker #{locker.id}</p>
                  <p className="capitalize">Size: {locker.size}</p>
                  <p>Status: {locker.status}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default LockerMap;
