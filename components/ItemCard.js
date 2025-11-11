import React, { useState } from 'react'

export default function ItemCard({ item, onClaimed, onCommentAdded, currentUser = {} }) {
  const [commentText, setCommentText] = useState('')
  const [claiming, setClaiming] = useState(false)

  async function handleClaim() {
    const name = currentUser.name || prompt('Enter your name to claim (will be shown)') || 'Anonymous'
    const studentNumber = currentUser.studentNumber || null
    setClaiming(true)
    const res = await fetch(`/api/items/${item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'claim', name, studentNumber })
    })
    setClaiming(false)
    if (res.ok) {
      const updated = await res.json()
      onClaimed && onClaimed(updated)
    } else {
      const err = await res.json()
      alert(err.error || 'Could not claim')
    }
  }

  async function submitComment(e) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    const res = await fetch(`/api/items/${item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', text, name: currentUser.name || 'Web User', studentNumber: currentUser.studentNumber || null })
    })
    if (res.ok) {
      const comment = await res.json()
      setCommentText('')
      onCommentAdded && onCommentAdded(item.id, comment)
    } else {
      const err = await res.json()
      alert(err.error || 'Could not add comment')
    }
  }

  return (
    <div className="glass rounded-2xl border-gray-700 shadow-lg p-4 flex flex-col">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-xl" />
      ) : (
        <div className="w-full h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">No image</div>
      )}

      <h3 className="mt-3 font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-200 mt-1 flex-1">{item.description}</p>
      {item.reportedByName && (
        <div className="text-xs text-gray-300 mt-1">Reported by {item.reportedByName}{item.reportedByStudentNumber ? ` • ${item.reportedByStudentNumber}` : ''}</div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
        <div>
          {item.claimed ? (
            <div className="text-sm text-green-400">Claimed by {item.claimedBy}{item.claimedByStudentNumber ? ` • ${item.claimedByStudentNumber}` : ''}</div>
          ) : (
            <button onClick={handleClaim} className="apple-btn bg-blue-500 text-white" disabled={claiming}>
              {claiming ? 'Claiming...' : 'Claim'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 border-t pt-3">
        <div className="text-sm font-medium">Comments</div>
        <div className="mt-2 space-y-2 max-h-36 overflow-auto">
          {item.comments.length === 0 && <div className="text-xs text-gray-400">No comments yet</div>}
          {item.comments.map((c) => (
            <div key={c.id} className="text-sm bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">{c.name}{c.studentNumber ? ` • ${c.studentNumber}` : ''} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="mt-1 text-gray-200">{c.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={submitComment} className="mt-2 flex gap-2">
          <input value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 apple-input" placeholder="Write a comment" />
          <button className="apple-btn bg-gray-200 text-black">Send</button>
        </form>
      </div>
    </div>
  )
}
