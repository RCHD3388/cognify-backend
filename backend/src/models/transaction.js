'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
      Transaction.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Transaction.init({
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    course_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    gross_amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    payment_token: DataTypes.STRING,
    payment_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};