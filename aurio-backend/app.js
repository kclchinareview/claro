import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('aurio backend is running');
});

app.post('/api/tools', (req, res) => {
  res.json({ result: "This is a test response. Your backend is working!" });
});

app.listen(port, () => {
  console.log(`aurio backend listening on port ${port}`);
});