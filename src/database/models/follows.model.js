import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Follows = sequelize.define("Follows", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'artist_id'
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'follower_id'
  },
  followedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'followed_at'
  }
}, {
  tableName: 'follows',
  freezeTableName: true,
  timestamps: false
});

export default Follows;