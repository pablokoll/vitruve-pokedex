import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { bearerAuth } from 'hono/bearer-auth';
import { sign, verify } from 'hono/jwt';
import { createUser, getUserByUsername } from '../database/db.js';

type Bindings = {
    JWT_SECRET: string;
};

type Variables = {
    username: string;
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

app.post('/auth/signup', async (c) => {
    const { username, password } = await c.req.json();

    if (!username || !password || password.length < 8) {
        return c.json({ error: 'Invalid username or password format' }, 400);
    }
    const user = await getUserByUsername(username)
    if (user) {
        return c.json({ error: 'User already exists' }, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await createUser(username, hashedPassword)
    return c.json({ message: 'User created' });
});

app.post('/auth/signin', async (c) => {
    const { username, password } = await c.req.json();
    const user = await getUserByUsername(username)

    if (!(user && await bcrypt.compare(password, user.password))) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const { JWT_SECRET } = env(c, 'node');

    const accessToken = await sign({ username }, JWT_SECRET);

    return c.json({ accessToken });
});

app.use(
    '/auth/*',
    bearerAuth({
      verifyToken: async (token, c) => {
        const { JWT_SECRET } = env(c, 'node')
        const verified = await verify(token, JWT_SECRET)
        if(verified?.username) {
            c.set('username', verified.username)
            return true
        }
        return false
    },
    })  
)

app.get('/auth/protected', (c) => {
    const user = c.get('username');
    console.log('username', user)
    return c.json({ message: 'Access granted', user });
});



export default app;
