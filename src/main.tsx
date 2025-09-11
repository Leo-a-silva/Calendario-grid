import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { DataProvider } from './contexts/DataContext.tsx'
import { MedicalProvider } from './contexts/MedicalContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <DataProvider>
      <MedicalProvider>
        <App />
      </MedicalProvider>
    </DataProvider>
  </AuthProvider>
);
