import User from "../models/user.model.js"
import bcrypt from 'bcrypt'


export const signup = async (req, res) => {
    
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: "please fill in all the fields"})
        }
        if(username.lentgh <3 || password.lentgh <6){
            return res.status(400).json({message: "password or username too short"})
        }

        const oldUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
            ]
        })
        

        if(oldUser){
            return res.status(400).json({message: "username or email already exists, please login"})
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username:username,
            email:email,
            password: hashedpassword
        })

        await newUser.save();

        if (newUser) {
            
            req.session.regenerate(err => {
            if (err) {
                return res.status(500).json({ message: 'something went wrong' });
            }

            req.session.userId = newUser._id;
            req.session.createdAt = Date.now();

            res.status(200).json({
                message: 'user signed up',
                username: newUser.username,
                _id: newUser._id,
                email: newUser.email,
            });
            });


        } else {
            console.log(error.message)
            res.status(500).json({message: "error in the user creation"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error in the user creation"});
    }  
}


export const login = async (req, res)=>{
    const {username, password} = req.body
    try {
        if(!username || !password){
            return res.status(400).json({message: "please fill in all the fields"})
        }

        const user = await User.findOne({ username});
        
        if(!user){
            return res.status(400).json({message: 'username or password incorrect'})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: 'username or password incorrect'})
        }

        req.session.regenerate(err => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({ message: 'something went wrong', error: err });
            }

            req.session.userId = user._id;
            req.session.createdAt = Date.now();

            res.status(200).json({
                message: 'user logged in',
                username: user.username,
                _id: user._id,
                email: user.email,
            });
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "error in the user creation"})
    }
}

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) return res.status(501).send('Logout failed');
            res.clearCookie('connect.sid');
            res.json('Logged out');
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal error!"})
    }
    
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");

    if (user) {
      return res.status(200).json({
        message: "user logged in",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
