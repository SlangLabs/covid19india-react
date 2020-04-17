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

      {/* <a
        href="http://reddit.com/submit?url=https://covid19india.slanglabs.in&amp;title=India%20Covid-19%20Voice%20Enabled%20Tracker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://simplesharebuttons.com/images/somacro/reddit.png"
          alt="Reddit"
          rel="noopener noreferrer"
        />
      </a> */}

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
        href="https://wa.me/?text=Get%20trustworthy%20data%20on%20CoVid19%20at:%20https://covid19india.slanglabs.in/%20%0A%0AThis%20is%20a%20voice%20enabled%20dashboard%20where%20you%20can%20search%20for%20confirmed%20cases%20in%20any%20district%20using%20voice.%20You%20can%20do%20this%20in%20English%20or%20Hindi.%20We%20decided%20to%20voice%20enable%20it%20so%20that%20our%20parents%20and%20family%20members%20can%20also%20get%20trustworthy%20CoVid19%20as%20well%20just%20by%20asking%20for%20it.%20%0A%0AContribute%20to%20the%20CoVid19%20fight%20by%20sharing%20this%20with%20your%20friends%20and%20family,%20to%20help%20curb%20the%20fake%20news%20and%20make%20more%20people%20aware%20of%20the%20need%20of%20Social%20distancing.%20%0A%0AStay%20Safe!%20Stay%20Indoors!"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="whatsapp.png" alt="WhatsApp" rel="noopener noreferrer" />
      </a>
    </div>
  );
}

export default ShareButtons;
