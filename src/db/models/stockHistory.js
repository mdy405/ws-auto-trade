import Sequelize from "sequelize";

export const stockHistory = (sequelize) => {
  const StockHistory = sequelize.define("stockHistory", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
    },
    open: {
      type: Sequelize.DECIMAL,
    },
    close: {
      type: Sequelize.DECIMAL,
    },
    volume: {
      type: Sequelize.INTEGER,
    },
    timestamp: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  });
  return StockHistory;
};
