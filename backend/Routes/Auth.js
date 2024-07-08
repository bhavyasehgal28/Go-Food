const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa"


// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered



router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message)
    }
})

// Authentication a User, No login Requiered
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // -password will not pick password from db.
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        console.log(lat, long)
        let location = await axios
            .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
            .then(async res => {
                // console.log(`statusCode: ${res.status}`)
                console.log(res.data.results)
                // let response = stringify(res)
                // response = await JSON.parse(response)
                let response = res.data.results[0].components;
                console.log(response)
                let { village, county, state_district, state, postcode } = response
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location })

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

const foodData = [
    {
        "CategoryName": "Cakes",
        "name": "Pineapple cake",
        "img": "https://assets.winni.in/product/primary/2023/5/85206.jpeg?dpr=1&w=1000",
        "options": [
            {
                "0.5Kg": "250",
                "1Kg": "500"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Black Forest cake",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKDQwQyMcuoiLrA27RL3UMoP7P5a0iGmxTbQ&s",
        "options": [
            {
                "0.5Kg": "300",
                "1Kg": "600"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Fresh Fruit cake",
        "img": "https://ocakes.in/storage/app/public/images/item/item-64c777444b485.jpg",
        "options": [
            {
                "0.5Kg": "300",
                "1Kg": "600"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Butterscoth cake",
        "img": "https://sahnibakery.com/cdn/shop/products/CRUNCHYBUTTERSCOTCH549A@2x.jpg?v=1609400887",
        "options": [
            {
                "0.5Kg": "300",
                "1Kg": "600"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Blue Berry cake",
        "img": "https://assets.winni.in/c_limit,dpr_1,fl_progressive,q_80,w_1000/40572_extravagant-blueberry-cake.jpeg",
        "options": [
            {
                "0.5Kg": "400",
                "1Kg": "800"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Kit-Kat cake",
        "img": "https://ribbonsandballoons.com/assets1/uploads/ccake4.jpg",
        "options": [
            {
                "0.5Kg": "350",
                "1Kg": "700"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Red Velvet cake",
        "img": "https://theobroma.in/cdn/shop/files/RedVelvetCakehalfkg_341891f8-fc0d-431e-b574-98c3764c4e74.jpg?v=1711125810",
        "options": [
            {
                "0.5Kg": "400",
                "1Kg": "800"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Cakes",
        "name": "Dark Chocolate cake",
        "img": "https://imgcdn.floweraura.com/DSC_5885.jpg",
        "options": [
            {
                "0.5Kg": "400",
                "1Kg": "800"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Pizza",
        "name": "Margherita Pizza",
        "img": "https://img.apmcdn.org/6180055d1a33b0eba9f197c430adc94c3a574455/widescreen/26786d-20220908-tst-real-neapolitan-italian-pizza-out-of-the-oven-stock-photo-2000.jpg",
        "options": [
            {
                "regular": "120",
                "medium": "230",
                "large": "350"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Pizza",
        "name": "Farmhouse Pizza",
        "img": "https://www.dominos.com.sg/ManagedAssets/SG/product/PXVV/SG_PXVV_en_hero_11915.jpg?v893463060",
        "options": [
            {
                "regular": "120",
                "medium": "230",
                "large": "350"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Pizza",
        "name": "Chicken Cheese Pizza",
        "img": "https://b.zmtcdn.com/data/pictures/8/19248578/7bb8f35a0e6cb28f27a04e0bfa0f1861.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "options": [
            {
                "regular": "180",
                "medium": "260",
                "large": "350"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Pizza",
        "name": "Mix Vegie Pizza",
        "img": "https://blog.travelkhana.com/tkblog/wp-content/uploads/sites/2/2023/05/Cover.png",
        "options": [
            {
                "regular": "100",
                "medium": "200",
                "large": "300"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Burger",
        "name": "Aloo Tikki Burger",
        "img": "https://ik.imagekit.io/dunzo/tr:w-$w$,h-$h$,cm-pad_resize/NlJMc2RhWHRKcXUyekIvdDVVTGRtdz09-product_image.jpg",
        "options": [
            {
                "grilled": "70",
                "plain": "40"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Burger",
        "name": "Paneer Patty Burger",
        "img": "https://5.imimg.com/data5/JF/IO/MR/ANDROID-47622648/product-jpeg.png",
        "options": [
            {
                "grilled": "80",
                "plain": "50"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Burger",
        "name": "Chicken Burger",
        "img": "https://images.immediate.co.uk/production/volatile/sites/2/2017/06/Butchies-2.jpg?crop=10px%2C1099px%2C3819px%2C1643px&resize=1200%2C630",
        "options": [
            {
                "grilled": "70",
                "plain": "40"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Burger",
        "name": "Maharaja Burger",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG6LF0NkHn3-54XqLY94stkgR9Kxut-hnwxfJ93aRfwZB3woo3QhETHuTtxS_1EB39LSo&usqp=CAU",
        "options": [
            {
                "grilled": "120",
                "plain": "90"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Starter",
        "name": "Chilli Paneer",
        "img": "https://media.istockphoto.com/photos/spicy-paneer-or-chilli-paneer-or-paneer-tikka-or-cottage-cheese-in-picture-id697316634?b=1&k=20&m=697316634&s=170667a&w=0&h=bctfHdYTz9q2dJUnuxGRDUUwC9UBWjL_oQo5ECVVDAs=",
        "options": [
            {
                "half": "120",
                "full": "200"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Starter",
        "name": "Paneer 65",
        "img": "https://media.istockphoto.com/photos/paneer-tikka-kabab-in-red-sauce-is-an-indian-dish-made-from-chunks-of-picture-id1257507446?b=1&k=20&m=1257507446&s=170667a&w=0&h=Nd7QsslbvPqOcvwu1bY0rEPZXJqwoKTYCal3nty4X-Y=",
        "options": [
            {
                "half": "150",
                "full": "260"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Starter",
        "name": "Chicken Tikka",
        "img": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHRpa2thfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "options": [
            {
                "half": "170",
                "full": "300"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Starter",
        "name": "Paneer Tikka",
        "img": "https://media.istockphoto.com/photos/paneer-tikka-at-skewers-in-black-bowl-at-dark-slate-background-paneer-picture-id1186759790?k=20&m=1186759790&s=612x612&w=0&h=e9MlX_7cZtq9_-ORGLPNU27VNP6SvDz7s-iwTxrf7wU=",
        "options": [
            {
                "half": "170",
                "full": "250"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Soup",
        "name": "Tomato Soup",
        "img": "https://geekrobocook.com/wp-content/uploads/2021/03/1.-Cream-of-Tomato-Soup.jpg",
        "options": [
            {
                "half": "50",
                "full": "100"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Soup",
        "name": "Spicy Vegie Soup",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnvLx0sqoD5syjBGEPm0zmFiVGhc7IcYv3cw&s",
        "options": [
            {
                "half": "50",
                "full": "100"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Soup",
        "name": "Chicken Soup",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdT9d2p2J_do26p5vSWLVssr_k92rkGytN5Q&s",
        "options": [
            {
                "half": "70",
                "full": "140"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Soup",
        "name": "Sweet Corn Soup",
        "img": "https://img.taste.com.au/CCnkLB1G/taste/2016/11/chicken-and-sweet-corn-soup-3787-1.jpeg",
        "options": [
            {
                "half": "70",
                "full": "140"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Biryani/Rice",
        "name": "Veg Fried Rice",
        "img": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dmVnJTIwZnJpZWQlMjByaWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "options": [
            {
                "half": "110",
                "full": "200"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Biryani/Rice",
        "name": "Chicken Biryani",
        "img": "https://cdn.pixabay.com/photo/2019/11/04/12/16/rice-4601049__340.jpg",
        "options": [
            {
                "half": "170",
                "full": "300"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Biryani/Rice",
        "name": "Veg Biryani",
        "img": "https://media.istockphoto.com/photos/veg-biryani-picture-id1363306527?b=1&k=20&m=1363306527&s=170667a&w=0&h=VCbro7CX8nq2kruynWOCO2GbMGCea2dDJy6O6ebCKD0=",
        "options": [
            {
                "half": "150",
                "full": "260"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Biryani/Rice",
        "name": "Prawns Fried Rice",
        "img": "https://cdn.pixabay.com/photo/2018/03/23/08/27/thai-fried-rice-3253027__340.jpg",
        "options": [
            {
                "half": "120",
                "full": "220"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Shakes",
        "name": "Chocolate Shake",
        "img": "https://www.thespruceeats.com/thmb/qB63P8d50_HR5JMhdbwGvcFgKjE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chocolate-milkshake-4587581-hero-1-22c8a039103c413dafd75f4f4c39ddd4.JPG",
        "options": [
            {
                "small": "70",
                "med": "100",
                "large": "140"
            }
        ],
        "description": ""
    },
    {
        "CategoryName": "Shakes",
        "name": "Strawberry Shake",
        "img": "https://assets.epicurious.com/photos/647df8cad9749492c4d5d407/3:2/w_6795,h_4530,c_limit/StrawberryMilkshake_RECIPE_053123_3599.jpg",
        "options": [
            {
                "small": "70",
                "med": "100",
                "large": "140"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "Mango Shake",
        "img": "https://images.eatthismuch.com/img/927279_tabitharwheeler_0429baa1-435d-4689-b5f9-382a6040fe09.jpg",
        "options": [
            {
                "small": "70",
                "med": "100",
                "large": "140"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "BubbleGum Shake",
        "img": "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/1/2017/07/11110741/110717_ZufrutaUnicornShake_01.jpg",
        "options": [
            {
                "small": "100",
                "med": "150",
                "large": "200"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "Banana Shake",
        "img": "https://cowboycolostrum.com/cdn/shop/articles/banana-smoothie-recipes-759606-hero-01-d2abaa79f3204030a0ec0a8940456acc.jpg?v=1691516119",
        "options": [
            {
                "small": "70",
                "med": "100",
                "large": "140"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "Oreo Shake",
        "img": "https://www.julieseatsandtreats.com/wp-content/uploads/2021/08/How-to-Make-Oreo-Milkshake-2-of-3.jpg",
        "options": [
            {
                "small": "100",
                "med": "150",
                "large": "200"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "Kiwi Shake",
        "img": "https://www.zespri.com/content/dam/zespri/us/blog-detail/avocado-kiwi-smoothie/Kiwi_Fruit_Smoothie.jpeg",
        "options": [
            {
                "small": "70",
                "med": "100",
                "large": "140"
            }
        ],
        "description": ""
    },{
        "CategoryName": "Shakes",
        "name": "Blue Berry Shake",
        "img": "https://www.savoryexperiments.com/wp-content/uploads/2024/04/Grimace-Shake-9.jpg",
        "options": [
            {
                "small": "100",
                "med": "150",
                "large": "200"
            }
        ],
        "description": ""
    },
]

const foodCategory = [
  { id: 1, CategoryName: "Cakes" },
  { id: 2, CategoryName: "Pizza" },
  { id: 3, CategoryName: "Burger" },
  { id: 4, CategoryName: "Starter"},
  { id: 5, CategoryName: "Soup" },
  { id: 6, CategoryName: "Biryani/Rice" },
  { id: 7, CategoryName: "Shakes" },
];

router.post('/foodData', async (req, res) => {
  try {
    res.send([foodData, foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

module.exports = router;



router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    console.log("1231242343242354",req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
            console.log("1231242343242354",req.body.email)
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }

});

module.exports = router