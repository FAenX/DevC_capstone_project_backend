import express from "express";
import userControllers from "../controllers/users";

import auth from "../middleware/auth";

const router = express.Router();


// user routes
router.post("/create-user", auth.isStaff, userControllers.signUp);
router.post("/signin", userControllers.login);
// router.get("/", auth.isStaff, userControllers.viewAllUsers);
// router.patch("/:id", userControllers.modifyUser);
// router.delete("/:id", auth.verifyToken, userControllers.deleteUser);


export default router;
