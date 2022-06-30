import { User } from '../../models/user.model';

export function sanitizeUser(user: User): User {
  if (!user) return null;

  user.password = undefined;

  // user.appliedJobPosts.forEach((jobPost) => {
  //   jobPost.applicants = undefined;
  //   jobPost.selectedApplicants = undefined;
  // });

  return user;
}
