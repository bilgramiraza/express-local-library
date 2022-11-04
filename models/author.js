const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
  if (!this.first_name || !this.family_name) return '';

  let fullname = `${this.family_name}, ${this.first_name}`;
  return fullname;
});

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function () {
  if (!this.date_of_birth) return '';
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_FULL);
});

AuthorSchema.virtual('date_of_death_formatted').get(function () {
  if (!this.date_of_death) return '';
  return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_FULL);
});

module.exports = mongoose.model('Author', AuthorSchema);
