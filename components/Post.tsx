import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';

  return (
    <div>
      <Link href={`/p/${post.id}`}>
        <h2>{post.title}</h2>
      </Link>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
