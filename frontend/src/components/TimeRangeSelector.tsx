import './TimeRangeSelector.css';

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const ranges = [
    { value: '1w', label: '1 Week' },
    { value: '1m', label: '1 Month' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="time-range-selector">
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          className={`range-button ${selectedRange === range.value ? 'active' : ''}`}
          onClick={() => onRangeChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

