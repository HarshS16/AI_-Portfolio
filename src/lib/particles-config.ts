import type { ISourceOptions } from "@tsparticles/slim";

export const particlesConfig: ISourceOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: ["grab", "bubble"],
      },
      onClick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      grab: {
        distance: 200,
        links: {
          opacity: 0.8,
          color: "#00ffff",
        },
      },
      bubble: {
        distance: 150,
        size: 8,
        duration: 2,
        opacity: 1,
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    color: {
      value: ["#00ffff", "#0080ff", "#8000ff", "#ff0080"],
    },
    links: {
      color: {
        value: ["#00ffff", "#0080ff", "#8000ff"],
      },
      distance: 180,
      enable: true,
      opacity: 0.3,
      width: 1.5,
      triangles: {
        enable: true,
        opacity: 0.05,
      },
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 0.8,
      straight: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
    number: {
      density: {
        enable: true,
        width: 1920,
        height: 1080,
      },
      value: 150,
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: {
      type: ["circle", "triangle"],
    },
    size: {
      value: { min: 1, max: 4 },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1,
        color: {
          value: "#00ffff",
        },
      },
    },
  },
  detectRetina: true,
};