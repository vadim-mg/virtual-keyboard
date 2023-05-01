/* eslint-disable import/named */
import './assets/styles/main.scss';
import { caption } from './assets/js/caption';
import { Textarea } from './assets/js/textarea';
import { Keyboard } from './assets/js/keyboard';
import keys from './assets/keys.json';
import keysRu from './assets/keys-ru.json';

const body = document.querySelector('body');

body.append(caption);

const textarea = new Textarea(100, 10, 'text-field');
const ta = textarea.get();
body.append(ta);

const keyboard = new Keyboard(keys, keysRu, ta);
body.append(keyboard.board());

const text = document.createElement('p');
text.textContent = 'Для переключения языка: левыe ctrl + alt';
body.append(text);
