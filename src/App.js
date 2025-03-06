import logo from './logo.svg';
import './App.css';
import StockDashboard from './components/StockDashboard';

function App() {
  return (
    <div className="min-h-screen bg-[#0D1117] p-8">
      <div className="max-w-6xl mx-auto">
        <StockDashboard />
      </div>
    </div>
  );
}

export default App;
