import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const MapComponent = ({ latitude, longitude, title }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            // Prevent multiple initializations if global exists, but ensure we get the libs
            if (!window.google?.maps) {
                try {
                    setOptions({
                        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                        version: "weekly",
                    });
                } catch (e) {
                    console.error("Error setting options", e);
                }
            }

            try {
                // We need the 'maps' library for the Map class
                const { Map } = await importLibrary('maps');
                // Ensure marker library is loaded for google.maps.Marker
                await importLibrary('marker');

                if (!isMounted) return;

                if (!mapInstanceRef.current && mapRef.current) {
                    const lat = parseFloat(latitude);
                    const lng = parseFloat(longitude);

                    mapInstanceRef.current = new Map(mapRef.current, {
                        center: { lat, lng },
                        zoom: 14,
                        mapTypeId: 'roadmap',
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
            // Cleanup markers if needed? Maps API usually handles this but good practice.
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
