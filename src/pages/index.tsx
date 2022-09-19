import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ClientOnly from '../components/client-only';
import Posts from '../components/posts';
import octokit from '../services/octokit';
import RepositoriesDropdown from '../components/repositories-dropdown';
import { GithubGQLResponse, GithubRepo } from '../types/github-gql-response';

export type HomePageProps = {
  userRepositories: GithubRepo[];
  username: string;
};

const Home: NextPage<HomePageProps> = ({ userRepositories, username }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hashnode Assignment</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hashnode blog posts</h1>
        <RepositoriesDropdown userRepositories={userRepositories} username={username} />
        <ClientOnly>
          <Posts />
        </ClientOnly>
      </main>

      <footer className={styles.footer}>
        <a href='https://ninadsubba.in' target='_blank' rel='noopener noreferrer'>
          Presented by Ninad Subba
        </a>
      </footer>
    </div>
  );
};

export default Home;

export async function getServerSideProps(ctx: NextPageContext) {
  // const res = await octokit.rest.repos.listForUser({ username: 'Ninad99' });

  const username = process.env.GITHUB_USERNAME;

  const response = await octokit.graphql<GithubGQLResponse>(
    `
    query getRepositories {
      repositoryOwner(login: "${username}") {
        id
        repositories(first:100) {
          nodes {
            name
            nameWithOwner
            id
          }
        }
      }
    }
    `,
    {
      headers: {
        authorization: 'Bearer ' + process.env.GITHUB_PAT,
      },
    }
  );

  console.log(response);

  return {
    props: {
      userRepositories: response.repositoryOwner.repositories.nodes.filter(repo => repo.name.includes('articles-backup')),
      username,
    },
  };
}
