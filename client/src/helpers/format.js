export const formattedDate = (time) => {
  let date = new Date(time);
  return date.toLocaleDateString();
};

export const getFomattedTime = (time) => {
  let date = new Date(time);
  let hr =
    date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours();
  let min =
    date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes();
  let formattedTime = `${hr}` + ':' + `${min}`;
  return formattedTime;
};

export const getTimeRangeInMilliseconds = (range) => {
  switch (range) {
    case 'last-5-mins':
      return 5 * 60 * 1000;
    case 'last-10-mins':
      return 10 * 60 * 1000;
    case 'last-15-mins':
      return 15 * 60 * 1000;
    case 'last-30-mins':
      return 30 * 60 * 1000;
    case 'last-1-hour':
      return 60 * 60 * 1000;
    default:
      return 5 * 60 * 1000; // Default to 1 hour if an invalid range
  }
};
