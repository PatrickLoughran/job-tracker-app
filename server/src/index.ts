import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data store for initial setup
let jobs = [
  { id: '1', title: 'Graduate Software Engineer', company: 'TechCorp', status: 'Applied', salary: '£35,000' },
  { id: '2', title: 'Full-Stack Developer', company: 'CloudSystems', status: 'Interview', salary: '£40,000' }
];

app.get('/api/jobs', (req: Request, res: Response) => {
  res.json(jobs);
});

app.post('/api/jobs', (req: Request, res: Response) => {
  const newJob = { id: Date.now().toString(), ...req.body };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.delete('/api/jobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  jobs = jobs.filter(job => job.id !== id);
  res.json({ message: 'Job deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});