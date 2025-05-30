import { useState, useMemo } from 'react';
import { mockIncidents, SeverityLevel, Incident } from './types';
import { IncidentList } from './components/IncidentList';
import { SeverityFilter } from './components/SeverityFilter';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { SortDate } from './components/SortDate';
import { NewIncident } from './components/NewIncident';

type FilterOption = "All" | SeverityLevel;
type SortOption = "newest" | "oldest";

function App() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [severityFilter, setSeverityFilter] = useState<FilterOption>("All");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [showForm, setShowForm] = useState(false);

  const filteredIncidents = useMemo(() => {
    const filtered = severityFilter === "All"
      ? [...incidents]
      : incidents.filter(incident => incident.severity === severityFilter);

    return filtered.sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [incidents, severityFilter, sortOrder]);

  const handleNewIncident = (newIncident: { title: string; description: string; severity: SeverityLevel }) => {
    const incident: Incident = {
      id: uuidv4(),
      title: newIncident.title,
      description: newIncident.description,
      severity: newIncident.severity,
      reported_at: new Date().toISOString(),
    };
    setIncidents([incident, ...incidents]);
    setShowForm(false); 
  };

  return (
    <div className="app">
      <h1>AI Safety Incident Dashboard</h1>
      <div className="dashboard">
        <div className="header-controls">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="toggle-form-btn"
          >
            {showForm ? 'Cancel' : 'Report New Incident'}
          </button>
          <div className="filter-sort-controls">
            <SeverityFilter 
              selectedFilter={severityFilter}
              onFilterChange={setSeverityFilter}
            />
            <SortDate 
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>
        </div>

        {showForm && <NewIncident onSubmit={handleNewIncident} />}
        <IncidentList incidents={filteredIncidents} />
      </div>
    </div>
  );
}

export default App;