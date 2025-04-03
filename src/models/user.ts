import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드
userSchema.methods.setPassword = async function (newPassword: string) {
  this.hashedPassword = await bcrypt.hash(newPassword, 10);
};
userSchema.methods.checkPassword = async function (passwordToCheck: string) {
  return bcrypt.compare(passwordToCheck, this.hashedPassword);
};

// 정적 메서드
userSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

const User = mongoose.model('User', userSchema);

export default User;
