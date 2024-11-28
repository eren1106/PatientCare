import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_AVATAR_URL } from '@/constants';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  fallbackText?: string;
  className?: string;
  imageClassName?: string;
}

const ProfileAvatar = ({ src, alt="", size = "md", fallbackText = 'Img', className, imageClassName }: ProfileAvatarProps) => {
  const sizeToClassName = (_size: string) => {
    switch (_size) {
      case "2xs":
        return "size-4";
      case "xs":
        return "size-6";
      case "sm":
        return "size-8";
      case "md":
        return "size-10";
      case "lg":
        return "size-14";
      case "xl":
        return "size-16";
      case "2xl":
        return "size-20";
      case "3xl":
        return "size-24";
      case "4xl":
        return "size-28";
      default:
        return "size-10";
    }
  };

  return (
    <Avatar
      className={cn(sizeToClassName(size), className)}
    >
      <AvatarImage src={src || DEFAULT_AVATAR_URL} className={cn("object-cover", imageClassName)} alt={alt} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}

export default ProfileAvatar