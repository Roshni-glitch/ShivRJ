const mongoose=require('mongoose');
const Unit=require('../models/unit');
// Connect to MongoDB
const {connectDB}=require("../config/db.js");
connectDB();

const units = [
    {
        projectname: "Greenfield Heights",
        area: "1200 sq.ft.",
        location: "Sector 45, Gurgaon",
        price: "₹75,00,000",
        img: {
            url: "path/to/greenfield_heights.jpg",
            filename: "greenfield_heights.jpg"
        },
        
    },
    {
        projectname: "Blue Ridge Apartments",
        area: "950 sq.ft.",
        location: "Hinjewadi, Pune",
        price: "₹62,00,000",
        img: {
            url: "path/to/blue_ridge.jpg",
            filename: "blue_ridge.jpg"
        },
        
    },
    {
        projectname: "Sunshine Residency",
        area: "1500 sq.ft.",
        location: "Whitefield, Bangalore",
        price: "₹85,00,000",
        img: {
            url: "path/to/sunshine_residency.jpg",
            filename: "sunshine_residency.jpg"
        },
       
    },
    {
        projectname: "Palm Gardens",
        area: "1800 sq.ft.",
        location: "Kukatpally, Hyderabad",
        price: "₹1,05,00,000",
        img: {
            url: "path/to/palm_gardens.jpg",
            filename: "palm_gardens.jpg"
        },
        
    },
    {
        projectname: "Skyline Towers",
        area: "1400 sq.ft.",
        location: "Salt Lake, Kolkata",
        price: "₹68,00,000",
        img: {
            url: "path/to/skyline_towers.jpg",
            filename: "skyline_towers.jpg"
        },
       
    },
    {
        projectname: "Royal Orchid",
        area: "2000 sq.ft.",
        location: "Andheri, Mumbai",
        price: "₹1,50,00,000",
        img: {
            url: "path/to/royal_orchid.jpg",
            filename: "royal_orchid.jpg"
        },
        
    },
    {
        projectname: "Maple Woods",
        area: "1250 sq.ft.",
        location: "Rajajinagar, Bangalore",
        price: "₹78,00,000",
        img: {
            url: "path/to/maple_woods.jpg",
            filename: "maple_woods.jpg"
        },
       
    },
    {
        projectname: "Emerald City",
        area: "1700 sq.ft.",
        location: "Madhapur, Hyderabad",
        price: "₹92,00,000",
        img: {
            url: "path/to/emerald_city.jpg",
            filename: "emerald_city.jpg"
        },
       
    },
    {
        projectname: "Ocean Pearl",
        area: "950 sq.ft.",
        location: "Thane, Mumbai",
        price: "₹55,00,000",
        img: {
            url: "path/to/ocean_pearl.jpg",
            filename: "ocean_pearl.jpg"
        },
       
    },
    {
        projectname: "Hill View Villas",
        area: "2500 sq.ft.",
        location: "Lonavala, Pune",
        price: "₹2,00,00,000",
        img: {
            url: "path/to/hill_view_villas.jpg",
            filename: "hill_view_villas.jpg"
        },
        
    },
    {
        projectname: "Silver Springs",
        area: "1300 sq.ft.",
        location: "Rajarhat, Kolkata",
        price: "₹65,00,000",
        img: {
            url: "path/to/silver_springs.jpg",
            filename: "silver_springs.jpg"
        },
       
    },
    {
        projectname: "Garden Estate",
        area: "1900 sq.ft.",
        location: "Sector 50, Gurgaon",
        price: "₹1,20,00,000",
        img: {
            url: "path/to/garden_estate.jpg",
            filename: "garden_estate.jpg"
        },
        
    },
    {
        projectname: "Crystal Enclave",
        area: "1100 sq.ft.",
        location: "Baner, Pune",
        price: "₹58,00,000",
        img: {
            url: "path/to/crystal_enclave.jpg",
            filename: "crystal_enclave.jpg"
        },
        
    },
    {
        projectname: "Aurora Heights",
        area: "1600 sq.ft.",
        location: "Banjara Hills, Hyderabad",
        price: "₹95,00,000",
        img: {
            url: "path/to/aurora_heights.jpg",
            filename:"aurora_heights.jpg"
        }}
    ]

Unit.insertMany(units)
.then(()=>{console.log("Data inserted")})
.catch((err)=>{console.log(err)});