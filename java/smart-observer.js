/**
 * @zakkster/lite-smart-observer — Zero-Dependency Staggered Scroll Revelations
 *
 * High-performance intersection observer for grid/list animations.
 * Uses native Web Animations API and observation-order staggering.
 *
 * Features:
 * - IntersectionObserver + Web Animations API (no JS animation loops)
 * - Observation-order staggering across layout frames
 * - 10 animation modes + GSAP-style easing presets
 * - Safe WAAPI lifecycle: commitStyles() + cancel() on finish
 * - Just-in-time willChange promotion (not on observe, on animate)
 * - Clean re-entry (once: false) — no reverse(), full state reset
 * - Zero dependencies
 */
(function () {
  'use strict';

  const EASINGS = {
    "linear":      "linear",
    "ease":        "ease",
    "power1.out":  "cubic-bezier(0.17, 0.84, 0.44, 1)",
    "power2.out":  "cubic-bezier(0.25, 1, 0.5, 1)",
    "power3.out":  "cubic-bezier(0.22, 1, 0.36, 1)",
    "power4.out":  "cubic-bezier(0.16, 1, 0.3, 1)",
    "expo.out":    "cubic-bezier(0.19, 1, 0.22, 1)",
    "back.out":    "cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  class SmartObserver {
    /**
     * @param {Object}   options
     * @param {number}   [options.stagger=0.1]             Delay between batched elements (seconds)
     * @param {number}   [options.duration=0.6]            Animation duration (seconds)
     * @param {number}   [options.delay=0]                 Initial delay (seconds)
     * @param {boolean}  [options.once=true]                If false, re-animates on scroll back
     * @param {number}   [options.threshold=0.15]           Intersection ratio to trigger
     * @param {string}   [options.rootMargin="0px 0px -50px 0px"] Viewport margin
     * @param {string}   [options.mode="y"]                 Animation mode
     * @param {string}   [options.ease="power2.out"]        Easing preset key
     * @param {number}   [options.y=40]                     Starting Y offset (pixels)
     * @param {number}   [options.x=40]                     Starting X offset (pixels)
     * @param {number}   [options.scale=0.8]                Starting scale
     * @param {number}   [options.rotation=15]              Starting rotation (degrees)
     * @param {Array}    [options.keyframes]                Custom WAAPI keyframes (mode: "custom")
     * @param {Function} [options.onEnter]                  Called when element enters viewport
     * @param {Function} [options.onLeave]                  Called when element exits viewport
     */
    constructor(options = {}) {
      this._stagger    = (options.stagger || 0.1) * 1000;
      this._duration   = (options.duration || 0.6) * 1000;
      this._delay      = (options.delay || 0) * 1000;
      this._once       = options.once !== undefined ? options.once : true;
      this._threshold  = options.threshold || 0.15;
      this._rootMargin = options.rootMargin || "0px 0px -50px 0px";

      this._mode         = options.mode || "y";
      this._customFrames = options.keyframes || null;
      this._y        = options.y || 40;
      this._x        = options.x || 40;
      this._scale    = options.scale !== undefined ? options.scale : 0.8;
      this._rotation = options.rotation !== undefined ? options.rotation : 15;

      this._onEnter = options.onEnter || null;
      this._onLeave = options.onLeave || null;

      if (options.ease && !EASINGS[options.ease]) {
        console.warn("SmartObserver: Unknown easing \"" + options.ease + "\". Falling back to \"power2.out\".");
      }
      this._ease = EASINGS[options.ease] || EASINGS["power2.out"];

      if (this._mode === "custom" && !Array.isArray(this._customFrames)) {
        throw new Error("SmartObserver: 'custom' mode requires a valid keyframes array.");
      }

      this._defaultKeyframes = this._buildKeyframes(
        this._mode, this._y, this._x, this._scale, this._rotation
      );

      this._staggerCounter = 0;
      this._staggerTimer = null;

      this._elements = new Map();
      this._destroyed = false;

      this._observer = new IntersectionObserver(
        this._handleIntersect.bind(this),
        { threshold: this._threshold, rootMargin: this._rootMargin }
      );
    }

    _buildKeyframes(mode, y, x, scale, rot, transformOrigin) {
      if (mode === "custom" && this._customFrames) return this._customFrames;

      let frames;

      switch (mode) {
        case "fade":
        case "none":
          frames = [{ opacity: 0 }, { opacity: 1 }];
          break;

        case "scale":
          frames = [
            { opacity: 0, transform: "scale(" + scale + ")" },
            { opacity: 1, transform: "scale(1)" },
          ];
          break;

        case "x":
          frames = [
            { opacity: 0, transform: "translate3d(" + x + "px, 0, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ];
          break;

        case "scaleUp":
          frames = [
            { opacity: 0, transform: "translate3d(0, " + y + "px, 0) scale(" + scale + ")" },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ];
          break;

        case "rotateIn":
          frames = [
            { opacity: 0, transform: "rotate(" + rot + "deg) scale(" + scale + ")" },
            { opacity: 1, transform: "rotate(0deg) scale(1)" },
          ];
          break;

        case "flipX":
          frames = [
            { opacity: 0, transform: "perspective(600px) rotateX(90deg)" },
            { opacity: 1, transform: "perspective(600px) rotateX(0deg)" },
          ];
          break;

        case "flipY":
          frames = [
            { opacity: 0, transform: "perspective(600px) rotateY(90deg)" },
            { opacity: 1, transform: "perspective(600px) rotateY(0deg)" },
          ];
          break;

        case "zoomBlur":
          frames = [
            { opacity: 0, transform: "scale(" + (scale > 1 ? scale : 1.5) + ")", filter: "blur(8px)" },
            { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
          ];
          break;

        case "y":
        default:
          frames = [
            { opacity: 0, transform: "translate3d(0, " + y + "px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ];
          break;
      }

      if (transformOrigin) frames[0].transformOrigin = transformOrigin;
      return frames;
    }

    observe(selectorOrNodeList) {
      if (this._destroyed) return;

      var nodes = typeof selectorOrNodeList === "string"
        ? document.querySelectorAll(selectorOrNodeList)
        : (selectorOrNodeList.length !== undefined
          ? selectorOrNodeList
          : [selectorOrNodeList]);

      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var mode = el.dataset.revealMode || this._mode;
        if (mode !== "none") el.style.opacity = "0";
        this._elements.set(el, null);
        this._observer.observe(el);
      }
    }

    _handleIntersect(entries) {
      if (this._destroyed) return;

      var entered = [];
      var exited = [];

      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) entered.push(entries[i]);
        else exited.push(entries[i]);
      }

      for (var j = 0; j < entered.length; j++) {
        var entry = entered[j];
        var el = entry.target;
        var mode = el.dataset.revealMode || this._mode;

        if (this._once) this._observer.unobserve(el);

        var prev = this._elements.get(el);
        if (prev && prev !== "DONE") {
          prev.onfinish = null;
          prev.cancel();
        }

        var delay = this._delay + (this._staggerCounter * this._stagger);
        this._staggerCounter++;

        if (this._onEnter) {
          var self = this;
          setTimeout(function () { self._onEnter(el); }, delay);
        }

        if (mode !== "none") {
          var keyframes = this._defaultKeyframes;
          var hasOverrides = el.dataset.revealY || el.dataset.revealX
            || el.dataset.revealScale || el.dataset.revealRotate
            || el.dataset.revealOrigin || el.dataset.revealMode;

          if (hasOverrides) {
            keyframes = this._buildKeyframes(
              mode,
              Number(el.dataset.revealY || this._y),
              Number(el.dataset.revealX || this._x),
              Number(el.dataset.revealScale || this._scale),
              Number(el.dataset.revealRotate || this._rotation),
              el.dataset.revealOrigin || null
            );
          }

          var rawDur = el.dataset.revealDuration;
          var duration = rawDur !== undefined ? Number(rawDur) : this._duration;

          el.style.willChange = mode === "zoomBlur"
            ? "opacity, transform, filter"
            : "opacity, transform";

          var anim = el.animate(keyframes, {
            duration: Math.max(0, duration),
            delay: delay,
            easing: this._ease,
            fill: "both",
          });

          this._elements.set(el, anim);

          var currentAnim = anim;
          anim.onfinish = function () {
            if (self._elements.get(el) !== currentAnim) return;
            try { currentAnim.commitStyles(); } catch (e) {}
            currentAnim.cancel();
            self._elements.set(el, "DONE");
            el.style.willChange = "";
          };
        }
      }

      if (entered.length > 0) {
        clearTimeout(this._staggerTimer);
        var self = this;
        this._staggerTimer = setTimeout(function () {
          self._staggerCounter = 0;
        }, Math.max(50, this._stagger * 0.75));
      }

      if (!this._once) {
        for (var k = 0; k < exited.length; k++) {
          var exitEntry = exited[k];
          var exitEl = exitEntry.target;
          var exitMode = exitEl.dataset.revealMode || this._mode;

          if (this._onLeave) this._onLeave(exitEl);

          if (exitMode !== "none") {
            var exitAnim = this._elements.get(exitEl);
            if (exitAnim && exitAnim !== "DONE") {
              exitAnim.onfinish = null;
              exitAnim.cancel();
            }

            this._elements.set(exitEl, null);
            exitEl.style.opacity = "0";
            exitEl.style.transform = "";
            exitEl.style.transformOrigin = "";
            exitEl.style.filter = "";
            exitEl.style.willChange = "";
          }
        }
      }
    }

    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;

      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }

      clearTimeout(this._staggerTimer);

      var self = this;
      this._elements.forEach(function (anim, el) {
        if (anim && anim !== "DONE") {
          anim.onfinish = null;
          anim.cancel();
        }
        el.style.opacity = "";
        el.style.transform = "";
        el.style.filter = "";
        el.style.willChange = "";
      });

      this._elements.clear();
      this._onEnter = null;
      this._onLeave = null;
    }
  }

  window.SmartObserver = SmartObserver;
  window.SmartObserverEASINGS = EASINGS;
})();
