import User from '../schemas/user.schema';

// Update User Info
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, specialization, writingStyle, img_url } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          bio,
          specialization,
          writingStyle,
          img_url,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Get Profile Info
export const getProfileInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      'name firstName lastName email role bio specialization writingStyle img_url rating',
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching user profile' });
  }
};
