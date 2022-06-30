import { compare, hash } from 'bcrypt';
import { User } from '../../models/user.model';

// export async function hashUserPassword(
//   this: any,
//   next: (err?: NativeError) => void,
// ) {
//   const user = this;
//   const SALT_FACTOR = 10;

//   if (!user.isModified('password')) {
//     return next();
//   }

//   hash(user.password, SALT_FACTOR)
//     .then(hash => {
//       user.password = hash;
//     })
//     .then(() => next())
//     .catch(next);
// }

// export function hashEnterprisePassword(
//   this: any,
//   next: (err?: NativeError) => void,
// ) {
//   const enterprise = this;
//   const SALT_FACTOR = 10;

//   if (!enterprise.isModified('password')) {
//     return next();
//   }

//   hash(enterprise.password, SALT_FACTOR)
//     .then(hash => {
//       enterprise.password = hash;
//     })
//     .then(() => next())
//     .catch(next);
// }

export async function hashPassword(password: string) {
  const SALT_FACTOR = 10;
  return await hash(password, SALT_FACTOR);
}

export function comparePassword(
  customer: User,
  password: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    compare(password, customer.password, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res === true);
    });
  });
}
