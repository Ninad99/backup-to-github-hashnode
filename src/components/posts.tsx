import React from 'react';
import { User, useUserQuery } from '../generated/graphql';
import Card from './card';

const Posts: React.FC = () => {
  const { data, loading, error } = useUserQuery({ variables: { username: 'SandroVolpicella' } });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const posts = data?.user?.publication?.posts;
  const { username, photo, publicationDomain } = data?.user as User;

  return (
    <div className='grid grid-cols-2 gap-4 py-12'>
      {posts &&
        posts.map(post => (
          <Card
            key={post?._id}
            author={{ username: username as string, photo: photo as string }}
            date={post?.dateAdded || '...'}
            snippet={post?.brief || '...'}
            title={post?.title || '...'}
            readMoreUrl={'https://' + publicationDomain + '/' + (post?.slug || '')}
          />
        ))}
    </div>
  );
};

export default Posts;
