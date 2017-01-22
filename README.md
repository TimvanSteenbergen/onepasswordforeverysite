# One password for every site
Tired of having to remember a lot of passwords? Yes?
Uncomfortable with trusting any passwordmanagement-tool with all your userids and passwords? Yes?
Looking for the simplest and safest solution? You found it!

This Chrome-extension allows you to use one password for every site! All you have to remember is one simple password. Yes, it does not even have to be a complex or long one.

<h2>Fully Open source</h2>
<p>Extra security because this code is fully opensource. This has several security advantages:
<ul>
    <li>You can follow your password along every step of the way.</li>
    <li>Every single line of code is visible to you. No hidden functions. No surprises.</li>
    <li>Code is publicly available and every change to it is traceble to the programmer</li>
</ul>
</p>

<h2>Only Client-side code</h2>
<p>The only code that is executed is in javascript on your own computer. No on-line services, no cloud-applications. No
    one gets any bit of information about your password.</p>

<h2>Salted Security</h2>
<p>Your password gets hashed using the domainname, your userid for this particular site, your password and a salt for
    this domain.
    Without the salt it would be possible to take the generated password for this site-you-re-trying-to-login-to and
    find out what your-only-password is. Either by bruteforcing or via rainbowtables.
    The salt is unknown to the site-you-re-trying-to-login-to un thus makes that impossible.</p>
</p>
 