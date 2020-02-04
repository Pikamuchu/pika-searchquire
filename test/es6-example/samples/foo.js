'use strict';

import { bar, rab } from './bar';
import bas from './bas';

const bigBar = () => bar().toUpperCase();

const bigRab = () => rab().toUpperCase();

const bigBas = (file) => bas(file).toUpperCase();

export {
  bigBar,
  bigRab,
  bigBas
}
