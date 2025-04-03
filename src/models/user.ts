import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser {
  _id: string;
  username: string;
  hashedPassword?: string;
}

interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => IUser;
  generateToken: () => string;
}

interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Promise<IUserDocument>;
}

// 스키마 정의
const userSchema: Schema<IUserDocument> = new Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String },
});

// 인스턴스 메서드
userSchema.methods.setPassword = async function (password: string) {
  const hashed = await bcrypt.hash(password, 10);
  this.hashedPassword = hashed;
};
userSchema.methods.checkPassword = async function (password: string) {
  const checkResult = await bcrypt.compare(password, this.hashedPassword);
  return checkResult;
};
userSchema.methods.serialize = function () {
  const userData: IUser = this.toJSON();
  delete userData.hashedPassword;
  return userData;
};
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.JWT_SALT,
    { expiresIn: '7d' }
  );
  return token;
};

// 정적 메서드
userSchema.statics['findByUsername'] = function (username: string) {
  return this.findOne({ username });
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
