class RoleService {
  constructor(db) {
      this.Role = db.Role;
  }

  async getAllRoles() {
      return await this.Role.findAll();
  }
}

module.exports = RoleService;