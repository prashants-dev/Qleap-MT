import express from "express";
import { register, login } from "../controllers/authController.js";
import { getAllUsers, updateUser,deleteUser,createUser } from "../controllers/userController.js";
import {
  verifyToken,
  isAdmin,
  checkPermission,
  attachPermissions,
} from "../middlewares/authMiddleware.js";
//import { canViewAllUsers } from "../middlewares/permissions/getAllUsersPermission.js";
import { getAllPermissions } from "../controllers/permissionController/getAllPermissions.js";
import { managePermissions } from "../controllers/permissionController/managePermission.js";
import { updateRolePermission } from "../controllers/permissionController/updatePermissions.js";
import { getStaffUsers } from "../controllers/staff/StaffUsers.js";
import {
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff/createStaff.js";
import {
  getRoles,
  updateRole,
  createRole,
  deleteRole,
} from "../controllers/roleManagement.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/users",
  verifyToken,
  attachPermissions,
  checkPermission("getAllUsers"),
  isAdmin,
  getAllUsers
);
router.put(
  "/users/:id",
  verifyToken,
  attachPermissions,
  checkPermission("updateUser"),
  isAdmin,
  updateUser
);
router.delete(
  "/users/:id",
  verifyToken,
  attachPermissions,
  checkPermission("deleteUser"),
  isAdmin,
  deleteUser
);
router.post(
  "/users",
  verifyToken,
  attachPermissions,
  checkPermission("createUser"),
  isAdmin,
  createUser
);
router.get("/permissions", verifyToken, isAdmin, getAllPermissions);
router.get("/managePermissions", verifyToken, isAdmin, managePermissions);
router.put("/permissions/update", verifyToken, isAdmin, updateRolePermission);

router.get("/staff", verifyToken, getStaffUsers);
router.post(
  "/staff/create",
  verifyToken,
  attachPermissions,
  checkPermission("createStaff"),
  createStaff
);
router.put(
  "/staff/:id",
  verifyToken,
  attachPermissions,
  checkPermission("updateStaff"),
  updateStaff
);
router.delete(
  "/staff/:id",
  verifyToken,
  attachPermissions,
  checkPermission("deleteStaff"),
  deleteStaff
);

router.get("/roles", verifyToken, getRoles);
router.post("/roles", verifyToken, isAdmin, createRole);
router.put("/roles/:id", verifyToken, isAdmin, updateRole);
router.delete("/roles/:id", verifyToken, isAdmin, deleteRole);

export default router;
