import React, { useEffect, useRef } from 'react';

const ChartWidget = ({ interval = 'D' }) => {
    const containerRef = useRef();

    useEffect(() => {
        // Clear previous widget
        if (containerRef.current) containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;

        // Map app interval format to TradingView format
        // M1->1, M5->5, H1->60, D1->D, etc.
        const tvInterval = interval === 'M1' ? '1' :
            interval === 'M5' ? '5' :
                interval === 'M15' ? '15' :
                    interval === 'M30' ? '30' :
                        interval === 'H1' ? '60' :
                            interval === 'H4' ? '240' :
                                interval === 'W1' ? 'W' : 'D';

        script.onload = () => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    "width": "100%",
                    "height": "100%",
                    "symbol": "FX:EURUSD",
                    "interval": tvInterval,
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "hide_side_toolbar": true,
                    "hide_top_toolbar": true,
                    "hide_legend": true, // User requested to hide background text/legend
                    "allow_symbol_change": false,
                    "container_id": "tradingview_widget" // Important: ID must match
                });
            }
        };
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup if needed
        }
    }, [interval]);

    return (
        <div className="flex-1 h-full w-full bg-[#131722]" id="tradingview_widget" ref={containerRef}>
            {/* Widget will be injected here */}
            <div className="flex items-center justify-center h-full text-gray-500">
                Loading Chart...
            </div>
        </div>
    );
};

export default ChartWidget;
