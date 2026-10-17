# Philip Miller fan site

An unofficial fan site for [Philip Miller](https://www.youtube.com/channel/UCAe8ekEogKjd7Gxz5CD2FOQ), an independent artist making indie pop electronic music.

It's a plain static site (HTML, CSS and a little JavaScript) with no build step.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Add songs

Edit `videos.js` and add one entry per track, newest first:

```js
window.PM_VIDEOS = [
  { id: "VIDEO_ID", title: "Song Title", note: "Optional fan note." },
];
```

The `id` is the part after `watch?v=` in the YouTube URL. While the list is empty, the player shows the channel's full uploads playlist.

## Publish with GitHub Pages

1. Merge this branch into `main`.
2. In the repo on GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.

The site will be live at `https://<your-username>.github.io/philipmiller/` within a minute or two.
