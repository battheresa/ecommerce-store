import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Lato',
            'sans-serif'
        ].join(',')
    },
    palette: {
        primary: {
            light: '#000',
            main: '#000',
            dark: '#000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#fff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#000',
        },
    },
    shape: {
        borderRadius: 0
    },
    props: {
        MuiButton: {
            color: 'primary'
        },
        MuiTextField: {
            color: 'primary',
            variant: 'outlined',
            size: 'small',
            inputProps: {
                style: { 
                    fontSize: 16, 
                    fontWeight: 300, 
                    wordSpacing: 3
                }
            },
        }
    }
});
