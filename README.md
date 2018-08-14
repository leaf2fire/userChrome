# userChrome

[Firefox][ff] browser customizations via [`userChrome.css`][uccss] and related
resources repository.

# Usage

### Basic

Find the *Profile Directory*. The location of this directory can be found on the
"[about:][about]profiles" page under *Root Directory* in Firefox.

Once you've found the directory, clone [this repository][this] as `chrome` in it.

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

# Related

* [/r/FirefoxCSS][ffcss]

[ff]: https://www.mozilla.org/firefox/
[uccss]: http://kb.mozillazine.org/index.php?title=UserChrome.css
[about]: https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/The_about_protocol
[this]: https://github.com/leaf2fire/userChrome.git
[ffcss]: https://www.reddit.com/r/FirefoxCSS/