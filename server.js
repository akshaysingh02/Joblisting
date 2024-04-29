require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const jobRoute = require("./routes/job")


const app = express();
app.use(express.json())


app.get("/health", (req, res) => {
  console.log("I'm in the health api");
  res.json({
    server: "Backend job listing api service",
    status: "active",
    time: new Date(),
  });
});

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/job",jobRoute);

app.use((error,req,res,next)=>{
  console.log(error)
  res.status(500).json({errorMessage: "Something went wrong"})
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Db connected");
  })
  .catch((error) => {
    console.log("Failed to connect DB", error);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server listening at port: ${PORT}`);
});
