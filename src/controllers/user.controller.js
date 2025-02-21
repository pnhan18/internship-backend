const userService = require('../services/user.service');

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await userService.getUserById(userId);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUser = async(req, res)=> {
    try {
        const userId = req.params.id;
        const { email, name, address, phone, avatar_url } = req.body;
        const updatedUser = await userService.updateUserById(userId,email, name, address, phone, avatar_url);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getUser,updateUser };

