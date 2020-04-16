import React from 'react';

function ShareButtons() {
  return (
    <div className="ShareButtons">
      <a
        href="http://www.facebook.com/sharer.php?u=https://covid19india.slanglabs.in"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://simplesharebuttons.com/images/somacro/facebook.png"
          alt="Facebook"
          rel="noopener noreferrer"
        />
      </a>

      <a
        href="http://www.linkedin.com/shareArticle?mini=true&amp;url=https://covid19india.slanglabs.in"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://simplesharebuttons.com/images/somacro/linkedin.png"
          alt="LinkedIn"
          rel="noopener noreferrer"
        />
      </a>

      <a
        href="http://reddit.com/submit?url=https://covid19india.slanglabs.in&amp;title=India%20Covid-19%20Voice%20Enabled%20Tracker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://simplesharebuttons.com/images/somacro/reddit.png"
          alt="Reddit"
          rel="noopener noreferrer"
        />
      </a>

      <a
        href="https://twitter.com/share?url=https://covid19india.slanglabs.in&amp;text=India%20Covid-19%20Voice%20Enabled%20Tracker&amp;hashtags=slanglabs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://simplesharebuttons.com/images/somacro/twitter.png"
          alt="Twitter"
          rel="noopener noreferrer"
        />
      </a>
      <a
        href="https://wa.me/?text=India%20Covid-19%20Voice%20Enabled%20Tracker%0A%0Ahttps://covid19india.slanglabs.in"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="whatsapp.png" alt="WhatsApp" rel="noopener noreferrer" />
      </a>
    </div>
  );
}

export default ShareButtons;
