import Image from "next/image";

type AvatarProps = {
  name: string;
  src?: string;
};

const SIZE = 40;

const colorPalette = ["#1f4d40", "#8a5a2b", "#3d4f7a", "#7a3d55", "#4f6b2e"];

export default function Avatar({ name, src }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={SIZE}
        height={SIZE}
        unoptimized
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = colorPalette[name.length % colorPalette.length];

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ width: SIZE, height: SIZE, backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
