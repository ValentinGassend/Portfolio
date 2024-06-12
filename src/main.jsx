import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {Analytics} from "@vercel/analytics/react";


ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Analytics/>
        <App/>
    </>,
)
