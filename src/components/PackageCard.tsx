
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package as PackageType } from '@/lib/mockData';
import { Box, Package } from 'lucide-react';

interface PackageCardProps {
  packageData: PackageType;
  onCollect?: (id: string) => void;
  onAssignLocker?: (id: string) => void;
}

const PackageCard = ({ packageData, onCollect, onAssignLocker }: PackageCardProps) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'collected': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return <Box className="h-4 w-4" />;
      case 'medium': return <Box className="h-5 w-5" />;
      case 'large': return <Box className="h-6 w-6" />;
      default: return <Box className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{packageData.description || 'Package'}</CardTitle>
            <CardDescription className="mt-1">Tracking #: {packageData.trackingNumber}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(packageData.status)} capitalize`}>
            {packageData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Courier:</span>
            <span className="font-medium">{packageData.courier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-medium">{packageData.recipient}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Size:</span>
            <div className="flex items-center">
              {getSizeIcon(packageData.size)}
              <span className="ml-1 capitalize">{packageData.size}</span>
            </div>
          </div>
          {packageData.lockerNumber && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Locker:</span>
              <span className="font-medium">#{packageData.lockerNumber}</span>
            </div>
          )}
          {packageData.deliveredAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivered:</span>
              <span>{formatDate(packageData.deliveredAt)}</span>
            </div>
          )}
          {packageData.collectedAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Collected:</span>
              <span>{formatDate(packageData.collectedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-wrap gap-2">
          {packageData.status === 'pending' && onAssignLocker && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={() => onAssignLocker(packageData.id)}
            >
              Assign Locker
            </Button>
          )}
          {packageData.status === 'delivered' && onCollect && (
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => onCollect(packageData.id)}
            >
              Collect Package
            </Button>
          )}
          {packageData.status === 'collected' && (
            <Badge variant="outline" className="w-full text-center py-1">
              Collected on {formatDate(packageData.collectedAt)}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
