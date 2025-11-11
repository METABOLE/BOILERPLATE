import { Image, Slug } from "sanity";

export interface Sample {
  _id: string;
  name: string;
  slug: Slug;
  image: Image;
}
