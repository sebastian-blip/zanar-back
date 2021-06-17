import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
	const User = sequelize.define(
		'User',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0
			},
			email: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			password: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			remember_token: {
				type: DataTypes.STRING(100),
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
			mobile: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			username: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			domain_name: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			family: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			phone: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			city: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			province: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			address: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			national_id: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			avatar: {
				type: DataTypes.STRING(100),
				allowNull: true
			},
			job_title: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			gender: {
				type: DataTypes.ENUM('Mr', 'Ms'),
				allowNull: false,
				defaultValue: 'Mr'
			},
			sms_value: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			user_type: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			lang: {
				type: DataTypes.STRING(2),
				allowNull: false,
				defaultValue: '0'
			},
			calendar_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true
				/* references: {
        model: 'calendars',
        key: 'id'
      } */
			},
			user_signature: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			user_extension: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			document: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			token_syn_calendar: {
				type: DataTypes.STRING(191),
				allowNull: true
			},
			accept_data: {
				type: DataTypes.ENUM('not_accept', 'acepta'),
				allowNull: false
			},
			companion: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			signature_digital: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			eps: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true,
				references: {
					model: 'service_provider_eps',
					key: 'id'
				}
			},
			document_type: {
				type: DataTypes.BIGINT.UNSIGNED,
				allowNull: true,
				references: {
					model: 'type_document',
					key: 'id'
				}
			},
			neighborhood: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			is_campaing: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: 1
			},
			omni_user: {
				type: DataTypes.STRING(190),
				allowNull: true
			},
			omni_pass: {
				type: DataTypes.TEXT,
				allowNull: true
			}
		},
		{
			sequelize,
			tableName: 'users',
			timestamps: true,
			underscored: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }]
				},
				/* {
        name: "users_calendar_id_foreign",
        using: "BTREE",
        fields: [
          { name: "calendar_id" },
        ]
      }, */
				{
					name: 'users_eps_foreign',
					using: 'BTREE',
					fields: [{ name: 'eps' }]
				},
				{
					name: 'users_document_type_foreign',
					using: 'BTREE',
					fields: [{ name: 'document_type' }]
				}
			]
		}
	);

	User.associate = Models => {
		const { Role, Contact, ServiceProviderEPS, TypeDocument } = Models;

		User.belongsToMany(Role, {
			through: 'role_user',
			timestamps: false,
			as: 'roles'
		});

		User.hasOne(Contact, {
			foreignKey: 'user_id',
			constraints: true,
			as: 'contact'
		});

		User.belongsTo(ServiceProviderEPS, {
			foreignKey: 'eps',
			constraints: true,
			as: 'serviceProviderEPS'
		});

		User.belongsTo(TypeDocument, {
			foreignKey: 'document_type',
			constraints: true,
			as: 'documentType'
		});
	};

	return User;
}
