
"use strict";

/* =========================================
   1. NINE UNIQUE PHOTO MEMORIES
========================================= */

const memories = [
  {
    image: "assets/images/memory1.jpeg",
    title: "Give me lots of hugs 💕"
  },
  {
    image: "assets/images/memory2.jpeg",
    title: "Keep that beautiful smile ✨"
  },
  {
    image: "assets/images/memory3.jpeg",
    title: "Enjoy your special moments 🎀"
  },
  {
    image: "assets/images/memory4.jpeg",
    title: "Make us entertain a lot 🌷"
  },
  {
    image: "assets/images/memory5.jpeg",
    title: "Stay wonderfully you 🦋"
  },
  {
    image: "assets/images/memory6.jpeg",
    title: "Be my hottest partner 💗"
  },
  {
    image: "assets/images/memory7.jpeg",
    title: "Give me your b'day chocolates 🍫"
  },
  {
    image: "assets/images/memory8.jpg",
    title: "Stay wonderfully you 🦋"
  },
  {
    image: "assets/images/memory9.jpeg",
    title: "Start learning driving ⭐"
  }
];

/* =========================================
   2. HTML ELEMENTS
========================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const startButton = document.getElementById("startButton");
const birthdayWebsite = document.getElementById("birthdayWebsite");

const envelope = document.getElementById("envelope");
const cake = document.getElementById("cake");

const floatingPlayground =
  document.getElementById("floatingPlayground");

const memoryGallery =
  document.getElementById("memoryGallery");

const wishButton = document.getElementById("wishButton");
const wishResult = document.getElementById("wishResult");

const confettiLayer = document.getElementById("confettiLayer");

/* =========================================
   3. BACKGROUND BIRTHDAY MUSIC
========================================= */

// Change the path if your audio filename is different.
const birthdayAudio = new Audio("assets/audio/birthday-song.mp3");

// Music settings
birthdayAudio.loop = true;
birthdayAudio.volume = 0.5;
birthdayAudio.preload = "auto";

let birthdayOpened = false;

/* Store the indexes of memories that have been revealed. */
const revealedMemories = new Set();

/* =========================================
   4. OPEN THE BIRTHDAY WEBSITE
========================================= */

if (startButton) {
  startButton.addEventListener("click", () => {
    if (birthdayOpened) return;

    birthdayOpened = true;
    startButton.disabled = true;

    /* START BACKGROUND MUSIC */
    birthdayAudio.play().catch((error) => {
      console.error("Unable to play birthday music:", error);
    });

    if (birthdayWebsite) {
      birthdayWebsite.hidden = false;
    }

    if (welcomeScreen) {
      welcomeScreen.classList.add("leaving");
    }

    /*
      Start the envelope and cake animations together.
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (envelope) {
          envelope.classList.add("open");
        }

        if (cake) {
          cake.classList.add("show");
        }

        launchConfetti(80);
      });
    });

    window.setTimeout(() => {
      if (welcomeScreen) {
        welcomeScreen.hidden = true;
      }
    }, 650);

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  });
}

/* =========================================
   5. REVEAL A PHOTO AT THE CLICKED EMOJI
========================================= */

function revealMemory(index, button) {
  /*
    Validate the memory index and clicked button.
  */
  if (
    !Number.isInteger(index) ||
    !memories[index] ||
    !button
  ) {
    return;
  }

  /*
    If this memory was already revealed,
    do not create a duplicate photo.
  */
  if (revealedMemories.has(index)) {
    return;
  }

  const memory = memories[index];

  /*
    Create the small square photo block.
  */
  const photoBlock = document.createElement("div");

  photoBlock.className = "memory-photo-block";
  photoBlock.dataset.photoIndex = String(index);
  photoBlock.setAttribute("role", "group");
  photoBlock.setAttribute("aria-label", memory.title);

  /*
    Copy the emoji button's position and size.
  */
  const buttonStyle = window.getComputedStyle(button);

  photoBlock.style.position = "absolute";
  photoBlock.style.top = buttonStyle.top;
  photoBlock.style.right = buttonStyle.right;
  photoBlock.style.bottom = buttonStyle.bottom;
  photoBlock.style.left = buttonStyle.left;

  photoBlock.style.width = buttonStyle.width;
  photoBlock.style.height = buttonStyle.height;

  photoBlock.style.margin = buttonStyle.margin;
  photoBlock.style.zIndex = "4";

  /*
    Create the photo.
  */
  const photo = document.createElement("img");

  photo.src = memory.image;
  photo.alt = memory.title;
  photo.loading = "eager";
  photo.draggable = false;

  /*
    Create the caption.
  */
  const caption = document.createElement("span");

  caption.className = "memory-photo-caption";
  caption.textContent = memory.title;

  photoBlock.append(photo, caption);

  /*
    Place the photo in the same playground.
  */
  if (floatingPlayground) {
    floatingPlayground.appendChild(photoBlock);
  } else {
    return;
  }

  /*
    Hide the original emoji.
  */
  revealedMemories.add(index);

  button.classList.add("memory-emoji-hidden");
  button.setAttribute("aria-hidden", "true");
  button.disabled = true;

  launchConfetti(12);

  /*
    Handle missing images.
  */
  photo.addEventListener("error", () => {
    photoBlock.classList.add("memory-photo-error");
    photo.alt = "Photo unavailable";

    photo.style.display = "none";

    const fallback = document.createElement("span");

    fallback.className = "memory-photo-fallback";
    fallback.textContent = "♡";
    fallback.setAttribute("aria-label", "Photo unavailable");

    photoBlock.insertBefore(fallback, caption);

    console.error("Could not load memory image:", memory.image);
  }, { once: true });
}

/* =========================================
   6. CONNECT EACH EMOJI TO ITS OWN PHOTO
========================================= */

document.querySelectorAll(".float-item[data-memory]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.memory);

      revealMemory(index, button);
    });
  });

/* =========================================
   7. BIRTHDAY WISHES
========================================= */

const wishes = [
  "May your dreams find their wings. Keep shining! ✨",
  "May happiness find you in the smallest moments. 💗",
  "Your next chapter is going to be beautiful. Believe it! 🌷",
  "May you always be surrounded by love and laughter. 🎂",
  "The world is brighter with you in it. Never forget that! 💖",
  "Wishing you countless little moments worth remembering. 💌"
];

if (wishButton && wishResult) {
  wishButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * wishes.length);

    wishResult.textContent = wishes[randomIndex];

    wishButton.textContent = "✨ Make another wish ✨";

    launchConfetti(55);
  });
}

/* =========================================
   8. CONFETTI ANIMATION
========================================= */

function launchConfetti(amount = 40) {
  if (!confettiLayer) return;

  const count = Math.min(Math.max(amount, 0), 100);

  const colors = [
    "#ef8da9",
    "#e9bd69",
    "#b6a0db",
    "#f6c9d9",
    "#c3dfce",
    "#ffffff"
  ];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = `${Math.random() * 100}%`;

    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.setProperty(
      "--duration",
      `${2 + Math.random() * 2.5}s`
    );

    piece.style.setProperty(
      "--drift",
      `${(Math.random() - 0.5) * 180}px`
    );

    piece.style.animationDelay = `${Math.random() * 0.4}s`;

    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 5000);
  }
}

/* =========================================
   9. REPORT BROKEN IMAGE PATHS
========================================= */

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    console.error(
      "Could not load image:",
      img.getAttribute("src")
    );
  });
});

/* =========================================
   10. READY
========================================= */

console.log("Birthday surprise website is ready! 💗");
