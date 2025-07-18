import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/encrypt-text', (req, res) => {
  const { text, method, key } = req.body;

  let result = '';
  try {
    if (method === 'base64') {
      result = Buffer.from(text).toString('base64');
    } else if (method === 'hex') {
      result = Buffer.from(text).toString('hex');
    } else if (method === 'rot13') {
      result = text.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(
          (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        )
      );
    } else if (method === 'aes') {
      const cipher = crypto.createCipher('aes-256-cbc', key);
      result = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } else {
      return res.status(400).json({ error: 'Méthode non supportée' });
    }

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Erreur de cryptage' });
  }
});

app.post('/encrypt-file', upload.single('file'), (req, res) => {
  const fileBuffer = req.file.buffer;
  const method = req.body.method;
  const key = req.body.key;

  let result;
  try {
    if (method === 'base64') {
      result = fileBuffer.toString('base64');
    } else if (method === 'hex') {
      result = fileBuffer.toString('hex');
    } else if (method === 'aes') {
      const cipher = crypto.createCipher('aes-256-cbc', key);
      result = Buffer.concat([cipher.update(fileBuffer), cipher.final()]).toString('hex');
    } else {
      return res.status(400).json({ error: 'Méthode non supportée' });
    }

    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: 'Erreur de cryptage du fichier' });
  }
});

app.listen(port, () => {
  console.log(`✅ INCONNU BOY ENCRY lancé sur http://localhost:${port}`);
});
