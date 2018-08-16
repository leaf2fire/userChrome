# userChrome

[Firefox][ff] browser customizations using [`userChrome.css`][uccss] and related
resources repository.

Personally, I don't mind the default Firefox themes, but there are some things
that irked me. For me, it is the scrollbar.

### Scrollbar

The role of the scrollbar is to inform the user the approximate width and height
of an area, the approximate location of the user in that area, and whether the
user can scroll. As a user who primarily navigates by keyboard, whether the
scrollbar can actually be used to scroll is of secondary importance.

The default scrollbar does all of that, except, it is distracting. There are
times whenever I'm trying to focus on the content on the page and my focus
unintentionally drifts to the scrollbar. This has happened enough times that I'm
willing to change it for a smoother browsing experience.

As an additional role, the scrollbar needs to be noticeable when you need to
know the information provided by the roles above and be practically invisible
when you don't.

To fulfill this final role, I decided to make the scrollbar a thin translucent
rectangle. Details can be found in `css/scrollbars.uc.css`.

# Usage

### Basic

Find the *Profile Directory*. The location of this directory can be found on the
"[about:][about]profiles" page under *Root Directory* in Firefox.

Once you've found the directory, clone this repository as `chrome` in it.

```
git clone https://github.com/leaf2fire/userChrome.git chrome
```

Restart Firefox for the code to take effect.

### Updating JavaScript

In the case where the JavaScript in the repo is updated, clearing the local
cache before restarting is necessary. The directory of the local cache can be
found on the "about:profiles" page under *Local Directory*. Deleting
`startupCache` in this directory will force the browser to use the updated
JavaScript files.

### Additional CSS

You can add your own CSS style sheets under the `css` directory. The code will
automatically load all files under `css` with the `.uc.css` extension.

# Code Walkthrough

Before I walkthrough any code, I want to mention a tool that is very helpful for
debugging code and exploring existing functionality. That tool is the [Browser
Toolbox][toolbox]. I recommend enabling it if you plan to change or add new
functionality to your customizations.

Everything starts with the assumption that Firefox will load `userChrome.css`,
which it currently does at the time of writing. While it may have the ".css"
extension, `userChrome.css` is not your ordinary CSS file. It is a CSS file that
is a part of [XUL][xul] (XML User Interface Language).

```CSS
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
@namespace html url("http://www.w3.org/1999/xhtml");
```

You'll find the code above at the top of `userChrome.css`. We add these
[namespaces][namespc] so that we can properly access XUL and HTML elements,
properties, etc. You'll almost always these namespaces included in CSS used in
XUL.

After a quick look over `userChrome.css`, you might have noticed that it doesn't
ever talk about scrollbars. While it *can* talk about scrollbars, its reach is
limited to browser UI widgets, which excludes the all important one you always
see on the right. In other words, we won't be able to style scrollbars exactly
how we want directly through `userChrome.css`. Fortunately, there are ways
around this such as XBL.

[XBL][xbl] (Extensible Bindings Language) is a way to define the child elements,
properties, methods, events, and styles of a XUL widget. We can bind an element
using the [`-moz-binding`][mozbind] property whose value points to a binding
definition in an XML/XBL file.

Since we can't modify scrollbars directly in `userChrome.css`, we use XBL to run
JavaScript and load our CSS in the proper contexts and priorties. First, we need
to bind to a dummy element to bootstrap our own CSS loader. Since we don't want
to manually add more elements, we simply select an existing element that isn't
already bound to something else. We specify the id, since this is something we
only need to do once.

```CSS
keyset#mainKeyset {
  -moz-binding: url("userChrome.xml#user-chrome-js");
}
```

With this in place, we can now move on to `userChrome.xml`. We only really need
to focus on the internals in `binding`. The rest is boilerplate. First up is
`implementation`. Typically, fields, properties, and [methods][methods] go in
here. There are two special methods called `constructor` and `destructor` that
have their own tags. Inside these methods we can write our own
JavaScript. Though we don't need to declare a CDATA section in our case, we do
it anyways so we don't need to worry about incorrect parsing as much.

```JavaScript
const profileDir = OS.Constants.Path.profileDir;
const file = OS.Path.join(profileDir, 'chrome', 'userChrome.js');
const uri = OS.Path.toFileURI(file);
Services.scriptloader.loadSubScript(uri, window);
```

Since we only need to run our code once, it made sense to put it in the
constructor. The JS above uses the [OS.File][osfile] API and the [subscript
loader][jsloader] service to run our dedicated JS file. This leads us to
`userChrome.js`.

In short, `userChrome.js`

1. Identifies our `css` directory.
2. Lists the full file paths inside said directory.
3. Filters the list based on extension (i.e. '.uc.css').
4. Loads the CSS files as User Agent.

Documentation of relevent services and functions not mentioned already include
the [style sheet service][sss] and [`makeURI`][makeuri].

Finally, we made it to `css/scrollbars.uc.css`. A common property value you may
notice is [`-moz-appearance: none`][mozapp]. This ensures that we aren't using
[GTK][gtk] defined defaults. To give the space previously occupied solely by the
scrollbar to the content in a page, we add [`margin-inline-start`][margin] and
`margin-top` equal to the width and height of the scrollbar respectively.

# Related

* Custom Firefox community ([/r/FirefoxCSS][ffcss])
* Firefox source code ([GitHub][ffgit], [Mercurial][ffhg])

[ff]: https://www.mozilla.org/firefox/
[uccss]: http://kb.mozillazine.org/index.php?title=UserChrome.css
[about]: https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/The_about_protocol
[ffcss]: https://www.reddit.com/r/FirefoxCSS/
[mozbind]: https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-binding
[xbl]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XBL
[ffgit]: https://github.com/mozilla/gecko-dev
[ffhg]: https://hg.mozilla.org/
[toolbox]: https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox
[xul]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Tutorial/Introduction
[namespc]: https://developer.mozilla.org/en-US/docs/Web/CSS/@namespace
[methods]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Tutorial/Adding_Methods_to_XBL-defined_Elements
[osfile]: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm
[jsloader]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/mozIJSSubScriptLoader
[sss]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIStyleSheetService
[makeuri]: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIURI
[mozapp]: https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-appearance
[gtk]: https://wiki.archlinux.org/index.php/GTK+
[margin]: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start