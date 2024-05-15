import Head from "next/head";
import { useEffect, useRef } from "react";

type DotType = {
  x: number;
  y: number;
  radius: number;
  color: string;
};

const DOT_COLORS: string[] = ["#ff0000", "#00ff00", "#0000ff"];
const DOT_COUNT = 100;
const DOT_MAX_RADIUS = 5;
const LINE_THRESHOLD = 200;

export default function Home() {
  const contentRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots: DotType[] = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        radius: Math.random() * DOT_MAX_RADIUS,
        color:
          DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)] ?? "#fff",
      });
    }

    const drawDots = () => {
      dots.forEach((dot) => {
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    drawDots();

    const drawLines = (e: MouseEvent) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDots();

      const mouse = {
        x: e.clientX,
        y: e.clientY,
      };

      dots.forEach((dot) => {
        const distance = Math.sqrt(
          (mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2,
        );

        if (distance < LINE_THRESHOLD) {
          ctx.strokeStyle = dot.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    };
    content.addEventListener("mousemove", drawLines);

    const clearLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDots();
    };
    content.addEventListener("mouseout", clearLines);

    return () => {
      content.removeEventListener("mousemove", drawLines);
      content.removeEventListener("mouseout", clearLines);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Spider Cursor Effect</title>
        <meta name="description" content="Made by Kairos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        ref={contentRef}
        className="bg-background dark relative flex min-h-screen items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 top-0 h-full w-full bg-transparent"
        />
        <div className="z-10">
          <h1 className="text-9xl font-bold text-white">
            Spider Cursor Effect
          </h1>
        </div>
      </main>
    </>
  );
}
