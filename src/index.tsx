import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from '@rmwc/button';
import { ThemeProvider } from '@rmwc/theme';
import { Typography } from '@rmwc/typography';
import palette from './Palette';
import { createGlobalStyle } from 'styled-components';
const GlobalStyle = createGlobalStyle`
 		body {
							background-color: ${palette.backGround};
							/* color: hotpink !important; */
						}
						.mdc-tab .mdc-tab__text-label {
							color: white;
						}
						.mdc-tab--active .mdc-tab__text-label {
							color: steelblue;
						}
`;
function App(props) {
	console.log('oops', process.env.cool);
	return (
		<ThemeProvider
			options={{
				primary: palette.primary,
				secondary: 'blue',
				primaryBg: 'pink',
				secondaryBg: 'pink',
				surface: palette.backGround,
				// background: 'magenta',
				textPrimaryOnBackground: 'white',
				// used by subtitle
				textSecondaryOnBackground: 'slategrey',
				textIconOnBackground: 'slategrey',
				textPrimaryOnLight: 'white',
				textSecondaryOnLight: 'white',
				textHintOnBackground: 'white',
				textHintOnLight: 'white'
			}}>
			<GlobalStyle />
			<Typography use="body1">hello wow nice</Typography>
			<Button label="Button" />
		</ThemeProvider>
	);
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
	// <Hello compiler="TypeScript" framework="React" />,
	// document.getElementById("root")
);
