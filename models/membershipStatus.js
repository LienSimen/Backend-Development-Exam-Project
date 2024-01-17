module.exports = (sequelize, DataTypes) => {
    const MembershipStatus = sequelize.define('MembershipStatus', {
        membershipStatusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        statusName: DataTypes.STRING,
        discount: DataTypes.INTEGER
    });

    MembershipStatus.associate = function(models) {
        MembershipStatus.hasMany(models.User, {
            foreignKey: 'membershipStatusId'
        });
    };

    return MembershipStatus;
};