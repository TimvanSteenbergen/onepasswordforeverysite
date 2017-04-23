# One password for every site
Using this extension you only need one password to log into any website!<br/> 
Tired of having to remember a lot of passwords? Yes?<br/>
Uncomfortable with trusting any passwordmanagement-tool with all your userids and passwords? Yes?<br/>
Looking for the simplest and safest solution? You found it!

This Chrome-extension allows you to use one password for every site! All you have to remember is one simple password, that really does not need to be a complex or long one.
<h2>No password stored anywhere</h2>
This extension will not store any password at all. Not locally on your pc, not in any cookie, not anywhere online. 
Of course your password does get stored in the usual way: at the site where you are logging into. But that is of no concern to this extension.
 Never will this extension request any of your passwords, simply because it does not need to.

<h2>100% Open source</h2>
<p>Every bit of code is out in the open, for everyone to see. No hidden functions or tricks possible. 
This results in extra security because fully opensource code can get monitored by anyone. This has several security advantages:
<ul>
 <li>You can follow your password along every step of the way.</li>
 <li>Every single line of code is visible to you. No hidden functions. No surprises.</li>
 <li>Code is publicly available and every change to it is traceble to the programmer</li>
</ul>
</p>

<h2>Only Client-side code</h2>
<p>The only code that is executed is in javascript on your own computer. No on-line services, no cloud-applications. No
    one gets any bit of information about your one-and-only password.</p>

<h2>What does gets stored? And where?</h2>
This extension can store per domainname: your userid, a <a href="#" title="A salt can be used for extra security. Using a salt prevents the hased value to get found in some rainbowtable">salt</a>, a sequencenumber and a remark. These are all optional.</br>
Also per domain these informational fields: used at, a remark.</br>
This data is stored in the webappsstore.sqlite file in the profile folder of your browser. Usually this file only
 available with administrator rights, which is why it is also showed in the extension itself

<h2>Salted Security</h2>
<p>Your password gets hashed using the domainname, your userid for this particular site, a sequencenumber, your password and a salt for this domain.
    Without the salt it would be possible to take the generated password for this site-you-re-trying-to-login-to and
    find out what your-only-password is. Either by bruteforcing or via rainbowtables.
    The salt is unknown to the site-you-re-trying-to-login-to un thus makes that impossible.</p>
</p>
<h2>Installation ...</h2>
<h3>... in your Chrome-browser</h3>
<p>Once we have this added to Chrome's webstore...: Easiest way is to add this extension to your Chrome browser's extensions.
 <ul>
  <li>go to settings</li>
  <li>click on extensions</li>
  <li>at the bottom click on "Add more extensions". This will bring you to <a href="https://chrome.google.com/webstore/category/extensions?hl=nl">the Chrome webstore</a></li>
 </ul>
</p>
<p>Don't trust the ChromeWebStore? Then download this code to any directory on your local pc and follow these steps:
 <ul>
  <li>go to settings</li>
  <li>click on extensions</li>
  <li>check the tickbox next to "Developers modus"</li>
  <li>click on "Load extracted extensions"</li>
  <li>select the directory where you have placed the downloaded code and click "OK"</li>
 </ul>
 The OnePasswordForEverySite-extension should now be added to the top of your list of extensions.<br/>
 The icon for this extension should show up at your extension-icons tray, usually next to your url-bar.
</p>