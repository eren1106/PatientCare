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