export const signUp = (req,res)=>{
    const { email, password, userName} = req.body;
    res.send(`Sign up route with email: ${email}, password: ${password}, userName: ${userName}`);
    
};

export const signIn = (req,res)=>{res.send("Sign in route")};

export const signOut = (req,res)=>{res.send("Sign out route")};

export const createUser = (req,res)=>{res.send("Create a new user")};

export const authenticateUser = (req,res)=>{res.send("Authenticate user and return token")};

export const loginIn = (req,res)=>{res.send("Login route")};