import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from "react-router"
import { ReadPage } from './ReadPage.tsx'
import { HomePage } from './HomePage.tsx'
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <StrictMode>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path={`read/:book/:chapter`} element={<ReadPage />} />
      </Routes>
    </StrictMode>
  </HashRouter>,
)
