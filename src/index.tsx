import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview'
import katexStyle from './katex-style';
import katexScript from './katex-script';

export interface TrustContext {
  command: string
  url: string
  protocol: string
}

export interface KatexOptions {
  displayMode?: boolean;
  output?: 'html' | 'mathml' | 'htmlAndMathml';
  leqno?: boolean;
  fleqn?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  macros?: any;
  minRuleThickness?: number;
  colorIsTextColor?: boolean;
  maxSize?: number;
  maxExpand?: number;
  strict?: boolean | string | Function;
  trust?: boolean | ((context: TrustContext) => boolean);
  globalGroup?: boolean;
}

export interface ContentOptions extends KatexOptions {
  inlineStyle?: string;
  expression?: string;
}

function getContent({ inlineStyle, expression = "", ...options }: ContentOptions) {
  return `<!DOCTYPE html>
<html>
<head>
<style>
${katexStyle}
${inlineStyle}
</style>
<script>
window.onerror = e => document.write(e);
window.onload = () => katex.render(${JSON.stringify(
    expression
  )}, document.body, ${JSON.stringify(options)});
${katexScript}
</script>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
</head>
<body>
</body>
</html>
`;
}

const defaultStyle = StyleSheet.create({
  root: {
    height: 40,
  },
});

// const defaultInlineStyle = `
// html, body {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   margin: 0;
//   padding: 0;
// }
// .katex {
//   margin: 0;
//   display: flex;
// }
// `;

export interface KatexProps extends ContentOptions {
  style: StyleProp<ViewStyle>;
  onLoad: any;
  onError: any;
}

export default function Katex({ style, onLoad, onError, ...options }: KatexProps) {
  return <AutoHeightWebView
    style={style}
    source={{ html: getContent(options) }}
    onLoad={onLoad}
    onError={onError}
    renderError={onError}
    scrollEnabled={false}
    scalesPageToFit={true}
    viewportContent={'width=device-width, user-scalable=no'}
  />;
}


Katex.defaultProps = {
  expression: '',
  displayMode: false,
  throwOnError: false,
  errorColor: '#f00',
  // inlineStyle: defaultInlineStyle,
  style: defaultStyle,
  macros: {},
  colorIsTextColor: false,
  onLoad: Boolean,
  onError: Boolean,
};
