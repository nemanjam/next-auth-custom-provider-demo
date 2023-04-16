import React from 'react';
import type { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import Post, { PostProps } from 'components/Post';
import prisma from 'lib/prisma';
import { useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return {
    props: { feed },
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  const sessionData = useSession();

  return (
    <Layout>
      <div className="page">
        <div className="title">
          <h1>Public Feed</h1>
          <div>
            <label>Session data:</label>
            <pre className="code">{JSON.stringify(sessionData, null, 2)}</pre>
          </div>
        </div>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .title {
          display: flex;
          justify-content: space-between;
        }

        label {
          font-size: 12px;
          font-weight: bold;
        }

        .code {
          font-size: 12px;
          background-color: #e2e2e2;
          padding: 0.5rem;
          margin-top: 0;
        }

        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
