const ensureAuthenticated = require("../Middlewares/Auth");
const router = require("express").Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("---- logged in user detail ---", req.user);
  res.status(200).json([
    {
      name: "Dr Mohammad Zadran",
      Department: "Cardiology",
    },
    {
      name: "Dr Seikh Mohammad Ali",
      Department: "Neurology",
    },
    {
      name: "Dr Ayesha Khan",
      Department: "Pediatrics",
    },
    {
      name: "Dr Rahul Verma",
      Department: "Orthopedics",
    },
    {
      name: "Dr Sunita ",
      Department: "Dermatology",
    }
  ]);
});

module.exports = router;
