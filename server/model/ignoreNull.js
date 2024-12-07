const path = require('path');

// Custom decorator to ignore null values
const IgnoreNull = (schema) => {
    schema.pre('save', function (next) {
      // Get the model name (e.g., 'UserModel')
      const modelName = this.constructor.modelName;
      
      // Get the path dynamically (this could be the file where the model is defined)
      let filePath = this.constructor.modelFilePath;  // Relative file path

      filePath = filePath.replace(/\\/g, '/');

      // Remove file extension
      filePath = filePath.replace(/\.[^/.]+$/, '');  // Remove the extension

      // Set the _class field with the model name and path
      this._class = filePath;
      this.modelName = modelName;
      
      const schemaPaths = this.schema.paths; // Rename to avoid conflict with the outer `schema`
  
      for (let key in this._doc) {
        // Remove fields that are explicitly set to null and have no default value in the schema
        if (this._doc[key] === null) {
          delete this._doc[key]; // Remove null fields that don't have a default
        }
  
        // Apply default values, but only if the field is undefined (not null)
        if (this._doc[key] === undefined && schemaPaths[key] && schemaPaths[key].defaultValue !== undefined) {
          this._doc[key] = schemaPaths[key].defaultValue; // Set default value if field is undefined
        }
      }
      
  
      next();
    });
    schema.pre('findOneAndUpdate', function (next) {

      const update = this.getUpdate();
      // Get the model name (e.g., 'UserModel')
      const modelName = this.model.modelName;

      // Get the path dynamically (this could be the file where the model is defined)
      let filePath = this.model.modelFilePath;  // Relative file path
      // Convert backslashes to single slashes
      filePath = filePath.replace(/\\/g, '/');

      // Remove file extension
      filePath = filePath.replace(/\.[^/.]+$/, '');  // Remove the extension
  
      if (!update._class) {
        update._class = filePath;
      }
      if (!update.modelName) {
          update.modelName = modelName;
      }

      const schemaPaths = this.schema.paths; // Rename to avoid conflict with the outer `schema`
      // Remove fields that are explicitly set to null and have no default value in the schema
      if (update.$set) {
        // Remove null values from the $set object
        for (let key in update.$set) {
            if (!update.$set[key] || (Array.isArray(update.$set[key]) && update.$set[key].length == 0) || update.$set[key] === false) {
                delete update.$set[key];
            }
            // Apply default values, but only if the field is undefined (not null)
            if (update.$set[key] === undefined && schemaPaths[key] && schemaPaths[key].defaultValue !== undefined) {
                update.$set[key] = schemaPaths[key].defaultValue; // Set default value if field is undefined
            }
        }
      } else {
          // If $set is not present, apply similar logic to the entire update object
          for (let key in update) {
              if (update[key] === null) {
                  delete update[key];
              }
              if (update[key] === undefined && schemaPaths[key] && schemaPaths[key].defaultValue !== undefined) {
                  update[key] = schemaPaths[key].defaultValue; // Set default value if field is undefined
              }
          }
      }
      
  
      next();
    });
  };
module.exports = IgnoreNull;