import React from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const handleReseed = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/seed', {
        method: 'GET',
      });
      await Router.push('/');
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
        Reseed
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
          Reseed
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
          Reseed
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
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create" legacyBehavior>
          <button>
            <a>New post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
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
