import jwt from "jsonwebtoken";
import { getUserRolesAndPermissions } from "../services/userRolePermissionAccess.js";
import dotenv from "dotenv";

dotenv.config();

// Verify JWT token
const JWT_SECRETS = [
  process.env.JWT_SECRET_1,
  process.env.JWT_SECRET_2,
  process.env.JWT_SECRET_3,
];

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1) Decode without verification — only to read secretIndex
    const decodedUnverified = jwt.decode(token);

    if (!decodedUnverified) {
      return res.status(401).json({ message: "Token decode failed" });
    }

    const secretKey = JWT_SECRETS[decodedUnverified.secretIndex];

    if (!secretKey) {
      return res.status(403).json({ message: "Invalid secret index" });
    }

    
    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    
    req.user = {
      id: decoded.userId,   
      roles: decoded.roles,
     // raw: decoded          
    };

    next();

  } catch (err) {
    return res.status(403).json({ message: "Token verification failed" });
  }
};

//Allow only Admins or Super Admins

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles) {
    return res.status(403).json({ message: "No role info found" });
  }

  if (
    req.user.roles.includes("ADMIN") ||
    req.user.roles.includes("SUPER_ADMIN")
  ) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};

function checkPermission(permissionName) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.permissions) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Look for permission
    const hasPermission = user.permissions.find(
      (p) => p.name === permissionName && p.is_deleted === 0
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
}

async function attachPermissions(req, res, next) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }

    const { roleNames, permissions } = await getUserRolesAndPermissions(userId);

    req.user.roles = roleNames;
    req.user.permissions = permissions;

    next();
  } catch (err) {
    console.log("AttachPermissions Error:", err);
    return res.status(500).json({ message: "Error loading permissions" });
  }
}


export { verifyToken, isAdmin, checkPermission, attachPermissions };
