import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Search } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  salary: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://animated-waddle-6977vjwx69qgfr75x-5000.app.github.dev';
const STATUSES: Job['status'][] = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<Job['status']>('Applied');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jobs`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, salary, status }),
    })
      .then(res => res.json())
      .then(savedJob => {
        setJobs(prevJobs => [savedJob, ...prevJobs]);
        setTitle('');
        setCompany('');
        setSalary('');
        setStatus('Applied');
      })
      .catch(err => console.error('Error creating job:', err));
  };

  const handleStatusChange = (id: string, newStatus: Job['status']) => {
    fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(updatedJob => {
        setJobs(prev => prev.map(job => (job.id === id ? updatedJob : job)));
      })
      .catch(err => console.error('Error updating status:', err));
  };

  const handleDelete = (id: string) => {
    fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' })
      .then(() => setJobs(prev => prev.filter(job => job.id !== id)))
      .catch(err => console.error('Error deleting job:', err));
  };

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase size={32} color="#2563eb" />
          <h1 style={{ margin: 0, fontSize: '24px' }}>Tech Application Board</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', width: '250px' }}>
          <Search size={18} color="#9ca3af" />
          <input
            placeholder="Search title or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%' }}
          />
        </div>
      </header>

      {/* Add Job Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '30px' }}>
        <input placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        <input placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
        <select value={status} onChange={e => setStatus(e.target.value as Job['status'])} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Kanban Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'start' }}>
        {STATUSES.map(columnStatus => {
          const columnJobs = filteredJobs.filter(j => j.status === columnStatus);
          return (
            <div key={columnStatus} style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '12px', minHeight: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', color: '#4b5563' }}>{columnStatus}</h3>
                <span style={{ backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{columnJobs.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {columnJobs.map(job => (
                  <div key={job.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px' }}>{job.title}</h4>
                      <button onClick={() => handleDelete(job.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6b7280' }}>{job.company} • {job.salary || 'N/A'}</p>
                    
                    <select
                      value={job.status}
                      onChange={e => handleStatusChange(job.id, e.target.value as Job['status'])}
                      style={{ width: '100%', padding: '4px', fontSize: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}