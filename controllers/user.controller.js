import User from '../mongodb/models/user.js';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
}


const createUser = async (req, res) => {
    const {email, name, batch, password} = req.body;
    const body = {
        "email": email,
        "name": name,
        "batch": batch
    }

    try {
        const user = await User.createUser(email, password, body);

        const token = createToken(user._id);
        
        res.status(200).json({email, "token": token});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
};

const loginUser = async (req, res) => {
    // res.json({mssg: "login user"});
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.status(200).json({email, "token": token});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
};

const getUserInfo = async (req, res) => {
    const email = req.query.email;

    try {
        const user = await User.getUserInfo(email);
        const userWithoutPassword = JSON.parse(JSON.stringify(user));
        delete userWithoutPassword.password;

        console.log("user wo pass: ", userWithoutPassword);

        if(user)
            res.status(200).json(userWithoutPassword);
        else res.status(400).json("error: user null");
    } catch(error) {
        res.status(400).json({error: error.message});
    }
};


export {
    createUser,
    loginUser,
    getUserInfo
}
