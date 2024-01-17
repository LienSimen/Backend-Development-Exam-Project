class MembershipStatusService {
  constructor(db) {
      this.db = db;
      this.MembershipStatus = db.MembershipStatus;
  }

  async createStatus(data) {
      return this.MembershipStatus.create(data);
  }

  async getStatuses() {
      return this.MembershipStatus.findAll();
  }

  async updateStatus(id, data) {
      const status = await this.MembershipStatus.findByPk(id);
      if (!status) {
          throw new Error('Membership status not found');
      }
      return status.update(data);
  }

  async deleteStatus(id) {
      // Check if any user has this membership status
      const users = await this.MembershipStatus.findAll({
          include: [{
              model: this.db.User,
              where: {
                  membershipStatusId: id
              }
          }]
      });
      if (users && users.length > 0) {
          throw new Error('Cannot delete a membership status that is assigned to a user');
      } else {
          const status = await this.MembershipStatus.findByPk(id);
          if (!status) {
              throw new Error('Membership status not found');
          }
          await status.destroy();
      }
  }
}

module.exports = MembershipStatusService;