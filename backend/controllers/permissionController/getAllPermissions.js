import { query } from '../../config/db.js';

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await query(`
      SELECT id,description
      FROM permissions
      ORDER BY id;
    `);
    res.json(permissions);
  } catch (err) {
    console.error('Error fetching permissions:', err);
    res.status(500).json({ message: 'Server error while fetching permissions' });
  }
};
