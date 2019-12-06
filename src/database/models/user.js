import bcrypt from "bcrypt";
/* import * as argon2 from "argon2";
import randomBytes from "randombytes"; */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: ["^[a-z0-9_]+$", "i"],
            msg: "Username can only contain letters, numbers and underscores"
          },
          len: [3, 20],
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: ["^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,100}$"],
            msg:
              "Password should be between 6 to 100 characters long, at least contain one Uppercase letter, lowercase letter, number and special character"
          },
          // len: { args: [6, 100], msg: "Password length should be between 6 to 100 characters" },
          notEmpty: true
        }
      },
      salt: DataTypes.STRING,
      first_name: DataTypes.STRING(50),
      last_name: DataTypes.STRING(50),
      address: DataTypes.STRING(100),
      city: DataTypes.STRING(100),
      state: DataTypes.STRING(100),
      country: DataTypes.STRING(100),
      postal_code: DataTypes.STRING(10),
      email_verified: DataTypes.BOOLEAN,
      phone: {
        type: DataTypes.STRING(14),
        validate: { isNumeric: { msg: "Phone can only contain numbers" } }
      },
      createdAt: { type: DataTypes.DATE, field: "created_at" },
      updatedAt: { type: DataTypes.DATE, field: "updated_at" },
      deletedAt: { type: DataTypes.DATE, field: "deleted_at" }
    },
    {
      underscored: true,
      // tableName: "users",
      timestamps: true
      // paranoid: true
    }
  );

  User.beforeCreate(async user => {
    /*     const salt = randomBytes(32).toString("hex");
    user.salt = salt;
    user.password = await user.createPasswordHash(salt); */
    const salt = await bcrypt.genSalt(10);
    user.password = await user.createPasswordHash(salt);
  });

  User.prototype.createPasswordHash = async function (salt) {
    // return argon2.hash(this.password, { salt });
    return bcrypt.hash(this.password, salt);
  };

  User.prototype.verifyPassword = async function (password) {
    // return argon2.verify(this.password, password);
    return bcrypt.compare(password, this.password);
  };

  User.prototype.getSafeDataValues = function () {
    const { password, ...data } = this.dataValues;
    return data;
  };

  User.associate = function (models) {
    // associate user with token
    User.hasOne(models.EmailToken, { foreignKey: "user_id" })
  };
  return User;
};
