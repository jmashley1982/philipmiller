(function () {
  const videos = Array.isArray(window.PM_VIDEOS) ? window.PM_VIDEOS : [];
  const grid = document.getElementById("track-grid");
  const empty = document.getElementById("tracks-empty");
  const player = document.getElementById("player");
  const nowPlaying = document.getElementById("now-playing");
  const toastEl = document.getElementById("toast");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tape label colours, cycled across the track cards.
  const TAPE_COLOURS = ["#ff2fa0", "#ffd25c", "#4fe3ff", "#3dff9e", "#b77bff", "#ff7a3d"];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
  }

  // Load the video without autoplay: YouTube only reliably counts a view
  // when the visitor presses play in the player themselves.
  function load(video) {
    player.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(video.id) + "?rel=0";
    player.title = video.title + " by Philip Miller";
    nowPlaying.textContent = "Loaded: " + video.title + " · press play";
    grid.querySelectorAll(".track").forEach((btn) => {
      btn.classList.toggle("is-playing", btn.dataset.id === video.id);
    });
  }

  if (videos.length === 0) {
    grid.hidden = true;
    empty.hidden = false;
  } else {
    videos.forEach((video, i) => {
      const li = el("li", "tape");
      li.style.setProperty("--tape", TAPE_COLOURS[i % TAPE_COLOURS.length]);
      li.style.setProperty("--tilt", (i % 2 ? 1 : -1) * (1 + (i % 3)) + "deg");

      const btn = el("button", "track");
      btn.type = "button";
      btn.dataset.id = video.id;

      const screen = el("span", "tape-screen");
      const thumb = el("img");
      thumb.src = "https://i.ytimg.com/vi/" + encodeURIComponent(video.id) + "/hqdefault.jpg";
      thumb.alt = "";
      thumb.loading = "lazy";
      screen.append(thumb, el("span", "tape-play", "▶"));
      if (video.tag) screen.append(el("span", "sticker", video.tag));

      const label = el("span", "tape-label");
      label.append(
        el("span", "track-num", "SIDE A · " + String(i + 1).padStart(2, "0")),
        el("span", "track-title", video.title)
      );
      if (video.note) label.append(el("span", "track-note", video.note));

      btn.append(screen, label);
      btn.addEventListener("click", () => {
        load(video);
        document.getElementById("listen").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
      li.append(btn);

      if (video.date || video.buy) {
        const meta = el("div", "track-meta");
        if (video.date) {
          const time = el("time", "", new Date(video.date + "T12:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }));
          time.dateTime = video.date;
          meta.append(time);
        }
        if (video.buy) {
          const buy = el("a", "", "Get the single →");
          buy.href = video.buy;
          buy.target = "_blank";
          buy.rel = "noopener";
          buy.setAttribute("aria-label", "Get " + video.title + " on Apple Music");
          meta.append(buy);
        }
        li.append(meta);
      }
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
      shareBtn.textContent = "Signal sent ✓";
    } catch (e) {
      shareBtn.textContent = url;
    }
  });

  // Party mode: the Konami code, or five taps on the sun.
  function party() {
    document.body.classList.toggle("party");
    toast(document.body.classList.contains("party")
      ? "★ GAMER LOSS: 0%. YOU ARE THE REAL WORLD PLAYER ★"
      : "Party mode off. Don't touch that dial.");
  }

  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      party();
    }
  });

  let taps = 0;
  let tapTimer;
  document.getElementById("sun").addEventListener("click", () => {
    taps += 1;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, 1500);
    if (taps === 5) {
      taps = 0;
      party();
    }
  });

  // A little starlight trailing the cursor.
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const glyphs = ["✦", "★", "✧", "·"];
    let last = 0;
    document.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const spark = el("span", "spark", glyphs[Math.floor(Math.random() * glyphs.length)]);
      spark.style.left = e.clientX + "px";
      spark.style.top = e.clientY + "px";
      spark.style.color = TAPE_COLOURS[Math.floor(Math.random() * TAPE_COLOURS.length)];
      document.body.append(spark);
      spark.addEventListener("animationend", () => spark.remove());
    });
  }
})();
