import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import { AuthPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventControlPannel from './pages/EventControlPannel';
import EventDetails from './pages/BookingPage';



function App() {
  return (
    <>
      <Toaster theme="dark" position="top-center" expand={true} richColors />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth/signin/*" element={<AuthPage mode="signin" />} />
          <Route path="/auth/signup/*" element={<AuthPage mode="signup" />} />

          {/* Protected Routes */}

          {/* Dashboard Route */}
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
          {/* Dynamic Route for Event Control Panel */}
          <Route
            path="/dashboard/event/:id"
            element={
              <SignedIn>
                <EventControlPannel />
              </SignedIn>
            }
          />
          <Route path="/book/:id" element={<EventDetails />} />
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

          <Route path="*" element={<Navigate to="/" replace />} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;