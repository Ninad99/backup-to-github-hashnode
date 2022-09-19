import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon, RadioIcon } from '@heroicons/react/20/solid';
import { GithubRepo } from '../types/github-gql-response';

export type RepositoriesDropdownProps = {
  userRepositories: GithubRepo[];
  username: string;
};

const RepositoriesDropdown: React.FC<RepositoriesDropdownProps> = ({ userRepositories, username }) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelection = (selection: GithubRepo) => {
    console.log(selection);
    setSelection(selection.nameWithOwner);
  };

  const handleBackupRequest = async () => {
    setLoading(true);
    // console.log(process.env.NEXT_PUBLIC_TARGET_API_ENDPOINT);
    const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : process.env.NEXT_PUBLIC_BASE_URL;
    await fetch(`${baseURL}/api/backup`, {
      method: 'POST',
      body: JSON.stringify({
        repositoryName: selection,
        username,
      }),
    });
    setLoading(false);
  };

  return (
    <section className='flex justify-center pt-5'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            {selection === null ? 'Select a repository to back up posts' : selection}
            <ChevronDownIcon className='ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100' aria-hidden='true' />
          </Menu.Button>

          <button
            className='inline-flex w-full justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
            onClick={handleBackupRequest}
            disabled={selection === null}>
            {loading ? 'Loading...' : 'Backup to Github'}
          </button>
        </div>
        <Transition
          as={React.Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {userRepositories.map(repo => (
              <div key={repo.id} className='px-1 py-1 '>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleSelection(repo)}
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      {active ? (
                        <CheckIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                      ) : (
                        <RadioIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                      )}
                      {repo.nameWithOwner}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
};

export default RepositoriesDropdown;
