import { cn } from '@/lib/utils';
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
        className={cn('react-player', className)}
        url={url}
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default YouTubeEmbed;
