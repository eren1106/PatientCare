import { USER_SESSION_KEY } from '@/constants';
import { UserRole } from '@/enums';

export * from './axiosConfig';

export const refreshPage = (sec?: number) => {
  // refresh page after certain seconds
  setTimeout(() => {
    window.location.reload();
  }, sec ? (sec * 100) : 1500);
}

export const formatDate = (date: string | Date | undefined): string => {
  if(!date) return "No date found!";
  return new Date(date).toLocaleDateString();
}

export const formatTime = (time: Date | string) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const timeAgo = (date: Date): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.name}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export const convertCamelCaseToTitle = (input: string): string => {
  // Split the string at each uppercase letter
  const words = input.replace(/([A-Z])/g, ' $1').trim();

  // Capitalize the first letter of the first word
  const result = words.charAt(0).toUpperCase() + words.slice(1);

  return result;
}

export const checkIsToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function convertEnumToTitleCase(input: string): string {
  return input
      .toLowerCase()                 // Convert the string to lowercase
      .split('_')                    // Split by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ');                    // Join the words with a space
}
