export * from './axiosConfig';

export const refreshPage = (sec?: number) => {
  // refresh page after certain seconds
  setTimeout(() => {
    window.location.reload();
  }, sec ? (sec * 100) : 1500);
}