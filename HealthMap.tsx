/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Hospital, 
  Building2, 
  Pill, 
  WifiOff, 
  Wifi, 
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  History
} from 'lucide-react';
import { Card, Button } from '@/src/components/UI';
import { cn } from '@/src/lib/utils';
import { 
  useOnlineStatus, 
  cacheFacilityData, 
  getCachedFacilityData,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches
} from '@/src/lib/offline';

// Leaflet CSS is imported in index.css
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'hospital-marker'
});

interface Location {
  id: number;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  lat: number;
  lng: number;
  distance: string;
  availability: 'high' | 'medium' | 'low';
}

const defaultLocations: Location[] = [
  { id: 1, name: "City General Hospital", type: 'hospital', lat: 51.505, lng: -0.09, distance: "0.8 km", availability: 'high' },
  { id: 2, name: "Sunrise Health Clinic", type: 'clinic', lat: 51.51, lng: -0.1, distance: "1.2 km", availability: 'medium' },
  { id: 3, name: "MediCare Pharmacy", type: 'pharmacy', lat: 51.508, lng: -0.08, distance: "0.5 km", availability: 'high' },
  { id: 4, name: "Apollo Specialty Center", type: 'hospital', lat: 51.49, lng: -0.07, distance: "2.1 km", availability: 'low' },
];

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function HealthMap() {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'clinic' | 'pharmacy'>('all');
  const [isCaching, setIsCaching] = useState(false);
  const [cacheSuccess, setCacheSuccess] = useState(false);
  
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const loadInitialData = async () => {
      const cached = await getCachedFacilityData();
      if (cached) {
        setLocations(cached);
      } else if (isOnline) {
        await cacheFacilityData(defaultLocations);
      }

      const searches = await getRecentSearches();
      setRecentSearches(searches);
    };
    loadInitialData();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, [isOnline]);

  const handleDownloadOffline = async () => {
    setIsCaching(true);
    // Simulate downloading map tiles and health data
    // In a real PWA, this would trigger a Service Worker to open a specific cache
    await cacheFacilityData(locations);
    
    // Simulate time taken
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCaching(false);
    setCacheSuccess(true);
    setTimeout(() => setCacheSuccess(false), 3000);
  };

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || loc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSearchSubmit = async (term: string) => {
    setSearchTerm(term);
    setIsSearchFocused(false);
    const updated = await saveRecentSearch(term);
    if (updated) setRecentSearches(updated);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className={cn(
                "text-[10px] font-black uppercase tracking-wider",
                isOnline ? "text-green-600" : "text-red-600"
              )}>
                {isOnline ? "Connected" : "Offline Mode"}
              </span>
            </div>
            {!isOnline && (
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                CACHED DATA
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(searchTerm);
              }}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />

            <AnimatePresence>
              {isSearchFocused && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
                >
                  <div className="p-3 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Recent Searches</span>
                    <button 
                      onClick={async () => {
                        await clearRecentSearches();
                        setRecentSearches([]);
                      }}
                      className="text-[9px] font-bold text-blue-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearchSubmit(term)}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-slate-300" />
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            {(['all', 'hospital', 'clinic', 'pharmacy'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-wider",
                  filterType === type ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredLocations.length > 0 ? (
            filteredLocations.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  setCenter([loc.lat, loc.lng]);
                  setSelectedLocation(loc);
                }}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all hover:shadow-md",
                  selectedLocation?.id === loc.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    loc.type === 'hospital' && "bg-red-50 text-red-500",
                    loc.type === 'clinic' && "bg-blue-50 text-blue-500",
                    loc.type === 'pharmacy' && "bg-green-50 text-green-500",
                  )}>
                    {loc.type === 'hospital' && <Hospital className="w-4 h-4" />}
                    {loc.type === 'clinic' && <Building2 className="w-4 h-4" />}
                    {loc.type === 'pharmacy' && <Pill className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{loc.distance}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{loc.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    loc.availability === 'high' ? "bg-green-500" : loc.availability === 'medium' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic-none">
                    {loc.availability} Availability
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center gap-4 text-slate-300">
              <Search className="w-8 h-8 opacity-20" />
              <p className="text-xs font-bold font-mono">NO FACILITIES FOUND</p>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          disabled={!isOnline || isCaching}
          onClick={handleDownloadOffline}
          className="w-full h-11 border-dashed border-2 bg-white/50"
        >
          {isCaching ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
              Caching Zone...
            </span>
          ) : cacheSuccess ? (
            <span className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" /> Ready Offline
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <DownloadCloud className="w-4 h-4" /> Cache this Region
            </span>
          )}
        </Button>
      </div>

      {/* Map Display */}
      <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50">
        <MapContainer 
          center={center} 
          zoom={13} 
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={center} />
          
          {filteredLocations.map(loc => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]}
              icon={hospitalIcon}
            >
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-bold text-slate-900">{loc.name}</h3>
                  <p className="text-[10px] uppercase font-black text-slate-400 mt-1 mb-3">{loc.type}</p>
                  <Button size="sm" className="w-full rounded-lg">Get Directions</Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(p => setCenter([p.coords.latitude, p.coords.longitude]));
              }
            }}
            className="p-3 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {!isOnline && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Viewing Offline Cache
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-6 left-6 right-6 z-[1000] md:left-auto md:right-6 md:w-80"
            >
              <Card className="p-5 flex flex-col gap-4 border-slate-200 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 leading-tight pr-4">{selectedLocation.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Open 24/7 • Emergency Ready</p>
                  </div>
                  <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2 text-center rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Wait Time</p>
                    <p className="text-sm font-black text-slate-900">12 min</p>
                  </div>
                  <div className="bg-slate-50 p-2 text-center rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Bed Status</p>
                    <p className="text-sm font-black text-green-600 italic-none uppercase">AVAIL</p>
                  </div>
                </div>
                <Button className="w-full flex items-center gap-2" variant="dark">
                  <Navigation className="w-4 h-4" /> Start Navigation
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
