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