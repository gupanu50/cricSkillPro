import {showMessage} from 'react-native-flash-message';

export const successMessage = ({message}: {message: string}) => {
  showMessage({
    message: message,
    type: 'success',
  });
};

export const errorMessage = ({message}: {message: string}) => {
  showMessage({
    message: message,
    type: 'danger',
  });
};

export const delay = ({func, time}: {func: () => void; time: number}) => {
  setTimeout(func, time);
};
