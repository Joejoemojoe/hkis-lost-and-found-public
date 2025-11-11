const { readItems, writeItems } = require('../../../lib/data')

export default function handler(req, res) {
  const {
    query: { id }
  } = req

  if (req.method === 'GET') {
    const items = readItems()
    const item = items.find((i) => i.id === id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(item)
  }

  if (req.method === 'POST') {
    // actions: { action: 'claim'|'comment', name?, text? }
    const { action } = req.body || {}
    const items = readItems()
    const idx = items.findIndex((i) => i.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })

    const item = items[idx]
    if (action === 'claim') {
      const name = req.body.name || 'Anonymous'
      const studentNumber = req.body.studentNumber || null
      if (item.claimed) return res.status(400).json({ error: 'Already claimed' })
      item.claimed = true
      item.claimedBy = name
      item.claimedByStudentNumber = studentNumber
      item.claimedAt = new Date().toISOString()
      items[idx] = item
      writeItems(items)
      return res.status(200).json(item)
    }

    if (action === 'comment') {
      const text = (req.body.text || '').trim()
      const name = req.body.name || 'Anonymous'
      const studentNumber = req.body.studentNumber || null
      if (!text) return res.status(400).json({ error: 'Empty comment' })
      const comment = {
        id: Date.now().toString(),
        name,
        studentNumber,
        text,
        createdAt: new Date().toISOString()
      }
      item.comments.push(comment)
      items[idx] = item
      writeItems(items)
      return res.status(201).json(comment)
    }

    return res.status(400).json({ error: 'Unknown action' })
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
