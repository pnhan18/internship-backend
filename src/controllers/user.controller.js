const userService = require('../services/user.service');

const getUser = async (req, res) => {
    try {
        const email = req.params.email;
        const userData = await userService.getUserByEmail(email);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUser = async(req, res)=> {
    try {
        const emailUser = req.params.emailUser;
        const { email, name, address, phone, avatar_url } = req.body;
        const updatedUser = await userService.updateUserByEmail(emailUser,email, name, address, phone, avatar_url);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getUser,updateUser };

