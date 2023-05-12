# soulmate-nodejs-ejs-frontend
Soulmate 클라이언트 화면

- ES6모듈에는 __dirname 변수가 없어서 다음과 같이 __dirname변수를 만들어줘야한다.

```javascript
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
```