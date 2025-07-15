const User = require('../models/user.model');
/**
 * @desc    Get all users except the current user
 * @route   GET /api/users
 * @access  Private
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res) => {
try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}
};

/**
 * @desc    Update user's online status (for socket events)
 * @param   userId - ID of the user
 * @param   isOnline - true or false
 */
const updateOnlineStatus = async (userId, isOnline) => {
try {
    await User.findByIdAndUpdate(userId, { isOnline });
} catch (err) {
    console.error('Failed to update online status:', err.message);
}
};

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/users/:id
 * @access  Private (self or admin)
 */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId /* && !req.user.isAdmin */) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateOnlineStatus,
  deleteUser,
};




