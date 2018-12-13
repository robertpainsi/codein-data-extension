## Chrome Extension to download all data from a Code-In organisation

This extension downloads all meta-data from a Code-In organisation and stores it into the according json files (instances.json, tasks.json, students.json). Also all attachments will be downloaded without asking (lots of data!). Sometimes a file extension is considered unsafe and Chrome will ask if you want to `Discard` or `Keep` the file. Open all downloads to view them. I haven't found (won't implement) a better solution yet.

### HOW TO INSTALL

1. Download the latest version from https://github.com/robertpainsi/codein-data-extension/archive/master.zip
1. Extract the zip file to a folder where you want to permanently store the chrome extension.
1. Adapt the organisation id in [config.js](https://github.com/robertpainsi/codein-data-extension/blob/master/config.js#L3).
1. Go to [chrome://extensions/](chrome://extensions/)
1. Click on _Load unpacked extension_ and open the folder.
   * If you can't find the button on the top of the page, make sure that _Developer mode_ is enabled (https://developer.chrome.com/extensions/faq#faq-dev-01)

### HOW TO RUN

1. Read all infos in the README.md above before starting the Chrome Extension.
1. Make sure you adapted the organisation id in [config.js](https://github.com/robertpainsi/codein-data-extension/blob/master/config.js#L3).
1. Also be aware that the Chrome Extension will download all attachments (lots of data!).
1. Click the Code-In Chrome Extension icon located right to the address bar.
