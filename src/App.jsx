import React from 'react';
import MultilingualWidget from './components/MultilingualWidget/MultilingualWidget';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Les Fables d'Antoine Vincent Arnault
          </h1>
          <p className="text-slate-600">
            Découvrez les fables dans différentes langues
          </p>
        </div>
        
        <div className="space-y-6">
          <MultilingualWidget 
            widgetId="acteon-widget" 
            title="Actéon"
            author="antoine-vincent-arnault"
            book="livre-1"
            fable="acteon"
          />
          
          <MultilingualWidget 
            widgetId="aigle-chapon-widget" 
            title="L'Aigle et le Chapon"
            author="fabulateurs-francais/antoine-vincent-arnault"
            book="livre-1"
            fable="laigle-et-le-chapon"
          />
        </div>
      </div>
    </div>
  );
}

export default App;