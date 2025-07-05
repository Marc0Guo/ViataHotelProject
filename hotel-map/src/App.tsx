import Map from './components/Map';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Viata Hotel Project</h1>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="h-[calc(100vh-80px)]">
          <Map />
        </div>
      </main>
    </div>
  );
}

export default App;
