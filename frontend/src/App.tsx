import { SearchBar } from './components/SearchBar';
import { TickerSearchResult } from './models/TickerSearchResult';
import './App.css';

function App() {
  const handleSelectTicker = (ticker: TickerSearchResult) => {
    console.log('Selected ticker:', ticker);
    // TODO: Navigate to ticker analysis page
  };

  return (
    <div className="app">
      <main className="app-main">
        <SearchBar onSelectTicker={handleSelectTicker} />
      </main>
    </div>
  );
}

export default App;

