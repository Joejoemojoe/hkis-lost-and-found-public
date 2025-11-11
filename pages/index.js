import React, { useEffect, useState } from 'react'
import ItemCard from '../components/ItemCard'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [userName, setUserName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [dark, setDark] = useState(true)

  useEffect(() => {
    fetchItems()
    // load session user info from localStorage
    try {
      const u = localStorage.getItem('lf_user')
      if (u) {
        const obj = JSON.parse(u)
        setUserName(obj.name || '')
        setStudentNumber(obj.studentNumber || '')
      }
      const d = localStorage.getItem('lf_dark')
      setDark(d === '1')
      if (d === '1') document.documentElement.classList.add('dark')
    } catch (e) {}
  }, [])

  async function fetchItems() {
    setLoading(true)
    const res = await fetch('/api/items')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let image = null
    if (file) {
      image = await toDataURL(file)
    }
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, image, reportedByName: userName, reportedByStudentNumber: studentNumber })
    })
    if (res.ok) {
      const newItem = await res.json()
      setItems((s) => [newItem, ...s])
      setTitle('')
      setDescription('')
      setFile(null)
      document.getElementById('fileInput').value = ''
    } else {
      const err = await res.json()
      alert(err.error || 'Failed')
    }
  }

  function toDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function handleClaimed(updated) {
    setItems((s) => s.map((it) => (it.id === updated.id ? updated : it)))
  }

  function handleCommentAdded(itemId, comment) {
    setItems((s) => s.map((it) => (it.id === itemId ? { ...it, comments: [...it.comments, comment] } : it)))
  }

  function saveSession() {
    const obj = { name: userName, studentNumber }
    localStorage.setItem('lf_user', JSON.stringify(obj))
    alert('Saved session info')
  }

  function toggleDark() {
    const next = !dark
    setDark(next)
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('lf_dark', next ? '1' : '0')
  }

  return (
    <div className="container py-8">
      <div className="page-header">
        <h1 className="text-3xl font-semibold">Lost & Found</h1>
        <div className="text-sm text-gray-400">Apple-style dark UI</div>
      </div>

      <div className="glass p-4 rounded-2xl mb-6">
        <h2 className="font-semibold">Report an item</h2>
        <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="col-span-1 md:col-span-1 apple-input" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="col-span-1 md:col-span-1 apple-input" />
          <div className="col-span-1 md:col-span-1 flex items-center gap-2">
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
            <button className="apple-btn bg-blue-500 text-white">Upload</button>
          </div>
        </form>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" className="apple-input" />
          <input value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} placeholder="Student number" className="apple-input" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={saveSession} className="apple-btn bg-green-500 text-white">Save session</button>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} currentUser={{ name: userName, studentNumber }} onClaimed={handleClaimed} onCommentAdded={handleCommentAdded} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
