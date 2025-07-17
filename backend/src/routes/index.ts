import { Router, Request, Response } from 'express';

const router = Router();

// Define your API endpoints here
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'Example route' });
});

// Export the router
export default router;