import { useState } from 'react';

export default function ReportForm({ onAddItem }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [type, setType] = useState('Lost');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !location || !contact) {
      alert("Please fill in all required fields!");
      return;
    }

    const newItem = {
      id: Date.now(), // Generate unique ID
      title,
      category,
      type,
      location,
      date: new Date().toISOString().split('T')[0],
      description,
      contact
    };

    onAddItem(newItem);

    // Reset Form
    setTitle('');
    setLocation('');
    setDescription('');
    setContact('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      marginBottom: '20px'
    }}>
      <h3>Report an Item</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Item Title (e.g. Blue Backpack)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Electronics">Electronics</option>
            <option value="Personal Items">Personal Items</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <input 
          type="text" 
          placeholder="Location (e.g. Canteen, MCA Lab)" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Contact Email / Phone" 
          value={contact} 
          onChange={(e) => setContact(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Submit Report</button>
      </div>
    </form>
  );
}