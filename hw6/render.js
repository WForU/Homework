import { Client } from "https://deno.land/x/postgres/mod.ts";

// Define the database connection
const client = new Client();
await client.connect();

// Your existing functions for SQL commands and user queries

export function layout(title, content) {
    return `
    <html>
        <head>
            <title>${title}</title>
            <style>
                /* Your existing styles */
            </style>
        </head>
        <body>
            <section id="content">
                ${content}
            </section>
        </body>
    </html>`;
}

export function home() {
    return layout('Home', `
    <h1> Management </h1>
    <ol>
        <li><a href="/signup">Sign Up</a></li>
        <li><a href="/login">Sign In</a></li>
    </ol>
    `);
}

export function loginui() {
    return layout('Login', `
    <form action="/login" method="post">   
        <h1> Sign In </h1>
        <div class="shadowbox-1">
            <!-- Your existing login form HTML -->
        </div>
    </form>
    `);
}

export function signupui() {
    return layout('Signup', `
    <form action="/signup" method="post">
        <h1> Sign Up</h1>
        <div class="shadowbox">
            <!-- Your existing signup form HTML -->
        </div>
    </form>
    `);
}

export function success() {
    return layout('Success', `
    <h1>Success!</h1>
    Success <a href="/">Return Home Page</a> or <a href="/login">Login Page</a>
    `);
}

export function fail() {
    return layout('Fail', `
    <h1>Fail!</h1>
    Failed <a href="/">Return Home Page</a> or <a href="/login">Login Page</a>
    `);
}
