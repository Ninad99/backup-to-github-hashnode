import type { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import apolloClient from '../../services/apollo-client';
import { Message } from '../../types/message';
import octokit from '../../services/octokit';
import { UserPosts } from '../../types/user-posts';

const FETCH_USER_AND_POSTS_QUERY = gql`
  query ($username: String!) {
    user(username: $username) {
      _id
      publication {
        _id
        posts {
          _id
          slug
          title
          dateAdded
          contentMarkdown
        }
      }
      username
      photo
      blogHandle
      publicationDomain
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST /api/consumer
  if (req.method === 'POST') {
    console.log('consumer received message', req.body);
    const body = req.body as Message;
    const { username, repositoryName } = body;

    const { data: userPostsData, error: postsServiceError } = await apolloClient.query<UserPosts>({
      query: FETCH_USER_AND_POSTS_QUERY,
      variables: { username: 'SandroVolpicella' },
    });

    if (postsServiceError) {
      res.status(500).json({ message: 'Error in posts service.', error: postsServiceError });
    }

    const { publication, _id: userIdFromResponse } = userPostsData.user;

    // do further validation if needed

    const { posts, _id: publicationIdFromResponse } = publication;

    for (let i = 0; i < posts.length; i++) {
      const { _id, contentMarkdown } = posts[i];

      const now = dayjs();
      console.log(`Pushing file ${i + 1}/${posts.length} at`, now.toISOString())
      const result = await octokit.rest.repos.createOrUpdateFileContents({
        content: Buffer.from(contentMarkdown).toString('base64'),
        message: `Backed up on ${now.format('DD/MM/YYYY')}`,
        owner: process.env.GITHUB_USERNAME!,
        path: `backups/${now.format('YYYY/MMM/DD')}/${_id}.md`,
        repo: repositoryName.split('/').slice(1).join(''),
        committer: {
          email: process.env.GITHUB_COMMITTER_EMAIL!,
          name: process.env.GITHUB_COMMITTER_NAME!,
        },
      });

      // send a notification
      console.log(result);
    }

    return res.status(201).json({ message: 'Backed up all posts successfully.' });
  }

  return res.status(404).json({ message: 'Not found' });
}
