import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Layout & Pages
import Navbar from './components/Navbar';
import { AuthPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreateEvent from './Pages/CreateEvent';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin/*" element={<AuthPage mode="signin" />} />
        <Route path="/auth/signup/*" element={<AuthPage mode="signup" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/create-event"
          element={
            <>
              <SignedIn>
                <CreateEvent />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Catch-all Routes*/}
        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;