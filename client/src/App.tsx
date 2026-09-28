import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  salary: string;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<Job['status']>('Applied');

  // Fetch jobs from backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    const newJob = { title, company, salary, status };

    fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob),
    })
      .then(res => res.json())
      .then(savedJob => {
        setJobs([...jobs, savedJob]);
        setTitle('');
        setCompany('');
        setSalary('');
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:5000/api/jobs/${id}`, { method: 'DELETE' })
      .then(() => setJobs(jobs.filter(job => job.id !== id)));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <Briefcase size={32} color="#2563eb" />
        <h1 style={{ margin: 0 }}>Tech Application Tracker</h1>
      </header>

      {/* Add Job Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '30px' }}>
        <input placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '8px' }} />
        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} style={{ padding: '8px' }} />
        <input placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} style={{ padding: '8px' }} />
        <select value={status} onChange={e => setStatus(e.target.value as Job['status'])} style={{ padding: '8px' }}>
          <option value="Wishlist">Wishlist</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0' }}>{job.title}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>{job.company} • {job.salary || 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: job.status === 'Interview' ? '#fef3c7' : '#e0e7ff', fontSize: '14px', fontWeight: 'bold' }}>
                {job.status}
              </span>
              <button onClick={() => handleDelete(job.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}