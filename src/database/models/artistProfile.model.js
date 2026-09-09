import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const ArtistProfile = sequelize.define("ArtistProfile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  bio: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  profilePictureUrl: {
    type: DataTypes.STRING(2048),
    allowNull: false,
    field: 'profile_picture_url',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  }
}, 
{
  tableName: 'artist_profiles',
  freezeTableName: true,
  timestamps: false
});

export default ArtistProfile;