import Sequelize from 'sequelize';
export default function (sequelize, DataTypes) {
  const AdditionalFieldKey = sequelize.define('AdditionalFieldKey', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    additional_field_key_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    additional_field_key_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    additional_field_key_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    additional_field_key_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    additional_field_key_validation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    additional_field_key_description: {
      type: DataTypes.STRING(255),
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
    upport_module_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'upport_modules',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'additional_field_keys',
    timestamps: false,
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
        name: "additional_field_keys_upport_module_id_foreign",
        using: "BTREE",
        fields: [
          { name: "upport_module_id" },
        ]
      },
    ]
  });

  AdditionalFieldKey.associate = Models => {
    const { UpportModule, AdditionalFieldValue} = Models;

    AdditionalFieldKey.belongsTo(UpportModule, {
      foreignKey: 'upport_module_id',
      constraints: true,
      as: 'upportModule'
    });

    AdditionalFieldKey.hasMany(AdditionalFieldValue, {
      foreignKey: 'additional_field_key_id',
      constraints: true,
      as: 'additionalFieldValues'
    });
  };

  return AdditionalFieldKey;
};
