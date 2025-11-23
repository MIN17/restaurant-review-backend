import { Static, Type } from "@sinclair/typebox";

const Review = Type.Object({
  name: Type.String(),
  address: Type.String(),
  rating: Type.Integer(),
  review: Type.String(),
});

const UpdateReview = Type.Object({
  id: Type.Integer(),
  rating: Type.Integer(),
  review: Type.String(),
});

const DeleteReview = Type.Object({
  id: Type.Integer(),
});

const User = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export type ReviewType = Static<typeof Review>;
export type UpdateReviewType = Static<typeof UpdateReview>;
export type DeleteReviewType = Static<typeof DeleteReview>;
export type UserType = Static<typeof User>;
