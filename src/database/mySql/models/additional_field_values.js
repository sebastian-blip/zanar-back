import Sequelize from 'sequelize';
export default function (sequelize, DataTypes) {
  const AdditionalFieldValue = sequelize.define('AdditionalFieldValue', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    additional_field_values: {
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
    additional_field_key_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'additional_field_keys',
        key: 'id'
      }
    },
    account_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      /* references: {
        model: 'accounts',
        key: 'id'
      } */
    },
    contact_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id'
      }
    },
    lead_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      /* references: {
        model: 'leads',
        key: 'id'
      } */
    },
    inventory_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      /* references: {
        model: 'inventories',
        key: 'id'
      } */
    },
    opportunity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      /* references: {
        model: 'opportunities',
        key: 'id'
      } */
    },
    binnacle_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      /* references: {
        model: 'binnacle_calls',
        key: 'id'
      } */
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'additional_field_values',
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
        name: "additional_field_values_additional_field_key_id_foreign",
        using: "BTREE",
        fields: [
          { name: "additional_field_key_id" },
        ]
      },
      /* {
        name: "additional_field_values_account_id_foreign",
        using: "BTREE",
        fields: [
          { name: "account_id" },
        ]
      }, */
      {
        name: "additional_field_values_contact_id_foreign",
        using: "BTREE",
        fields: [
          { name: "contact_id" },
        ]
      },
      /* {
        name: "additional_field_values_lead_id_foreign",
        using: "BTREE",
        fields: [
          { name: "lead_id" },
        ]
      },
      {
        name: "additional_field_values_inventory_id_foreign",
        using: "BTREE",
        fields: [
          { name: "inventory_id" },
        ]
      },
      {
        name: "additional_field_values_opportunity_id_foreign",
        using: "BTREE",
        fields: [
          { name: "opportunity_id" },
        ]
      },
      {
        name: "additional_field_values_binnacle_id_foreign",
        using: "BTREE",
        fields: [
          { name: "binnacle_id" },
        ]
      }, */
    ]
  });

  AdditionalFieldValue.associate = Models => {
    const { AdditionalFieldKey, Contact } = Models;

    AdditionalFieldValue.belongsTo(AdditionalFieldKey, {
      foreignKey: 'additional_field_key_id',
      constraints: true,
      as: 'additionalFieldKeys'
    });

    
    AdditionalFieldValue.belongsTo(Contact, {
      foreignKey: 'contact_id',
      constraints: true,
      as: 'contact'
    });
  };

  return AdditionalFieldValue;
};
