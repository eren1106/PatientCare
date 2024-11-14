import { cn } from '@/lib/utils';
import ReactPlayer from 'react-player/youtube';

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  wrapperClassName?: string;
}

const YouTubeEmbed = ({ url, className, wrapperClassName }: YouTubeEmbedProps) => {
  return (
    <div className={cn("player-wrapper", wrapperClassName)}>
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
