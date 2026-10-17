(function () {
  const videos = Array.isArray(window.PM_VIDEOS) ? window.PM_VIDEOS : [];
  const grid = document.getElementById("track-grid");
  const empty = document.getElementById("tracks-empty");
  const player = document.getElementById("player");
  const nowPlaying = document.getElementById("now-playing");

  function play(video, autoplay) {
    const params = "rel=0" + (autoplay ? "&autoplay=1" : "");
    player.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.id) + "?" + params;
    player.title = video.title + " by Philip Miller";
    nowPlaying.textContent = "Now playing: " + video.title;
    grid.querySelectorAll(".track").forEach((el) => {
      el.classList.toggle("is-playing", el.dataset.id === video.id);
    });
  }

  if (videos.length === 0) {
    grid.hidden = true;
    empty.hidden = false;
  } else {
    videos.forEach((video, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track";
      btn.dataset.id = video.id;

      const thumb = document.createElement("img");
      thumb.src = "https://i.ytimg.com/vi/" + encodeURIComponent(video.id) + "/hqdefault.jpg";
      thumb.alt = "";
      thumb.loading = "lazy";

      const num = document.createElement("span");
      num.className = "track-num";
      num.textContent = String(i + 1).padStart(2, "0");

      const title = document.createElement("span");
      title.className = "track-title";
      title.textContent = video.title;

      btn.append(thumb, num, title);
      if (video.note) {
        const note = document.createElement("span");
        note.className = "track-note";
        note.textContent = video.note;
        btn.append(note);
      }

      btn.addEventListener("click", () => {
        play(video, true);
        document.getElementById("listen").scrollIntoView({ behavior: "smooth" });
      });

      li.append(btn);
      grid.append(li);
    });
  }

  const shareBtn = document.getElementById("share-btn");
  shareBtn.addEventListener("click", async () => {
    const url = location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: "Philip Miller", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      shareBtn.textContent = "Link copied ✓";
    } catch (e) {
      shareBtn.textContent = url;
    }
  });
})();
