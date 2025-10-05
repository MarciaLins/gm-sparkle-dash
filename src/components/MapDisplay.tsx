import { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Card } from "./ui/card";
import { Loader2, MapPin } from "lucide-react";

interface MapDisplayProps {
  location: string;
  description?: string;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyDPKLhY4xYr2XdHqJVMGqQh5GqQTkJrx3g";

export const MapDisplay = ({ location, description }: MapDisplayProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          setError("Localização não encontrada");
        }
      } catch (err) {
        console.error("Erro ao geocodificar:", err);
        setError("Erro ao carregar mapa");
      } finally {
        setIsLoading(false);
      }
    };

    geocodeLocation();
  }, [location]);

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center justify-center h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </Card>
    );
  }

  if (error || !coordinates) {
    return (
      <Card className="p-4 flex items-center justify-center h-[300px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-6 w-6" />
          <p className="text-sm">{error || "Não foi possível carregar o mapa"}</p>
          <p className="text-xs">Localização: {location}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-[300px] w-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={coordinates}
            defaultZoom={15}
            gestureHandling="cooperative"
            disableDefaultUI={false}
          >
            <Marker position={coordinates} />
          </Map>
        </APIProvider>
      </div>
      {description && (
        <div className="p-3 bg-secondary border-t border-border">
          <p className="text-sm text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            {description}
          </p>
        </div>
      )}
    </Card>
  );
};