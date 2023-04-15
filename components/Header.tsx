import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const [isReseeding, setIsReseeding] = useState(false);

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const handleReseed = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setIsReseeding(true);
      await fetch('/api/seed', {
        method: 'POST',
      });
      setIsReseeding(false);
      signOut();
    } catch (error) {
      console.error(error);
    }
  };

  let left = (
    <div className="left">
      <Link href="/" legacyBehavior>
        <a data-active={isActive('/')}>Feed</a>
      </Link>
      <a href="#" onClick={handleReseed}>
        {isReseeding ? 'Seeding...' : 'Reseed'}
      </a>
      <style jsx>{`
        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active='true'] {
          text-decoration: underline;
          font-weight: bold;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/" legacyBehavior>
          <a data-active={isActive('/')}>Feed</a>
        </Link>
        <a href="#" onClick={handleReseed}>
          {isReseeding ? 'Seeding...' : 'Reseed'}
        </a>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .left a[data-active='true'] {
            text-decoration: underline;
            font-weight: bold;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin" legacyBehavior>
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/" legacyBehavior>
          <a data-active={isActive('/')}>Feed</a>
        </Link>
        <Link href="/drafts" legacyBehavior>
          <a data-active={isActive('/drafts')}>My drafts</a>
        </Link>
        <a href="#" onClick={handleReseed}>
          {isReseeding ? 'Seeding...' : 'Reseed'}
        </a>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .left a[data-active='true'] {
            text-decoration: underline;
            font-weight: bold;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <div className="user-info">
          <div>
            <label>Name:</label>
            <span>{session.user.name}</span>
          </div>
          <div>
            <label>Email:</label>
            <span>({session.user.email})</span>
          </div>
        </div>
        <Link href="/create" legacyBehavior>
          <button>
            <a>New post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
        <style jsx>{`
          .user-info {
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            padding-right: 1rem;
          }

          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          label {
            display: inline;
            font-size: 12px;
            font-weight: bold;
            margin-right: 5px;
          }

          span {
            font-size: 12px;
            margin: 0;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
            display: flex;
            align-items: center;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
