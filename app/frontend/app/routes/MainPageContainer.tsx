import React from 'react';

import NavBar from '../components/NavBar'

const MainPageContainer: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Home');

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">    
          </div>
          <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="bg-teal-700 p-24 flex items-center justify-center min-h-[400px]">
          <h1 className="text-white text-5xl font-light tracking-wide">
            HealthSimple
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MainPageContainer;