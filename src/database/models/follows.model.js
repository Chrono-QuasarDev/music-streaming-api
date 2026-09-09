import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Follows = sequelize.define("Follows", {
  id: {
    type: DataTypes.UUID,
    defaultvalue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  artist_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'artist_id'
  },
  follower_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'follower_id'
  },
  followedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'followed_at'
  }
}, {
  tableName: 'follows',
  freezeTableName: true,
  timestamps: false
});

export default Follows;