import { query } from "../../config/db.js";

const getStaffUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // from auth middleware

    const staffUsers = await query(`
      SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        u.status,
        u.created_at,
        r.name AS role_name
      FROM user_staff us
      JOIN users u ON us.staff_id = u.id
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE us.user_id = ?
      ORDER BY u.created_at DESC
    `, [loggedInUserId]);

    res.status(200).json({
      message: "Fetched your staff successfully",
      data: staffUsers,
    });
  } catch (error) {
    console.error("Error fetching staff users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getStaffUsers };
