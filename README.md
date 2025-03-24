# Limitar peticiones

Para limitar el numero de peticiones a nuestro servidor podemos usar `express-rate-limit`:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Limitar a 100 peticiones por IP
});
app.use(limiter);
app.post('/api/login', limiter, (req, res) => {
  // Lógica de inicio de sesión
});
```