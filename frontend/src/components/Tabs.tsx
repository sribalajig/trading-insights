import './Tabs.css';

interface TabsProps {
  activeTab: 'search' | 'watchlist';
  onTabChange: (tab: 'search' | 'watchlist') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="tabs-container">
      <button
        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabChange('search')}
      >
        Search
      </button>
      <button
        className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
        onClick={() => onTabChange('watchlist')}
      >
        Watchlist
      </button>
    </div>
  );
}

