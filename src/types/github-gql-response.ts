export interface GithubGQLResponse {
  repositoryOwner: {
    id: string;
    repositories: {
      nodes: GithubRepo[]
    }
  }
}

export interface GithubRepo {
  name: string;
  nameWithOwner: string;
  id: string;
}