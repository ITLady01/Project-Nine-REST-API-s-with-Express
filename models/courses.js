'use strict';
module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { 
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    estimatedTime: {
      type:DataTypes.STRING,
      allowNull:true
    },
    materialsNeeded: { 
      type: DataTypes.STRING,
      allowNull:true,
    },
  });
  
  Courses.associate = function(models) {
    Courses.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
    // associations can be defined here
  };
  return Courses;
};