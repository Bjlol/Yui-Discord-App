const Sequelize = require('sequelize');

module.exports = {
  guildId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  welcomeEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  welcomeChannel: {
    type: Sequelize.STRING,
  },
  welcomeMessage: {
    type: Sequelize.STRING,
  },
  autoroleEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  autoroleId: {
    type: Sequelize.STRING,
  },
  verifyEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  verifyRoleId: {
    type: Sequelize.BOOLEAN,
  },
}