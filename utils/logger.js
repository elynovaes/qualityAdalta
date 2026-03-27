const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export const logger = {
  info: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
};