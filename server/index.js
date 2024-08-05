const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/Database')
const bcrypt = require('bcrypt');
const axios = require('axios');
const bodyParser = require('body-parser');
const Credentials = require('./models/Credentials');
const validationSchema = require('./models/validation');
const UserModel = require('./models/User');
const FeeModel = require('./models/Fee')
const lipaNaMpesaRoutes = require('./routes/routes.lipanampesa')
const studentRoutes = require('./routes/routes.studentRecords')


require('dotenv').config();

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,

}));
// connect the db
connectDB();

app.use('/api', lipaNaMpesaRoutes);
app.use('api/student', studentRoutes);



app.post('/login', async (req, res) => {
    const { admissionNumber, password } = req.body;

    try {
        const user = await Credentials.findOne({ admissionNumber });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.status(200).json({ message: 'Success', user });
            } else {
                res.status(401).json({ message: 'The password is incorrect!' });
            }
        } else {
            res.status(404).json({ message: 'The user does not exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

app.post('/signup', async (req, res) => {
    const { error } = validationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation failed', details: error.details });
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Credentials({ ...req.body, password: hashedPassword });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
});

app.post('/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
        const userInfo = response.data;

        // Check if the user exists in your database or create a new user
        let user = await UserModel.findOne({ googleId: userInfo.sub });
        if (!user) {
            user = new UserModel({
                googleId: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
            });
            await user.save();
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

app.get('', (req ,res) =>{
    
})



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`App is running on localhost:${port}`);
});
