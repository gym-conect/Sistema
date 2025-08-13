require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // aceita self-signed certificate
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Erro na conexão ao banco", err.stack);
  } else {
    console.log("Conectado ao banco PostgreSQL");
    release();
  }
});

app.get("/", (req, res) => {
  res.send("API está rodando.");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
