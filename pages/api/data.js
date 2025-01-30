let data = [
    { id: 1, name: 'Aditya Kumar', dob: '2003-06-04' },
    { id: 2, name: 'Jane Smith', dob: '1985-05-15' },
    { id: 3, name: 'AMAN ', dob: '2003-06-04' },
    { id: 4, name: 'Aravr', dob: '2003-06-04' },
    { id: 5, name: 'Aryan ', dob: '2003-06-04' },
    // Add more items as needed
  ];
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json(data);
    } else if (req.method === 'DELETE') {
      const id = parseInt(req.query.id);
      data = data.filter(item => item.id !== id);
      res.status(200).json({ message: 'Item deleted' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }