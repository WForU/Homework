export function layout(title, content) {
    return `
    <html>
        <head>
        <title>${title}</title>
        <style>
        /* Overall layout using Flex */
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        
        /* Login Box */
        .login-box {
            padding: 16px;
            font-size: 14px;
            background-color: var(--bgColor-muted, var(--color-canvas-subtle));
            border: 1px solid var(--borderColor-muted, var(--color-border-muted));
            border-top: 0;
            border-radius: 0 0 6px 6px;
        }
        .shadowbox {
            width: 20em;
            height: 22em;
            border: 1px solid #333;
            padding: 12px 12px 12px 12px;
            background-color:#ff903b;
            border-radius: 20px;
        }
        .shadowbox-1 {
            width: 20em;
            height: 14em;
            border: 1px solid #333;
            padding: 12px 12px 12px 12px;
            background-color:#ff903b;
            border-radius: 20px;
        }
        /* Title */
        h1 {
            text-align: center; 
            font-size: 2em;
        }
        
        /* Form area */
        form {
            display: flex;
            flex-direction: column;
        }
        
        /* Input styles */
        .input {
            width: 100%;
            display: flex;
            margin: 10px 0;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #ddd;
        }
        
        /* Button area */
        .button {
            width: 100%;
            padding: 10px;
            background: #4a2cd1;
            color: #fff;
            border: none;
            border-radius: 20px;
        }
        </style>
        </head>
        <body>
        <section id="content">
             ${content}
        </section>
    </body>
    </html>
    `;
}

export function home() {
    return layout('Home',`
    <h1> Personnel Management System </h1>
    <ol>
        <li><a href="/signup">Sign Up</a></li>
        <li><a href="/login">Log In</a></li>
    </ol>
    `);
}

export function loginui() {
    return layout('Login', `
    <form action="/login" method="post">   
    <h1> Log In </h1>
    <div class="shadowbox-1">
        <label>Username</label>
        <br />
        <input class="input" type="text" name="username" placeholder="Username"/>
        <label>Password</label>
        <br />
        <input class="input" type="password" name="password" placeholder="Password"/>
        <br />
        <input class="button" type="submit" value="Log In">
    </div>
</form> 
    `);
}

export function signupui() {
    return layout('Signup', `
    <form action="/signup" method="post">
    <body>
        <h1> Sign Up </h1>
        <div class="shadowbox">
            <label>Username</label>
            <br/>
            <input class= "input" type="text" name="username" placeholder="Username"/>
            <br/>
            <label>Email</label>
            <br/>
            <input class= "input" type="email" name="email" placeholder="Email"/>
            <br/>
            <label>Password</label>
            <input class= "input" type="password" name="password" placeholder="Password"/>
            <br/>
            <input class= "button" type="submit" value="Sign Up">
        </div>
    </body>
</form>
    `);
}

export function success() {
    return layout('Success', `
    <h1>Success!</h1>
    Success<a href="/">Go to Homepage</a> or <a href="/login">Login Page</a>
    `);
}

export function fail() {
    return layout('Fail', `
    <h1>Fail!</h1>
    Fail<a href="/">Go to Homepage</a> or <a href="/login">Login Page</a>
    `);
}
