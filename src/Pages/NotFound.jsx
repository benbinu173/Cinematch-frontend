import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  // Film-strip decoration — alternating holes and frames
  const stripItems = Array.from({ length: 9 }, (_, i) =>
    i % 2 === 0 ? 'hole' : 'frame'
  );

  return (
    <div className="notfound-page">
      <div className="notfound-inner">

        {/* Giant 404 — middle zero in gold */}
        <h1 className="notfound-code">
          4<span className="gold">0</span>4
        </h1>

        <div className="notfound-rule" />

        <p className="notfound-title">Scene Not Found</p>
        <p className="notfound-sub">
          Looks like this reel went missing from the archive.
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="notfound-btn">
          Back to Home
        </Link>

        {/* Decorative film strip */}
        <div className="notfound-strip" aria-hidden="true">
          {stripItems.map((type, i) =>
            type === 'hole'
              ? <div key={i} className="notfound-strip-hole" />
              : <div key={i} className="notfound-strip-frame" />
          )}
        </div>

      </div>
    </div>
  );
}

export default NotFound;