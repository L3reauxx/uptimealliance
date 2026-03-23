document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       1. THEME TOGGLE (SVG Sun/Moon Switch)
       ========================================================================== */
    const body = document.body;

    /* ==========================================================================
       2. GSAP: HERO ANIMATIONS (Cinematic Reveal + Evolution Morph)
       ========================================================================== */
    const heroTimeline = gsap.timeline({
        defaults: { ease: "power4.out" }
    });

    // Initial Setup
    gsap.set(".new-logo-img", { opacity: 0, scale: 0.8 });


    // Animate the main headline sliding UP
    heroTimeline.to(".hero-h1 .reveal-text", {
        y: "0%",
        duration: 1.5,
        stagger: 0.2,
        delay: 0.2,
        onComplete: () => {
            // Remove overflow hidden from masks to prevent clipping the scale and glow
            document.querySelectorAll(".line-mask").forEach(mask => {
                mask.style.overflow = "visible";
            });
            startEvolutionMorph();
        }
    });

    function startEvolutionMorph() {
        const oldText = document.querySelector(".hero-old-text");
        const newText = document.querySelector(".hero-new-text");

        const evolutionTl = gsap.timeline({ delay: 1.5 });

        // Fade out old logo and old text
        evolutionTl.to(".old-logo-img", {
            opacity: 0,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.out"
        });

        evolutionTl.to(oldText, {
            opacity: 0.15,
            filter: "blur(6px)",
            duration: 0.5,
            ease: "power2.out"
        }, "<"); // sync with logo fade out

        // Reveal new logo and wipe new text
        evolutionTl.to(".new-logo-img", {
            opacity: 1,
            scale: 1,
            filter: "none",
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.2");

        evolutionTl.to(newText, {
            backgroundPosition: "0% 0%",
            duration: 1.2,
            ease: "power2.out"
        }, "<"); // sync with new logo reveal
    }
    heroTimeline.fromTo(".scroll-indicator", 
    { opacity: 0, y: -10 }, 
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
    "+=0.5" // Start half a second after the hero text resolves
);

    /* ==========================================================================
       4. GSAP: THE REALITY (Pinned Staggered Storytelling)
       ========================================================================== */

    // Pinned Timeline for Staggered Blocks
    // We pin the wrapper and use the spacer height (150vh) to determine scroll duration
    const storyTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".reality-section-pinned",
            start: "top 50%",
            end: "bottom bottom", // Tied to the 150vh spacer end
            scrub: true,
            pin: ".pinned-story-container", // Pin the container holding absolute blocks
            pinSpacing: false
        }
    });

    const blocks = document.querySelectorAll(".story-block");

    blocks.forEach((block, index) => {
        // Prepare block: Ensure it's hidden and slightly translated down
        gsap.set(block, { autoAlpha: 0, y: 50 });

        // Fade in and slide up
        storyTimeline.to(block, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, index * 1.0); // Stagger start times based on index

        // If it's NOT the last block, fade it out so the next one can take focus
        if (index !== blocks.length - 1) {
            storyTimeline.to(block, {
                autoAlpha: 0,
                y: -50,
                duration: 1,
                ease: "power2.in"
            }, (index * 1.0) + 0.8); // Start fading out just before next block enters
        }
    });

    storyTimeline.to({}, { duration: 1.5 }); // Creates a scrolling buffer to read the final block

    /* ==========================================================================
       5. GSAP: THE METHODOLOGY (Staggered Glass Cards & Pinning)
       ========================================================================== */
    const methodologyTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".methodology-section",
            start: "top top",
            end: "+=1500", // Scroll distance
            scrub: 1,
            pin: ".methodology-pinned-wrapper",
            anticipatePin: 1,
            pinSpacing: false // Allows the next section to overlap and wipe over this one
        }
    });

    // Stagger the cards sliding up and fading in
    methodologyTl.to(".method-col", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.5,
        ease: "power3.out"
    });

    /* ==========================================================================
       6. VANILLA JS: MAGNETIC BUTTON (Footer CTA)
       ========================================================================== */
    const magneticBtn = document.getElementById("magnetic-btn");
    const magneticText = magneticBtn.querySelector(".btn-text");

    let mouseX = 0;
    let mouseY = 0;
    let btnX = 0;
    let btnY = 0;

    let cachedRect = null;

    function updateCachedRect() {
        cachedRect = magneticBtn.getBoundingClientRect();
    }

    magneticBtn.addEventListener("mouseenter", updateCachedRect);

    magneticBtn.addEventListener("mousemove", (e) => {
        if (!cachedRect) updateCachedRect();

        const centerX = cachedRect.left + cachedRect.width / 2;
        const centerY = cachedRect.top + cachedRect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        mouseX = distanceX * 0.3;
        mouseY = distanceY * 0.3;
    });

    magneticBtn.addEventListener("mouseleave", () => {
        mouseX = 0;
        mouseY = 0;
        cachedRect = null;
    });

    window.addEventListener("resize", () => {
        if (cachedRect) updateCachedRect();
    });

    function animateMagnetic() {
        btnX += (mouseX - btnX) * 0.1;
        btnY += (mouseY - btnY) * 0.1;

        magneticBtn.style.transform = `translate(${btnX}px, ${btnY}px)`;
        magneticText.style.transform = `translate(${btnX * 0.5}px, ${btnY * 0.5}px)`;

        requestAnimationFrame(animateMagnetic);
    }

    animateMagnetic();

});