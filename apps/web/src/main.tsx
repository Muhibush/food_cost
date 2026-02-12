import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill for crypto.randomUUID in non-secure contexts (http://192.168.x.x)
if (!window.crypto) {
    // @ts-ignore
    window.crypto = {};
}
// @ts-ignore
if (!window.crypto.randomUUID) {
    // @ts-ignore
    window.crypto.randomUUID = () => {
        // If we have getRandomValues (most modern browsers even in insecure context), use it
        if (window.crypto.getRandomValues) {
            // @ts-ignore
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
                (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c / 4)).toString(16)
            );
        }
        // Fallback for deeply insecure contexts (extremely rare nowadays but good for safety)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
