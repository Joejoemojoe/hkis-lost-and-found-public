import { v4 as uuidv4 } from 'uuid'
const fs = require('fs')
const path = require('path')
const { readItems, writeItems } = require('../../../lib/data')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = readItems()
    return res.status(200).json(items)
  }

  if (req.method === 'POST') {
    // create a new item: expects { title, description, image, reportedByName, reportedByStudentNumber }
    const { title, description, image, reportedByName, reportedByStudentNumber } = req.body || {}
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description required' })
    }

    let imagePath = null
    if (image && typeof image === 'string') {
      // handle data URL (data:<mime>;base64,<data>) -> write to /public/uploads
      const m = image.match(/^data:(.+);base64,(.+)$/)
      if (m) {
        const mime = m[1]
        const data = m[2]
        let ext = mime.split('/')[1] || 'bin'
        if (ext === 'jpeg') ext = 'jpg'
        const filename = `${uuidv4()}.${ext}`
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const filePath = path.join(uploadsDir, filename)
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
        imagePath = `/uploads/${filename}`
      } else {
        // if it's already a path or URL, keep
        imagePath = image
      }
    }

    const items = readItems()
    const newItem = {
      id: uuidv4(),
      title,
      description,
      image: imagePath || null,
      comments: [],
      claimed: false,
      claimedBy: null,
      claimedByStudentNumber: null,
      reportedByName: reportedByName || null,
      reportedByStudentNumber: reportedByStudentNumber || null,
      createdAt: new Date().toISOString()
    }
    items.unshift(newItem)
    writeItems(items)
    return res.status(201).json(newItem)
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
