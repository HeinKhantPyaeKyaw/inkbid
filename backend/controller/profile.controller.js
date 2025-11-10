import User from '../schemas/user.schema.js';
import { uploadProfilePicture } from '../services/firebaseupload.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadProfilePicture(req.file);
    }

    let updateFields = {};

    if (req.body.role === 'seller') {
      const firstName =
        req.body.firstName || req.body.name?.split(' ')[0] || '';

      const lastName = req.body.lastName || req.body.name?.split(' ')[1] || '';

      const fullName = `${firstName} ${lastName}`.trim();

      updateFields = {
        firstName,
        lastName,
        name: fullName,
        bio: req.body.bio,
        specialization: req.body.specialization,
        writingStyle: req.body.writingStyle,
        paypalEmail: req.body.paypalEmail,
      };
    } else {
      const firstName =
        req.body.firstName || req.body.name?.split(' ')[0] || '';

      const lastName = req.body.lastName || req.body.name?.split(' ')[1] || '';

      const fullName = `${firstName} ${lastName}`.trim();

      updateFields = {
        firstName,
        lastName,
        name: fullName,
        organization: req.body.organization,
        paypalEmail: req.body.paypalEmail,
      };
    }

    if (imageUrl) {
      updateFields.img_url = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateFields,
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

export const getProfileInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      'name firstName lastName email role bio specialization writingStyle img_url rating createdAt',
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
