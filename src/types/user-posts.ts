export interface UserPosts {
  user: {
    _id: string;
    publication: {
      _id: string;
      posts: {
        _id: string;
        slug: string;
        title: string;
        dateAdded: string;
        contentMarkdown: string;
      }[];
    };
    username: string;
    photo: string;
    blogHandle: string;
    publicationDomain: string;
  };
}
