import Sequelize from 'sequelize';
export default function (sequelize, DataTypes) {
  const Contact = sequelize.define('Contact', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    account_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_purchased: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_color_badge_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'customer_color_badges',
        key: 'id'
      }
    },
    technician_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'technicians',
        key: 'id'
      }
    },
    opportunity_source_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'opportunity_sources',
        key: 'id'
      }
    },
    is_doctor: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'contacts',
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
        name: "contacts_account_id_foreign",
        using: "BTREE",
        fields: [
          { name: "account_id" },
        ]
      },
      {
        name: "contacts_user_id_foreign",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "contacts_customer_color_badge_id_foreign",
        using: "BTREE",
        fields: [
          { name: "customer_color_badge_id" },
        ]
      },
      {
        name: "contacts_technician_id_foreign",
        using: "BTREE",
        fields: [
          { name: "technician_id" },
        ]
      },
      {
        name: "contacts_opportunity_source_id_foreign",
        using: "BTREE",
        fields: [
          { name: "opportunity_source_id" },
        ]
      },
    ]
  });

  Contact.associate = Models => {
    const { User, AdditionalFieldValue } = Models;

    Contact.belongsTo(User, {
      foreignKey: 'user_id',
      constraints: true,
      as: 'user'
    });

    Contact.hasMany(AdditionalFieldValue, {
      foreignKey: 'contact_id',
      constraints: true,
      as: 'additionalFieldValues'
    });
  };
  return Contact;
};
