import Item from '../models/Item.js';

// @desc    Get all items with optional search & filters
// @route   GET /api/items
export const getItems = async (req, res) => {
  try {
    const { search, category, type, status } = req.query;
    const query = {};
    // Filter by type (LOST / FOUND)
    if (type && type !== 'All') {
      query.type = type;
    }
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    // Filter by status (OPEN / CLAIMED / etc.)
    if (status && status !== 'All') {
      query.status = status;
    }
    // Search keyword in title or location
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { location: regex }, { description: regex }];
    }
    const items = await Item.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new lost or found item report
// @route   POST /api/items
export const createItem = async (req, res) => {
  try {
    const { title, type, category, location, description, date, contact, imageUrl, coordinates, isGeoTagged, createdBy } = req.body;
    if (!title || !type || !category || !location || !description || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, type, category, location, description, contact)',
      });
    }
    const newItem = await Item.create({
      title,
      type,
      category,
      location,
      description,
      date: date || new Date().toISOString().split('T')[0],
      contact,
      imageUrl: imageUrl || '',
      coordinates: coordinates || { lat: null, lng: null },
      isGeoTagged: Boolean(isGeoTagged || (coordinates && coordinates.lat && coordinates.lng)),
      createdBy: createdBy || { name: 'Anonymous', email: contact, role: 'user' },
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update item status (e.g. CLAIMED, RESOLVED, OPEN)
// @route   PATCH /api/items/:id/status
export const updateItemStatus = async (req, res) => {
  try {
    const { status, claimData } = req.body;
    const validStatuses = ['OPEN', 'PENDING', 'CLAIMED', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }
    const updateQuery = { $set: { status } };
    if (claimData) {
      updateQuery.$push = {
        claims: {
          claimantName: claimData.claimantName || 'Anonymous',
          claimantContact: claimData.claimantContact || '',
          proofDetails: claimData.proofDetails || '',
          createdAt: new Date(),
        },
      };
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find smart matches between LOST and FOUND items
// @route   GET /api/items/:id/matches
export const getPotentialMatches = async (req, res) => {
  try {
    const currentItem = await Item.findById(req.params.id);
    if (!currentItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    // Look for opposite type (if LOST -> find FOUND, if FOUND -> find LOST)
    const oppositeType = currentItem.type === 'LOST' ? 'FOUND' : 'LOST';
    const matches = await Item.find({
      _id: { $ne: currentItem._id },
      type: oppositeType,
      category: currentItem.category,
      status: 'OPEN',
    }).limit(5);
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
