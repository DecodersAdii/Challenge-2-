import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users = [
  { id: 1, email: 'user@example.com', password: bcrypt.hashSync('password', 8) }
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}