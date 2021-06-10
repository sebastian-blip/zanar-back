const Sequelize = require('sequelize');
export default function(sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: "roles_name_unique"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    display_name: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    guard_name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: "web"
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "roles_name_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });

  Role.associate = Models => {
    const { User } = Models;

    Role.belongsToMany(User, {
      through: 'role_user',
      as: 'users'
    });
  };
  return Role;
};
