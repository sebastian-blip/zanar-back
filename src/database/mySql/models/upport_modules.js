import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  const UpportModule = sequelize.define('UpportModule', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    upport_table_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_model_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_model_permission: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_model_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_model_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_model_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_controller_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_lang_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upport_lang_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    upport_show_report: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    upport_model_filter_array: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upport_model_search_array: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upport_model_import_array: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'upport_modules',
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
    ]
  });

  UpportModule.associate = Models => {
    const { AdditionalFieldKey } = Models;

    UpportModule.hasMany(AdditionalFieldKey, {
      foreignKey: 'upport_module_id',
      constraints: true,
      as: 'additionalFieldKeys'
    });
  };

  return UpportModule;
};
