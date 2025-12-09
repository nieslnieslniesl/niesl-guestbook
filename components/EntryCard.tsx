import { Badge } from './Badge';

type Props = {
  name: string;
  message: string;
  imageUrl?: string | null;
  createdAt: string;
};

export function EntryCard({ name, message, imageUrl, createdAt }: Props) {
  return (
    <div className="rainbow-border sparkle">
      <div className="inner">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffbde1] to-[#6ae3ff] grid place-items-center text-2xl">
              💖
            </div>
            <div>
              <div className="font-bold text-lg">{name}</div>
              <Badge color="blue">Posted {createdAt}</Badge>
            </div>
          </div>
          <Badge color="pink">Guestbook Legend</Badge>
        </div>
        <p className="mt-3 text-base leading-6">{message}</p>
        {imageUrl ? (
          <div className="mt-3">
            <img
              src={imageUrl}
              alt="Guest upload"
              className="rounded-xl border-4 border-[#ffbde1] max-h-72 object-cover w-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

