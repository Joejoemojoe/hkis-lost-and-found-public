const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'items.json')

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8')
}

function readItems() {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeItems(items) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8')
}

module.exports = { readItems, writeItems }
