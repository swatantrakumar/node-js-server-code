// Custom decorator to ignore null values
const IgnoreNull = (schema) => {
    schema.pre('save', function (next) {
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
  };
module.exports = IgnoreNull;