// import bcrypt from "bcrypt";
import * as argon2 from "argon2";
import randomBytes from "randombytes";

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
          is: ["^[a-z0-9_]+$", "i"],
          msg: "Username can only contain letters, numbers and underscores",
          len: [3, 20],
          noEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          noEmpty: true,
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
          noEmpty: true
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
      phone: {
        type: DataTypes.STRING(14),
        validate: { isNumeric: { msg: "Phone can only contain numbers" } }
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      underscored: true,
      tableName: "user"
    }
  );

  User.beforeCreate(async user => {
    const salt = randomBytes(32).toString("hex");
    user.salt = salt;
    user.password = await user.createPasswordHash(salt);
  });

  User.prototype.createPasswordHash = async function createPasswordHash(salt) {
    return argon2.hash(this.password, { salt });
  };

  User.prototype.verifyPassword = async function verifyPassword(password) {
    return argon2.verify(this.password, password);
  };

  User.prototype.getSafeDataValues = function getSafeDataValues() {
    const { password, ...data } = this.dataValues;
    return data;
  };

  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
