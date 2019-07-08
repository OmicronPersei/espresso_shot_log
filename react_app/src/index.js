import React from 'react';
import ReactDOM from 'react-dom';
import MainDisplay from './MainDisplay/MainDisplay';



ReactDOM.render(<MainDisplay />, document.getElementById('root'));

//-----below is test code and should be removed before being merged.-----
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);