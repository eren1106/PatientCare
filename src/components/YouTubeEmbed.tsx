import React from 'react';
import ReactPlayer from 'react-player/youtube';

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, className }) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        className={className}
        url={url}
        controls
      />
    </div>
  );
};

export default YouTubeEmbed;
