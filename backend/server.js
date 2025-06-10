const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko_kue'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes untuk Kue
// Get all kue
app.get('/api/kue', (req, res) => {
    const query = 'SELECT * FROM kue ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add new kue
app.post('/api/kue', (req, res) => {
    const { nama, deskripsi, harga, gambar } = req.body;
    const query = 'INSERT INTO kue (nama, deskripsi, harga, gambar) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nama, deskripsi, harga, gambar], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId, message: 'Kue berhasil ditambahkan' });
    });
});

// Update kue
app.put('/api/kue/:id', (req, res) => {
    const { id } = req.params;
    const { nama, deskripsi, harga, gambar } = req.body;
    const query = 'UPDATE kue SET nama = ?, deskripsi = ?, harga = ?, gambar = ? WHERE id = ?';
    
    db.query(query, [nama, deskripsi, harga, gambar, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Kue berhasil diupdate' });
    });
});

// Delete kue
app.delete('/api/kue/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM kue WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Kue berhasil dihapus' });
    });
});

// Routes untuk Order
// Get all orders
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT o.*, k.nama as nama_kue, k.harga 
        FROM orders o 
        JOIN kue k ON o.kue_id = k.id 
        ORDER BY o.id DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add new order
app.post('/api/orders', (req, res) => {
    const { kue_id, jumlah, nama_customer, alamat, telepon } = req.body;
    const query = 'INSERT INTO orders (kue_id, jumlah, nama_customer, alamat, telepon, status) VALUES (?, ?, ?, ?, ?, "pending")';
    
    db.query(query, [kue_id, jumlah, nama_customer, alamat, telepon], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId, message: 'Order berhasil ditambahkan' });
    });
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    
    db.query(query, [status, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Status order berhasil diupdate' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});