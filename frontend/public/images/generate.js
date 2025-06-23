const fs = require('fs');

const basilLeaf = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 10C30 10 15 25 15 45C15 65 30 80 50 80C70 80 85 65 85 45C85 25 70 10 50 10Z" fill="#4B7F52"/>
  <path d="M50 20C35 20 25 30 25 45C25 60 35 70 50 70C65 70 75 60 75 45C75 30 65 20 50 20Z" fill="#2C5530"/>
</svg>`;

const tomato = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#E74C3C"/>
  <path d="M50 20C40 20 30 30 30 40C30 50 40 60 50 60C60 60 70 50 70 40C70 30 60 20 50 20Z" fill="#C0392B"/>
</svg>`;

const lemon = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="50" rx="35" ry="30" fill="#F1C40F"/>
  <path d="M50 30C35 30 25 40 25 50C25 60 35 70 50 70C65 70 75 60 75 50C75 40 65 30 50 30Z" fill="#F39C12"/>
</svg>`;

fs.writeFileSync('basil-leaf.svg', basilLeaf);
fs.writeFileSync('tomato.svg', tomato);
fs.writeFileSync('lemon.svg', lemon); 