import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Dark blue
    },
    secondary: {
      main: '#90caf9', // Light blue
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '2rem',
          textAlign: 'center',
          padding: '.75rem 3rem',
          backgroundColor: '#7cc4e3',
          border: '1px #7cc4e3 solid',
          borderRadius: '5px',
          color: 'white',
          fontSize: '17px',
          fontWeight: 500,
          fontFamily: "'Montserrat', sans-serif",
          '&:hover': {
            // opacity: 0.7,
            transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
          },
          '&:active': {
            // opacity: 0.9,
          },
        },
      },
    },
  },
});

export default theme;