import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const MapComponent = ({ latitude, longitude, title }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            // Always set options to ensure key is loaded, even if previously loaded without it
            try {
                // Check if already loaded to avoid warning, but for NoApiKeys error we might need to set it anyway
                if (!window.google?.maps?.importLibrary) {
                    setOptions({
                        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                        version: "weekly",
                        libraries: ["maps", "marker"] // Add libraries here to be safe
                    });
                } else {
                    // If it exists but we got NoApiKeys, re-setting options might help if it wasn't fully loaded
                    setOptions({
                        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                    });
                }
            } catch (e) {
                console.error("Error setting options", e);
            }

            try {
                const { Map } = await importLibrary('maps');
                await importLibrary('marker');

                if (!isMounted) return;

                if (!mapInstanceRef.current && mapRef.current) {
                    const lat = parseFloat(latitude);
                    const lng = parseFloat(longitude);

                    mapInstanceRef.current = new Map(mapRef.current, {
                        center: { lat, lng },
                        zoom: 14,
                        mapTypeId: 'roadmap',
                        mapId: "DEMO_MAP_ID",
                    });

                    // Add Legacy Marker
                    markerRef.current = new google.maps.Marker({
                        position: { lat, lng },
                        map: mapInstanceRef.current,
                        title: title,
                    });
                } else if (mapInstanceRef.current) {
                    // Update existing instance
                    const latLng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
                    mapInstanceRef.current.setCenter(latLng);
                    if (markerRef.current) {
                        markerRef.current.setPosition(latLng);
                        markerRef.current.setTitle(title);
                    }
                }
            } catch (e) {
                console.error("Failed to load Maps API", e);
            }
        };

        if (latitude && longitude) {
            initMap();
        }

        return () => {
            isMounted = false;
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        };
    }, [latitude, longitude, title]);

    if (!latitude || !longitude) return null;

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default MapComponent;
