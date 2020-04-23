import { lightGreen,red,grey, blue } from '@material-ui/core/colors';

export const ThemeTypes = {
	DARK: 'dark',
	LIGHT: 'light'
}

export const availableThemes = {
	[ThemeTypes.DARK]: {
		palette: {
			text:{
				primary:lightGreen[100],
				secondary:lightGreen[400]
			},
			primary: {
				main: grey[400],					
			},
			secondary:{
				main: grey[400],
			},
			error: {
				main: red.A400,
			},
			background:{
				default: grey[700],
				paper:grey[600]				
			},			
		},		
	},
	[ThemeTypes.LIGHT]:{
		palette: {
			primary: {
				main: '#283E4A',
			},
			secondary:{
				main: '#19857b',
			},
			error: {
				main: red.A400,
			},
			background:{
				default: '#F5F5F5',
				primary:'#F5F5F5',
				paper:'#F5F5F5'
			}
		}
	}
}
const defaultTheme = {
	// typography: {
	// 	"fontFamily": "\"Consolas\", \"Helvetica\", \"Arial\", sans-serif",
	// 	"fontSize": 16,
	// 	"fontWeightLight": 300,
	// 	"fontWeightRegular": 400,
	// 	"fontWeightMedium": 500					
	//    }	
  };
  

export const lightTheme = { ...defaultTheme, ...availableThemes[ThemeTypes.LIGHT] }
export const darkTheme = { ...defaultTheme, ...availableThemes[ThemeTypes.DARK] }
