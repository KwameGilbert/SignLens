import db from '../config/db.js';

const UserModel = {
  async findByEmail(email) {
    return db('users').where({ email }).first();
  },

  async findById(id) {
    return db('users').where({ id }).first();
  },

  async create({ email, passwordHash, firstName, lastName, role = 'user', status = 'active', profile = null }) {
    const [newUser] = await db('users')
      .insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role,
        status,
        profile,
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'role', 'status', 'profile', 'created_at', 'updated_at']);
    
    return newUser;
  },

  async listAll() {
    return db('users')
      .select('id', 'email', 'first_name', 'last_name', 'role', 'status', 'profile', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
  }
};

export default UserModel;
