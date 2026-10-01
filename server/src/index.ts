import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;


app.use(cors()); // Allows request from any frontend origin (Vercel & Codespaces)
app.use(express.json());

// GET: Fetch all jobs
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST: Add a new job
app.post('/api/jobs', async (req: Request, res: Response) => {
  const { title, company, salary, status } = req.body;
  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        salary,
        status: status || 'Applied'
      }
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PATCH: Update job status
app.patch('/api/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const updatedJob = await prisma.job.update({
      where: { id: String(id) },
      data: { status }
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// DELETE: Remove a job by ID
app.delete('/api/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.job.delete({
      where: { id: String(id) }
    });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running with PostgreSQL on port ${PORT}`);
});