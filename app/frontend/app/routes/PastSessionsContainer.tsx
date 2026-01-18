import React from "react";
import { useState } from 'react';
import { useRequireAuth } from "~/hooks/useRequireAuth";

import NavBar from "~/components/NavBar";

const PastSessionsContainer: React.FC = () => {
  const { session, loading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState('Past Sessions');
  
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-teal-700 p-6">
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <NavBar activeTab={activeTab} onTabChange={setActiveTab}/>
            </div>
            <h1>No sessions created yet!</h1>
        </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-700 p-6">
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <NavBar activeTab={activeTab} onTabChange={setActiveTab}/>
            </div>
        </div>
    </div>
  );
};

export default PastSessionsContainer;
